"use client"

import { useState, useRef, useEffect } from 'react';
import { Scan, Send, Camera, Image as ImageIcon, Loader2, AlertTriangle, RotateCcw, ArrowLeft, X, RefreshCw, Mic, MicOff } from 'lucide-react';
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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions.',
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

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Not Supported', description: 'Voice recognition is not supported in this browser.' });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
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
    
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      content: [{ text: m.content }]
    }));

    const currentInput = input;
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const result = await pathoScanAnalysis({
        message: currentInput || undefined,
        photoDataUri: currentImg || undefined,
        history: history
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
        description: 'Failed to process request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      <header className="flex items-center gap-4 px-6 py-4 bg-card/80 backdrop-blur-xl border-b border-border z-30">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
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
          <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="rounded-full text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-10 pb-48 space-y-8 relative">
        {/* Top Fade */}
        <div className="fixed top-16 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-6 opacity-60">
            <div className="h-24 w-24 bg-secondary rounded-[2.5rem] flex items-center justify-center">
              <Scan className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-headline">Hazard Scanner</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Describe a situation or scan a hazard for instant safety advice.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col space-y-3", msg.role === 'user' ? 'items-end' : 'items-start')}>
              {msg.role === 'user' ? (
                <div className="flex flex-col items-end gap-2 max-w-[85%]">
                  {msg.image && (
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border border-border shadow-xl mb-1">
                      <img src={msg.image} className="w-full h-full object-cover" alt="User upload" />
                    </div>
                  )}
                  <div className="bg-black border border-primary/30 px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg">
                    <p className="text-sm font-medium text-primary leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border px-5 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-lg">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.data?.hasStructuredGuidance && (
                    <div className="mt-4 pt-4 border-t border-border/20 space-y-4">
                      <h3 className="font-bold text-accent text-[10px] uppercase tracking-widest">
                        {msg.data.title || 'Safety Protocol'}
                      </h3>
                      <div className="space-y-3">
                        {msg.data.instructions?.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="h-5 w-5 rounded-md bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <p className="text-[13px] text-muted-foreground leading-snug">{step}</p>
                          </div>
                        ))}
                      </div>
                      {msg.data.warning && (
                        <div className="bg-destructive/10 p-3 rounded-xl flex gap-2 border border-destructive/20">
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                          <p className="text-[10px] font-bold text-destructive leading-tight uppercase">
                            {msg.data.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 p-3 rounded-xl w-fit">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI is processing...</span>
          </div>
        )}
        <div ref={scrollRef} />

        {/* Bottom Fade */}
        <div className="fixed bottom-24 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      </main>

      {/* Fullscreen Camera View */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
          <div className="absolute top-0 left-0 right-0 z-[110] flex justify-between items-center p-6 bg-gradient-to-b from-black/60 to-transparent">
             <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white" onClick={stopCamera}>
                <X className="h-6 w-6" />
             </Button>
             <div className="text-white font-bold text-xs uppercase tracking-widest">Safety Scan</div>
             <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white" onClick={toggleCamera}>
                <RefreshCw className="h-5 w-5" />
             </Button>
          </div>
          <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
          <div className="absolute bottom-12 left-0 right-0 z-[110] flex flex-col items-center gap-6">
            <button className="h-20 w-20 rounded-full border-4 border-white p-1 group active:scale-95 transition-all" onClick={capturePhoto}>
               <div className="h-full w-full rounded-full bg-white group-active:bg-primary transition-colors" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40">
        <div className="max-w-2xl mx-auto flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {selectedImage && (
            <div className="p-4 bg-secondary/30 border-b border-border flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border shadow-md">
                <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                <button className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center text-white" onClick={() => setSelectedImage(null)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attachment</p>
                <p className="text-xs text-muted-foreground">Ask PathoScan about this hazard</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 p-3">
            <div className="flex shrink-0 gap-1.5">
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-11 w-11 bg-secondary text-muted-foreground hover:bg-primary hover:text-black transition-all" 
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-11 w-11 bg-secondary text-muted-foreground hover:bg-primary hover:text-black transition-all" 
                onClick={() => startCamera()}
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full h-11 w-11 transition-all", 
                  isListening 
                    ? "bg-primary text-black animate-pulse shadow-[0_0_15px_rgba(0,209,178,0.3)]" 
                    : "bg-secondary text-muted-foreground hover:bg-primary hover:text-black"
                )} 
                onClick={toggleVoice}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 flex items-center h-full px-1">
              <textarea
                rows={1}
                suppressHydrationWarning
                className="w-full bg-transparent border-none py-3 text-sm focus:ring-0 outline-none resize-none max-h-32 placeholder:text-muted-foreground/40 mt-1"
                placeholder={isListening ? "Listening..." : "What's the hazard?"}
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

            <Button size="icon" className="rounded-xl h-11 w-11 bg-primary hover:bg-primary/90 text-black shadow-lg shrink-0" onClick={() => handleSubmit()} disabled={loading || (!input.trim() && !selectedImage)}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
