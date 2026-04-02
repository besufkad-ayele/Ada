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
      {/* AI Status Banner */}
      <div className="glass-card border-primary/20 bg-primary/5 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-6 w-6 text-primary animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Revenue Engine Active</p>
            <p className="text-xs text-primary">Continuously optimizing pricing across all room types</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Live
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass-card shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
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
