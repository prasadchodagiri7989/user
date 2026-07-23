import { useState, useRef, useEffect } from "react";
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
      <div className="mx-auto max-w-4xl h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
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
                  className="rounded-2xl px-5 py-4 text-sm shadow-sm leading-relaxed bg-secondary/65 text-foreground rounded-tl-none border border-border/50 prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-table:border prose-table:border-collapse prose-th:border prose-th:px-3 prose-th:py-2 prose-td:border prose-td:px-3 prose-td:py-2"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-secondary/65 border border-border/50 text-muted-foreground rounded-2xl rounded-tl-none px-4 py-2.5 text-sm flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your tech question here (e.g. What is polymorphism?)..."
            disabled={loading}
            className="flex-1 bg-background border-border rounded-xl focus-visible:ring-indigo-500 focus-visible:ring-offset-0 px-4 py-5 shadow-inner"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl px-4 py-5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
