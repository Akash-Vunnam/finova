"use client";

import { useState } from "react";
import { Sparkles, Play, Pause, BookOpen, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TODAY_BRIEFING, type AIBriefing } from "@/lib/constants/discover-data";
import { formatIndianCurrency } from "@/lib/utils/indian-market";

export function AIBriefingCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [briefing] = useState<AIBriefing>(TODAY_BRIEFING);
  const router = useRouter();

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Audio playback not supported in your browser");
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = `${briefing.summary}. Key points: ${briefing.keyPoints.join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const getSentimentIcon = () => {
    if (briefing.sentiment === "Bullish") return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    if (briefing.sentiment === "Bearish") return <TrendingDown className="w-5 h-5 text-rose-400" />;
    return <Minus className="w-5 h-5 text-amber-400" />;
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent p-6 backdrop-blur-xl">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-teal-500" />
        
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{briefing.title}</h2>
            <p className="text-xs text-slate-400">{briefing.generatedAt}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
            {getSentimentIcon()}
            <span className={`text-sm font-medium ${
              briefing.sentiment === "Bullish" ? "text-emerald-400" : 
              briefing.sentiment === "Bearish" ? "text-rose-400" : "text-amber-400"
            }`}>
              {briefing.sentiment}
            </span>
          </div>
        </div>

        <div className="mb-4 flex gap-6 text-sm">
          <div>
            <span className="text-slate-400">Nifty 50</span>
            <p className="font-semibold text-white">{briefing.niftyLevel.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-slate-400">Sensex</span>
            <p className="font-semibold text-white">{briefing.sensexLevel.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          "{briefing.summary}"
        </p>

        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/discover/briefing')}
            className="bg-white text-slate-900 hover:bg-slate-200"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Read Full Report
          </Button>
          <Button 
            onClick={toggleAudio}
            variant="outline" 
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? "Pause Audio" : "Play Audio Version"}
          </Button>
        </div>
      </div>
    </>
  );
}
