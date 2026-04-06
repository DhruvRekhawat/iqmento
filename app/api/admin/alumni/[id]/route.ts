import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  const { id } = await params;
  const alumni = await prisma.alumni.findUnique({
    where: { id },
    include: { college: { select: { id: true, name: true, slug: true } } },
  });

  if (!alumni) return notFoundResponse("Alumni not found");

  return NextResponse.json({
    alumni: {
      ...alumni,
      heroSummary: alumni.heroSummary ? JSON.parse(alumni.heroSummary) : null,
      overview: alumni.overview ? JSON.parse(alumni.overview) : null,
      stats: alumni.stats ? JSON.parse(alumni.stats) : null,
      focusAreas: alumni.focusAreas ? JSON.parse(alumni.focusAreas) : null,
      sessions: alumni.sessions ? JSON.parse(alumni.sessions) : null,
      highlights: alumni.highlights ? JSON.parse(alumni.highlights) : null,
      resources: alumni.resources ? JSON.parse(alumni.resources) : null,
      reviews: alumni.reviews ? JSON.parse(alumni.reviews) : null,
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  const { id } = await params;
  const existing = await prisma.alumni.findUnique({ where: { id } });
  if (!existing) return notFoundResponse("Alumni not found");

  try {
    const body = await request.json();

    const jsonField = (val: unknown) =>
      val !== undefined ? (val ? JSON.stringify(val) : null) : undefined;

    const data: Record<string, unknown> = {};

    // Simple string fields
    const stringFields = [
      "slug", "name", "headline", "bio", "course", "currentCompany",
      "currentJobRole", "jobLocation", "location", "mobileNumber", "mail",
      "profileImageUrl", "heroImageUrl", "heroTagline", "availability",
      "featuredQuote", "bookingUrl", "questionUrl", "collegeId",
    ] as const;

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        data[field] = body[field] || null;
      }
    }

    // Integer fields
    if (body.graduationYear !== undefined) {
      data.graduationYear = body.graduationYear ? parseInt(body.graduationYear, 10) : null;
    }

    // Boolean fields
    if (body.isBookable !== undefined) data.isBookable = body.isBookable;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.published !== undefined) data.published = body.published;

    // JSON fields
    const jsonFields = [
      "heroSummary", "overview", "stats", "focusAreas",
      "sessions", "highlights", "resources", "reviews",
    ] as const;

    for (const field of jsonFields) {
      const val = jsonField(body[field]);
      if (val !== undefined) {
        data[field] = val;
      }
    }

    const alumni = await prisma.alumni.update({ where: { id }, data });

    revalidatePath("/");
    revalidatePath("/alumni");
    revalidatePath(`/alumni/${alumni.slug}`);

    return NextResponse.json({ alumni });
  } catch (error) {
    console.error("Error updating alumni:", error);
    return NextResponse.json({ error: "Failed to update alumni" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  const { id } = await params;
  const existing = await prisma.alumni.findUnique({ where: { id } });
  if (!existing) return notFoundResponse("Alumni not found");

  await prisma.alumni.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/alumni");

  return NextResponse.json({ success: true });
}
