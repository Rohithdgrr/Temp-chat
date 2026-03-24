import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, messages, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { broadcaster } from "@/lib/broadcaster";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    if (!db) {
      return NextResponse.json([]);
    }

    const { code } = await params;
    const roomCode = code.toUpperCase();

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.code, roomCode),
    });

    if (!room) {
      return NextResponse.json({
        messages: [],
        userCount: 0,
        room: null,
      });
    }

    const roomMessages = await db.query.messages.findMany({
      where: eq(messages.roomId, room.id),
      orderBy: [desc(messages.createdAt)],
      limit: 100,
    });

    const roomUsers = await db.query.users.findMany({
      where: eq(users.roomId, room.id),
    });

    return NextResponse.json({
      messages: roomMessages.reverse(),
      userCount: roomUsers.length,
      room: {
        expiresAt: room.expiresAt,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({
      messages: [],
      userCount: 0,
      room: null,
    });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { code } = await params;
    const body = await request.json();
    const { 
      content, 
      userId, 
      type = "text", 
      metadata = null,
      replyToId = null,
      burnAfterReading = 0,
      maxViews = 0,
      expiresAt = null,
      isAnonymous = 0
    } = body;
    const roomCode = code.toUpperCase();

    if (!content || !userId) {
      return NextResponse.json({ error: "Content and userId required" }, { status: 400 });
    }

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.code, roomCode),
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const user = await db.query.users.findFirst({
      where: and(eq(users.roomId, room.id), eq(users.id, userId)),
    });

    const message = await db.insert(messages).values({
      roomId: room.id,
      userId: userId,
      senderName: user?.nickname || body.senderName || "You",
      type,
      content,
      metadata,
      replyToId,
      burnAfterReading,
      maxViews,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isAnonymous,
      reactions: {},
    }).returning();

    const savedMessage = message[0];

    broadcaster.broadcast(roomCode, "message", savedMessage);

    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { code } = await params;
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    await db.delete(messages).where(eq(messages.id, messageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
