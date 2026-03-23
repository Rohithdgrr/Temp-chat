import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, Shield, Upload, Download, HelpCircle } from "lucide-react";

export default function HelpPage() {
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
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                How do I create a chat room?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Click &quot;Start New Chat&quot; on the homepage</li>
                <li>Optionally enter your name</li>
                <li>Choose how long the room should last (1 hour, 24 hours, or 7 days)</li>
                <li>Click &quot;Create Room&quot;</li>
                <li>Share the code or link with your friend</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                How long do rooms last?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>You choose when creating a room:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>1 Hour:</strong> Quick discussions</li>
                <li><strong>24 Hours:</strong> Day-long collaboration</li>
                <li><strong>7 Days:</strong> Extended projects</li>
              </ul>
              <p className="mt-4">
                All data is automatically deleted when the room expires.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Is TempChat private?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Yes! TempChat is designed for privacy:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>No account or email required</li>
                <li>No data stored after room expires</li>
                <li>6-character codes are hard to guess</li>
                <li>No tracking or analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Can I share files?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Yes! You can share:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Images (JPG, PNG, GIF, WebP)</li>
                <li>Documents (PDF, TXT)</li>
                <li>Archives (ZIP)</li>
              </ul>
              <p className="mt-4">
                Max file size: 25MB per file. Files are deleted when the room expires.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Can I save my chat?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Yes! Before the room expires, you can:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Export chat as text file</li>
                <li>Download shared files</li>
                <li>Save everything as a ZIP</li>
              </ul>
              <p className="mt-4">
                After expiration, all data is permanently deleted.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Still need help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Contact us at help@tempchat.app with your question.
              </p>
              <Link href="/" className="text-primary hover:underline">
                Back to TempChat
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
