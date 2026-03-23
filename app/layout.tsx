import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TempChat - Temporary Chat Rooms",
    template: "%s | TempChat",
  },
  description: "Create temporary chat rooms with file sharing. No account required. Chat instantly, share files, and save what matters before the room expires.",
  keywords: ["chat", "temporary chat", "ephemeral messaging", "file sharing", "no signup", "anonymous chat"],
  authors: [{ name: "TempChat" }],
  creator: "TempChat",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tempchat.app",
    siteName: "TempChat",
    title: "TempChat - Temporary Chat Rooms",
    description: "Create temporary chat rooms with file sharing. No account required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TempChat - Temporary Chat Rooms",
    description: "Create temporary chat rooms with file sharing. No account required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
