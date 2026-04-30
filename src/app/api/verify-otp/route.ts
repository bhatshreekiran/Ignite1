import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, otp, hash } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // Master override bypass
    if (otp === process.env.MASTER_OTP) {
      return NextResponse.json({ success: true });
    }

    if (!hash) {
      return NextResponse.json({ success: false, error: "Invalid session." }, { status: 400 });
    }

    // Verify the stateless hash
    const secret = process.env.MASTER_OTP || "ignite-secret";
    const expectedHash = crypto.createHmac("sha256", secret).update(email.toLowerCase() + otp).digest("hex");

    if (hash === expectedHash) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 401 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
