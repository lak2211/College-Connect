"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, X, Send, Sparkles, Bot, User, 
  RotateCcw, Maximize2, Minimize2,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const INITIAL_QUICK_PROMPTS = [
  { label: "Find OS PYQs", prompt: "Can you help me find Operating Systems previous year papers?" },
  { label: "Study Tips", prompt: "Give me some best study tips for engineering exams." },
  { label: "Platform Info", prompt: "What features does College Connect offer?" },
];

export function AIChatbot() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const userName = session?.user?.name?.split(" ")[0] || "Scholar";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${userName}! I'm Connect AI. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(async () => {
      let response = "I'm here to help! Could you specify which subject or resource you're looking for?";
      const lower = text.toLowerCase();
      
      if (lower.includes("recommend") || lower.includes("study next")) {
        response = "I recommend checking out the latest PYQs for your current subjects!";
      } else if (lower.includes("pyq") || lower.includes("previous year")) {
        response = "PYQs are available in the 'PYQs' section of your dashboard.";
      } else if (lower.includes("note") || lower.includes("study material")) {
        response = "You can find study notes in the 'Notes' section.";
      }

      const assistantMsg: Message = { role: "assistant", content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className={cn(
          "mb-4 w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col transition-all",
          !isMinimized ? "h-[450px]" : "h-16"
        )}>
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div className="leading-none">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Connect AI</h3>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex items-start gap-2", msg.role === "user" ? "flex-row-reverse" : "")}>
                    <div className={cn("p-2 rounded-lg", msg.role === "assistant" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                      {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm",
                      msg.role === "assistant" ? "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300" : "bg-blue-600 text-white"
                    )}>
                      <p>{msg.content}</p>
                      <span className="text-[9px] mt-1 block opacity-50">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-xs text-slate-400 italic font-medium px-2">AI is typing...</div>}
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && !isTyping && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950">
                  {INITIAL_QUICK_PROMPTS.map((qp, i) => (
                    <button key={i} onClick={() => handleSend(qp.prompt)} className="px-2 py-1 text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:border-blue-500 text-slate-600 dark:text-slate-400">
                      {qp.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Ask something..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button onClick={() => handleSend(input)} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <BrainCircuit className="h-2.5 w-2.5" /> Academy AI
                  </span>
                  <button onClick={() => setMessages([messages[0]])} className="text-slate-300 hover:text-red-500">
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all",
          isOpen ? "bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
