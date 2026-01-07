import { NextResponse } from "next/server";

export async function GET() {
  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  return NextResponse.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? "✓ Set" : "✗ Missing",
    nextPublicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing",
    keyIdValue: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + "...",
    allRazorpayKeys: Object.keys(process.env).filter(k => k.includes("RAZORPAY")),
  });
}

