// Temporary diagnostic endpoint - remove after confirming Resend delivery works.
module.exports = async (req, res) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL;

  if (!RESEND_API_KEY || !RESTAURANT_EMAIL) {
    res.status(500).json({ error: "Missing env vars", hasKey: !!RESEND_API_KEY, hasEmail: !!RESTAURANT_EMAIL });
    return;
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Roof Burger Web <onboarding@resend.dev>",
        to: [RESTAURANT_EMAIL],
        subject: "Prueba de notificacion de pedido",
        html: "<p>Esto es una prueba del sistema de notificaciones de Roof Burger Web.</p>",
      }),
    });
    const data = await r.json();
    res.status(r.status).json({ status: r.status, data });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
