const { BASE_URL, tbkHeaders, siteOrigin } = require("../lib/webpay");

function randomId(len) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const amount = Math.round(Number(body.amount));

    if (!amount || amount < 1) {
      res.status(400).json({ error: "Monto inválido" });
      return;
    }

    const buyOrder = `RB${Date.now().toString().slice(-8)}${randomId(3)}`;
    const sessionId = randomId(16);

    // Carry a compact copy of the order (items, contact, delivery mode) through
    // Transbank's redirect via the return_url query string, since this function
    // has no database to look it up by buy_order later.
    const orderPayload = {
      items: Array.isArray(body.items) ? body.items.slice(0, 30) : [],
      contact: body.contact || {},
      delivery: body.delivery || {},
    };
    const encodedOrder = Buffer.from(JSON.stringify(orderPayload), "utf8").toString("base64url");
    const returnUrl = `${siteOrigin(req)}/api/webpay-return?order=${encodedOrder}`;

    const tbkRes = await fetch(`${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
      method: "POST",
      headers: tbkHeaders(),
      body: JSON.stringify({
        buy_order: buyOrder,
        session_id: sessionId,
        amount,
        return_url: returnUrl,
      }),
    });

    const data = await tbkRes.json();

    if (!tbkRes.ok) {
      res.status(502).json({ error: "No pudimos iniciar el pago con Transbank", detail: data });
      return;
    }

    res.status(200).json({ token: data.token, url: data.url, buyOrder });
  } catch (err) {
    res.status(500).json({ error: "Error interno creando la transacción", detail: String(err) });
  }
};
