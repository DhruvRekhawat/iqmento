import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadFile } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedTypes = [...imageTypes, "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get("folder") as string) || "iqmento";

    if (imageTypes.includes(file.type)) {
      const result = await uploadImage(buffer, file.name, folder);
      return NextResponse.json({
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        name: file.name,
        mime: file.type,
        size: file.size,
      });
    } else {
      const result = await uploadFile(buffer, file.name, folder);
      return NextResponse.json({
        url: result.url,
        publicId: result.publicId,
        name: file.name,
        mime: file.type,
        size: file.size,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
