"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KPICards } from "../../components/dashboard/KPICards";
import { RevenueChart } from "../../components/dashboard/RevenueChart";
import { AIInsights } from "../../components/dashboard/AIInsights";
import { LiveAIActivity } from "../../components/dashboard/LiveAIActivity";
import { LiveRoomPricing } from "../../components/dashboard/LiveRoomPricing";
import { RecentBookings } from "../../components/dashboard/RecentBookings";
import EventPricingCalendar from "../../components/dashboard/EventPricingCalendar";
import { PageHeader } from "../../components/layout/PageHeader";
import { BarChart3 } from "lucide-react";
import { API_BASE } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("kuraz_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    async function fetchDashboardData() {
      try {
        const [kpiRes, chartRes, insightsRes] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/kpis`),
          fetch(`${API_BASE}/api/dashboard/revenue-timeseries`),
          fetch(`${API_BASE}/api/dashboard/ai-insights`),
        ]);

        if (kpiRes.ok) setKpiData(await kpiRes.json());
        if (chartRes.ok) setChartData(await chartRes.json());
        if (insightsRes.ok) setInsights(await insightsRes.json());
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not connect to the AI engine. Make sure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

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
        <div className="text-center space-y-2">
          <p className="text-rose-400 font-medium">{error}</p>
          <p className="text-muted-foreground text-sm">Run <code className="bg-white/10 px-1 rounded">POST /api/seed</code> to initialize data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <PageHeader
        icon={BarChart3}
        title="Resort"
        highlight="Dashboard"
        description="Real-time revenue intelligence & AI pricing actions."
        actions={
          user && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          )
        }
      />

      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Live Room Pricing - Full Width */}
      <LiveRoomPricing />

      {/* Main Content Grid - 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <RevenueChart data={chartData} />
          <LiveAIActivity />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <AIInsights insights={insights} />
          <RecentBookings />
        </div>
      </div>

      {/* Ethiopian Events & AI Pricing Impact - Full Width */}
      <EventPricingCalendar />
    </div>
  );
}
