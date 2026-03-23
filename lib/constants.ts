export const EXPIRY_OPTIONS = [
  { label: "1 Hour", value: 60, description: "Quick chat" },
  { label: "24 Hours", value: 1440, description: "Day-long collaboration" },
  { label: "7 Days", value: 10080, description: "Extended project" },
] as const;

export const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB (Catbox limit)

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const SSE_RECONNECT_DELAY = 3000;
export const SSE_POLL_INTERVAL = 500;

export const TYPING_TIMEOUT = 3000;
