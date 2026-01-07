import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // For educators, return their own services
    // For students/admins, they can query by educatorId or educatorSlug via query param
    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educatorId");
    const educatorSlug = searchParams.get("educatorSlug");

    const where: { educatorId?: string } = {};

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
        return NextResponse.json({ services: [] });
      }
    } else if (educatorId) {
      where.educatorId = educatorId;
    } else if (user.role === "EDUCATOR") {
      where.educatorId = user.id;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
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
      return NextResponse.json({ error: "Only educators can create services" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, durationMinutes, price, active } = body;

    if (!title || !durationMinutes || price === undefined) {
      return badRequestResponse("Title, durationMinutes, and price are required");
    }

    const service = await prisma.service.create({
      data: {
        educatorId: user.id,
        title,
        description: description || null,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

