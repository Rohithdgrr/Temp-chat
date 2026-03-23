import { NextRequest, NextResponse } from "next/server";
import { createPresignedUrl } from "@/lib/r2/presign";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, roomCode } = body;

    const result = await createPresignedUrl(
      fileName || "file.txt",
      fileType || "text/plain",
      roomCode || "demo"
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 503 }
      );
    }

    return NextResponse.json({
      uploadUrl: result.uploadUrl,
      fileUrl: result.fileUrl,
      key: result.key,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
