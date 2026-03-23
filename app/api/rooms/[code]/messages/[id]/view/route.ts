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

    const existingMessage = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const currentViews = (existingMessage.viewCount || 0) + 1;
    const maxViews = existingMessage.maxViews || 0;

    if (maxViews > 0 && currentViews >= maxViews) {
      await db.delete(messages).where(eq(messages.id, id));
      return NextResponse.json({ deleted: true, views: currentViews });
    }

    const updatedMessage = await db
      .update(messages)
      .set({ viewCount: currentViews })
      .where(eq(messages.id, id))
      .returning();

    return NextResponse.json({ views: currentViews, deleted: false, message: updatedMessage[0] });
  } catch (error) {
    console.error("View track error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
