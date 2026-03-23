import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Code is required" },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().replace(/[^A-Z2-9]/g, "");

    if (normalizedCode.length !== 6) {
      return NextResponse.json({ valid: false, error: "Invalid code format" });
    }

    return NextResponse.json({
      valid: true,
      roomId: normalizedCode,
      status: "active",
      userCount: 1,
    });
  } catch (error) {
    console.error("Validate room error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate room" },
      { status: 500 }
    );
  }
}
