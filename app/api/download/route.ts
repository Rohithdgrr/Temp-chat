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

    let urlObj: URL;
    try {
      urlObj = new URL(fileUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const allowedHosts = [
      "catbox.moe",
      "catbox.to",
      "r2.dev",
      "r2.cloudflarestorage.com",
    ];
    if (!allowedHosts.some(h => urlObj.hostname.endsWith(h))) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    return NextResponse.redirect(fileUrl, 302);
  } catch (error) {
    console.error("Download redirect error:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
