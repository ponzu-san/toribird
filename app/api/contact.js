import nodemailer from "nodemailer";

// 簡易レートリミット（メモリ）: 実運用では Redis 等を使うべき
const ipTracker = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // シンプルなレート制限: 同一IPから1分間に3回まで
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const record = ipTracker.get(ip) || [];
  const recent = record.filter((t) => now - t < 60 * 1000);
  if (recent.length >= 3) {
    return res.status(429).json({ error: "Too many requests" });
  }
  recent.push(now);
  ipTracker.set(ip, recent);

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });

    // サニタイズ（最低限）
    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 2000);

    // nodemailer transporter を作成（環境変数を使う）
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"LP お問い合わせ" <${process.env.SMTP_FROM}>`, // 送信元
      to: process.env.CONTACT_TO, // サイト管理者の受信先
      subject: `【LP】お問い合わせ: ${safeName}`,
      text: `名前: ${safeName}\nメール: ${safeEmail}\n\nメッセージ:\n${safeMessage}`,
      html: `<p><strong>名前:</strong> ${safeName}</p>
             <p><strong>メール:</strong> ${safeEmail}</p>
             <p><strong>メッセージ:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
