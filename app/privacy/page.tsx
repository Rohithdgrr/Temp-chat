import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, FileX, UserX } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="font-bold text-xl">
            TempChat
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Data Collection</h2>
            <p className="text-muted-foreground">
              TempChat is designed with privacy in mind. We collect minimal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Room codes:</strong> Temporary identifiers for chat rooms</li>
              <li><strong>Messages:</strong> Stored only until room expiration</li>
              <li><strong>Nicknames:</strong> Optional display names you choose</li>
              <li><strong>Files:</strong> Uploaded files stored until room expiration</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Data Deletion</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileX className="h-5 w-5 text-destructive" />
                  Automatic Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  All data is automatically and permanently deleted when:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Room expires (1 hour, 24 hours, or 7 days)</li>
                  <li>All participants leave the room</li>
                  <li>Manual room deletion by creator</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">No Account Required</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-primary" />
                  No Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We don&apos;t require sign-up, email, or any personal information.
                You can start chatting immediately with just a nickname.
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Cookies</h2>
            <p className="text-muted-foreground">
              We use minimal cookies for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Session management:</strong> Temporary session IDs during active chats</li>
              <li><strong>No tracking:</strong> No analytics or advertising cookies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              For privacy concerns, contact us at privacy@tempchat.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
