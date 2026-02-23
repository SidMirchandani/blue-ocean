
"use client"

import { useState, useEffect } from 'react';
import { Shield, Zap, WifiOff, MapPin, Scan, BookOpen, Phone, FileText, Activity, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

export default function DashboardPage() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('pathoscan_disclaimer_accepted');
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('pathoscan_disclaimer_accepted', 'true');
    setShowDisclaimer(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-[90vw] md:max-w-md bg-card border-border rounded-3xl p-0 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold font-headline text-foreground leading-tight">
                  Important Disclaimer
                </DialogTitle>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                  Please read before using PathoScan
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">PathoScan is for informational purposes only</strong> and is NOT a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                AI-powered analysis may produce inaccurate results. Always consult qualified healthcare professionals for medical decisions.
              </p>
              <p className="font-bold text-foreground">
                In case of a medical emergency, call 911 (US) or your local emergency number immediately.
              </p>
              <p className="text-xs italic">
                First aid guides are for educational purposes. Individual circumstances vary. This app does not establish a doctor-patient relationship.
              </p>
            </div>

            <Button 
              className="w-full py-7 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20"
              onClick={handleAcceptDisclaimer}
            >
              I Understand — Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Scan className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-headline">PathoScan</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Point-and-Solve Safety</p>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Hero Card */}
        <Link href="/scan">
          <Card className="bg-card border-primary/20 dashboard-card-gradient overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Scan className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-headline">Scan for Hazards</h2>
                <p className="text-sm text-muted-foreground leading-snug">
                  Take a photo of anything suspicious — mold, insects, plants, injuries — and get instant AI analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Shield, val: '20+', label: 'Safety Guides' },
            { icon: Zap, val: 'AI', label: 'Powered Analysis' },
            { icon: WifiOff, val: 'Offline', label: 'Ready Content' },
            { icon: MapPin, val: 'GPS', label: 'Emergency Locate' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/50 text-center gap-1">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">{stat.val}</span>
              <span className="text-[8px] text-muted-foreground uppercase font-bold leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/scan" className="block">
            <Card className="bg-card hover:bg-secondary/30 transition-colors h-full rounded-3xl overflow-hidden border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Scan className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">AI Scanner</h3>
                  <p className="text-xs text-muted-foreground">Point & identify hazards</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge-base?tab=protocols" className="block">
            <Card className="bg-card hover:bg-secondary/30 transition-colors h-full rounded-3xl overflow-hidden border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">First Aid</h3>
                  <p className="text-xs text-muted-foreground">Actionable protocols</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/emergency-finder" className="block">
            <Card className="bg-card hover:bg-secondary/30 transition-colors h-full rounded-3xl overflow-hidden border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">Emergency</h3>
                  <p className="text-xs text-muted-foreground">Find nearby help</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge-base?tab=articles" className="block">
            <Card className="bg-card hover:bg-secondary/30 transition-colors h-full rounded-3xl overflow-hidden border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">Articles</h3>
                  <p className="text-xs text-muted-foreground">Safety literacy</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Emergency Quick Action */}
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-4 mt-6">
          <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
            <Activity className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Need immediate help?</h4>
            <p className="text-xs text-muted-foreground">Quick-dial emergency services or find the nearest trauma center instantly.</p>
            <Button variant="link" className="p-0 h-auto text-red-500 font-bold text-xs" asChild>
              <Link href="/emergency-finder">Open Facility Finder →</Link>
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
