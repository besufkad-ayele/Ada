"use client";

import { useEffect, useState } from "react";
import { PackageMetrics } from "../../components/dashboard/PackageMetrics";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Loader2, Sparkles, CheckCircle2, PackageCheck } from "lucide-react";

function PackagesPageContent() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [promptData, setPromptData] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const fetchPackages = async () => {
    try {
      const [catRes, perfRes] = await Promise.all([
        fetch(`${API_BASE}/api/packages/catalog`),
        fetch(`${API_BASE}/api/packages/performance`),
      ]);

      if (catRes.ok) setCatalog(await catRes.json());
      if (perfRes.ok) setPerformance(await perfRes.json());
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setError("Could not connect to the AI engine.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleGeneratePackage = async () => {
    if (!promptData.trim()) return;
    setIsGenerating(true);
    setGenerateSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/packages/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_audience: promptData }),
      });
      if (res.ok) {
        await fetchPackages(); // Refresh catalog with new package
        setGenerateSuccess(true);
        setPromptData("");
        setTimeout(() => setGenerateSuccess(false), 3000);
      } else {
        const error = await res.json();
        alert("Generation failed: " + JSON.stringify(error));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during AI generation.");
    } finally {
      setIsGenerating(false);
    }
  };

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

  const mergedData = catalog.map(pkg => {
    const perf = performance.find(p => p.code === pkg.code) || {};
    return { ...pkg, ...perf };
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        icon={PackageCheck}
        title="Service"
        highlight="Packages"
        description="AI-recommended service bundles and their financial performance."
        actions={
          <div className="flex flex-col items-end gap-2 bg-primary/5 p-4 border border-primary/20 rounded-xl relative overflow-hidden max-w-sm w-full shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="w-full flex justify-between items-center z-10 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Gemini Package Generator
            </span>
            {generateSuccess && <span className="text-xs text-emerald-400 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Generated!</span>}
          </div>
          <div className="flex w-full space-x-2 z-10">
            <Input 
              placeholder="e.g. 'Chinese Diplomats visiting for 5 days...'"
              value={promptData}
              onChange={(e) => setPromptData(e.target.value)}
              className="bg-black/30 border-white/10 text-white placeholder:text-white/30 text-xs"
              autoComplete="off"
            />
            <Button
              onClick={handleGeneratePackage}
              disabled={isGenerating || !promptData.trim()}
              className="bg-primary hover:bg-primary/90 text-[10px] uppercase font-bold tracking-wider"
              size="sm"
            >
              {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <BrainCircuit className="h-3 w-3" />}
            </Button>
          </div>
          </div>
        }
      />

      <PackageMetrics data={mergedData} />
    </div>
  );
}

export default function PackagesPage() {
  return (
    <ProtectedRoute>
      <PackagesPageContent />
    </ProtectedRoute>
  );
}
