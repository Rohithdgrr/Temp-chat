import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, AlertTriangle, Shield } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Acceptance</h2>
            <p className="text-muted-foreground">
              By using TempChat, you agree to these terms. If you don&apos;t agree, please don&apos;t use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Temporary Nature</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Ephemeral Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>All chats are temporary and will be automatically deleted:</p>
                <ul className="list-disc pl-6">
                  <li>After the room&apos;s expiration time</li>
                  <li>When all participants leave</li>
                  <li>Upon manual room deletion</li>
                </ul>
                <p className="mt-4">
                  <strong>Important:</strong> We cannot recover deleted data. Export important conversations before expiration.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Acceptable Use</h2>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-800 space-y-2">
                <p>Don&apos;t use TempChat for:</p>
                <ul className="list-disc pl-6">
                  <li>Illegal activities or harassment</li>
                  <li>Sharing malicious files or software</li>
                  <li>Spam or unsolicited messages</li>
                  <li>Impersonating others</li>
                  <li>Content that violates others&apos; rights</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">File Sharing</h2>
            <p className="text-muted-foreground">
              Files shared in rooms are subject to the same expiration rules as messages.
              Malicious files will be removed without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Disclaimer</h2>
            <p className="text-muted-foreground">
              TempChat is provided &quot;as is&quot; without warranties. We don&apos;t guarantee
              uninterrupted service or data security beyond our control.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Changes</h2>
            <p className="text-muted-foreground">
              We may update these terms. Continued use means accepting new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Questions? Contact us at legal@tempchat.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
