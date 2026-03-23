export type RoomStatus = "waiting" | "active" | "ended";

export interface RoomInfo {
  id: string;
  code: string;
  status: RoomStatus;
  maxUsers: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface CreateRoomResponse {
  code: string;
  roomId: string;
  expiresAt: string;
}

export interface ValidateRoomResponse {
  valid: boolean;
  roomId?: string;
  status?: RoomStatus;
  userCount?: number;
}

export interface JoinRoomResponse {
  success: boolean;
  roomId: string;
  userId: string;
}
