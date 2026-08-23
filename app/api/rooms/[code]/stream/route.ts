import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { rooms, messages } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { broadcaster } from "@/lib/broadcaster";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const roomCode = code.toUpperCase();

  if (!userId) {
    return new Response("userId required", { status: 400 });
  }

  const encoder = new TextEncoder();
  let isConnected = true;

  broadcaster.addClient(roomCode, userId, (data) => {});

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      const interval = setInterval(() => {
        if (isConnected) {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch {}
        }
      }, 15000);

      const handler = (data: unknown) => {
        if (!isConnected) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {}
      };
      broadcaster.addClient(roomCode, userId, handler);

      request.signal.addEventListener("abort", () => {
        isConnected = false;
        clearInterval(interval);
        broadcaster.removeClient(roomCode, userId);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
