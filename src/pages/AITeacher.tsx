import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const API_BASE = import.meta.env.VITE_API_URL as string;

export default function AITeacher() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your AI Teacher. Ask me any question related to technology, computer science, or programming, and I will do my best to help you learn!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    // Add user message
    const userMsg: Message = { sender: "user", text: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiFetch<{ reply: string }>(`${API_BASE}/ai/ask`, {
        method: "POST",
        body: JSON.stringify({ question: query }),
      });

      const aiMsg: Message = {
        sender: "ai",
        text: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        sender: "ai",
        text: err.message || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="relative w-full h-[calc(100vh-10rem)]">
        {/* Main chat background - blurred and pointer-events disabled */}
        <div className="mx-auto max-w-4xl h-full flex flex-col space-y-4 filter blur-[6px] pointer-events-none select-none">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">AI Teacher</h1>
              <p className="text-xs text-muted-foreground">
                Ask anything about programming, database engineering, cloud computing, and more.
              </p>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto border border-border rounded-2xl bg-card/45 backdrop-blur-sm p-4 space-y-4 shadow-sm min-h-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold border",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground border-primary/20"
                      : "bg-secondary text-foreground border-border"
                  )}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                {msg.sender === "user" ? (
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed bg-primary text-primary-foreground rounded-tr-none"
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className="rounded-2xl px-5 py-4 text-sm shadow-sm leading-relaxed bg-secondary/65 text-foreground rounded-tl-none border border-border/50 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="flex gap-2 items-center">
            <Input
              value={input}
              placeholder="Type your tech question here..."
              disabled
              className="flex-1 bg-background border-border rounded-xl px-4 py-5 shadow-inner"
            />
            <Button
              disabled
              className="rounded-xl px-4 py-5 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Coming Soon Glassmorphic Modal Card Overlay */}
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/25 backdrop-blur-[2px]">
          <div className="w-full max-w-md bg-card/85 border border-border shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col items-center text-center space-y-6 animate-scale-in">
            {/* Pulsing Sparks Icon Badge */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20 shadow-md">
                <Sparkles className="h-8 w-8 animate-pulse text-indigo-500" />
              </div>
              <span className="absolute -top-2 -right-8 text-[9px] font-bold tracking-wider text-rose-500 uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shadow-sm animate-bounce">
                Coming Soon
              </span>
            </div>

            {/* Matter Description */}
            <div className="space-y-2">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                AI Tech Teacher
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are building a highly advanced, context-aware AI tutor to guide you through your software and engineering journey. From solving programming bugs to explaining architectural patterns, your personal AI Teacher is just around the corner.
              </p>
            </div>

            {/* B.B. King Quote */}
            <div className="w-full border-t border-b border-border/80 py-4 px-2 my-2 bg-secondary/15 rounded-lg">
              <p className="font-serif text-sm italic text-foreground/90 leading-normal">
                "The beautiful thing about learning is nobody can take it away from you."
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-semibold">
                — B.B. King
              </p>
            </div>

            {/* Continue Learning Action Button */}
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full py-6 rounded-xl text-sm font-semibold tracking-wide shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
