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
        kycCollege: true,
        kycGraduationYear: true,
        kycLinkedin: true,
        kycDocumentUrl: true,
      },
    });

    return NextResponse.json({ 
      kycStatus: fullUser?.kycStatus || "PENDING",
      educatorSlug: fullUser?.educatorSlug,
      college: fullUser?.kycCollege,
      graduationYear: fullUser?.kycGraduationYear,
      linkedin: fullUser?.kycLinkedin,
      documentUrl: fullUser?.kycDocumentUrl,
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
    const { 
      kycStatus, 
      educatorSlug, 
      educatorId, // For admin to update other educators
      college,
      graduationYear,
      linkedin,
      documentUrl,
    } = body;

    // Determine which user to update
    const targetUserId = educatorId && user.role === "ADMIN" ? educatorId : user.id;

    // Validate kycStatus if provided
    if (kycStatus && !["PENDING", "APPROVED", "REJECTED"].includes(kycStatus)) {
      return badRequestResponse("kycStatus must be PENDING, APPROVED, or REJECTED");
    }

    // Only allow educators to update their own KYC, but admins can update any educator
    if (user.role !== "EDUCATOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only educators and admins can update KYC" }, { status: 403 });
    }

    // Only allow users to set their own status to PENDING
    // APPROVED and REJECTED should be set by admins only
    if (kycStatus && kycStatus !== "PENDING" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can approve or reject KYC" }, { status: 403 });
    }

    // Only educators can update their own KYC form data
    if (targetUserId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "You can only update your own KYC information" }, { status: 403 });
    }

    const updateData: {
      kycStatus?: string;
      educatorSlug?: string;
      kycCollege?: string;
      kycGraduationYear?: number | null;
      kycLinkedin?: string;
      kycDocumentUrl?: string;
    } = {};

    if (kycStatus !== undefined) {
      updateData.kycStatus = kycStatus;
    }
    if (educatorSlug !== undefined) {
      updateData.educatorSlug = educatorSlug;
    }
    if (college !== undefined) {
      updateData.kycCollege = college || null;
    }
    if (graduationYear !== undefined) {
      updateData.kycGraduationYear = graduationYear ? parseInt(String(graduationYear), 10) : null;
    }
    if (linkedin !== undefined) {
      updateData.kycLinkedin = linkedin || null;
    }
    if (documentUrl !== undefined) {
      updateData.kycDocumentUrl = documentUrl || null;
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
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

    return NextResponse.json({ 
      kycStatus: updated.kycStatus || "PENDING",
      educatorSlug: updated.educatorSlug,
      college: updated.kycCollege,
      graduationYear: updated.kycGraduationYear,
      linkedin: updated.kycLinkedin,
      documentUrl: updated.kycDocumentUrl,
    });
  } catch (error) {
    console.error("Error updating KYC:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

