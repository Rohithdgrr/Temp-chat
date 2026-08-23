import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, messages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { format = "json" } = await request.json();
  const roomCode = code.toUpperCase();

  if (!db) {
    return NextResponse.json({ error:"Database not configured" }, { status:500 });
  }
  const room = await db.query.rooms.findFirst({ where: eq(rooms.code, roomCode) });
  if (!room) return NextResponse.json({ error:"Room not found" }, { status:404 });

  const msgs = await db.query.messages.findMany({ where: eq(messages.roomId, room.id), orderBy:[desc(messages.createdAt)] });

  if (format === "txt") {
    let content = `TempChat Export\n`;
    content += `Room: ${roomCode}\n`;
    content += `Exported: ${new Date().toISOString()}\n`;
    content += `Messages: ${msgs.length}\n`;
    content += `${"=".repeat(50)}\n\n`;
    for (const msg of msgs.reverse()) {
      const time = new Date(msg.createdAt).toLocaleString();
      content += `[${time}] ${msg.senderName}: ${msg.content}\n`;
    }
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="tempchat-${roomCode}.txt"`,
      },
    });
  }

  return NextResponse.json({
    room:{ code:room.code, status:room.status, createdAt:room.createdAt, expiresAt:room.expiresAt },
    exportedAt: new Date().toISOString(),
    messageCount: msgs.length,
    messages: msgs.reverse(),
  });
}
