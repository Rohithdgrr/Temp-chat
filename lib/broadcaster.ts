type BroadcastCallback = (data: unknown) => void;

class SSEBroadcaster {
  private clients: Map<string, Map<string, BroadcastCallback>> = new Map();

  addClient(roomCode: string, userId: string, callback: BroadcastCallback) {
    if (!this.clients.has(roomCode)) {
      this.clients.set(roomCode, new Map());
    }
    this.clients.get(roomCode)!.set(userId, callback);
    console.log(`[SSE] Client ${userId} connected to room ${roomCode}. Total clients: ${this.clients.get(roomCode)!.size}`);
  }

  removeClient(roomCode: string, userId: string) {
    const roomClients = this.clients.get(roomCode);
    if (roomClients) {
      roomClients.delete(userId);
      console.log(`[SSE] Client ${userId} disconnected from room ${roomCode}. Remaining: ${roomClients.size}`);
      if (roomClients.size === 0) {
        this.clients.delete(roomCode);
      }
    }
  }

  broadcast(roomCode: string, eventType: string, data: unknown) {
    const roomClients = this.clients.get(roomCode);
    if (roomClients) {
      const payload = { type: eventType, ...(data as object) };
      roomClients.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[SSE] Broadcast error:`, error);
        }
      });
      console.log(`[SSE] Broadcasted ${eventType} to ${roomClients.size} clients in room ${roomCode}`);
    }
  }

  getClientCount(roomCode: string): number {
    return this.clients.get(roomCode)?.size || 0;
  }
}

export const broadcaster = new SSEBroadcaster();
