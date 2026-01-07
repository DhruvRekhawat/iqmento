import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can update KYC status" }, { status: 403 });
    }

    const body = await request.json();
    const { educatorId, kycStatus } = body;

    if (!educatorId) {
      return badRequestResponse("educatorId is required");
    }

    if (!kycStatus || !["PENDING", "APPROVED", "REJECTED"].includes(kycStatus)) {
      return badRequestResponse("kycStatus must be PENDING, APPROVED, or REJECTED");
    }

    const updated = await prisma.user.update({
      where: { id: educatorId },
      data: { kycStatus },
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
      },
    });

    return NextResponse.json({ educator: updated });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

