import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PollOption } from "@/types/message";

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
    const { optionId, userId } = body;

    if (!optionId || !userId) {
      return NextResponse.json({ error: "Option ID and userId required" }, { status: 400 });
    }

    const existingMessage = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const pollOptions = (existingMessage.pollOptions as PollOption[]) || [];
    
    const updatedOptions = pollOptions.map((opt) => {
      if (opt.id === optionId) {
        if (!opt.voters.includes(userId)) {
          return {
            ...opt,
            votes: opt.votes + 1,
            voters: [...opt.voters, userId],
          };
        }
      }
      return opt;
    });

    const updatedMessage = await db
      .update(messages)
      .set({ pollOptions: updatedOptions })
      .where(eq(messages.id, id))
      .returning();

    return NextResponse.json(updatedMessage[0]);
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
