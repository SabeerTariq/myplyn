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

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    ...(port === 587 && { requireTLS: true }),
  });

  return transporter;
}

function formatLeadSource(source) {
  if (source === 'landing-en') return 'English Landing Page';
  if (source === 'landing') return 'Arabic Landing Page';
  return source;
}

function formatLeadDate(date = new Date()) {
  return date.toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }) + ' UTC';
}

function buildLeadEmailHtml({ fullName, phone, source, sentAt }) {
  const safeName = escapeHtml(fullName);
  const safePhone = escapeHtml(phone);
  const safeSource = escapeHtml(formatLeadSource(source));
  const safeDate = escapeHtml(formatLeadDate(new Date(sentAt)));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#37485f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6edea;box-shadow:0 14px 40px rgba(14,42,94,0.10);">
          <tr>
            <td style="background:linear-gradient(120deg,#0e2a5e 0%,#14357c 42%,#1ea24c 100%);padding:28px 32px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#8cf0ac;margin-bottom:10px;">Myplyn</div>
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:#ffffff;">New Lead</h1>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#dbe7ff;">A new creator lead just came in from your landing page.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 12px;">
                <tr>
                  <td style="padding:16px 18px;background:#f8fbf9;border:1px solid #e6edea;border-radius:14px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#1ea24c;margin-bottom:6px;">Full Name</div>
                    <div style="font-size:18px;font-weight:700;color:#0e2a5e;">${safeName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;background:#f8fbf9;border:1px solid #e6edea;border-radius:14px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#1ea24c;margin-bottom:6px;">Phone</div>
                    <div style="font-size:18px;font-weight:700;color:#0e2a5e;direction:ltr;text-align:left;">${safePhone}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;background:#f8fbf9;border:1px solid #e6edea;border-radius:14px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#1ea24c;margin-bottom:6px;">Source</div>
                    <div style="font-size:16px;font-weight:700;color:#0e2a5e;">${safeSource}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;background:#f8fbf9;border:1px solid #e6edea;border-radius:14px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#1ea24c;margin-bottom:6px;">Received</div>
                    <div style="font-size:16px;font-weight:600;color:#37485f;">${safeDate}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:18px 20px;background:#eef3fb;border-radius:14px;border:1px solid #dbe4f2;">
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#14357c;">
                      Follow up with this lead as soon as possible to complete onboarding and connect their pages.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#71809a;">This message was sent automatically from the Myplyn landing form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendChatEmail({ userMessage, botReply, page, visitorEmail, source = 'chat-widget' }) {
  const transport = getTransporter();
  const to = process.env.CHAT_EMAIL || process.env.LEAD_EMAIL || 'info@myplyn.com';
  const from = process.env.EMAIL_FROM || `Myplyn <${process.env.SMTP_USER || 'info@myplyn.com'}>`;
  const sentAt = formatLeadDate(new Date());

  const safeMessage = escapeHtml(userMessage);
  const safeReply = escapeHtml(botReply || '—');
  const safePage = escapeHtml(page || '/');
  const safeEmail = escapeHtml(visitorEmail || 'Not provided');
  const safeSource = escapeHtml(source);

  if (!transport) {
    console.warn('[mail] SMTP not configured. Chat message:', { userMessage, page });
    return false;
  }

  await transport.sendMail({
    from,
    to,
    subject: 'MYPLYN Chat — new visitor message',
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0A1F44;padding:24px;">
      <h2 style="color:#00B86B;margin:0 0 16px;">MYPLYN Chat Widget</h2>
      <p><strong>Page:</strong> ${safePage}</p>
      <p><strong>Visitor email:</strong> ${safeEmail}</p>
      <p><strong>Source:</strong> ${safeSource}</p>
      <p><strong>Time:</strong> ${escapeHtml(sentAt)}</p>
      <hr style="border:none;border-top:1px solid #E8EDF3;margin:20px 0"/>
      <p><strong>Visitor message</strong></p>
      <p style="background:#F8FAFC;padding:12px;border-radius:8px;">${safeMessage}</p>
      <p><strong>Bot reply (Plyn)</strong></p>
      <p style="background:#F0FDF4;padding:12px;border-radius:8px;">${safeReply}</p>
    </body></html>`,
    text: [
      'MYPLYN Chat Widget',
      '',
      `Page: ${page || '/'}`,
      `Visitor email: ${visitorEmail || 'Not provided'}`,
      `Time: ${sentAt}`,
      '',
      'Visitor message:',
      userMessage,
      '',
      'Bot reply:',
      botReply || '—',
    ].join('\n'),
  });

  return true;
}

function buildOtpEmailHtml({ code }) {
  const safeCode = escapeHtml(code);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#37485f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6edea;box-shadow:0 14px 40px rgba(14,42,94,0.10);">
          <tr>
            <td style="background:linear-gradient(120deg,#0e2a5e 0%,#14357c 42%,#1ea24c 100%);padding:28px 32px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#8cf0ac;margin-bottom:10px;">Myplyn</div>
              <h1 style="margin:0;font-size:26px;line-height:1.2;font-weight:800;color:#ffffff;">Verify your email</h1>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#dbe7ff;">Use this code to finish creating your account.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;text-align:center;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#1ea24c;margin-bottom:12px;">Your verification code</div>
              <div style="display:inline-block;padding:18px 28px;background:#f8fbf9;border:1px solid #e6edea;border-radius:16px;font-size:34px;font-weight:800;letter-spacing:0.35em;color:#0e2a5e;">${safeCode}</div>
              <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#71809a;">This code expires in 10 minutes. If you didn&apos;t request it, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOtpEmail({ email, code }) {
  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || `Myplyn <${process.env.SMTP_USER || 'info@myplyn.com'}>`;

  if (!transport) {
    console.warn('[mail] SMTP not configured. Signup OTP for', email, ':', code);
    if (process.env.NODE_ENV === 'production') {
      const err = new Error('Email service is not configured on the server');
      err.status = 503;
      throw err;
    }
    return false;
  }

  await transport.sendMail({
    from,
    to: email,
    subject: 'Myplyn — Your verification code',
    html: buildOtpEmailHtml({ code }),
    text: [
      'Verify your Myplyn account',
      '',
      `Your verification code: ${code}`,
      '',
      'This code expires in 10 minutes.',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
  });

  return true;
}

function buildPasswordResetEmailHtml({ resetUrl }) {
  const safeUrl = escapeHtml(resetUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#37485f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6edea;box-shadow:0 14px 40px rgba(14,42,94,0.10);">
          <tr>
            <td style="background:linear-gradient(120deg,#0e2a5e 0%,#14357c 42%,#1ea24c 100%);padding:28px 32px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#8cf0ac;margin-bottom:10px;">Myplyn</div>
              <h1 style="margin:0;font-size:26px;line-height:1.2;font-weight:800;color:#ffffff;">Reset your password</h1>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#dbe7ff;">We received a request to reset the password for your Myplyn account.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;text-align:center;">
              <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#1ea24c;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">Reset password</a>
              <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#71809a;">This link expires in 1 hour. If you didn&apos;t request a reset, you can ignore this email.</p>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#9aabbd;word-break:break-all;">Or paste this link into your browser:<br />${safeUrl}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail({ email, resetUrl }) {
  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || `Myplyn <${process.env.SMTP_USER || 'info@myplyn.com'}>`;

  if (!transport) {
    console.warn('[mail] SMTP not configured. Password reset link for', email, ':', resetUrl);
    if (process.env.NODE_ENV === 'production') {
      const err = new Error('Email service is not configured on the server');
      err.status = 503;
      throw err;
    }
    return false;
  }

  await transport.sendMail({
    from,
    to: email,
    subject: 'Myplyn — Reset your password',
    html: buildPasswordResetEmailHtml({ resetUrl }),
    text: [
      'Reset your Myplyn password',
      '',
      'We received a request to reset the password for your account.',
      '',
      `Reset link: ${resetUrl}`,
      '',
      'This link expires in 1 hour.',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
  });

  return true;
}

export async function sendLeadEmail({ fullName, phone, source, subject }) {
  const transport = getTransporter();
  const to = process.env.LEAD_EMAIL || 'info@myplyn.com';
  const from = process.env.EMAIL_FROM || `Myplyn <${process.env.SMTP_USER || 'info@myplyn.com'}>`;
  const sentAt = new Date().toISOString();
  const sourceLabel = formatLeadSource(source);
  const dateLabel = formatLeadDate(new Date(sentAt));

  if (!transport) {
    console.warn('[mail] SMTP not configured. Lead:', { fullName, phone, source });
    const err = new Error('Email service is not configured on the server');
    err.status = 503;
    throw err;
  }

  await transport.sendMail({
    from,
    to,
    subject: subject || 'Myplyn — New Lead',
    html: buildLeadEmailHtml({ fullName, phone, source, sentAt }),
    text: [
      'New Lead',
      '',
      `Full Name: ${fullName}`,
      `Phone: ${phone}`,
      `Source: ${sourceLabel}`,
      `Received: ${dateLabel}`,
      '',
      'Follow up with this lead as soon as possible to complete onboarding and connect their pages.',
    ].join('\n'),
  });
}

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  role,
  subject,
  message,
}) {
  const transport = getTransporter();
  const to = process.env.CONTACT_EMAIL || process.env.LEAD_EMAIL || 'info@myplyn.com';
  const from = process.env.EMAIL_FROM || `Myplyn <${process.env.SMTP_USER || 'info@myplyn.com'}>`;
  const fullName = `${firstName} ${lastName}`.trim();
  const sentAt = formatLeadDate(new Date());

  if (!transport) {
    const err = new Error('Email service is not configured on the server');
    err.status = 503;
    throw err;
  }

  const safe = {
    fullName: escapeHtml(fullName),
    email: escapeHtml(email),
    role: escapeHtml(role),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, '<br />'),
    sentAt: escapeHtml(sentAt),
  };

  await transport.sendMail({
    from,
    to,
    replyTo: email,
    subject: `Myplyn contact — ${subject}`,
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0A1F44;padding:24px;">
      <h2 style="color:#00B86B;margin:0 0 20px;">New website contact</h2>
      <p><strong>Name:</strong> ${safe.fullName}</p>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Contact type:</strong> ${safe.role}</p>
      <p><strong>Subject:</strong> ${safe.subject}</p>
      <p><strong>Received:</strong> ${safe.sentAt}</p>
      <hr style="border:none;border-top:1px solid #E8EDF3;margin:20px 0" />
      <p><strong>Message</strong></p>
      <p style="background:#F8FAFC;padding:14px;border-radius:8px;line-height:1.6;">${safe.message}</p>
    </body></html>`,
    text: [
      'New website contact',
      '',
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Contact type: ${role}`,
      `Subject: ${subject}`,
      `Received: ${sentAt}`,
      '',
      message,
    ].join('\n'),
  });

  return true;
}
