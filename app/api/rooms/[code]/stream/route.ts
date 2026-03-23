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

  const connectedPromise = new Promise<void>((resolve) => {
    broadcaster.addClient(roomCode, userId, (data) => {
      if (isConnected) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
    });

    const controller = {
      enqueue: (chunk: Uint8Array) => {
        if (isConnected) {
          try {
            request.signal.throwIfAborted();
          } catch {
            // Signal aborted
          }
        }
      },
    };

    resolve();
  });

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      const interval = setInterval(() => {
        if (isConnected) {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch {
            clearInterval(interval);
          }
        }
      }, 15000);

      request.signal.addEventListener("abort", () => {
        isConnected = false;
        clearInterval(interval);
        broadcaster.removeClient(roomCode, userId);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });

      connectedPromise.then(() => {
        broadcaster.addClient(roomCode, userId, (data) => {
          if (isConnected) {
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            } catch {
              // Stream closed
            }
          }
        });
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
