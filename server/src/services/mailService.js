import nodemailer from 'nodemailer';

let transporter;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendLeadEmail({ fullName, phone, source, subject }) {
  const transport = getTransporter();
  const to = process.env.LEAD_EMAIL || 'info@myplyn.com';
  const from = process.env.EMAIL_FROM || 'Myplyn <noreply@myplyn.com>';
  const safeName = escapeHtml(fullName);
  const safePhone = escapeHtml(phone);
  const safeSource = escapeHtml(source);
  const sentAt = new Date().toISOString();

  if (!transport) {
    console.warn('[mail] SMTP not configured. Lead:', { fullName, phone, source });
    const err = new Error('Email service is not configured on the server');
    err.status = 503;
    throw err;
  }

  await transport.sendMail({
    from,
    to,
    subject: subject || 'Myplyn Landing — New registration',
    html: `
      <h2>New landing page registration</h2>
      <table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse">
        <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${safePhone}</td></tr>
        <tr><td><strong>Source</strong></td><td>${safeSource}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${sentAt}</td></tr>
      </table>
    `,
    text: `Name: ${fullName}\nPhone: ${phone}\nSource: ${source}\nSubmitted: ${sentAt}`,
  });
}
