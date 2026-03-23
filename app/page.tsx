import Link from "next/link";
import { MessageSquare, Shield, Zap, Download, Users, Clock, FileUp, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <span>TempChat</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/share" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Upload className="h-4 w-4 inline mr-1" />
              Share Files
            </Link>
            <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">
              Help
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
          
          <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              No signup required
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
              Chat Instantly.
              <br />
              <span className="text-indigo-600">No signup. No hassle.</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Connect with anyone using a temporary code. Your conversation disappears
              when you&apos;re done. Simple, fast, and private by design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-indigo-600 hover:bg-indigo-700">
                  Start New Chat
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Join with Code
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          {/* Share Files CTA */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Share Files Instantly</h3>
                    <p className="text-indigo-100 mb-4">
                      Need to send a file? Use TempShare - upload up to 200MB without login. 
                      Get a shareable link in seconds.
                    </p>
                    <Link href="/share">
                      <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                        <Upload className="h-4 w-4 mr-2" />
                        Start Sharing
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why TempChat?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Built for quick, private conversations that leave no trace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Private by Design"
              description="No accounts, no tracking. Rooms auto-expire and all data is permanently deleted when you're done."
              color="indigo"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Real-Time Chat"
              description="Instant messaging with typing indicators. No delays, no lag. Just smooth conversations."
              color="purple"
            />
            <FeatureCard
              icon={<Download className="h-8 w-8" />}
              title="Save What Matters"
              description="Export your chat history and files before the room expires. Take your data with you."
              color="pink"
            />
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Get started in seconds. No sign-up required.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <Step number={1} title="Create a Room" description="Click 'Start New Chat' to generate a room code" />
              <Step number={2} title="Share the Code" description="Send the 6-character code to your friend" />
              <Step number={3} title="Join & Chat" description="They enter the code and join instantly" />
              <Step number={4} title="Export & Done" description="Save your conversation before it expires" />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <FeatureList
                icon={<Users className="h-5 w-5" />}
                title="Multiple Participants"
                description="Chat with up to 10 people in a single room"
              />
              <FeatureList
                icon={<Clock className="h-5 w-5" />}
                title="Flexible Expiry"
                description="Choose 1 hour, 24 hours, or 7 days"
              />
              <FeatureList
                icon={<FileUp className="h-5 w-5" />}
                title="File Sharing"
                description="Share images, PDFs, and documents up to 25MB"
              />
              <FeatureList
                icon={<MessageSquare className="h-5 w-5" />}
                title="Real-Time Updates"
                description="See messages instantly as they arrive"
              />
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to chat?</h2>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto">
              No account needed. No data stored. Just instant, temporary conversations.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10">
                Create Your Room
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="h-5 w-5" />
              <span>TempChat</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/share" className="hover:text-indigo-600">
                Share Files
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Terms
              </Link>
              <Link href="/help" className="hover:text-gray-900">
                Help
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Built for temporary, private conversations.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "indigo" | "purple" | "pink";
}) {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="pt-6 text-center">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${colorClasses[color]} mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold mb-4">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function FeatureList({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-gray-50">
      <div className="text-indigo-600 shrink-0">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
