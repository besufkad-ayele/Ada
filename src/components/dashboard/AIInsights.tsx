import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, TrendingUp, AlertTriangle, Info } from "lucide-react";

export function AIInsights({ insights }: { insights: any[] }) {
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
    <Card className="glass-card shadow-lg border-white/5 h-full overflow-hidden flex flex-col">
      <CardHeader className="bg-primary/5 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle className="text-white">AI Engine Insights</CardTitle>
        </div>
        <CardDescription>Live recommendations from the dynamic pricing model</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-white/5">
          {insights.map((insight) => (
            <div key={insight.id} className="p-5 hover:bg-white/5 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {getIcon(insight.severity)}
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {insight.message}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className={getBadgeColor(insight.category)}>
                        {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/10">
                        {insight.metric_impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pl-9">
                <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                  <p className="text-xs text-primary font-medium flex items-center">
                    <BrainCircuit className="h-3 w-3 mr-1.5" />
                    Action: {insight.suggested_action}
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
