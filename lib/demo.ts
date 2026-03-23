export const DEMO_MODE = process.env.DEMO_MODE !== "false";

export const DEMO_MESSAGES = [
  { id: "demo-1", roomId: "DEMO01", userId: null, senderName: "Welcome Bot", content: "👋 Welcome to TempChat!", type: "system" as const, createdAt: new Date(Date.now() - 120000), metadata: null },
  { id: "demo-2", roomId: "DEMO01", userId: "demo-user", senderName: "Demo User", content: "This is a demo of how messages look in TempChat.", type: "text" as const, createdAt: new Date(Date.now() - 60000), metadata: null },
  { id: "demo-3", roomId: "DEMO01", userId: "current-user", senderName: "You", content: "Messages appear on the left or right depending on who sent them.", type: "text" as const, createdAt: new Date(Date.now() - 30000), metadata: null },
  { id: "demo-4", roomId: "DEMO01", userId: "demo-user", senderName: "Demo User", content: "Create a real room at /create to start chatting with friends!", type: "text" as const, createdAt: new Date(), metadata: null },
];
