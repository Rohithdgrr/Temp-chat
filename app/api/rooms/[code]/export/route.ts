import { NextRequest, NextResponse } from "next/server";

const demoMessages = [
  { id: "1", senderName: "Alice", content: "Hey! This is TempChat demo 🎉", type: "text", createdAt: new Date(Date.now() - 60000), metadata: null },
  { id: "2", senderName: "You", content: "Wow, it works! How cool is this?", type: "text", createdAt: new Date(Date.now() - 30000), metadata: null },
  { id: "3", senderName: "Alice", content: "Pretty cool! Create a real room to start chatting.", type: "text", createdAt: new Date(), metadata: null },
];

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { format = "json" } = await request.json();

  if (format === "txt") {
    let content = `TempChat Export\n`;
    content += `Room: ${code}\n`;
    content += `Exported: ${new Date().toISOString()}\n`;
    content += `Messages: ${demoMessages.length}\n`;
    content += `${"=".repeat(50)}\n\n`;

    for (const msg of demoMessages) {
      const time = new Date(msg.createdAt).toLocaleString();
      content += `[${time}] ${msg.senderName}: ${msg.content}\n`;
    }

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="tempchat-${code}.txt"`,
      },
    });
  }

  return NextResponse.json({
    room: {
      code,
      status: "demo",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
    },
    exportedAt: new Date().toISOString(),
    messageCount: demoMessages.length,
    messages: demoMessages,
  });
}
