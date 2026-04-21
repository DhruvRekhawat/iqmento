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
    const cleanPhone = phone.replace(/\D/g, "");
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit phone number" }, { status: 400 });
    }

    // 🔥 RESEND RESTRICTION (1 MINUTE)
    const existingOtp = await prisma.otp.findFirst({
      where: { phone: cleanPhone },
      orderBy: { createdAt: "desc" },
    });

    if (existingOtp) {
      const diff = Date.now() - new Date(existingOtp.createdAt).getTime();

      if (diff < 60 * 1000) {
        return NextResponse.json(
          { error: "Please wait 1 minute before requesting another OTP" },
          { status: 429 }
        );
      }
    }

    // Generate OTP
    const otp = generateOtp();

    // 🔥 EXPIRY → 2 MINUTES
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

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
    
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!smsResult.success) {
      console.error("❌ Failed to send OTP via SMS:", {
        phone: cleanPhone,
        formattedPhone: `91${cleanPhone}`,
        error: smsResult.error,
        otp: otp,
        timestamp: new Date().toISOString(),
      });
      
      if (isDevelopment) {
        return NextResponse.json({ 
          success: true,
          message: "OTP generated (SMS failed)",
          debugOtp: otp,
        });
      }
      
      return NextResponse.json({ 
        success: true,
        message: "OTP sent successfully" 
      });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      ...(isDevelopment && { debugOtp: otp }),
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}