# TempChat

**Temporary chat rooms with file sharing — simple, fast, and private by design.**

<p align="center">
  <img src="https://via.placeholder.com/800x400/4F46E5/ffffff?text=TempChat" alt="TempChat Preview" />
</p>

## Quick Start

### 1. Install Node.js

Download from: https://nodejs.org/

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Browser

Go to: http://localhost:3000

**Note:** The app runs in demo mode without database setup. For full functionality:

## Full Setup (Optional)

### 1. Neon PostgreSQL
1. Sign up at https://neon.tech
2. Create a project
3. Copy connection string

### 2. Cloudflare R2
1. Sign up at https://cloudflare.com
2. Create R2 bucket
3. Get API credentials

### 3. Create `.env.local`

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-key-id"
R2_SECRET_ACCESS_KEY="your-secret"
R2_BUCKET_NAME="tempchat-files"
R2_PUBLIC_URL="https://your-bucket.r2.dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
npm run db:push
```

## Features

- Landing page with hero
- Create room with QR code
- Join room with OTP input
- Real-time chat (SSE)
- File uploads
- Message bubbles
- Typing indicators
- Timer countdown
- Export chat
- Mobile responsive

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon PostgreSQL
- Cloudflare R2
- Server-Sent Events

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint code
npm run typecheck # Type check
```

## Project Structure

```
tempchat/
├── app/
│   ├── page.tsx              # Landing
│   ├── create/page.tsx       # Create room
│   ├── join/page.tsx         # Join room
│   ├── chat/[code]/page.tsx # Chat room
│   └── api/                  # API routes
├── components/
│   └── ui/                  # UI components
├── lib/                      # Utilities
├── hooks/                    # React hooks
└── types/                    # TypeScript types
```

## License

MIT
