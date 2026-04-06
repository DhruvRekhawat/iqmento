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
  const college = await prisma.college.findUnique({
    where: { id },
    include: { alumni: { select: { id: true, name: true, slug: true } } },
  });

  if (!college) return notFoundResponse("College not found");

  // Parse JSON fields for the response
  return NextResponse.json({
    college: {
      ...college,
      hero: college.hero ? JSON.parse(college.hero) : null,
      about: college.about ? JSON.parse(college.about) : null,
      courses: college.courses ? JSON.parse(college.courses) : null,
      admission: college.admission ? JSON.parse(college.admission) : null,
      recruiters: college.recruiters ? JSON.parse(college.recruiters) : null,
      reviews: college.reviews ? JSON.parse(college.reviews) : null,
      faqs: college.faqs ? JSON.parse(college.faqs) : null,
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
  const existing = await prisma.college.findUnique({ where: { id } });
  if (!existing) return notFoundResponse("College not found");

  try {
    const body = await request.json();

    const college = await prisma.college.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.shortName !== undefined && { shortName: body.shortName || null }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.heroImageUrl !== undefined && { heroImageUrl: body.heroImageUrl || null }),
        ...(body.hero !== undefined && { hero: body.hero ? JSON.stringify(body.hero) : null }),
        ...(body.about !== undefined && { about: body.about ? JSON.stringify(body.about) : null }),
        ...(body.courses !== undefined && {
          courses: body.courses ? JSON.stringify(body.courses) : null,
        }),
        ...(body.admission !== undefined && {
          admission: body.admission ? JSON.stringify(body.admission) : null,
        }),
        ...(body.recruiters !== undefined && {
          recruiters: body.recruiters ? JSON.stringify(body.recruiters) : null,
        }),
        ...(body.reviews !== undefined && {
          reviews: body.reviews ? JSON.stringify(body.reviews) : null,
        }),
        ...(body.faqs !== undefined && { faqs: body.faqs ? JSON.stringify(body.faqs) : null }),
        ...(body.collegeType !== undefined && { collegeType: body.collegeType || null }),
        ...(body.collegeTier !== undefined && { collegeTier: body.collegeTier || null }),
        ...(body.rating !== undefined && { rating: body.rating ? parseFloat(body.rating) : null }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle || null }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription || null }),
        ...(body.published !== undefined && { published: body.published }),
      },
    });

    revalidatePath("/");
    revalidatePath("/colleges");
    revalidatePath(`/colleges/${college.slug}`);

    return NextResponse.json({ college });
  } catch (error) {
    console.error("Error updating college:", error);
    return NextResponse.json({ error: "Failed to update college" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  const { id } = await params;
  const existing = await prisma.college.findUnique({ where: { id } });
  if (!existing) return notFoundResponse("College not found");

  await prisma.college.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/colleges");

  return NextResponse.json({ success: true });
}
