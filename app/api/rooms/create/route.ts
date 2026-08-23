import { NextResponse } from "next/server";
import { generateCode } from "@/lib/code-generator";
import { db } from "@/lib/db";
import { rooms, users } from "@/lib/db/schema";
import { createRoomSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { nickname, expiryMinutes, maxUsers } = parsed.data;

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    let code: string, room;
    for (let i=0;i<5;i++) {
      code = generateCode();
      try {
        const [r] = await db.insert(rooms).values({
          code,
          status: "waiting",
          expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
          maxUsers,
        }).returning();
        room = r;
        break;
      } catch(e:any) {
        if (!e.message?.includes('duplicate')) throw e;
      }
    }
    if (!room) return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });

    const [newUser] = await db.insert(users).values({
      roomId: room.id,
      nickname,
    }).returning();

    return NextResponse.json({
      code: room.code,
      roomId: room.code,
      expiresAt: room.expiresAt.toISOString(),
      userId: newUser.id,
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
