import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, notFoundResponse } from "@/lib/api-helpers";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
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
        service: true,
        slot: true,
      },
    });

    if (!booking) {
      return notFoundResponse("Booking not found");
    }

    // Verify user has access
    if (booking.studentId !== user.id && booking.educatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return notFoundResponse("Booking not found");
    }

    // Verify user has access
    if (booking.studentId !== user.id && booking.educatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["UPCOMING", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // If cancelling, free up the slot
    if (status === "CANCELLED" && booking.status !== "CANCELLED") {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.booking.update({
          where: { id },
          data: { status },
        });

        await tx.availabilitySlot.update({
          where: { id: booking.slotId },
          data: { isBooked: false },
        });
      });
    } else {
      await prisma.booking.update({
        where: { id },
        data: { status },
      });
    }

    const updated = await prisma.booking.findUnique({
      where: { id },
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
        service: true,
        slot: true,
      },
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

