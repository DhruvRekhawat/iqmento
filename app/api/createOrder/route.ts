import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export type OrderBody = {
  amount: number;
  currency: string;
};

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  // Debug logging (remove after fixing)
  console.log("Environment check:", {
    hasKeyId: !!key_id,
    hasKeySecret: !!key_secret,
    keyIdLength: key_id?.length || 0,
    keySecretLength: key_secret?.length || 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes("RAZORPAY")),
  });

  if (!key_id || !key_secret) {
    const missing: any[] = [];
    if (!key_id) missing.push("RAZORPAY_KEY_ID");
    if (!key_secret) missing.push("RAZORPAY_KEY_SECRET");
    throw new Error(`Razorpay keys are missing: ${missing.join(", ")}. Please check your .env.local file and restart the server.`);
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check for Razorpay keys
    const razorpay = getRazorpayInstance();

    // Parse request body
    let body: OrderBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { amount, currency } = body;
    
    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { message: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const options = {
      amount,
      currency: currency || "INR",
      receipt: `receipt#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order Created Successfully:", order.id);

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("Razorpay keys are missing")) {
        return NextResponse.json(
          { message: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

