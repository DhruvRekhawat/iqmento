import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse, notFoundResponse } from "@/lib/api-helpers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const rule = await prisma.availabilityRule.findUnique({
      where: { id },
    });

    if (!rule) {
      return notFoundResponse("Availability rule not found");
    }

    if (rule.educatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.availabilityRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting availability rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

