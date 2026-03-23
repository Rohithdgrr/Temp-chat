# Setup Instructions for TempChat

## Prerequisites

You need to install the following:

### 1. Node.js (Required)

Download and install from: https://nodejs.org/

**For Windows:**
- Download the Windows Installer (.msi)
- Run the installer
- Restart your terminal/command prompt
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Git (Optional but recommended)

Download from: https://git-scm.com/

## Quick Setup

### Step 1: Open Terminal

Open Command Prompt or PowerShell:
```
Press Win + R, type "cmd", press Enter
```

### Step 2: Navigate to Project

```bash
cd "C:\Users\Student\Music\New folder (2)"
```

### Step 3: Install Node.js (if not installed)

Download from: https://nodejs.org/

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Set Up Services

#### Neon PostgreSQL (Free)
1. Go to: https://neon.tech
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Create `.env.local` file:
   ```
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```

#### Cloudflare R2 (Free)
1. Go to: https://dash.cloudflare.com
2. Sign up for free
3. Create R2 bucket named `tempchat-files`
4. Create API token
5. Add to `.env.local`:
   ```
   R2_ACCOUNT_ID="your-account-id"
   R2_ACCESS_KEY_ID="your-access-key"
   R2_SECRET_ACCESS_KEY="your-secret"
   R2_BUCKET_NAME="tempchat-files"
   R2_PUBLIC_URL="https://pub-xxx.r2.dev"
   ```

### Step 6: Initialize Database

```bash
npm run db:push
```

### Step 7: Start Development Server

```bash
npm run dev
```

### Step 8: Open Browser

Go to: http://localhost:3000

## Alternative: Quick Preview Without Setup

If you want to preview the UI without setting up databases:

1. The project structure is complete
2. Install Node.js from: https://nodejs.org/
3. Run the setup commands above
4. Visit http://localhost:3000

## Troubleshooting

### "npm is not recognized"
- Restart your terminal after installing Node.js
- Or add Node.js to PATH

### "Cannot connect to database"
- Check your Neon connection string
- Ensure `?sslmode=require` is at the end

### "Cannot upload files"
- Check R2 credentials
- Ensure CORS is configured on R2 bucket

## VS Code Setup (Recommended)

1. Download VS Code: https://code.visualstudio.com/
2. Open the project folder
3. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

## Next Steps After Setup

1. Create a room at `/create`
2. Copy the room code
3. Open another browser/tab to `/join`
4. Enter the code
5. Start chatting!

## Features Working After Setup

- Landing page with hero
- Create room with QR code
- Join room with OTP input
- Real-time chat via SSE
- File uploads to R2
- File downloads
- Message bubbles
- Typing indicators
- Timer countdown
- Export chat (JSON/TXT)
- Session ended page
- Mobile responsive
- Toast notifications
- Connection status
