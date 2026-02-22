"use client"

import { useState, useEffect } from 'react';
import { Search, ArrowLeft, BookOpen, ChevronRight, X, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';
import { KNOWLEDGE_BASE, Article } from '@/lib/knowledge-base';
import { useSearchParams } from 'next/navigation';

export default function KnowledgeBasePage() {
  const searchParams = useSearchParams();
  const initialArticleId = searchParams.get('article');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Injury' | 'Environmental'>('All');

  useEffect(() => {
    if (initialArticleId) {
      const art = KNOWLEDGE_BASE.find(a => a.id === initialArticleId);
      if (art) setSelectedArticle(art);
    }
  }, [initialArticleId]);

  const filteredArticles = KNOWLEDGE_BASE.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || article.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/50 backdrop-blur-md border-b border-border p-4">
        {selectedArticle ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedArticle(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg font-headline truncate">{selectedArticle.title}</h1>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-bold text-xl font-headline">Knowledge Base</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 bg-secondary/50 border-none rounded-xl"
                placeholder="Search first-aid articles..."
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
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                selectedArticle.category === 'Critical' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
              }`}>
                {selectedArticle.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold font-headline">{selectedArticle.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{selectedArticle.summary}</p>

            <div className="space-y-6 mt-8">
              {selectedArticle.content.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-card rounded-2xl border border-border/50">
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pt-1 flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-24">
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
              {['All', 'Critical', 'Injury', 'Environmental'].map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? 'default' : 'secondary'}
                  size="sm"
                  className="rounded-full px-4 shrink-0 h-8"
                  onClick={() => setFilter(cat as any)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="bg-card border-border/50 hover:bg-secondary/20 transition-all cursor-pointer overflow-hidden group rounded-2xl"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors truncate">{article.title}</h4>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight shrink-0 ${
                          article.category === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                        }`}>
                          {article.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {article.summary}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 space-y-4">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-30" />
                <p className="text-muted-foreground font-medium text-sm">No guides found.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
