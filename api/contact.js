/* eslint-disable no-undef */
import nodemailer from "nodemailer";

// Rate limit in-memory (best effort su serverless)
const RATE_WINDOW_MS = 60_000; // 1 min
const RATE_MAX = 5;            // 5 richieste/min per IP
const bucket = new Map();

function getIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function isSpammyText(s) {
  // blocca HTML e link eccessivi (tuning)
  if (/<[a-z][\s\S]*>/i.test(s)) return true; // tag html
  const links = (s.match(/https?:\/\//gi) || []).length;
  if (links >= 3) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // parse body (Vercel lo parse-a come JSON automaticamente se Content-Type application/json)
  const { name = "", email = "", message = "", company = "" } = req.body || {};

  // honeypot: i bot lo compilano
  if (company && String(company).trim().length) {
    return res.status(200).json({ ok: true });
  }

  // rate limit
  const ip = getIp(req);
  const now = Date.now();
  const item = bucket.get(ip) || { count: 0, start: now };
  if (now - item.start > RATE_WINDOW_MS) {
    bucket.set(ip, { count: 1, start: now });
  } else {
    item.count += 1;
    bucket.set(ip, item);
    if (item.count > RATE_MAX) {
      return res.status(429).json({ error: "Too many requests" });
    }
  }

  // validate
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(name).trim();
  const cleanMsg = String(message).trim();

  if (!cleanEmail || !cleanMsg) return res.status(400).json({ error: "Missing fields" });
  if (cleanEmail.length > 254 || cleanName.length > 120 || cleanMsg.length > 6000) {
    return res.status(413).json({ error: "Payload too large" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (isSpammyText(cleanMsg)) {
    return res.status(400).json({ error: "Message rejected" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { minVersion: "TLSv1.2" },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Spin Factor" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: cleanEmail,
      subject: "Nuovo messaggio dal sito",
      text: `Nome: ${cleanName || "-"}\nEmail: ${cleanEmail}\n\n${cleanMsg}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact mail error:", err?.code, err?.message);
    return res.status(500).json({ error: "Mail error" });
  }
}
