export type MessageType = "text" | "system" | "file" | "voice" | "poll";

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  key: string;
  maxViews?: number;
  viewCount?: number;
  burnAfterReading?: boolean;
}

export interface PollMetadata {
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
}

export interface Reactions {
  [emoji: string]: { count: number; users: string[] };
}

export interface Message {
  id: string;
  roomId: string;
  userId: string | null;
  senderName: string;
  type: MessageType;
  content: string;
  metadata: FileMetadata | null;
  createdAt: Date;
  replyToId?: string | null;
  replyTo?: Message | null;
  burnAfterReading?: number;
  maxViews?: number;
  viewCount?: number;
  expiresAt?: Date | null;
  reactions?: Reactions;
  isAnonymous?: number;
  isBurned?: boolean;
  isPinned?: number;
  unlockAt?: Date | null;
  mood?: string | null;
  isBlurred?: number;
  pollOptions?: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface SSEEvent {
  type: string;
  [key: string]: unknown;
}

export interface NewMessageEvent {
  type: "message:new";
  message: Message;
}

export interface UserJoinedEvent {
  type: "user:joined";
  user: {
    id: string;
    nickname: string;
  };
}

export interface UserLeftEvent {
  type: "user:left";
  userId: string;
}

export interface TypingEvent {
  type: "typing:start" | "typing:stop";
  userId: string;
  nickname: string;
}

export interface RoomExpireEvent {
  type: "room:expire";
  expiresAt: string;
}
