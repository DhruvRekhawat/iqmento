import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // For educators, return their own rules
    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educatorId");

    const where = educatorId 
      ? { educatorId }
      : user.role === "EDUCATOR"
      ? { educatorId: user.id }
      : {};

    const rules = await prisma.availabilityRule.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error("Error fetching availability rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "EDUCATOR") {
      return NextResponse.json({ error: "Only educators can create availability rules" }, { status: 403 });
    }

    const body = await request.json();
    const { startDate, endDate, daysOfWeek, specificDates, startTime, durationMinutes, price } = body;

    if (!startDate || !endDate || !startTime || durationMinutes === undefined || price === undefined) {
      return badRequestResponse("startDate, endDate, startTime, durationMinutes, and price are required");
    }

    // Validate daysOfWeek or specificDates
    if ((!daysOfWeek || daysOfWeek.length === 0) && (!specificDates || specificDates.length === 0)) {
      return badRequestResponse("Either daysOfWeek or specificDates must be provided");
    }

    const rule = await prisma.availabilityRule.create({
      data: {
        educatorId: user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        daysOfWeek: JSON.stringify(daysOfWeek || []),
        specificDates: specificDates ? JSON.stringify(specificDates) : null,
        startTime,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Error creating availability rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

