import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });

    const allowedEmails = [process.env.ALLOWED_EMAIL_1, process.env.ALLOWED_EMAIL_2]
      .filter(Boolean)
      .map(e => e?.toLowerCase().trim());

    if (!allowedEmails.includes(email.toLowerCase().trim())) {
      return NextResponse.json({ success: false, error: "Email is not authorized." }, { status: 403 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Ignite AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Access Code - Ignite AI Reveal",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #0c0c14; color: #f1f5f9; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #ffffff1a;">
          <h2 style="color: #818cf8; letter-spacing: 2px; text-transform: uppercase; font-size: 14px;">Ignite AI Exclusive Access</h2>
          <p style="font-size: 16px; margin-top: 20px;">Your one-time access code is:</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #1a1a2e; border-radius: 8px; border: 1px solid #6366f140;">
            <h1 style="font-size: 42px; letter-spacing: 8px; color: #a855f7; margin: 0; font-family: monospace;">${otp}</h1>
          </div>
          <p style="font-size: 13px; color: #94a3b8;">This code will expire shortly. Do not share it.</p>
        </div>
      `
    });

    // Create a stateless hash to send back to the client
    const secret = process.env.MASTER_OTP || "ignite-secret";
    const hash = crypto.createHmac("sha256", secret).update(email.toLowerCase() + otp).digest("hex");

    return NextResponse.json({ success: true, hash });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email. Check your .env setup." }, { status: 500 });
  }
}
