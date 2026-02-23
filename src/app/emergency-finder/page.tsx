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
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
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
          <Button variant="ghost" size="icon" className="text-primary rounded-full">
            <Navigation className="h-5 w-5" />
          </Button>
        )}
      </header>

      <main className="flex-1 px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="space-y-1">
              <p className="font-bold">Locating nearby facilities...</p>
              <p className="text-xs text-muted-foreground">Using device GPS services</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mock Map Area */}
            <div className="relative h-56 w-full bg-card rounded-[2rem] border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-[#0B1215] flex items-center justify-center">
                {/* Visual Map Mockup */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="relative">
                   <div className="absolute -inset-6 bg-primary/20 rounded-full animate-ping opacity-25" />
                   <div className="relative h-8 w-8 bg-primary rounded-full border-4 border-background flex items-center justify-center shadow-xl">
                      <div className="h-2 w-2 bg-white rounded-full" />
                   </div>
                </div>
                {MOCK_FACILITIES.map((f, i) => (
                  <div 
                    key={f.id}
                    className="absolute transition-transform hover:scale-110"
                    style={{
                      top: `${25 + (i * 20)}%`,
                      left: `${20 + (i * 25)}%`
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      <MapPin className="h-6 w-6 text-red-500 fill-red-500/20" />
                      <div className="bg-card/90 backdrop-blur-md border border-border px-2 py-0.5 rounded text-[8px] font-bold mt-1 shadow-lg">
                        {f.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                GPS ACTIVE
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Closest Locations</h2>
              <span className="text-[10px] bg-secondary px-2 py-1 rounded-full font-bold">3 RESULTS</span>
            </div>

            <div className="space-y-4">
              {MOCK_FACILITIES.map((facility) => (
                <Card key={facility.id} className="bg-card border-border/50 hover:border-primary/30 transition-all rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-5 flex gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <Hospital className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-lg leading-tight">{facility.name}</h3>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            {facility.rating}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{facility.address}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{facility.type}</span>
                          <span className="text-[10px] uppercase font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">{facility.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-none h-14 text-primary font-bold gap-2 hover:bg-primary/5 active:bg-primary/10 transition-colors"
                        onClick={() => handleCall(facility.phone)}
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </Button>
                      <div className="w-[1px] bg-border" />
                      <Button variant="ghost" className="flex-1 rounded-none h-14 font-bold gap-2 hover:bg-secondary active:bg-secondary/50 transition-colors">
                        <Navigation className="h-4 w-4" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-5 bg-primary/5 rounded-3xl border border-primary/20 flex items-start gap-4">
               <Activity className="h-6 w-6 text-primary shrink-0" />
               <div className="space-y-1">
                  <h4 className="font-bold text-sm">Emergency Protocol</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If traveling to a trauma center, ensure the patient is stabilized. If status changes, call emergency services while in transit.
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