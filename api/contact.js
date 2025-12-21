/* eslint-disable no-undef */
/* eslint-env node */
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Solo POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // BODY
    const { name = "", email = "", message = "", company = "" } = req.body || {};

    // Honeypot (anche se ora non lo usi, non dà fastidio)
    if (company && String(company).trim().length > 0) {
      return res.status(200).json({ ok: true }); // silent success
    }

    // Validazioni minime
    const cleanName = String(name).trim().slice(0, 120);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 180);
    const cleanMessage = String(message).trim().slice(0, 5000);

    if (!cleanEmail || !cleanMessage) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ENV (se manca anche UNA, ti dico quale)
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT || "587";
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || SMTP_USER;
    const SENDER_EMAIL = process.env.SENDER_EMAIL || SMTP_USER;

    const missing = [];
    if (!SMTP_HOST) missing.push("SMTP_HOST");
    if (!SMTP_USER) missing.push("SMTP_USER");
    if (!SMTP_PASS) missing.push("SMTP_PASS");
    if (missing.length) {
      return res.status(500).json({
        error: `Missing env: ${missing.join(", ")}`,
      });
    }

    const portNum = parseInt(SMTP_PORT, 10);
    const secure = portNum === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: portNum,
      secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      requireTLS: !secure, // STARTTLS su 587
      tls: {
        minVersion: "TLSv1.2",
        servername: SMTP_HOST,
      },
    });

    // verifica connessione
    await transporter.verify();

    const subject = "Nuovo messaggio dal sito Spin Factor";
    const text =
`Nome: ${cleanName || "-"}
Email: ${cleanEmail}

Messaggio:
${cleanMessage}
`;

    await transporter.sendMail({
      from: { name: "Spin Factor", address: SENDER_EMAIL },
      to: RECEIVER_EMAIL,
      replyTo: cleanEmail,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return res.status(500).json({ error: "Mail error" });
  }
}
