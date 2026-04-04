import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// Base Glass Card
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, hover = false, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10",
        "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
        hover && "transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Metric Card
interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ icon: Icon, label, value, trend, className }: MetricCardProps) {
  return (
    <GlassCard hover className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium px-2 py-1 rounded-lg",
            trend.isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// Data Card with Header
interface DataCardProps {
  icon?: LucideIcon;
  title: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DataCard({ icon: Icon, title, badge, action, children, footer, className }: DataCardProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {badge && <div className="mt-1">{badge}</div>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 pt-4 border-t border-white/5">
          {footer}
        </div>
      )}
    </GlassCard>
  );
}

// Stat Card (Compact Metric)
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, change, className }: StatCardProps) {
  return (
    <GlassCard hover className={cn("p-5", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        {change && (
          <span className={cn(
            "text-xs font-medium",
            change.isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {change.isPositive ? "↑" : "↓"} {change.value}
          </span>
        )}
      </div>
    </GlassCard>
  );
}

// Interactive Card (Clickable)
interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function InteractiveCard({ children, className, ...props }: InteractiveCardProps) {
  return (
    <GlassCard
      className={cn(
        "p-6 cursor-pointer transition-all duration-200",
        "hover:border-primary/30 hover:-translate-y-1",
        "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

// Chart Card
interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, description, action, children, className }: ChartCardProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </GlassCard>
  );
}
