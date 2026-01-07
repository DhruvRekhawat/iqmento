import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access this endpoint" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: status && status !== "ALL" ? { status } : undefined,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        educator: {
          select: {
            id: true,
            name: true,
            email: true,
            educatorSlug: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            description: true,
            durationMinutes: true,
            price: true,
          },
        },
        slot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

