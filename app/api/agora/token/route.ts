import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-token";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth-utils";

// Get Agora credentials from environment
// Support both AGORA_APP_CERTIFICATE and AGORA_SECRET (AGORA_APP_CERTIFICATE takes precedence)
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || process.env.AGORA_SECRET;

if (!APP_ID || !APP_CERTIFICATE) {
  console.error("Missing Agora credentials: AGORA_APP_ID and AGORA_APP_CERTIFICATE (or AGORA_SECRET) must be set");
}

export async function POST(request: NextRequest) {
  try {
    if (!APP_ID || !APP_CERTIFICATE) {
      return NextResponse.json(
        { error: "Agora credentials not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { channelName, uid, role = "publisher" } = body;

    if (!channelName || uid === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: channelName and uid" },
        { status: 400 }
      );
    }

    // Validate UID is within Agora's valid range [0, 65535]
    const numericUid = Number(uid);
    if (isNaN(numericUid) || numericUid < 0 || numericUid > 65535 || !Number.isInteger(numericUid)) {
      return NextResponse.json(
        { error: "Invalid UID: must be an integer between 0 and 65535" },
        { status: 400 }
      );
    }

    // Validate user has access to this booking/channel
    // The channelName should be the booking ID
    const authToken = getTokenFromRequest(request);
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and get user
    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Verify booking exists and user has access
    const booking = await prisma.booking.findUnique({
      where: { id: channelName },
      select: {
        id: true,
        studentId: true,
        educatorId: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.studentId !== decoded.userId && booking.educatorId !== decoded.userId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    if (booking.status !== "UPCOMING") {
      return NextResponse.json(
        { error: "Meeting is not available" },
        { status: 400 }
      );
    }

    // Token expires in 24 hours
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + 24 * 3600;

    // Generate token
    const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      numericUid,
      rtcRole,
      expirationTimeInSeconds,
      expirationTimeInSeconds // Join channel privilege expiration (same as token expiration)
    );

    return NextResponse.json({
      token,
      appId: APP_ID,
      channelName,
      uid: numericUid,
      expirationTime: expirationTimeInSeconds,
    });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

