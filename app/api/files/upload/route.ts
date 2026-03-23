import { NextRequest, NextResponse } from "next/server";
import { uploadToCatbox } from "@/lib/storage/catbox";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const roomCode = formData.get("roomCode") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 200MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCatbox(buffer, file.name, file.type);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    const messageType = getMessageType(file.type);

    return NextResponse.json({
      success: true,
      fileUrl: result.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      messageType,
      roomCode,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

function getMessageType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "file";
}
