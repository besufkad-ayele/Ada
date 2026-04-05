"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Clock,
  Sparkles,
  BarChart3,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCcw,
  AlertCircle
} from "lucide-react";

// --- Mock Data Fallbacks ---
const MOCK_PRICING_TABLE = {
  time_buckets: { ">30": ">1 Month", "30-14": "2-4 Weeks", "14-7": "1-2 Weeks", "<7": "Last Minute" },
  table: {
    ">30,0-15": [10, 15], ">30,15-30": [5, 30], ">30,30-40": [0, 40], ">30,>40": [0, 60],
    "30-14,0-15": [10, 20], "30-14,15-30": [5, 30], "30-14,30-40": [2.5, 60], "30-14,>40": [0, 80],
    "14-7,0-15": [10, 25], "14-7,15-30": [5, 40], "14-7,30-40": [2.5, 75], "14-7,>40": [0, 100],
    "<7,0-15": [5, 50], "<7,15-30": [2.5, 75], "<7,30-40": [1.25, 80], "<7,>40": [0, 0]
  }
};

const MOCK_FORECAST = Array.from({ length: 28 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const multipliers = [0.8, 0.9, 1.0, 1.15, 1.3, 1.5];
  const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
  return {
    date: date.toISOString().split('T')[0],
    day_of_week: date.toLocaleDateString('en-US', { weekday: 'long' }),
    demand_multiplier: mult,
    demand_level: mult >= 1.3 ? "Very High" : mult >= 1.1 ? "High" : mult >= 0.9 ? "Normal" : "Low"
  };
});

