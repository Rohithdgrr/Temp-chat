import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 6 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default("waiting").notNull(),
  maxUsers: integer("max_users").default(31).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
}, (table) => ({
  codeIdx: index("rooms_code_idx").on(table.code),
}));

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  nickname: varchar("nickname", { length: 50 }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  senderName: varchar("sender_name", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).default("text").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  replyToId: uuid("reply_to_id"),
  burnAfterReading: integer("burn_after_reading").default(0),
  maxViews: integer("max_views").default(0),
  viewCount: integer("view_count").default(0),
  expiresAt: timestamp("expires_at"),
  reactions: jsonb("reactions").default({}),
  isAnonymous: integer("is_anonymous").default(0),
  isPinned: integer("is_pinned").default(0),
  unlockAt: timestamp("unlock_at"),
  mood: varchar("mood", { length: 20 }),
  isBlurred: integer("is_blurred").default(0),
  pollOptions: jsonb("poll_options"),
}, (table) => ({
  roomIdIdx: index("messages_room_id_idx").on(table.roomId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
