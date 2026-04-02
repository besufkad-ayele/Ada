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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((pkg) => (
        <Card key={pkg.code} className="glass-card shadow-lg border-white/5 flex flex-col group hover:border-primary/50 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-white text-lg flex items-center">
                  <PackageCheck className="h-5 w-5 mr-2 text-primary" />
                  {pkg.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {pkg.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-white/5 capitalize border-white/10 shrink-0">
                {pkg.category}
              </Badge>
            </div>
            
            <div className="mt-4 flex flex-col space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Acceptance Rate
                </span>
                <span className="font-semibold text-white">
                  {((pkg.acceptance_rate || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                  Avg Revenue Uplift
                </span>
                <span className="font-semibold text-emerald-400">
                  +ETB {Math.round(pkg.avg_revenue_uplift_etb || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Base Price
                </span>
                <span className="text-sm text-white">
                  ETB {pkg.base_price_etb.toLocaleString()}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 mt-auto">
            <div className="bg-black/20 rounded-md p-3 border border-white/5">
              <h5 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Components</h5>
              <ul className="space-y-1.5">
                {pkg.components?.slice(0, 3).map((comp: any, idx: number) => (
                  <li key={idx} className="text-xs text-muted-foreground flex justify-between">
                    <span className="truncate pr-2">{comp.quantity}x {comp.service_name}</span>
                  </li>
                ))}
                {pkg.components?.length > 3 && (
                  <li className="text-xs text-primary font-medium indent-2">
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
