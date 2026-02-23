"use client"

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, BookOpen, MapPin, Scan, FileText, Phone, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Scan', icon: Scan, href: '/scan' },
    { label: 'First Aid', icon: Zap, href: '/knowledge-base?tab=protocols', activeMatch: pathname === '/knowledge-base' && currentTab === 'protocols' },
    { label: 'Articles', icon: FileText, href: '/knowledge-base?tab=articles', activeMatch: pathname === '/knowledge-base' && currentTab === 'articles' },
    { label: 'Emergency', icon: Phone, href: '/emergency-finder', activeMatch: pathname === '/emergency-finder' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-card/80 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.activeMatch !== undefined ? item.activeMatch : pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive && "bg-primary/10"
              )}>
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
              {isActive && <div className="absolute top-0 w-8 h-[2px] bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
