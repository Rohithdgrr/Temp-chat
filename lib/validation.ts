import { z } from "zod";

export const codeSchema = z.string().transform(s => s.toUpperCase().replace(/[^A-Z2-9]/g,'')).refine(v => v.length === 6, { message: 'Code must be 6 characters' });
export const nicknameSchema = z.string().min(1).max(50).regex(/^[a-zA-Z0-9 _-]+$/);
export const expirySchema = z.number().int().min(60).max(10080);
export const maxUsersSchema = z.number().int().min(2).max(31);
export const createRoomSchema = z.object({
  nickname: z.string().max(50).optional().default("Guest"),
  expiryMinutes: expirySchema.optional().default(1440),
  maxUsers: maxUsersSchema.optional().default(31),
});

export const joinRoomSchema = z.object({
  code: codeSchema,
  nickname: z.string().max(50).optional().default("Guest"),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(10000),
  userId: z.string().min(1),
  type: z.enum(["text","image","video","audio","file","system","poll","voice"]).optional().default("text"),
  metadata: z.any().optional(),
  replyToId: z.string().optional().nullable(),
  burnAfterReading: z.number().int().min(0).max(1).optional().default(0),
  maxViews: z.number().int().min(0).optional().default(0),
  expiresAt: z.string().datetime().optional().nullable(),
  isAnonymous: z.number().int().min(0).max(1).optional().default(0),
});

export const reactSchema = z.object({
  emoji: z.string().min(1).max(10),
  userId: z.string().min(1),
});

export const voteSchema = z.object({
  optionId: z.string().min(1),
  userId: z.string().min(1),
});
