import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: { studentId?: string; educatorId?: string; status?: string } = {};

    // Filter by user role
    if (user.role === "STUDENT") {
      where.studentId = user.id;
    } else if (user.role === "EDUCATOR") {
      where.educatorId = user.id;
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can create bookings" }, { status: 403 });
    }

    const body = await request.json();
    const {
      serviceId,
      slotId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!serviceId || !slotId) {
      return badRequestResponse("serviceId and slotId are required");
    }

    // Verify payment if payment details are provided
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const secret = process.env.RAZORPAY_KEY_SECRET as string;
      if (!secret) {
        return NextResponse.json({ error: "Razorpay secret not found" }, { status: 500 });
      }

      const HMAC = crypto.createHmac("sha256", secret);
      HMAC.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = HMAC.digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    } else {
      return badRequestResponse("Payment details are required");
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (!service.active) {
      return NextResponse.json({ error: "Service is not active" }, { status: 400 });
    }

    // Verify slot exists and is available
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.isBooked) {
      return NextResponse.json({ error: "Slot is already booked" }, { status: 400 });
    }

    if (slot.educatorId !== service.educatorId) {
      return NextResponse.json({ error: "Slot does not belong to this educator" }, { status: 400 });
    }

    // Create booking and mark slot as booked in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Mark slot as booked
      await tx.availabilitySlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          studentId: user.id,
          educatorId: service.educatorId,
          serviceId: service.id,
          slotId: slot.id,
          status: "UPCOMING",
          razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
          razorpaySignature: razorpaySignature || null,
          paymentStatus: "COMPLETED",
        },
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

      return newBooking;
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

