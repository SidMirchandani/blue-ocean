"use client"

import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, ArrowLeft, AlertTriangle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';
import { emergencyAidGuidance, EmergencyAidGuidanceOutput } from '@/ai/flows/emergency-aid-guidance';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AIGuidePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmergencyAidGuidanceOutput | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const output = await emergencyAidGuidance({ situationDescription: input });
      setResult(output);
    } catch (error) {
      console.error("AI Guidance Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
  };

  useEffect(() => {
    if (result) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-bold text-lg font-headline">AI Emergency Tool</h1>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {!result ? (
          <div className="max-w-md mx-auto flex flex-col gap-6">
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-primary/10 text-primary mb-4">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold font-headline">What's the situation?</h2>
              <p className="text-muted-foreground text-sm">
                Describe the symptoms or emergency clearly. Our AI will provide precise protocols.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  className="w-full min-h-[120px] p-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-base resize-none"
                  placeholder="e.g., Someone collapsed after complaining of chest pain..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Situation...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Get Immediate Guidance
                  </>
                )}
              </Button>
            </form>

            <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-accent" />
                Critical Reminders
              </h3>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                <li>If the situation is life-threatening, call emergency services (911) immediately.</li>
                <li>Stay calm and follow instructions clearly.</li>
                <li>AI guidance is a support tool, not a substitute for professional medical help.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 pb-20">
            <Card className="border-accent/30 bg-accent/5 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold font-headline text-accent-foreground">{result.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {result.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        {idx !== result.instructions.length - 1 && (
                          <div className="w-0.5 h-full bg-border my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-base text-foreground leading-relaxed pt-1">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {result.warning && (
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-xs text-destructive-foreground font-medium">{result.warning}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button variant="outline" className="rounded-xl border-border hover:bg-secondary" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                New Situation
              </Button>
              <Link href="/knowledge-base" className="w-full">
                <Button className="w-full rounded-xl bg-secondary text-foreground hover:bg-secondary/80">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Related Guides
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      
      <div ref={scrollRef} />
      <BottomNav />
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
