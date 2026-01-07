import { NextResponse } from "next/server";

export async function POST() {
  // Since we're using JWT tokens stored client-side, logout is handled client-side
  // This endpoint exists for consistency and future cookie-based auth
  return NextResponse.json({ message: "Logged out successfully" });
}

