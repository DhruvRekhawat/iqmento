import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== "EDUCATOR") {
      return NextResponse.json({ error: "Only educators have KYC status" }, { status: 403 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        educatorSlug: true,
        kycStatus: true,
      },
    });

    return NextResponse.json({ 
      kycStatus: fullUser?.kycStatus || "PENDING",
      educatorSlug: fullUser?.educatorSlug,
    });
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { kycStatus, educatorSlug } = body;

    // Validate kycStatus if provided
    if (kycStatus && !["PENDING", "APPROVED", "REJECTED"].includes(kycStatus)) {
      return badRequestResponse("kycStatus must be PENDING, APPROVED, or REJECTED");
    }

    // Only allow educators to update KYC, but admins can approve/reject
    if (user.role !== "EDUCATOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only educators can update KYC" }, { status: 403 });
    }

    // Only allow users to set their own status to PENDING
    // APPROVED and REJECTED should be set by admins only
    if (kycStatus && kycStatus !== "PENDING" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can approve or reject KYC" }, { status: 403 });
    }

    const updateData: { kycStatus?: string; educatorSlug?: string } = {};
    if (kycStatus !== undefined) {
      updateData.kycStatus = kycStatus;
    }
    if (educatorSlug !== undefined) {
      updateData.educatorSlug = educatorSlug;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        educatorSlug: true,
        kycStatus: true,
      },
    });

    return NextResponse.json({ 
      kycStatus: updated.kycStatus || "PENDING",
      educatorSlug: updated.educatorSlug,
    });
  } catch (error) {
    console.error("Error updating KYC:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

