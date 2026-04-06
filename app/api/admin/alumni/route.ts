import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);
  const search = searchParams.get("search") || undefined;
  const collegeId = searchParams.get("collegeId") || undefined;
  const isFeatured = searchParams.get("isFeatured");
  const isBookable = searchParams.get("isBookable");
  const published = searchParams.get("published");

  const where: Prisma.AlumniWhereInput = {};

  if (published !== null && published !== undefined && published !== "") {
    where.published = published === "true";
  }
  if (collegeId) where.collegeId = collegeId;
  if (isFeatured !== null && isFeatured !== undefined && isFeatured !== "") {
    where.isFeatured = isFeatured === "true";
  }
  if (isBookable !== null && isBookable !== undefined && isBookable !== "") {
    where.isBookable = isBookable === "true";
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { headline: { contains: search } },
      { currentCompany: { contains: search } },
      { location: { contains: search } },
    ];
  }

  const [alumni, total] = await Promise.all([
    prisma.alumni.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { college: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.alumni.count({ where }),
  ]);

  return NextResponse.json({ alumni, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  try {
    const body = await request.json();

    if (!body.name || !body.slug) {
      return badRequestResponse("name and slug are required");
    }

    const existing = await prisma.alumni.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return badRequestResponse("An alumni with this slug already exists");
    }

    const alumni = await prisma.alumni.create({
      data: {
        slug: body.slug,
        name: body.name,
        headline: body.headline || null,
        bio: body.bio || null,
        course: body.course || null,
        graduationYear: body.graduationYear ? parseInt(body.graduationYear, 10) : null,
        currentCompany: body.currentCompany || null,
        currentJobRole: body.currentJobRole || null,
        jobLocation: body.jobLocation || null,
        location: body.location || null,
        mobileNumber: body.mobileNumber || null,
        mail: body.mail || null,
        profileImageUrl: body.profileImageUrl || null,
        heroImageUrl: body.heroImageUrl || null,
        isBookable: body.isBookable ?? false,
        isFeatured: body.isFeatured ?? false,
        heroTagline: body.heroTagline || null,
        heroSummary: body.heroSummary ? JSON.stringify(body.heroSummary) : null,
        overview: body.overview ? JSON.stringify(body.overview) : null,
        availability: body.availability || null,
        stats: body.stats ? JSON.stringify(body.stats) : null,
        focusAreas: body.focusAreas ? JSON.stringify(body.focusAreas) : null,
        sessions: body.sessions ? JSON.stringify(body.sessions) : null,
        highlights: body.highlights ? JSON.stringify(body.highlights) : null,
        resources: body.resources ? JSON.stringify(body.resources) : null,
        reviews: body.reviews ? JSON.stringify(body.reviews) : null,
        featuredQuote: body.featuredQuote || null,
        bookingUrl: body.bookingUrl || null,
        questionUrl: body.questionUrl || null,
        published: body.published ?? false,
        collegeId: body.collegeId || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/alumni");

    return NextResponse.json({ alumni }, { status: 201 });
  } catch (error) {
    console.error("Error creating alumni:", error);
    return NextResponse.json({ error: "Failed to create alumni" }, { status: 500 });
  }
}
