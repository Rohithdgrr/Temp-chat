import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const filename = searchParams.get("name") || "download";

    if (!fileUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Redirect to the file with download headers
    // The browser will automatically download the file
    return NextResponse.redirect(fileUrl, 302);
  } catch (error) {
    console.error("Download redirect error:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
