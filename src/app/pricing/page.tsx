"use client";

import { useEffect, useState } from "react";
import { PricingHeatmap } from "../../components/dashboard/PricingHeatmap";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function PricingPageContent() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pricing & Inventory Map</h1>
        <p className="text-muted-foreground">Detailed view of dynamic rates, fare classes, and demand levels.</p>
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
