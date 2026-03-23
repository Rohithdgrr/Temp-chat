import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has expired.
        </p>
        <Link href="/">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
