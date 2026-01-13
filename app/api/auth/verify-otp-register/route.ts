import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, name, role } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    if (role && !["STUDENT", "EDUCATOR"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanOtp = otp.trim();

    console.log("Verifying OTP:", {
      phone: cleanPhone,
      otpLength: cleanOtp.length,
      otpPrefix: cleanOtp.substring(0, 2) + "****",
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
      console.error("OTP not found or expired:", {
        phone: cleanPhone,
        availableOtps: await prisma.otp.count({ where: { phone: cleanPhone } }),
      });
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    console.log("OTP record found:", {
      id: otpRecord.id,
      storedOtp: otpRecord.otp,
      providedOtp: cleanOtp,
      match: otpRecord.otp === cleanOtp,
      expiresAt: otpRecord.expiresAt,
      isExpired: otpRecord.expiresAt < new Date(),
    });

    if (otpRecord.otp !== cleanOtp) {
      return NextResponse.json({ 
        error: "Invalid OTP",
        // In development, provide more details
        ...(process.env.NODE_ENV === "development" && {
          debug: {
            expected: otpRecord.otp,
            received: cleanOtp,
            phone: cleanPhone,
          },
        }),
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this phone number already exists" }, { status: 409 });
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Create user
    // Explicitly set email to null since it's now optional
    const user = await prisma.user.create({
      data: {
        phone: cleanPhone,
        email: null, // Explicitly set to null since email is optional
        name: name?.trim() || null,
        role: role || "STUDENT",
      },
    });

    const token = generateToken(user.id, user.phone, user.role);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    }, { status: 201 });
  } catch (error) {
    console.error("Verify OTP register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