function PricingPageContent() {
  const [pricingTable, setPricingTable] = useState<any>(null);
  const [demandForecast, setDemandForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tableRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE}/api/pricing/pricing-table`),
        fetch(`${API_BASE}/api/pricing/demand-forecast/AWASH?days_ahead=30`)
      ]);

      if (tableRes.ok) setPricingTable(await tableRes.json());
      else setPricingTable(MOCK_PRICING_TABLE);

      if (forecastRes.ok) setDemandForecast(await forecastRes.json());
      else setDemandForecast({ forecast: MOCK_FORECAST });

    } catch (err) {
      console.error("Failed to fetch pricing data:", err);
      setPricingTable(MOCK_PRICING_TABLE);
      setDemandForecast({ forecast: MOCK_FORECAST });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-64 mx-auto bg-white/5" />
          <Skeleton className="h-6 w-96 mx-auto bg-white/5" />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />)}
        </div>
        <Skeleton className="h-[400px] rounded-3xl bg-white/5" />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 mb-20"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 border border-white/10 bg-slate-900/40 backdrop-blur-2xl group shadow-2xl">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[30rem] h-[30rem] bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-colors duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-4 w-4" />
              Dynamic Yield Protocol Alpha
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
              Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-blue-400 to-emerald-400">Intelligence</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
              Real-time inventory pricing that adapts to market demand, seasonal trends, and localized events.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                +25% Revenue Growth
              </div>
              <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold">
                16 Decision Tiers
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center w-56 h-56 rounded-full border border-white/10 bg-slate-800/20 backdrop-blur-3xl relative group cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-inner">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
            <Plane className="h-20 w-20 text-primary-light group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
            <div className="absolute -bottom-4 px-6 py-3 bg-slate-950 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[10px] font-black text-white whitespace-nowrap tracking-widest uppercase">
              Yield Stream Active
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Metric Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Temporal Tiers", value: "4", icon: Clock, color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20" },
          { label: "Inventory Blocks", value: "4", icon: Users, color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20" },
          { label: "Pricing Vectors", value: "16", icon: BarChart3, color: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/20" },
          { label: "Optimal Discount", value: "10%", icon: DollarSign, color: "text-amber-400", bg: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20" }
        ].map((metric, i) => (
          <Card key={i} className={`relative overflow-hidden bg-gradient-to-br ${metric.bg} border-0 border-l-2 ${metric.border} backdrop-blur-xl rounded-2xl group shadow-lg`}>
            <CardContent className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 ${metric.color} shadow-xl`}>
                  <metric.icon className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-[0.1em] text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                   ACTIVE <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-1 tracking-tighter">{metric.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10 -mr-6 -mb-6 group-hover:scale-110 transition-transform duration-700">
                <metric.icon className="h-32 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Pricing Matrix - Left 2 Columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-900/60 backdrop-blur-glass border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-black text-white mb-1 flex items-center gap-3">
                    <BarChart3 className="h-7 w-7 text-primary-light" />
                    Yield Strategy Matrix
                  </CardTitle>
                  <p className="text-sm text-slate-400 font-medium">Multi-dimensional pricing rules optimized for occupancy velocity</p>
                </div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Autonomous Sync</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/[0.04] text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                      <th className="py-6 px-10 text-left border-r border-white/5">Maturity Window</th>
                      <th className="py-6 px-6 text-center">0-15% Blocks</th>
                      <th className="py-6 px-6 text-center bg-white/[0.01]">15-30% Blocks</th>
                      <th className="py-6 px-6 text-center">30-40% Blocks</th>
                      <th className="py-6 px-6 text-center bg-white/[0.01]">Over 40%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.keys(MOCK_PRICING_TABLE.time_buckets).map((timeBucket, i) => (
                      <tr key={timeBucket} className="hover:bg-white/[0.03] transition-all duration-300 group">
                        <td className="py-8 px-10 border-r border-white/5">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-white group-hover:text-primary-light transition-colors tracking-tight">
                              {MOCK_PRICING_TABLE.time_buckets[timeBucket as keyof typeof MOCK_PRICING_TABLE.time_buckets]}
                            </span>
                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1 opacity-60">Lead Tier {4-i}</span>
                          </div>
                        </td>
                        {["0-15", "15-30", "30-40", ">40"].map((invBucket, idx) => {
                          const rule = MOCK_PRICING_TABLE.table[`${timeBucket},${invBucket}` as keyof typeof MOCK_PRICING_TABLE.table];
                          const discount = rule ? rule[0] : 0;
                          
                          return (
                            <td key={invBucket} className={`py-8 px-6 text-center ${idx % 2 !== 0 ? 'bg-white/[0.005]' : ''}`}>
                              {discount > 0 ? (
                                <motion.div 
                                  initial={false}
                                  whileHover={{ scale: 1.05 }}
                                  className="inline-flex flex-col items-center cursor-help"
                                >
                                  <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black shadow-[0_4px_15px_rgba(16,185,129,0.1)]">
                                    -{discount}%
                                  </div>
                                  <div className="mt-2 flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,1)]" />
                                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Applied</span>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-xs font-bold tracking-tight opacity-50">
                                  Standard
                                </div>
                              )}
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

          {/* Strategy Info Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -5 }}>
              <Card className="h-full bg-slate-900/40 border border-white/10 rounded-3xl p-8 hover:border-primary/40 transition-all duration-500 shadow-xl group">
                <div className="flex gap-6">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary-light h-fit shadow-inner group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-black text-white tracking-tight">Inventory Fencing</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Intelligent block allocation that protects ADR (Average Daily Rate) during rapid booking spikes. Automatically restricts discount flow as occupancy velocity increases.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -5 }}>
              <Card className="h-full bg-slate-900/40 border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-500 shadow-xl group">
                <div className="flex gap-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 h-fit shadow-inner group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-black text-white tracking-tight">Predictive Overlays</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Localized context injection for Timkat, Meskel, and Ledet. The AI Layer overrides base multipliers to capture maximum willingness-to-pay during critical festive periods.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Fare Classes & Forecast - Right Column */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Fare Classes */}
          <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-7 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/5">
              <CardTitle className="text-lg font-black text-white flex items-center gap-3 tracking-tighter">
                <Plane className="h-6 w-6 text-purple-400" />
                Differentiated Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {[
                { name: "Saver", discount: "10%", color: "emerald", icon: TrendingDown, features: ["Non-refundable", "Prepaid total", "Yield Priority: Low"] },
                { name: "Standard", discount: "5%", color: "blue", icon: ArrowRight, features: ["Refundable (7d)", "Partial prepay", "Yield Priority: Med"] },
                { name: "Flex", discount: "2.5%", color: "purple", icon: RefreshCcw, features: ["Full Refund", "Pay at Resort", "Yield Priority: High"] }
              ].map((cls, i) => (
                <div key={i} className="group relative overflow-hidden p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-500 cursor-default shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl bg-${cls.color}-500/15 text-${cls.color}-400 shadow-inner`}>
                        <cls.icon className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-black text-white tracking-tight">{cls.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-${cls.color}-500/10 border border-${cls.color}-500/20 text-${cls.color}-400 text-[10px] font-black uppercase tracking-widest`}>
                      -{cls.discount}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cls.features.map((f, j) => (
                      <span key={j} className="text-[9px] px-2.5 py-1 rounded-xl bg-slate-950/40 text-slate-400 border border-white/5 font-bold uppercase tracking-tight">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 30-Day Heatmap Forecast */}
          <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-7 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black text-white flex items-center gap-3 tracking-tighter">
                  <TrendingUp className="h-6 w-6 text-indigo-400" />
                  30-Day Horizon
                </CardTitle>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <Calendar className="h-5 w-5 text-slate-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-7">
              <div className="grid grid-cols-7 gap-2">
                {demandForecast?.forecast?.slice(0, 28).map((day: any, idx: number) => {
                  const demandLevel = day.demand_multiplier >= 1.3 ? 'vhigh' : 
                                     day.demand_multiplier >= 1.1 ? 'high' :
                                     day.demand_multiplier >= 0.9 ? 'normal' : 'low';
                  
                  const bgColors = {
                    vhigh: 'bg-rose-500/80',
                    high: 'bg-amber-500/80',
                    normal: 'bg-blue-500/80',
                    low: 'bg-emerald-500/80'
                  };

                  return (
                    <motion.div
                      whileHover={{ scale: 1.15, y: -2, zIndex: 10 }}
                      key={idx}
                      className={`aspect-square rounded-lg ${bgColors[demandLevel as keyof typeof bgColors]} flex flex-col items-center justify-center cursor-pointer shadow-lg relative group transition-shadow duration-300 hover:shadow-indigo-500/20`}
                    >
                      <span className="text-[10px] font-black text-white leading-none tracking-tighter">
                        {new Date(day.date).getDate()}
                      </span>
                      {/* Premium Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 p-3 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none scale-90 group-hover:scale-100">
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{day.day_of_week}</p>
                          <div className="h-[1px] w-full bg-white/10" />
                          <p className="text-[11px] font-black text-white">{day.demand_level} Demand</p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                            <Zap className="h-3 w-3 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400">{day.demand_multiplier}x Multiplier</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">
                  <span>Intensity Map</span>
                  <span>Rev Impact</span>
                </div>
                {[
                  { label: "Critical Demand", color: "bg-rose-500", desc: "+30% Yield" },
                  { label: "Standard Flow", color: "bg-blue-500", desc: "Reference" },
                  { label: "Growth Promo", color: "bg-emerald-500", desc: "-10% Yield" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-lg`} />
                      <span className="text-xs font-bold text-white tracking-tight">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Special Premiums - Bottom Section */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden group rounded-[2.5rem] border border-white/10 bg-slate-950/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-orange-600/5 to-transparent backdrop-blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 right-0 p-12 text-white/5 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000">
            <Calendar className="h-64 w-64" />
          </div>
          <CardContent className="p-10 md:p-14 relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className="p-6 rounded-[2rem] bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-transform duration-500">
              <Calendar className="h-12 w-12 text-orange-400" />
            </div>
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
                System Auto-Rule
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter">Weekend Flux Premium</h3>
              <p className="text-base text-slate-400 leading-relaxed font-medium">
                Automatic application of an 8% structural premium for check-ins on Friday and Saturday. Captures peak leisure demand from urban centers.
              </p>
              <div className="pt-4 flex items-center gap-3 text-orange-400 font-black group-hover:gap-6 transition-all duration-500 cursor-pointer text-sm uppercase tracking-widest">
                <span>Configure Rule</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group rounded-[2.5rem] border border-white/10 bg-slate-950/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-indigo-600/5 to-transparent backdrop-blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 right-0 p-12 text-white/5 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000">
            <Sparkles className="h-64 w-64" />
          </div>
          <CardContent className="p-10 md:p-14 relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className="p-6 rounded-[2rem] bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-transform duration-500">
              <Sparkles className="h-12 w-12 text-indigo-400" />
            </div>
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Local Context Layer
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter">Festival Surge Overrides</h3>
              <p className="text-base text-slate-400 leading-relaxed font-medium">
                Dynamic overrides for Timkat, Meskel, and Ledet. Injects a +15% yield modifier across all tiers while disabling standard discounts during high-conviction periods.
              </p>
              <div className="pt-4 flex items-center gap-3 text-indigo-400 font-black group-hover:gap-6 transition-all duration-500 cursor-pointer text-sm uppercase tracking-widest">
                <span>Edit Calendar</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <ProtectedRoute>
      <PricingPageContent />
    </ProtectedRoute>
  );
}
