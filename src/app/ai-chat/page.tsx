'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ApiKeyModal from '@/components/ui/ApiKeyModal';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isApiKeyMissing?: boolean;
}

const suggestedPrompts = [
  "Analyze RELIANCE's recent earnings",
  "What is a good dividend portfolio in India?",
  "Explain F&O trading simply",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am your Finova AI Copilot. How can I assist you with your investments in the Indian market today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const apiKey = localStorage.getItem('finova_gemini_key') || '';
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.type === 'API_KEY_MISSING') {
          setIsModalOpen(true);
          throw new Error('API Key is missing');
        }
        throw new Error(err.message || err.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      if (errorMessage !== 'API Key is missing') {
        toast.error(errorMessage);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Namaste! I'm your Finova AI Copilot. I can help analyze Indian stocks, explain NSE/BSE market trends, and give investment advice. Try asking me about RELIANCE or TCS!",
            isApiKeyMissing: true,
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] bg-transparent pt-8 md:pt-4 relative overflow-hidden">
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => toast.success("API Key saved")} 
      />
      {/* Header */}
      <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto w-full flex items-center gap-3 mb-6 shrink-0">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-finova-purple rounded-full blur-md opacity-50 animate-pulse" />
          <div className="relative z-10 w-8 h-8 bg-gradient-to-tr from-finova-purple to-finova-green rounded-full flex items-center justify-center">
             <Bot size={18} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Finova AI</h1>
          <p className="text-xs text-white/50 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-finova-green" /> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 pb-4 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-tr from-finova-purple to-finova-blue' 
                    : 'bg-white/5 backdrop-blur-md border border-finova-purple/30'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-finova-purple" />}
                </div>
                
                <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl text-sm leading-relaxed shadow-lg backdrop-blur-md relative group ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-tr from-finova-purple/80 to-finova-blue/80 border border-white/10 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                }`}>
                  {msg.role !== 'user' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl rounded-tl-none pointer-events-none" />
                  )}
                  <div className="relative z-10 prose prose-invert prose-sm max-w-none">
                    {msg.content}
                    {msg.isApiKeyMissing && (
                      <div className="mt-4">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-gradient-to-r from-finova-purple to-finova-green px-4 py-2 rounded-xl text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2"
                        >
                          <Sparkles size={16} />
                          Add API Key
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
               <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 border border-finova-purple/30">
                  <Bot size={14} className="text-finova-purple" />
               </div>
               <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none flex gap-1 items-center">
                 <motion.div className="w-2 h-2 rounded-full bg-white/40" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                 <motion.div className="w-2 h-2 rounded-full bg-white/40" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                 <motion.div className="w-2 h-2 rounded-full bg-white/40" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 shrink-0 p-4 md:p-8 pt-2 bg-finova-navy/80 backdrop-blur-lg border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          
          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs md:text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-finova-purple/50 transition-colors flex items-center gap-2"
                >
                  <Sparkles size={12} className="text-finova-purple" />
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask Copilot anything..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-finova-purple/50 transition-colors shadow-lg"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-finova-purple rounded-xl text-white disabled:opacity-50 hover:bg-finova-purple/80 transition-colors flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-3">
            AI Copilot can make mistakes. Consider verifying important financial info.
          </p>
        </div>
      </div>
    </div>
  );
}
