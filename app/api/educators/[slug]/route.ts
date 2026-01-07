import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFoundResponse } from "@/lib/api-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const educator = await prisma.user.findUnique({
      where: { educatorSlug: slug },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        educatorSlug: true,
        kycStatus: true,
      },
    });

    if (!educator || educator.role !== "EDUCATOR") {
      return notFoundResponse("Educator not found");
    }

    return NextResponse.json({ educator });
  } catch (error) {
    console.error("Error fetching educator:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

