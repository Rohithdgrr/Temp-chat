<div align="center">
  
  <br />
  
  # 💬 TempChat
  
  **Frictionless, zero-persistence chat rooms with rich media support.**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Neon DB](https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech/)
  [![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cloudflare.com/)

  [**Live Demo**](https://temp-chat-nu.vercel.app) • [**Architecture**](#%EF%B8%8F-architecture--data-flow) • [**Report a Bug**](https://github.com/Rohithdgrr/Temp-chat/issues) • [**Contribute**](#-contributing)
</div>

---

## 📖 Table of Contents

- [The Problem & Solution](#-the-problem--solution)
- [Target Use Cases](#-target-use-cases)
- [Key Features](#-key-features)
- [Security & Privacy](#-security--privacy)
- [Architecture & Data Flow](#%EF%B8%8F-architecture--data-flow)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚡ The Problem & Solution

**The Problem:** Traditional messaging apps require account creation, phone numbers, or email verifications. They store your data indefinitely, making them bloated and unsuited for quick, disposable communication or fast file transfers between devices.

**The Solution:** TempChat is designed for the modern web. It provides **zero-friction, ephemeral communication**. Generate a room, share the OTP or QR code, exchange messages, code, and files, and watch the room self-destruct when the timer runs out. No tracking, no accounts, no trace.

---

## 🎯 Target Use Cases

- **Cross-Device File Transfer:** Quickly send a document or photo from your phone to your PC without using email or cloud drives.
- **Developer Collaboration:** Share code snippets with live syntax highlighting and execution previews without cluttering Slack or Discord.
- **Privacy-First Conversations:** Have secure, temporary discussions that are guaranteed to expire and delete from the database.
- **Classrooms & Workshops:** Create instant rooms for students or attendees to share links and files during a session.

---

## ✨ Key Features

### 💬 Core Chat & Experience
*   **Instant Rooms:** 1-click room creation with auto-generated QR codes and OTPs.
*   **Real-Time Sync:** Ultra-low latency messaging powered by Server-Sent Events (SSE).
*   **Auto-Destruction:** Built-in countdown timers. Once time is up, the room and its contents are purged.
*   **Chat Export:** Download your conversation history locally before the room expires.

### 📁 Media & File Sharing
*   **Versatile Uploads:** Support for Images, Videos, Audio, and Documents.
*   **Seamless UX:** Drag-and-drop zones, real-time upload progress bars, and rich media previews.
*   **Cloudflare Edge Storage:** Lightning-fast global file delivery via Cloudflare R2.

### 📝 Developer-Focused Markdown
*   **GitHub Flavored Markdown (GFM):** Full support for tables, blockquotes, lists, and links.
*   **Code Execution:** Write and run JavaScript/TypeScript directly inside the chat interface.
*   **Syntax Highlighting:** Auto-detected language formatting for clean, readable code sharing.

---

## 🛡️ Security & Privacy

TempChat treats user privacy as a first-class citizen. 

| Feature | Description |
| :--- | :--- |
| **No Authentication** | Users are completely anonymous. No emails, passwords, or OAuth required. |
| **Ephemeral Data** | Database records (messages, rooms) are designed to be temporary and are purged after the session expires. |
| **Secure Assets** | Uploaded files via R2 are isolated to specific chat sessions. |
| **XSS Protection** | Markdown rendering is strictly sanitized to prevent Cross-Site Scripting attacks. |

---

## 🏗️ Architecture & Data Flow

TempChat leverages a modern, serverless architecture optimized for edge delivery and real-time synchronization.

1.  **Client Layer (Next.js + React):** Handles the UI, markdown parsing, and local state management.
2.  **Transport Layer (SSE):** Instead of heavy WebSockets, TempChat uses lightweight Server-Sent Events to push database updates directly to connected clients efficiently.
3.  **Data Layer (Neon Postgres + Drizzle ORM):** Serverless PostgreSQL handles room states and message history with minimal cold starts.
4.  **Storage Layer (Cloudflare R2):** S3-compatible edge storage handles heavy media assets to keep database costs low and download speeds high.

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18 | App Router, Server Components, UI rendering |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first styling and accessible component primitives |
| **Database** | Neon PostgreSQL | Serverless, scalable relational database |
| **ORM** | Drizzle ORM | Type-safe database queries and migrations |
| **Storage** | Cloudflare R2 | High-performance, zero-egress-fee object storage |
| **Markdown** | `react-markdown`, `remark-gfm` | Secure, rich text and code block rendering |

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js v18 or higher
*   Git

### 2. Local Setup (Demo Mode)

Clone the repository and install dependencies:

```bash
git clone [https://github.com/Rohithdgrr/Temp-chat.git](https://github.com/Rohithdgrr/Temp-chat.git)
cd Temp-chat
npm install
