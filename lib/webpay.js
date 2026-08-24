// Shared Transbank WebPay Plus config.
// Falls back to Transbank's own PUBLIC integration/test credentials (documented at
// https://www.transbankdevelopers.cl) so the checkout works end-to-end in test mode
// with zero setup. To go live, set WEBPAY_COMMERCE_CODE, WEBPAY_API_KEY and
// WEBPAY_ENV=production as environment variables in the Vercel project — no code
// changes needed.
const TEST_COMMERCE_CODE = "597055555532";
const TEST_API_KEY = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1";

const IS_PRODUCTION = process.env.WEBPAY_ENV === "production";

const COMMERCE_CODE = process.env.WEBPAY_COMMERCE_CODE || TEST_COMMERCE_CODE;
const API_KEY = process.env.WEBPAY_API_KEY || TEST_API_KEY;
const BASE_URL = IS_PRODUCTION
  ? "https://webpay3g.transbank.cl"
  : "https://webpay3gint.transbank.cl";

function tbkHeaders() {
  return {
    "Content-Type": "application/json",
    "Tbk-Api-Key-Id": COMMERCE_CODE,
    "Tbk-Api-Key-Secret": API_KEY,
  };
}

function siteOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

module.exports = { BASE_URL, tbkHeaders, siteOrigin, IS_PRODUCTION };
