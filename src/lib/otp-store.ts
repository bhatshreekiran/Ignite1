/**
 * In-memory OTP store for serverless environment.
 * Works for Vercel since only 2 users are expected and OTPs expire quickly.
 * Note: In serverless, each cold start resets this. That's fine for short-lived OTPs.
 */

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpEntry>();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOtp(phone: string, otp: string): void {
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });
}

export function verifyOtp(phone: string, inputOtp: string): { valid: boolean; error?: string } {
  const masterOtp = process.env.MASTER_OTP;

  // Check master override first
  if (masterOtp && inputOtp === masterOtp) {
    return { valid: true };
  }

  const entry = otpStore.get(phone);

  if (!entry) {
    return { valid: false, error: "No OTP found. Please request a new one." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, error: "OTP has expired. Please request a new one." };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(phone);
    return { valid: false, error: "Too many attempts. Please request a new OTP." };
  }

  entry.attempts++;

  if (entry.otp === inputOtp) {
    otpStore.delete(phone); // One-time use
    return { valid: true };
  }

  return { valid: false, error: `Invalid OTP. ${MAX_ATTEMPTS - entry.attempts} attempts remaining.` };
}

export function isAllowedPhone(phone: string): boolean {
  const allowed = [
    process.env.PHONE_1,
    process.env.PHONE_2,
  ].filter(Boolean);

  return allowed.includes(phone);
}

/**
 * Clean up expired OTPs (called periodically)
 */
export function cleanupExpired(): void {
  const now = Date.now();
  for (const [phone, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(phone);
    }
  }
}
