import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, TrendingUp, AlertTriangle, Info } from "lucide-react";

interface Insight {
  id: number;
  severity: string;
  title: string;
  message: string;
  category: string;
  metric_impact: string;
  suggested_action: string;
}

export function AIInsights({ insights }: { insights: Insight[] }) {
  if (!insights || insights.length === 0) return (
    <div className="glass-card shadow-lg border-white/5 h-full flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground text-sm">No insights yet. Seed the database to generate AI recommendations.</p>
    </div>
  );

  const getIcon = (severity: string) => {
    switch (severity) {
      case "action":
        return <AlertTriangle className="h-5 w-5 text-rose-500 mt-1 flex-shrink-0" />;
      case "warning":
        return <TrendingUp className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "demand":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "pricing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "package":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <Card className="glass-card shadow-2xl overflow-hidden flex flex-col h-full border-primary/10">
      <CardHeader className="bg-gradient-to-br from-black/40 via-transparent to-transparent border-b border-white/5 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointers-events-none" />
        <div className="flex items-center space-x-3 relative z-10">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
            <BrainCircuit className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-white text-xl tracking-tight"><span className="gold-gradient-text">AI Engine Insights</span></CardTitle>
            <CardDescription className="text-slate-400 mt-1">Live recommendations from the pricing model</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-white/5">
          {insights.map((insight) => (
            <div key={insight.id} className="p-5 hover:bg-white/5 transition-all duration-300 group border-l-2 border-transparent hover:border-primary">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 w-full">
                  <div className="bg-black/30 p-2 rounded-xl border border-white/5 shadow-inner">
                    {getIcon(insight.severity)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors tracking-wide">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {insight.message}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className={`font-semibold tracking-wider text-[10px] uppercase ${getBadgeColor(insight.category)} px-2 py-0.5`}>
                        {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="bg-white/5 text-slate-400 border-white/10 font-mono text-xs">
                        {insight.metric_impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pl-14">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 shadow-inner relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                  <p className="text-xs text-primary font-bold flex items-center tracking-wide">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    <span className="uppercase text-[10px] tracking-widest mr-2 opacity-70">Action:</span> {insight.suggested_action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
