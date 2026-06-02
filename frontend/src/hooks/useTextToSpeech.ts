"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useTextToSpeech(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    // Cancel any ongoing speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const play = useCallback(() => {
    if (!isSupported) {
      toast.error("Audio not supported in your browser");
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.lang === "en-IN" ||
        v.lang === "en-GB"
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-IN";

    utterance.onstart = () => {
      setIsPlaying(true);
      toast.success("Playing audio briefing...");
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      // Ignore cancellation errors
      if (e.error !== "canceled") {
        console.error("Speech synthesis error", e);
        setIsPlaying(false);
        toast.error("Error playing audio");
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  return { play, pause, stop, isPlaying, isSupported };
}
