import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, description } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return badRequestResponse("Name, email, and phone number are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequestResponse("Invalid email format");
    }

    // Create trial call request
    const trialCall = await prisma.trialCall.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(
      { message: "Trial call request submitted successfully", trialCall },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating trial call:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can access this endpoint" },
        { status: 403 }
      );
    }

    const trialCalls = await prisma.trialCall.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ trialCalls });
  } catch (error) {
    console.error("Error fetching trial calls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
