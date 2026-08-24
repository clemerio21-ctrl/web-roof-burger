const { BASE_URL, tbkHeaders, siteOrigin } = require("../lib/webpay");

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    // application/x-www-form-urlencoded fallback
    const params = new URLSearchParams(req.body);
    return Object.fromEntries(params.entries());
  }
  return {};
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
