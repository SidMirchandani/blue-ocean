"use client"

import { useState, useRef, useEffect } from 'react';
import { Scan, Send, Camera, Image as ImageIcon, Loader2, AlertTriangle, RotateCcw, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/navigation/BottomNav';
import { pathoScanAnalysis, PathoScanOutput } from '@/ai/flows/emergency-aid-guidance';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions.',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUri = canvas.toDataURL('image/jpeg');
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
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-card/50 backdrop-blur-xl border-b border-border z-30">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold font-headline">AI Scanner</h1>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="rounded-full text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-32 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-6 opacity-60">
            <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center">
              <Scan className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Point & Identify</h2>
              <p className="text-sm">Describe a situation or upload a photo of a hazard for analysis.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm shadow-sm ${
                msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-card border border-border rounded-tl-none'
              }`}>
                {msg.image && (
                  <img src={msg.image} className="rounded-xl mb-3 w-full max-h-48 object-cover border border-white/10" alt="Analysis subject" />
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.data?.hasStructuredGuidance && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {msg.data.title || 'Guidance'}
                    </h3>
                    <div className="space-y-3">
                      {msg.data.instructions?.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="font-bold text-primary shrink-0">{idx + 1}</span>
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                    {msg.data.warning && (
                      <div className="bg-destructive/10 p-3 rounded-xl flex gap-2 border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <p className="text-[10px] font-bold text-destructive leading-tight uppercase tracking-tight">{msg.data.warning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI analyzing situation...
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Camera Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
          <div className="absolute top-6 left-6">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white backdrop-blur-md" onClick={stopCamera}>
               <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 px-6">
            <div className="w-12 h-12" />
            <button className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-all" onClick={capturePhoto}>
               <div className="h-16 w-16 rounded-full bg-white group-active:bg-primary transition-colors" />
            </button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-md" onClick={stopCamera}>
               <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Input Section */}
      <div className="absolute bottom-20 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {selectedImage && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-3 group border-2 border-primary/50 shadow-2xl animate-in zoom-in-50">
              <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
              <button 
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 bg-card/90 backdrop-blur-2xl border border-border p-2 rounded-3xl shadow-2xl">
            <div className="flex gap-1 shrink-0">
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
              <Button variant="secondary" size="icon" className="rounded-2xl h-12 w-12 bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-2xl h-12 w-12 bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all" onClick={startCamera}>
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                rows={1}
                className="w-full bg-transparent border-none rounded-2xl px-3 py-3 text-sm focus:ring-0 outline-none resize-none max-h-32 placeholder:text-muted-foreground/50"
                placeholder="Message AI Scanner..."
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
              className="rounded-2xl h-12 w-12 shadow-lg shadow-primary/20 shrink-0 bg-primary hover:bg-primary/90" 
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
