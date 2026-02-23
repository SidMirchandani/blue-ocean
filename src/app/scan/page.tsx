
"use client"

import { useState, useRef, useEffect } from 'react';
import { Scan, Send, Camera, Image as ImageIcon, Loader2, AlertTriangle, RotateCcw, Activity, ArrowLeft, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/navigation/BottomNav';
import { pathoScanAnalysis, PathoScanOutput } from '@/ai/flows/emergency-aid-guidance';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  data?: PathoScanOutput;
}

export default function ScanPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    if (videoRef.current?.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };

  const toggleCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUri = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(dataUri);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const result = await pathoScanAnalysis({
        message: currentInput || undefined,
        photoDataUri: currentImg || undefined
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.reply,
        data: result
      }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to process the request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      <header className="flex items-center gap-4 px-6 py-4 bg-card/50 backdrop-blur-xl border-b border-border z-30">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Scan className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold font-headline tracking-tight">AI Scanner</h1>
        </div>
        <div className="ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMessages([])} 
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-40 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-6">
            <div className="h-28 w-28 bg-primary/10 rounded-[3rem] flex items-center justify-center relative">
              <Scan className="h-14 w-14 text-primary animate-pulse" />
              <div className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] animate-ping opacity-20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Point & Analyze</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe a situation or snap a photo of a hazard (mold, injuries, chemicals) for instant safety protocols.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col space-y-2 animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn(
                "max-w-[85%] rounded-[2rem] px-6 py-4 text-sm shadow-md",
                msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-card border border-border/50 rounded-tl-none'
              )}>
                {msg.image && (
                  <div className="relative mb-3 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                    <img src={msg.image} className="w-full max-h-64 object-cover" alt="User analysis subject" />
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap text-base">{msg.content}</p>
                
                {msg.data?.hasStructuredGuidance && (
                  <div className="mt-5 pt-5 border-t border-border/20 space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <h3 className="font-bold text-primary text-xs uppercase tracking-widest">
                        {msg.data.title || 'Guidance Protocol'}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {msg.data.instructions?.map((step, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-muted-foreground leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                    {msg.data.warning && (
                      <div className="bg-destructive/10 p-4 rounded-2xl flex gap-3 border border-destructive/20">
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                        <p className="text-[11px] font-bold text-destructive leading-tight uppercase tracking-tight">
                          {msg.data.warning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-3 text-primary font-bold text-sm bg-primary/5 p-3 rounded-2xl w-fit">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI analyzing environment...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 left-0 right-0 z-[110] flex justify-between items-center p-6 bg-gradient-to-b from-black/60 to-transparent">
             <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white backdrop-blur-md" onClick={stopCamera}>
                <X className="h-6 w-6" />
             </Button>
             <div className="text-white font-bold text-sm uppercase tracking-widest">Live View</div>
             <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white backdrop-blur-md" onClick={toggleCamera}>
                <RefreshCw className="h-5 w-5" />
             </Button>
          </div>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="flex-1 object-cover"
          />
          
          <div className="absolute bottom-12 left-0 right-0 z-[110] flex flex-col items-center gap-8">
            <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
              Tap to capture situation
            </div>
            <button 
              className="h-20 w-20 rounded-full border-[4px] border-white flex items-center justify-center group active:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
              onClick={capturePhoto}
            >
               <div className="h-16 w-16 rounded-full bg-white group-active:bg-primary transition-colors" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto flex flex-col gap-3">
          {selectedImage && (
            <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden group border-2 border-primary shadow-2xl animate-in zoom-in-50 slide-in-from-bottom-4">
              <img src={selectedImage} className="w-full h-full object-cover" alt="Preview attachment" />
              <button 
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-3xl border border-border/50 p-2.5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex gap-1.5 shrink-0">
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all" 
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all" 
                onClick={() => startCamera()}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                rows={1}
                suppressHydrationWarning
                className="w-full bg-transparent border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-0 outline-none resize-none max-h-32 placeholder:text-muted-foreground/40"
                placeholder="Describe the hazard..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            <Button 
              className="rounded-full h-12 w-12 shadow-xl shadow-primary/20 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={() => handleSubmit()}
              disabled={loading || (!input.trim() && !selectedImage)}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
