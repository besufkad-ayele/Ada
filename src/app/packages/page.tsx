"use client";

import { useEffect, useState } from "react";
import { PackageMetrics } from "../../components/dashboard/PackageMetrics";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function PackagesPageContent() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
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
    }

    fetchPackages();
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

  const mergedData = catalog.map(pkg => {
    const perf = performance.find(p => p.code === pkg.code) || {};
    return { ...pkg, ...perf };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Service Packages</h1>
        <p className="text-muted-foreground">AI-recommended service bundles and their financial performance.</p>
      </div>

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
