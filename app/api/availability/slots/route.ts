import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

// Generate slots from rules
function generateSlotsFromRule(rule: {
  startDate: Date;
  endDate: Date;
  daysOfWeek: string;
  specificDates: string | null;
  startTime: string;
  durationMinutes: number;
  price: number;
}): Array<{ startTime: Date; endTime: Date; price: number }> {
  const slots: Array<{ startTime: Date; endTime: Date; price: number }> = [];
  const start = new Date(rule.startDate);
  const end = new Date(rule.endDate);
  const [hours, minutes] = rule.startTime.split(":").map(Number);
  const daysOfWeek = JSON.parse(rule.daysOfWeek) as number[];
  const specificDates = rule.specificDates ? (JSON.parse(rule.specificDates) as string[]) : null;

  if (specificDates && specificDates.length > 0) {
    // Generate slots for specific dates
    specificDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const slotStart = new Date(date);
      slotStart.setHours(hours, minutes, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + rule.durationMinutes);
      
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        price: rule.price,
      });
    });
  } else if (daysOfWeek.length > 0) {
    // Generate slots for days of week in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (daysOfWeek.includes(dayOfWeek)) {
        const slotStart = new Date(d);
        slotStart.setHours(hours, minutes, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + rule.durationMinutes);
        
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          price: rule.price,
        });
      }
    }
  }

  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educatorId");
    const educatorSlug = searchParams.get("educatorSlug");
    const onlyAvailable = searchParams.get("onlyAvailable") === "true";

    const where: { educatorId?: string; isBooked?: boolean } = {};
    
    if (educatorSlug) {
      // Find educator by slug first
      const educator = await prisma.user.findUnique({
        where: { educatorSlug },
        select: { id: true },
      });
      if (educator) {
        where.educatorId = educator.id;
      } else {
        // Return empty if educator not found
        return NextResponse.json({ slots: [] });
      }
    } else if (educatorId) {
      where.educatorId = educatorId;
    } else if (user.role === "EDUCATOR") {
      where.educatorId = user.id;
    }

    if (onlyAvailable) {
      where.isBooked = false;
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching availability slots:", error);
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
      return NextResponse.json({ error: "Only educators can generate slots" }, { status: 403 });
    }

    const body = await request.json();
    const { ruleId, clearExisting } = body;

    if (!ruleId) {
      return badRequestResponse("ruleId is required");
    }

    const rule = await prisma.availabilityRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    if (rule.educatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Clear existing slots if requested
    if (clearExisting) {
      await prisma.availabilitySlot.deleteMany({
        where: {
          educatorId: user.id,
          isBooked: false,
        },
      });
    }

    // Generate slots from rule
    const generatedSlots = generateSlotsFromRule(rule);

    // Get existing booked slots to preserve them
    const existingBookedSlots = await prisma.availabilitySlot.findMany({
      where: {
        educatorId: user.id,
        isBooked: true,
      },
    });

    // Create new slots (avoid duplicates by checking time ranges)
    const slotsToCreate = [];
    for (const slot of generatedSlots) {
      // Check if slot already exists (within same minute)
      const exists = existingBookedSlots.some((existing: { startTime: Date; educatorId: string }) => {
        const existingStart = new Date(existing.startTime);
        const slotStart = new Date(slot.startTime);
        return (
          existingStart.getTime() === slotStart.getTime() &&
          existing.educatorId === user.id
        );
      });

      if (!exists) {
        slotsToCreate.push({
          educatorId: user.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isBooked: false,
        });
      }
    }

    if (slotsToCreate.length > 0) {
      await prisma.availabilitySlot.createMany({
        data: slotsToCreate,
      });
    }

    // Return all slots for this educator
    const allSlots = await prisma.availabilitySlot.findMany({
      where: { educatorId: user.id },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ slots: allSlots }, { status: 201 });
  } catch (error) {
    console.error("Error generating slots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "EDUCATOR") {
      return NextResponse.json({ error: "Only educators can delete slots" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get("slotId");
    const clearAvailable = searchParams.get("clearAvailable") === "true";

    if (slotId) {
      // Delete specific slot
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: slotId },
      });

      if (!slot) {
        return NextResponse.json({ error: "Slot not found" }, { status: 404 });
      }

      if (slot.educatorId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (slot.isBooked) {
        return NextResponse.json({ error: "Cannot delete booked slot" }, { status: 400 });
      }

      await prisma.availabilitySlot.delete({
        where: { id: slotId },
      });

      return NextResponse.json({ success: true });
    } else if (clearAvailable) {
      // Clear all available (non-booked) slots
      await prisma.availabilitySlot.deleteMany({
        where: {
          educatorId: user.id,
          isBooked: false,
        },
      });

      return NextResponse.json({ success: true });
    } else {
      return badRequestResponse("slotId or clearAvailable=true is required");
    }
  } catch (error) {
    console.error("Error deleting slots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

