"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Send, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const EXAMPLE_QUERIES = [
  "What happens if I block 20 rooms for a tour group next weekend at 15% discount?",
  "Should I run a promotion for next Friday? Occupancy looks low.",
  "Why would the AI increase prices for Saturday night?",
  "What's the best package to offer an international couple booking 45 days out?",
  "How should I price the Deluxe rooms during Timkat festival?",
];

interface Message {
  role: "user" | "ai";
  text: string;
  context?: any;
}

function AskPageContent() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (q?: string) => {
    const text = q ?? query;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ml/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, context: data.context_snapshot },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Failed to reach the AI engine. Make sure the backend is running." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center">
          <BrainCircuit className="mr-3 h-8 w-8 text-primary" />
          Ask the Revenue AI
        </h1>
        <p className="text-muted-foreground">
          Natural language interface to the Kuraz AI engine. Powered by Groq (Llama 3.1 70B).
        </p>
      </div>

      {/* Example queries */}
      {messages.length === 0 && (
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" /> Try asking...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all text-sm text-slate-300 hover:text-white"
              >
                "{q}"
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "glass-card border border-white/10 text-slate-200 rounded-bl-sm"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="flex items-center mb-2">
                    <BrainCircuit className="h-4 w-4 text-primary mr-2" />
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      Kuraz AI
                    </Badge>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.context && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground space-y-1">
                    <p>Context: {msg.context.date} · {msg.context.weekly_bookings} bookings this week · ETB {msg.context.weekly_revenue_etb?.toLocaleString()} revenue</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass-card border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                <BrainCircuit className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-6">
        <div className="glass-card border border-white/10 rounded-2xl p-3 flex gap-3 shadow-2xl">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
            placeholder="Ask about pricing, demand, packages, or revenue strategy..."
            className="bg-transparent border-none text-white placeholder:text-muted-foreground focus-visible:ring-0 flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleAsk()}
            disabled={isLoading || !query.trim()}
            className="bg-primary hover:bg-primary/90 text-white shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <ProtectedRoute>
      <AskPageContent />
    </ProtectedRoute>
  );
}
