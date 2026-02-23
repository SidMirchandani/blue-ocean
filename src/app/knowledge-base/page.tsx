"use client"

import { useState } from 'react';
import { Search, ArrowLeft, BookOpen, ChevronRight, X, ShieldCheck, Zap, Info, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { KNOWLEDGE_BASE, Article } from '@/lib/knowledge-base';
import { cn } from '@/lib/utils';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredItems = KNOWLEDGE_BASE.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const protocols = filteredItems.filter(i => i.type === 'Protocol');
  const articles = filteredItems.filter(i => i.type === 'Article');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border p-4">
        {selectedArticle ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedArticle(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-base font-headline truncate">{selectedArticle.title}</h1>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{selectedArticle.type}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-bold text-xl font-headline">Safety Library</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 bg-secondary/50 border-none rounded-2xl"
                placeholder="Search protocols & articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {selectedArticle ? (
          <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              {selectedArticle.readTime && (
                <span className="text-[10px] text-muted-foreground">• {selectedArticle.readTime} read</span>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline leading-tight">{selectedArticle.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{selectedArticle.summary}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              {selectedArticle.type === 'Protocol' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Execution Steps</span>
                  </div>
                  {selectedArticle.content.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-card border border-border/50 rounded-3xl shadow-sm">
                      <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pt-1 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                   {selectedArticle.content.map((paragraph, idx) => (
                    <p key={idx} className="text-base text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-secondary/30 rounded-3xl border border-border/50 space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Expert Verified
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This {selectedArticle.type.toLowerCase()} has been reviewed for compliance with OSHA and EPA environmental safety guidelines. Always consult professionals for large-scale contamination.
              </p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="protocols" className="w-full pb-24">
            <TabsList className="w-full bg-secondary/50 p-1 rounded-2xl h-12 mb-6">
              <TabsTrigger value="protocols" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest">
                Quick Protocols
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest">
                Deep Dives
              </TabsTrigger>
            </TabsList>

            <TabsContent value="protocols" className="space-y-4">
              <div className="flex items-center gap-2 px-1 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Immediate Response Guides</span>
              </div>
              {protocols.map((protocol) => (
                <ProtocolCard key={protocol.id} item={protocol} onSelect={setSelectedArticle} />
              ))}
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <div className="flex items-center gap-2 px-1 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Educational Resources</span>
              </div>
              {articles.map((article) => (
                <ArticleCard key={article.id} item={article} onSelect={setSelectedArticle} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function ProtocolCard({ item, onSelect }: { item: Article, onSelect: (a: Article) => void }) {
  return (
    <Card 
      className="bg-card border-border/50 hover:border-primary/30 transition-all cursor-pointer overflow-hidden rounded-[2rem] group"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-6 flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Layers className="h-7 w-7" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.summary}</p>
          <div className="pt-2 flex items-center gap-2">
             <span className="text-[8px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-bold uppercase tracking-widest">
              {item.category}
            </span>
            <span className="text-[10px] font-bold text-primary ml-auto group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              OPEN PROTOCOL <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArticleCard({ item, onSelect }: { item: Article, onSelect: (a: Article) => void }) {
  return (
    <Card 
      className="bg-card border-border/50 hover:bg-secondary/20 transition-all cursor-pointer overflow-hidden rounded-3xl"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-5 flex gap-4">
        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.summary}</p>
          <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="text-blue-500">{item.category}</span>
            <span>•</span>
            <span>{item.readTime}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
      </CardContent>
    </Card>
  );
}
