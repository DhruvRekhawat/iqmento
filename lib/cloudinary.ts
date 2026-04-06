import crypto from "crypto";

/**
 * Parse CLOUDINARY_URL env var to extract credentials
 * Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 */
function parseCloudinaryEnv() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    throw new Error("CLOUDINARY_URL environment variable is not set");
  }

  const match = url.match(
    /^cloudinary:\/\/(\d+):([^@]+)@(.+)$/
  );
  if (!match) {
    throw new Error("Invalid CLOUDINARY_URL format. Expected: cloudinary://API_KEY:API_SECRET@CLOUD_NAME");
  }

  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  };
}

/**
 * Generate Cloudinary API signature
 */
function generateSignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(signatureString + apiSecret)
    .digest("hex");
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  folder: string
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryEnv();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    folder,
    timestamp,
  };

  const signature = generateSignature(params, apiSecret);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(file)]), filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

/**
 * Upload a file (PDF, etc.) to Cloudinary
 */
export async function uploadFile(
  file: Buffer,
  filename: string,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryEnv();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    folder,
    timestamp,
    resource_type: "raw",
  };

  const signature = generateSignature(params, apiSecret);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(file)]), filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Delete an asset from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryEnv();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    public_id: publicId,
    timestamp,
  };

  const signature = generateSignature(params, apiSecret);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );
}

/**
 * Get the Cloudinary cloud name from env
 */
export function getCloudName(): string {
  return parseCloudinaryEnv().cloudName;
}
