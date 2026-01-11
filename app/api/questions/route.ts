import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, educatorSlug } = body;

    // Validate required fields
    if (!name || !email || !phone || !message || !educatorSlug) {
      return badRequestResponse("Name, email, phone, message, and educator slug are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequestResponse("Invalid email format");
    }

    // Find educator by slug
    const educator = await prisma.user.findUnique({
      where: { educatorSlug },
      select: { id: true },
    });

    if (!educator) {
      return badRequestResponse("Educator not found");
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        educatorId: educator.id,
      },
    });

    return NextResponse.json(
      { message: "Question submitted successfully", question },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
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

    let questions;

    if (user.role === "ADMIN") {
      // Admin sees all questions
      questions = await prisma.question.findMany({
        include: {
          educator: {
            select: {
              id: true,
              name: true,
              email: true,
              educatorSlug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (user.role === "EDUCATOR") {
      // Educators see only their own questions
      questions = await prisma.question.findMany({
        where: {
          educatorId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Only admins and educators can access this endpoint" },
        { status: 403 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
