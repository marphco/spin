/* eslint-disable no-undef */
import nodemailer from "nodemailer";

function sendJson(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

async function readJsonBody(req) {
  // Vercel Node functions: body non è garantito che sia già parsato
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null; // JSON invalido
  }
}

export default async function handler(req, res) {
  // health check semplice (così da browser non crasha mai)
  if (req.method === "GET") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, GET");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(req);
    if (body === null) return sendJson(res, 400, { error: "Invalid JSON" });

    const { name = "", email = "", message = "", company = "" } = body || {};

    // honeypot
    if (company && String(company).trim().length > 0) {
      return sendJson(res, 200, { ok: true }); // silent success
    }

    const cleanName = String(name).trim().slice(0, 120);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 180);
    const cleanMessage = String(message).trim().slice(0, 5000);

    if (!cleanEmail || !cleanMessage) {
      return sendJson(res, 400, { error: "Missing fields" });
    }

    // ENV
    const SMTP_HOST = process.env.SMTP_HOST;       // es: smtp.aruba.it
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || SMTP_USER;
    const SENDER_EMAIL = process.env.SENDER_EMAIL || SMTP_USER;

    const missing = [];
    if (!SMTP_HOST) missing.push("SMTP_HOST");
    if (!SMTP_USER) missing.push("SMTP_USER");
    if (!SMTP_PASS) missing.push("SMTP_PASS");
    if (missing.length) return sendJson(res, 500, { error: `Missing env: ${missing.join(", ")}` });

    // Aruba: regola pratica
    // - 587 => STARTTLS => host "smtp.aruba.it" (NON "smtps.aruba.it")
    // - 465 => SSL => host "smtps.aruba.it"
    const secure = SMTP_PORT === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      requireTLS: !secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: { minVersion: "TLSv1.2", servername: SMTP_HOST },
    });

    const subject = "Nuovo messaggio dal sito Spin Factor";
    const text =
`Nome: ${cleanName || "-"}
Email: ${cleanEmail}

Messaggio:
${cleanMessage}
`;

    // (evitiamo verify: spesso fa perdere tempo/timeout su serverless)
    await transporter.sendMail({
      from: { name: "Spin Factor", address: SENDER_EMAIL },
      to: RECEIVER_EMAIL,
      replyTo: cleanEmail,
      subject,
      text,
      envelope: { from: SENDER_EMAIL, to: RECEIVER_EMAIL },
    });

    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return sendJson(res, 500, { error: "Mail error" });
  }
}
