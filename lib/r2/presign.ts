import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, isR2Configured } from "./client";
import { randomUUID } from "crypto";

export async function createPresignedUrl(
  fileName: string,
  fileType: string,
  roomCode: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string } | { error: string }> {
  if (!isR2Configured) {
    return { error: "File storage not configured" };
  }

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${roomCode}/${randomUUID()}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const presignedUrl = await getSignedUrl(r2Client, command, {
    expiresIn: 3600,
  });

  const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const fileUrl = `${publicUrl}/${key}`;

  return { uploadUrl: presignedUrl, fileUrl, key };
}
