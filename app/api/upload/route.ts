import { NextRequest, NextResponse } from "next/server";
import { STRAPI_API_URL, STRAPI_API_TOKEN } from "@/lib/strapi";

export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_API_URL) {
      return NextResponse.json(
        { error: "Strapi API URL is not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (PDF, images)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Create FormData for Strapi
    const strapiFormData = new FormData();
    strapiFormData.append("files", file);

    // Upload to Strapi
    const uploadUrl = `${STRAPI_API_URL}/api/upload`;
    const headers: HeadersInit = {};
    
    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }
    // Don't set Content-Type - let fetch set it automatically with boundary for FormData

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: strapiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("Strapi upload error:", errorText);
      return NextResponse.json(
        { error: "Failed to upload file to Strapi" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Strapi returns an array of file objects
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Invalid response from Strapi" },
        { status: 500 }
      );
    }

    const uploadedFile = data[0];
    
    // Return the file URL
    // Strapi file objects have a `url` property
    const fileUrl = uploadedFile.url?.startsWith("http")
      ? uploadedFile.url
      : `${STRAPI_API_URL}${uploadedFile.url}`;

    return NextResponse.json({
      url: fileUrl,
      id: uploadedFile.id,
      name: uploadedFile.name,
      mime: uploadedFile.mime,
      size: uploadedFile.size,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

