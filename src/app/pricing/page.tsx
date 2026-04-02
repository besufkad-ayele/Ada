"use client";

import { useEffect, useState } from "react";
import { PricingHeatmap } from "../../components/dashboard/PricingHeatmap";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";

function PricingPageContent() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function fetchPricingData() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/pricing-heatmap`);
        if (res.ok) {
          setHeatmapData(await res.json());
        } else {
          setError("Failed to load pricing data.");
        }
      } catch (err) {
        console.error("Failed to fetch pricing heatmap:", err);
        setError("Could not connect to the AI engine.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPricingData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-rose-400">{error}</p>
      </div>
    );
  }

  const handleAnalyzeMarket = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/analyze-pricing`);
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      } else {
        alert("AI Analysis failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pricing & Inventory Map</h1>
          <p className="text-muted-foreground">Detailed view of dynamic rates, fare classes, and demand levels.</p>
        </div>

        <div className="flex flex-col items-end max-w-lg">
          {!aiInsight ? (
            <Button
              onClick={handleAnalyzeMarket}
              disabled={isAnalyzing}
              className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isAnalyzing ? "Gemini is analyzing..." : "Ask Gemini Market Strategist"}
            </Button>
          ) : (
            <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-center mb-2 text-primary text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="mr-2 h-4 w-4" /> Gemini Strategic Insight
              </div>
              <p className="text-sm text-slate-200 italic leading-relaxed">
                "{aiInsight}"
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAiInsight(null)}
                className="text-xs text-primary/70 hover:text-primary mt-2 p-0 h-auto font-semibold"
              >
                Clear Analysis
              </Button>
            </div>
          )}
        </div>
      </div>

      <PricingHeatmap data={heatmapData} />
    </div>
  );
}

export default function PricingPage() {
  return (
    <ProtectedRoute>
      <PricingPageContent />
    </ProtectedRoute>
  );
}
