"use client"

import { Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function QuickDial() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Button 
        variant="destructive" 
        className="h-auto py-4 flex flex-col gap-1 rounded-2xl shadow-lg"
        onClick={() => handleCall('911')}
      >
        <Phone className="h-6 w-6" />
        <span className="font-bold">CALL 911</span>
        <span className="text-[10px] opacity-80 uppercase font-medium">Emergency Services</span>
      </Button>
      
      <Button 
        variant="secondary" 
        className="h-auto py-4 flex flex-col gap-1 rounded-2xl border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary shadow-lg"
        onClick={() => handleCall('000')}
      >
        <AlertCircle className="h-6 w-6" />
        <span className="font-bold">POISON</span>
        <span className="text-[10px] opacity-80 uppercase font-medium">Poison Control</span>
      </Button>
    </div>
  );
}
