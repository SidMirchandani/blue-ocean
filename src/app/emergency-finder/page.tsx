"use client"

import { useState, useEffect } from 'react';
import { MapPin, Phone, ArrowLeft, Navigation, Star, Activity, Loader2, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';

interface Facility {
  id: string;
  name: string;
  type: 'General Hospital' | 'Urgent Care' | 'Trauma Center';
  distance: string;
  address: string;
  phone: string;
  rating: number;
  openNow: boolean;
}

const MOCK_FACILITIES: Facility[] = [
  {
    id: 'f1',
    name: 'Metropolitan Medical Center',
    type: 'Trauma Center',
    distance: '0.8 miles',
    address: '450 Health Ave, Downtown',
    phone: '555-0101',
    rating: 4.8,
    openNow: true
  },
  {
    id: 'f2',
    name: 'St. Jude General Hospital',
    type: 'General Hospital',
    distance: '1.5 miles',
    address: '221 Bayside Blvd, North',
    phone: '555-0102',
    rating: 4.5,
    openNow: true
  },
  {
    id: 'f3',
    name: 'Rapid Response Urgent Care',
    type: 'Urgent Care',
    distance: '2.1 miles',
    address: '98 Market St, Westside',
    phone: '555-0103',
    rating: 4.2,
    openNow: true
  }
];

export default function EmergencyFinderPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate finding local services
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-xl font-headline">Facility Finder</h1>
        </div>
        {!loading && (
          <Button variant="ghost" size="icon" className="text-primary">
            <Navigation className="h-5 w-5" />
          </Button>
        )}
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="space-y-1">
              <p className="font-bold">Locating nearby facilities...</p>
              <p className="text-xs text-muted-foreground">Using device location services</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {/* Mock Map View Area */}
            <div className="relative h-48 w-full bg-secondary/50 rounded-2xl border border-border overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="relative">
                   <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping opacity-25" />
                   <div className="relative h-6 w-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <div className="h-2 w-2 bg-white rounded-full" />
                   </div>
                </div>
                {MOCK_FACILITIES.map((f, i) => (
                  <div 
                    key={f.id}
                    className="absolute"
                    style={{
                      top: `${20 + (i * 25)}%`,
                      left: `${30 + (i * 20)}%`
                    }}
                  >
                    <MapPin className="h-5 w-5 text-accent drop-shadow-sm" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold">
                MAP VIEW ACTIVE
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Closest Locations</h2>
              <span className="text-xs text-primary font-medium">3 found</span>
            </div>

            <div className="space-y-4">
              {MOCK_FACILITIES.map((facility) => (
                <Card key={facility.id} className="bg-card border-border/50 hover:border-primary/30 transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
                        <Hospital className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-base leading-tight">{facility.name}</h3>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            {facility.rating}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{facility.address}</p>
                        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider">
                          <span className="text-accent">{facility.type}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground">{facility.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-none h-12 text-primary font-bold gap-2 hover:bg-primary/5"
                        onClick={() => handleCall(facility.phone)}
                      >
                        <Phone className="h-4 w-4" />
                        Direct Call
                      </Button>
                      <div className="w-[1px] bg-border" />
                      <Button variant="ghost" className="flex-1 rounded-none h-12 font-bold gap-2 hover:bg-secondary">
                        <Navigation className="h-4 w-4" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4">
               <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <h4 className="font-bold text-sm">Emergency Protocol</h4>
                  <p className="text-xs text-muted-foreground">
                    If you are driving, ensure you are alert. If the patient is unstable, pull over safely and wait for an ambulance.
                  </p>
               </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
