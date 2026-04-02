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
  const roomTypes = Array.from(new Set(data.map(d => d.room_type_name)));
  
  // Group by date
  const datesRaw = Array.from(new Set(data.map(d => d.date)));
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
    <Card className="glass-card shadow-2xl overflow-hidden h-full flex flex-col border-primary/10">
      <CardHeader className="bg-gradient-to-br from-black/40 via-transparent to-transparent border-b border-white/5 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointers-events-none" />
        <div className="flex items-center justify-between relative z-10 w-full">
          <div>
            <CardTitle className="text-white flex items-center text-xl tracking-tight">
              <CalendarDays className="h-5 w-5 mr-3 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span className="gold-gradient-text">14-Day Pricing Outlook</span>
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1 ml-8">Live recommended rates by room type</CardDescription>
          </div>
          <div className="flex gap-3 text-xs text-slate-400 font-medium tracking-wide bg-black/40 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
            <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-2 shadow-[0_0_5px_rgba(51,65,85,0.8)]"></div> Low</span>
            <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div> Med</span>
            <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2 shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div> High</span>
            <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div> Peak</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left font-semibold text-slate-300 border-b border-white/5 bg-black/20 whitespace-nowrap uppercase tracking-widest text-[10px]">
                  Room Type
                </th>
                {dates.map(date => (
                  <th key={date} className="p-3 font-medium text-center border-b border-white/5 bg-black/20 min-w-[140px] border-l border-white/5">
                    <div className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">{format(parseISO(date), "EEE")}</div>
                    <div className="text-sm text-white font-extrabold">{format(parseISO(date), "MMM d")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {roomTypes.map((rtName, i) => (
                <tr key={rtName} className="group hover:bg-white/[0.02] transition-colors duration-300">
                  <td className="p-4 font-bold text-white tracking-wide border-r border-white/5 group-hover:bg-transparent bg-black/10">
                    {rtName}
                  </td>
                  {dates.map(date => {
                    const cellData = data.find(d => d.date === date && d.room_type_name === rtName);
                    
                    if (!cellData) {
                      return <td key={date} className="p-2 border-x border-white/5">--</td>;
                    }

                    const isPeak = cellData.demand_level === "peak";

                    return (
                      <td key={date} className="p-3 border-x border-white/5 bg-black/10">
                        <div className={`p-3 rounded-xl border ${getDemandColor(cellData.demand_level)} flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer relative group/cell min-h-[85px]`}>
                          {isPeak && <AlertCircle className="absolute -top-2 -right-2 h-5 w-5 text-rose-400 animate-pulse bg-black rounded-full drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]" />}
                          
                          <div className="font-extrabold tracking-tight">
                            ETB {cellData.rate_etb.toLocaleString()}
                          </div>
                          
                          <div className="flex w-full justify-between items-center px-1">
                            <span className="text-[10px] font-medium opacity-80">{Math.round(cellData.occupancy_rate * 100)}% occ</span>
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
