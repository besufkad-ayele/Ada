import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, Activity, DollarSign, BedDouble, TrendingUp, Zap } from "lucide-react";

export function KPICards({ data }: { data: any }) {
  if (!data) return null;

  const fmt = (v: any, fallback = 0) => (typeof v === "number" ? v : fallback);

  const kpis = [
    {
      title: "RevPAR",
      value: `ETB ${fmt(data.revpar).toLocaleString()}`,
      change: fmt(data.revpar_change_pct),
      icon: Activity,
      description: data.comparison_period ?? "",
    },
    {
      title: "ADR",
      value: `ETB ${fmt(data.adr).toLocaleString()}`,
      change: fmt(data.adr_change_pct),
      icon: DollarSign,
      description: data.comparison_period ?? "",
    },
    {
      title: "TRevPAR",
      value: `ETB ${fmt(data.trevpar).toLocaleString()}`,
      change: fmt(data.trevpar_change_pct),
      icon: TrendingUp,
      description: data.comparison_period ?? "",
    },
    {
      title: "Occupancy Rate",
      value: `${(fmt(data.occupancy_rate) * 100).toFixed(1)}%`,
      change: fmt(data.occupancy_change_pct),
      icon: BedDouble,
      description: data.comparison_period ?? "",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="glass-card relative overflow-hidden border-primary/30 p-5 rounded-2xl flex items-center justify-between shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative flex items-center gap-4">
          <div className="relative p-2 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]">
            <Zap className="h-6 w-6 text-primary animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_rgba(245,158,11,1)]"></span>
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-wide">AI Revenue Engine Active</p>
            <p className="text-sm text-primary/80">Continuously optimizing pricing across all room types</p>
          </div>
        </div>
        <Badge className="relative overflow-hidden bg-emerald-500/20 text-emerald-400 border-emerald-500/40 px-3 py-1 text-sm shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
          Live System
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass-card flex flex-col relative overflow-hidden group">
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 tracking-wider uppercase">
                {kpi.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <kpi.icon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
            </CardHeader>
            <CardContent className="relative flex-1">
              <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</div>
              <p className="text-xs flex items-center mt-2 group">
                <span
                  className={`flex items-center px-1.5 py-0.5 rounded-sm font-medium ${
                    kpi.change > 0 
                    ? "text-emerald-400 bg-emerald-400/10" 
                    : kpi.change < 0 
                    ? "text-rose-400 bg-rose-400/10"
                    : "text-muted-foreground"
                  }`}
                >
                  {kpi.change > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : kpi.change < 0 ? (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  ) : null}
                  {Math.abs(kpi.change)}%
                </span>
                <span className="text-muted-foreground ml-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  {kpi.description}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
