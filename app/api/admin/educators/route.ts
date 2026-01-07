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

    const educators = await prisma.user.findMany({
      where: {
        role: "EDUCATOR",
      },
      select: {
        id: true,
        email: true,
        name: true,
        educatorSlug: true,
        kycStatus: true,
        kycCollege: true,
        kycGraduationYear: true,
        kycLinkedin: true,
        kycDocumentUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ educators });
  } catch (error) {
    console.error("Error fetching educators:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

