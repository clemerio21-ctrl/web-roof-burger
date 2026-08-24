const { BASE_URL, tbkHeaders, siteOrigin } = require("../lib/webpay");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL;

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    // application/x-www-form-urlencoded fallback
    const params = new URLSearchParams(req.body);
    return Object.fromEntries(params.entries());
  }
  return {};
}

function decodeOrder(req) {
  try {
    const raw = req.query && req.query.order;
    if (!raw) return null;
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch (e) {
    return null;
  }
}

function clp(n) {
  return "$" + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function notifyRestaurant(order, tbkData) {
  if (!RESEND_API_KEY || !RESTAURANT_EMAIL || !order) return;

  const itemsHtml = (order.items || [])
    .map(
      (i) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(i.qty)}x ${esc(i.name)}${i.summary ? `<br><span style="color:#777;font-size:12px;">${esc(i.summary)}</span>` : ""}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${clp((i.unitPrice || 0) * (i.qty || 1))}</td>
      </tr>`
    )
    .join("");

  const delivery = order.delivery || {};
  const deliveryHtml =
    delivery.mode === "retiro"
      ? `<p><b>Modalidad:</b> Retiro en tienda<br><b>Sucursal:</b> ${esc(delivery.branch)}</p>`
      : `<p><b>Modalidad:</b> Delivery<br><b>Dirección:</b> ${esc(delivery.address) || "(no especificada)"}</p>`;

  const contact = order.contact || {};

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;">
      <h2 style="color:#CA2126;">Nuevo pedido pagado #${esc(tbkData.buy_order)}</h2>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <p style="text-align:right;font-weight:bold;margin-top:8px;">Total pagado: ${clp(tbkData.amount)}</p>
      <hr>
      <p><b>Cliente:</b> ${esc(contact.name)}<br><b>Correo:</b> ${esc(contact.email)}<br><b>Teléfono:</b> ${esc(contact.phone)}</p>
      ${deliveryHtml}
      <p style="color:#777;font-size:12px;">Código de autorización WebPay: ${esc(tbkData.authorization_code)}</p>
    </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Roof Burger Web <onboarding@resend.dev>",
        to: [RESTAURANT_EMAIL],
        subject: `🍔 Nuevo pedido pagado - ${clp(tbkData.amount)}`,
        html,
      }),
    });
  } catch (e) {
    // Notification failure must never break the payment success flow.
  }
}

module.exports = async (req, res) => {
  const origin = siteOrigin(req);
  const body = parseBody(req);
  const tokenWs = body.token_ws;
  const tbkToken = body.TBK_TOKEN;

  // User cancelled on Transbank's page, or the transaction timed out before payment.
  if (!tokenWs || tbkToken) {
    res.writeHead(302, { Location: `${origin}/?webpay=cancelled` });
    res.end();
    return;
  }

  try {
    const tbkRes = await fetch(
      `${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${encodeURIComponent(tokenWs)}`,
      { method: "PUT", headers: tbkHeaders() }
    );
    const data = await tbkRes.json();

    if (tbkRes.ok && data.response_code === 0) {
      await notifyRestaurant(decodeOrder(req), data);
      const params = new URLSearchParams({
        webpay: "success",
        order: data.buy_order || "",
        auth: data.authorization_code || "",
        amount: String(data.amount || ""),
      });
      res.writeHead(302, { Location: `${origin}/?${params.toString()}` });
    } else {
      res.writeHead(302, { Location: `${origin}/?webpay=failed` });
    }
    res.end();
  } catch (err) {
    res.writeHead(302, { Location: `${origin}/?webpay=failed` });
    res.end();
  }
};
