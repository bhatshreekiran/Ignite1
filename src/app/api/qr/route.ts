import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${appUrl}/login`;

    const qrDataUrl = await QRCode.toDataURL(loginUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#6366f1",
        light: "#0a0a0f",
      },
      errorCorrectionLevel: "H",
    });

    return NextResponse.json({
      success: true,
      qrCode: qrDataUrl,
      url: loginUrl,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate QR code." },
      { status: 500 }
    );
  }
}
