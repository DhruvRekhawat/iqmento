import { NextResponse } from "next/server";

export async function POST() {
  try {
    // This route is deprecated - use phone-based registration instead
    return NextResponse.json({ 
      error: "Email/password registration is no longer supported. Please use phone number and OTP registration." 
    }, { status: 410 }); // 410 Gone - indicates the resource is no longer available
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

