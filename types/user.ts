export interface User {
  id: string;
  roomId: string;
  nickname: string;
  joinedAt: Date;
  leftAt: Date | null;
}

export interface UserPresence {
  id: string;
  nickname: string;
  isTyping: boolean;
}
