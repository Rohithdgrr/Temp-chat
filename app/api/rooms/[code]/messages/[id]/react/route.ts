import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string; id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();
    const { emoji, userId } = body;

    if (!emoji || !userId) {
      return NextResponse.json({ error: "Emoji and userId required" }, { status: 400 });
    }

    const existingMessage = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const currentReactions = (existingMessage.reactions as Record<string, { count: number; users: string[] }>) || {};

    if (!currentReactions[emoji]) {
      currentReactions[emoji] = { count: 0, users: [] };
    }

    const userIndex = currentReactions[emoji].users.indexOf(userId);
    if (userIndex > -1) {
      currentReactions[emoji].users.splice(userIndex, 1);
      currentReactions[emoji].count--;
      if (currentReactions[emoji].count <= 0) {
        delete currentReactions[emoji];
      }
    } else {
      currentReactions[emoji].users.push(userId);
      currentReactions[emoji].count++;
    }

    const updatedMessage = await db
      .update(messages)
      .set({ reactions: currentReactions })
      .where(eq(messages.id, id))
      .returning();

    return NextResponse.json(updatedMessage[0]);
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
  }
}
