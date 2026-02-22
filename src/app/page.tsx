"use client"

import { Search, BrainCircuit, BookOpen, MapPin, ChevronRight, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/navigation/BottomNav';
import { QuickDial } from '@/components/emergency/QuickDial';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-24 md:pb-8">
      {/* Header / Hero */}
      <header className="relative h-48 flex flex-col justify-center px-6 overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="PathoScan"
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-headline">PathoScan</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-[250px]">
            Your intelligent first-aid companion. Reliable guidance when it matters most.
          </p>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-20">
        {/* Quick Actions */}
        <QuickDial />

        {/* AI Assistant Hook */}
        <Card className="mb-6 bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 overflow-hidden group">
          <Link href="/ai-guide">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase mb-1">
                    Emergency AI
                  </div>
                  <h3 className="text-xl font-bold font-headline">AI-Guided Rescue</h3>
                  <p className="text-sm text-muted-foreground">Describe your situation for instant step-by-step instructions.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl group-hover:shadow-primary/30 transition-all">
                Start Guidance <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        {/* Core Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/knowledge-base">
            <Card className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Offline Guides</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-1">First-aid library accessible anytime.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/emergency-finder">
            <Card className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Facility Finder</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-1">Locate the nearest emergency services.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recently Viewed / Critical Guides */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg font-headline">Critical Guides</h3>
            <Link href="/knowledge-base" className="text-xs text-primary font-medium">See all</Link>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Adult CPR', time: '1 min read', color: 'text-red-400', id: 'cpr-adult' },
              { title: 'Severe Bleeding', time: '2 min read', color: 'text-orange-400', id: 'severe-bleeding' },
              { title: 'Choking Relief', time: '1 min read', color: 'text-yellow-400', id: 'choking-adult' }
            ].map((guide, idx) => (
              <Link key={idx} href={`/knowledge-base?article=${guide.id}`}>
                <div className="flex items-center gap-4 p-3 bg-card rounded-2xl border border-border/40 hover:border-border transition-colors">
                  <div className={`h-2 w-2 rounded-full ${guide.color.replace('text-', 'bg-')}`} />
                  <div className="flex-1">
                    <h5 className="font-bold text-sm">{guide.title}</h5>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">{guide.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
