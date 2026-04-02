import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { CalendarDays, AlertCircle } from "lucide-react";

export function PricingHeatmap({ data }: { data: any[] }) {
  if (!data || data.length === 0) return (
    <div className="glass-card shadow-lg border-white/5 flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground text-sm">No pricing data available. Seed the database first.</p>
    </div>
  );

  // Group by room type
  const roomTypes = [...new Set(data.map(d => d.room_type_name))];
  
  // Group by date
  const datesRaw = [...new Set(data.map(d => d.date))];
  const dates = datesRaw.sort().slice(0, 14); // Show upcoming 14 days

  const getDemandColor = (level: string) => {
    switch (level) {
      case "peak": return "bg-rose-500/80 border-rose-500 text-rose-50";
      case "high": return "bg-orange-500/80 border-orange-500 text-orange-50";
      case "medium": return "bg-blue-500/60 border-blue-500 text-blue-50";
      case "low": return "bg-slate-700/60 border-slate-600 text-slate-300";
      default: return "bg-slate-800/60 border-slate-700 text-slate-400";
    }
  };

  const getFareClassBadge = (fc: string) => {
    switch (fc) {
      case "saver": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1 h-4">Saver</Badge>;
      case "standard": return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-1 h-4">Standard</Badge>;
      case "premium": return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] px-1 h-4">Premium</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="glass-card shadow-lg border-white/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-primary" />
              14-Day Pricing Outlook
            </CardTitle>
            <CardDescription>Live recommended rates by room type</CardDescription>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-700/60 mr-1"></div> Low</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500/60 mr-1"></div> Med</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500/80 mr-1"></div> High</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-rose-500/80 mr-1"></div> Peak</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-medium text-muted-foreground border-b border-white/5 bg-white/5 whitespace-nowrap rounded-tl-xl">
                  Room Type
                </th>
                {dates.map(date => (
                  <th key={date} className="p-3 font-medium text-center border-b border-white/5 bg-white/5 min-w-[120px]">
                    <div className="text-xs text-muted-foreground">{format(parseISO(date), "EEE")}</div>
                    <div className="text-sm text-white">{format(parseISO(date), "MMM d")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((rtName, i) => (
                <tr key={rtName} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-slate-200 bg-white/5 group-hover:bg-transparent">
                    {rtName}
                  </td>
                  {dates.map(date => {
                    const cellData = data.find(d => d.date === date && d.room_type_name === rtName);
                    
                    if (!cellData) {
                      return <td key={date} className="p-2 border-x border-white/5">--</td>;
                    }

                    const isPeak = cellData.demand_level === "peak";

                    return (
                      <td key={date} className="p-2 border-x border-white/5">
                        <div className={`p-3 rounded-xl border ${getDemandColor(cellData.demand_level)} flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 cursor-pointer relative group/cell`}>
                          {isPeak && <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-red-300 animate-pulse" />}
                          
                          <div className="font-bold text-sm tracking-tight">
                            ETB {cellData.rate_etb.toLocaleString()}
                          </div>
                          
                          <div className="flex w-full justify-between items-center mt-1 px-1">
                            <span className="text-[10px] opacity-80">{Math.round(cellData.occupancy_rate * 100)}% occ</span>
                            {getFareClassBadge(cellData.fare_class_active)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
