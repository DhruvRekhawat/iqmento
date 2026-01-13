import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanOtp = otp.trim();

    console.log("Verifying OTP for login:", {
      phone: cleanPhone,
      otpLength: cleanOtp.length,
    });

    // Find the OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        phone: cleanPhone,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (otpRecord.otp !== cleanOtp) {
      return NextResponse.json({ 
        error: "Invalid OTP",
        ...(process.env.NODE_ENV === "development" && {
          debug: {
            expected: otpRecord.otp,
            received: cleanOtp,
          },
        }),
      }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    const token = generateToken(user.id, user.phone, user.role);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Verify OTP login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
