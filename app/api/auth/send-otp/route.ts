import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtp, generateOtp } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate phone number (should be 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit phone number" }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing OTPs for this phone
    await prisma.otp.deleteMany({
      where: {
        phone: cleanPhone,
      },
    });

    // Create new OTP
    await prisma.otp.create({
      data: {
        phone: cleanPhone,
        otp,
        expiresAt,
      },
    });

    // Send OTP via SMS
    console.log("📱 Attempting to send OTP via SMS to:", cleanPhone);
    const smsResult = await sendOtp({ otp, number: cleanPhone });
    
    // In development, always return OTP for testing even if SMS fails
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!smsResult.success) {
      console.error("❌ Failed to send OTP via SMS:", {
        phone: cleanPhone,
        formattedPhone: `91${cleanPhone}`,
        error: smsResult.error,
        otp: otp,
        timestamp: new Date().toISOString(),
      });
      
      // In development, return OTP for testing
      if (isDevelopment) {
        console.warn("⚠️  SMS failed, but OTP is available in console for testing:", otp);
        return NextResponse.json({ 
          success: true,
          message: "OTP generated. Check server console for OTP (SMS failed)",
          // Include OTP in development for testing when SMS fails
          debugOtp: otp,
          smsError: smsResult.error,
          note: "Enter the debug OTP manually to test the verification flow",
        });
      }
      
      // In production, still return success but log the error
      // (This prevents phone number enumeration)
      return NextResponse.json({ 
        success: true,
        message: "OTP sent successfully" 
      });
    }

    console.log("✅ OTP sent successfully via SMS to:", cleanPhone);
    console.log("📱 SMS Delivery Info:", {
      phone: cleanPhone,
      formattedPhone: `91${cleanPhone}`,
      otp: otp,
      timestamp: new Date().toISOString(),
      note: "If SMS not received, check: 1) MSG91 account balance, 2) Phone number DND status, 3) Network connectivity",
    });
    
    // In development, also return OTP for easy testing (but don't auto-fill)
    const response: any = {
      success: true,
      message: "OTP sent successfully via SMS",
    };
    
    if (isDevelopment) {
      response.debugOtp = otp;
      response.note = "Check server console for OTP if SMS not received. Also verify MSG91 account status.";
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
