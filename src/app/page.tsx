"use client"

import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Camera, Image as ImageIcon, Mic, Loader2, AlertTriangle, RotateCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BottomNav } from '@/components/navigation/BottomNav';
import { emergencyAidGuidance, EmergencyAidGuidanceOutput } from '@/ai/flows/emergency-aid-guidance';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  data?: EmergencyAidGuidanceOutput;
}

export default function ChatPage() {
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
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
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
    setInput('');
    const currentImg = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    try {
      const result = await emergencyAidGuidance({
        situationDescription: input,
        photoDataUri: currentImg || undefined
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.title,
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
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* App Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-card/50 backdrop-blur-xl border-b border-border z-30">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-headline">RescueAI</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="rounded-full text-muted-foreground">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-6">
            <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
              <BrainCircuit className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Immediate Assistance</h2>
              <p className="text-muted-foreground text-sm">
                Describe an emergency, snap a photo of an injury, or upload a report for instant guidance.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
              <div className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm shadow-sm ${
                msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-card border border-border rounded-tl-none'
              }`}>
                {msg.image && (
                  <img src={msg.image} className="rounded-xl mb-2 w-full max-h-48 object-cover" alt="User input" />
                )}
                {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                
                {msg.data && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-3">
                      {msg.data.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                    {msg.data.warning && (
                      <div className="bg-destructive/10 p-3 rounded-xl flex gap-2 border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <p className="text-[10px] font-medium text-destructive leading-tight">{msg.data.warning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-primary font-bold text-xs animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing situation...
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Overlay for Camera */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/20 bg-white/10 text-white" onClick={stopCamera}>
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button className="h-20 w-20 rounded-full bg-white border-4 border-white/50" onClick={capturePhoto} />
            <div className="w-12 h-12" /> {/* Spacer */}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 bg-card/80 backdrop-blur-xl border-t border-border z-40">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {selectedImage && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-2 group">
              <img src={selectedImage} className="w-full h-full object-cover" />
              <button 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                onClick={() => setSelectedImage(null)}
              >
                <RotateCcw className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <div className="flex gap-1 shrink-0">
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
              <Button variant="secondary" size="icon" className="rounded-full h-11 w-11" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full h-11 w-11" onClick={startCamera}>
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                rows={1}
                className="w-full bg-secondary/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none max-h-32"
                placeholder="What is happening?"
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
              className="rounded-full h-11 w-11 shadow-lg shadow-primary/20 shrink-0" 
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
