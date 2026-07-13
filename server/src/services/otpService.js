const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

const otps = new Map();

function key(email, purpose) {
  return `${purpose}:${email.toLowerCase().trim()}`;
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function issueOtp(email, purpose = 'signup') {
  const normalized = email.toLowerCase().trim();
  const storeKey = key(normalized, purpose);
  const existing = otps.get(storeKey);

  if (existing && Date.now() - existing.sentAt < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.sentAt)) / 1000);
    const err = new Error(`Please wait ${waitSec}s before requesting another code`);
    err.status = 429;
    throw err;
  }

  const code = generateCode();
  otps.set(storeKey, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    sentAt: Date.now(),
  });

  return code;
}

export function verifyOtp(email, code, purpose = 'signup') {
  const storeKey = key(email, purpose);
  const entry = otps.get(storeKey);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otps.delete(storeKey);
    return false;
  }
  if (entry.code !== String(code).trim()) return false;
  otps.delete(storeKey);
  return true;
}
