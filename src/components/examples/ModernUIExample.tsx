/**
 * Modern UI Components Example
 * 
 * This file demonstrates how to use the new modern card components
 * based on the design system in design.md
 */

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { 
  GlassCard, 
  MetricCard, 
  DataCard, 
  StatCard, 
  InteractiveCard,
  ChartCard,
} from "@/components/ui/modern-card";
import { ModernBadge } from "@/components/ui/modern-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export function ModernUIExample() {
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* Page Header Example */}
      <PageHeader
        icon={Sparkles}
        title="Modern"
        highlight="Dashboard"
        description="Experience the new glassmorphism design with improved data visualization and user experience."
        badge={
          <ModernBadge variant="success">
            Live
          </ModernBadge>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Insights
            </Button>
          </>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          label="Total Revenue"
          value="$45,231"
          trend={{ value: "12.5%", isPositive: true }}
        />
        <MetricCard
          icon={Users}
          label="Active Guests"
          value="1,234"
          trend={{ value: "3.2%", isPositive: false }}
        />
        <MetricCard
          icon={TrendingUp}
          label="Occupancy Rate"
          value="87%"
          trend={{ value: "5.1%", isPositive: true }}
        />
        <MetricCard
          icon={Calendar}
          label="Avg. Stay Duration"
          value="3.2 days"
        />
      </div>

      {/* Stat Cards - Compact Version */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="ADR"
          value="$156"
          icon={DollarSign}
          change={{ value: "8%", isPositive: true }}
        />
        <StatCard
          label="RevPAR"
          value="$136"
          icon={TrendingUp}
          change={{ value: "12%", isPositive: true }}
        />
        <StatCard
          label="Packages Sold"
          value="342"
          icon={Sparkles}
          change={{ value: "5%", isPositive: false }}
        />
        <StatCard
          label="Cancellations"
          value="12"
          icon={Users}
        />
      </div>

      {/* Data Card with Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCard
          icon={TrendingUp}
          title="Revenue Breakdown"
          badge={<ModernBadge variant="primary">Last 30 Days</ModernBadge>}
          action={
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          }
          footer={
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Updated 5 min ago</span>
              <Button variant="link" size="sm" className="text-primary">
                Export Report
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-slate-300">Room Revenue</span>
              </div>
              <span className="text-white font-semibold">$32,450</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300">Package Revenue</span>
              </div>
              <span className="text-white font-semibold">$12,781</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-300">Ancillary Services</span>
              </div>
              <span className="text-white font-semibold">$5,230</span>
            </div>
          </div>
        </DataCard>

        <DataCard
          icon={Users}
          title="Guest Segments"
          badge={<ModernBadge variant="info">AI Classified</ModernBadge>}
        >
          <div className="space-y-3">
            {[
              { name: "Business Travelers", count: 234, color: "bg-blue-500" },
              { name: "Families", count: 189, color: "bg-emerald-500" },
              { name: "Honeymooners", count: 156, color: "bg-pink-500" },
              { name: "Budget Conscious", count: 98, color: "bg-amber-500" },
            ].map((segment) => (
              <div key={segment.name} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${segment.color}`}></div>
                <span className="text-slate-300 flex-1">{segment.name}</span>
                <span className="text-white font-medium">{segment.count}</span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InteractiveCard onClick={() => alert("Card clicked!")}>
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Simulator</h3>
          <p className="text-sm text-slate-400">
            Test pricing scenarios with our AI engine
          </p>
        </InteractiveCard>

        <InteractiveCard onClick={() => alert("Card clicked!")}>
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Revenue Reports</h3>
          <p className="text-sm text-slate-400">
            Detailed analytics and insights
          </p>
        </InteractiveCard>

        <InteractiveCard onClick={() => alert("Card clicked!")}>
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Event Calendar</h3>
          <p className="text-sm text-slate-400">
            Manage seasonal pricing events
          </p>
        </InteractiveCard>
      </div>

      {/* Chart Card Example */}
      <ChartCard
        title="Revenue Trend"
        description="Last 7 days performance"
        action={
          <ModernBadge variant="success">
            +12.5%
          </ModernBadge>
        }
      >
        <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-lg border border-white/5">
          <p className="text-slate-400">Chart component goes here</p>
        </div>
      </ChartCard>

      {/* Badge Examples */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Badge Variants</h3>
        <div className="flex flex-wrap gap-3">
          <ModernBadge variant="primary">Primary</ModernBadge>
          <ModernBadge variant="success">Success</ModernBadge>
          <ModernBadge variant="warning">Warning</ModernBadge>
          <ModernBadge variant="error">Error</ModernBadge>
          <ModernBadge variant="info">Info</ModernBadge>
          <ModernBadge variant="neutral">Neutral</ModernBadge>
          <ModernBadge variant="outline">Outline</ModernBadge>
        </div>
      </GlassCard>

    </div>
  );
}
