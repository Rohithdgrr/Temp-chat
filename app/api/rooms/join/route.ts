import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { code, nickname = "Guest" } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Code is required" },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().replace(/[^A-Z2-9]/g, "");

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.code, normalizedCode),
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    const currentUserCount = await db.query.users.findMany({
      where: and(
        eq(users.roomId, room.id),
        isNull(users.leftAt)
      ),
    });

    if (currentUserCount.length >= room.maxUsers) {
      return NextResponse.json(
        { success: false, error: "Room is full" },
        { status: 403 }
      );
    }

    const [user] = await db.insert(users).values({
      roomId: room.id,
      nickname,
    }).returning();

    return NextResponse.json({
      success: true,
      roomId: room.code,
      userId: user.id,
      maxUsers: room.maxUsers,
    });
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join room" },
      { status: 500 }
    );
  }
}
