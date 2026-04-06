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
  const collegeType = searchParams.get("collegeType") || undefined;
  const collegeTier = searchParams.get("collegeTier") || undefined;
  const published = searchParams.get("published");

  const where: Prisma.CollegeWhereInput = {};

  if (published !== null && published !== undefined && published !== "") {
    where.published = published === "true";
  }
  if (collegeType) where.collegeType = collegeType;
  if (collegeTier) where.collegeTier = collegeTier;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { location: { contains: search } },
      { shortName: { contains: search } },
    ];
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { alumni: true } } },
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({ colleges, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  try {
    const body = await request.json();

    if (!body.name || !body.slug || !body.location) {
      return badRequestResponse("name, slug, and location are required");
    }

    // Check slug uniqueness
    const existing = await prisma.college.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return badRequestResponse("A college with this slug already exists");
    }

    const college = await prisma.college.create({
      data: {
        slug: body.slug,
        name: body.name,
        shortName: body.shortName || null,
        location: body.location,
        heroImageUrl: body.heroImageUrl || null,
        hero: body.hero ? JSON.stringify(body.hero) : null,
        about: body.about ? JSON.stringify(body.about) : null,
        courses: body.courses ? JSON.stringify(body.courses) : null,
        admission: body.admission ? JSON.stringify(body.admission) : null,
        recruiters: body.recruiters ? JSON.stringify(body.recruiters) : null,
        reviews: body.reviews ? JSON.stringify(body.reviews) : null,
        faqs: body.faqs ? JSON.stringify(body.faqs) : null,
        collegeType: body.collegeType || null,
        collegeTier: body.collegeTier || null,
        rating: body.rating ? parseFloat(body.rating) : null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        published: body.published ?? false,
      },
    });

    revalidatePath("/");
    revalidatePath("/colleges");

    return NextResponse.json({ college }, { status: 201 });
  } catch (error) {
    console.error("Error creating college:", error);
    return NextResponse.json({ error: "Failed to create college" }, { status: 500 });
  }
}
