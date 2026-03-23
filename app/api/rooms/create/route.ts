import { NextResponse } from "next/server";
import { generateCode } from "@/lib/code-generator";
import { db } from "@/lib/db";
import { rooms, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nickname = "Guest", expiryMinutes = 1440, maxUsers = 31 } = body;

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const [room] = await db.insert(rooms).values({
      code,
      status: "waiting",
      expiresAt,
      maxUsers: Math.min(Math.max(2, maxUsers), 31),
    }).returning();

    const [user] = await db.insert(users).values({
      roomId: room.id,
      nickname,
    }).returning();

    return NextResponse.json({
      code: room.code,
      roomId: room.code,
      expiresAt: room.expiresAt.toISOString(),
      userId: user.id,
      maxUsers: room.maxUsers,
    });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
