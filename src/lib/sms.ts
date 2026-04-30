/**
 * SMS sending module using Fast2SMS (India-friendly).
 * Falls back to console logging if API key is not set.
 */

export async function sendOtpSms(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  // Strip country code for Fast2SMS (expects 10-digit Indian number)
  const cleanPhone = phone.replace(/^\+91/, "").replace(/\D/g, "");

  if (!apiKey || apiKey === "your_fast2sms_api_key_here") {
    // Development fallback - log OTP to console
    console.log(`\n🔑 [DEV MODE] OTP for ${phone}: ${otp}\n`);
    return { success: true };
  }

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: cleanPhone,
        flash: 0,
      }),
    });

    const data = await response.json();

    if (data.return) {
      return { success: true };
    } else {
      console.error("Fast2SMS error:", data);
      return { success: false, error: data.message || "Failed to send SMS" };
    }
  } catch (err) {
    console.error("SMS send error:", err);
    return { success: false, error: "Failed to send SMS. Please try again." };
  }
}
