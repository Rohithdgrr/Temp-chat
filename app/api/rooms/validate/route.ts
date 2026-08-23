import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

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
    if (!db) return NextResponse.json({ valid:false, error:"Database not configured"},{status:500});
    const room = await db.query.rooms.findFirst({ where: eq(rooms.code, normalizedCode) });
    if (!room) return NextResponse.json({ valid:false, error:"Room not found" },{status:404});
    if (new Date(room.expiresAt) < new Date()) return NextResponse.json({ valid:false, error:"Room expired" },{status:410});
    const userCount = await db.query.users.findMany({ where: and(eq(users.roomId, room.id), isNull(users.leftAt)) });
    return NextResponse.json({
      valid: true,
      roomId: normalizedCode,
      status: room.status,
      userCount: userCount.length,
      maxUsers: room.maxUsers,
    });
  } catch (error) {
    console.error("Validate room error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate room" },
      { status: 500 }
    );
  }
}
