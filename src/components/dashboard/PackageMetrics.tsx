import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, Activity, Users, TrendingUp } from "lucide-react";

export function PackageMetrics({ data }: { data: any[] }) {
  if (!data || data.length === 0) return (
    <div className="glass-card shadow-lg border-white/5 flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground text-sm">No package data available. Seed the database first.</p>
    </div>
  );

  // Sort by revenue uplift
  const sorted = [...data].sort((a, b) => (b.avg_revenue_uplift_etb || 0) - (a.avg_revenue_uplift_etb || 0));

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((pkg) => (
        <Card key={pkg.code} className="glass-card shadow-2xl border-white/10 flex flex-col group hover:border-primary/50 hover:bg-black/40 transition-all duration-500 overflow-hidden relative">
          {/* Subtle gradient background inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointers-events-none" />
          
          <CardHeader className="pb-4 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-white text-lg flex items-center font-bold tracking-tight">
                  <PackageCheck className="h-5 w-5 mr-3 text-primary drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" />
                  {pkg.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-slate-400 text-sm leading-relaxed">
                  {pkg.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-black/30 capitalize border-white/10 shrink-0 text-[10px] tracking-widest text-slate-300">
                {pkg.category}
              </Badge>
            </div>
            
            <div className="mt-6 flex flex-col space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center font-medium">
                  <Users className="h-4 w-4 mr-2 text-slate-500" />
                  Acceptance Rate
                </span>
                <span className="font-extrabold text-white">
                  {((pkg.acceptance_rate || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-500/80 flex items-center font-medium">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                  Avg Revenue Uplift
                </span>
                <span className="font-extrabold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                  +ETB {Math.round(pkg.avg_revenue_uplift_etb || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center font-medium">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  Base Price
                </span>
                <span className="font-semibold text-slate-300">
                  ETB {pkg.base_price_etb.toLocaleString()}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 mt-auto pb-6 px-6 relative z-10">
            <div className="bg-black/30 rounded-xl p-4 border border-white/5 shadow-inner">
              <h5 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-white/5" />
                Components
                <div className="h-[1px] flex-1 bg-white/5" />
              </h5>
              <ul className="space-y-2">
                {pkg.components?.slice(0, 3).map((comp: any, idx: number) => (
                  <li key={idx} className="text-xs text-slate-300 flex justify-between items-center bg-white/5 p-2 rounded border border-transparent group-hover:border-white/5 transition-colors">
                    <span className="truncate pr-2 font-medium">
                      <span className="text-primary mr-1 text-[10px]">{comp.quantity}x</span> 
                      {comp.service_name}
                    </span>
                  </li>
                ))}
                {pkg.components?.length > 3 && (
                  <li className="text-[10px] text-primary font-bold indent-2 uppercase tracking-widest text-center mt-2 opacity-80 border border-primary/20 bg-primary/5 rounded py-1">
                    +{pkg.components.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
