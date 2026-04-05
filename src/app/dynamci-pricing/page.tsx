"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Tags,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  BedDouble,
  Info,
  ChevronLeft,
  Activity,
  BarChart3,
  Percent,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE } from "@/lib/api";

const MOCK_PRICING_TABLE = {
  time_buckets: { 
    ">30": "Early Bird", 
    "30-14": "Standard Ahead", 
    "14-7": "Close-in", 
    "<7": "Last Minute" 
  },
  table: {
    ">30,0-15": [12, 15], ">30,15-30": [8, 30], ">30,30-40": [5, 45], ">30,>40": [0, 60],
    "30-14,0-15": [10, 20], "30-14,15-30": [5, 35], "30-14,30-40": [2, 50], "30-14,>40": [0, 75],
    "14-7,0-15": [8, 25], "14-7,15-30": [4, 40], "14-7,30-40": [0, 60], "14-7,>40": [0, 90],
    "<7,0-15": [5, 30], "<7,15-30": [0, 50], "<7,30-40": [0, 80], "<7,>40": [0, 0]
  }
};

const MOCK_FORECAST = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const multipliers = [0.8, 0.9, 1.0, 1.1, 1.25, 1.4];
  const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
  return {
    date: date.toISOString().split('T')[0],
    day_of_week: date.toLocaleDateString('en-US', { weekday: 'long' }),
    demand_multiplier: mult,
    demand_level: mult >= 1.2 ? "Very High" : mult >= 1.1 ? "High" : mult >= 0.9 ? "Normal" : "Low",
    recommended_strategy: mult >= 1.2 ? "Inventory Fencing" : mult >= 1.1 ? "Tier Uplift" : "Standard Base"
  };
});

export default function ResortRevenuePage() {
  const router = useRouter();
  const [pricingTable, setPricingTable] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("AWASH");
  const [loading, setLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingTable();
    fetchForecast();
  }, [selectedDestination]);

  const fetchPricingTable = async () => {
    setIsTableLoading(true);
    setTableError(null);
    try {
      const res = await fetch(`${API_BASE}/api/pricing/pricing-table`);
      if (res.ok) {
        const data = await res.json();
        setPricingTable(data);
      } else {
        // Fallback to mock if API returns error
        setPricingTable(MOCK_PRICING_TABLE);
        console.warn("Using mock pricing table due to API error");
      }
    } catch (err) {
      console.error("Failed to fetch pricing table:", err);
      // Fallback to mock on network error
      setPricingTable(MOCK_PRICING_TABLE);
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchForecast = async () => {
    setLoading(true);
    setForecastError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/pricing/demand-forecast/${selectedDestination}?days_ahead=30`
      );
      if (res.ok) {
        const data = await res.json();
        setForecast(data.forecast || []);
      } else {
        // Fallback to mock
        setForecast(MOCK_FORECAST);
        console.warn("Using mock forecast due to API error");
      }
    } catch (err) {
      console.error("Failed to fetch forecast:", err);
      // Fallback to mock
      setForecast(MOCK_FORECAST);
    } finally {
      setLoading(false);
    }
  };

  const getDemandColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "very high":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "normal":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "low":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "very low":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  } as const;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 selection:text-primary-light">
      <div className="relative overflow-hidden pt-20 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] -z-10" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center gap-3 text-primary-light font-medium tracking-wider text-sm uppercase">
                <Activity className="h-4 w-4" />
                Live Revenue Engine
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent flex items-center gap-4">
                Dynamic Pricing
                <Badge id="badge-ai-enabled" variant="outline" className="bg-primary/10 text-primary-light border-primary/20 text-xs py-0.5 px-2 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Enabled
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Badge>
              </h1>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                Intelligent yield management automatically adjusting rates based on real-time occupancy, demand forecasting, and seasonal trends.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Button 
                id="btn-back-dashboard"
                onClick={() => router.push("/dashboard")} 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white gap-2 h-11"
              >
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                id="btn-update-rules"
                className="bg-primary hover:bg-primary-dark text-white rounded-button h-11 px-6 shadow-lg shadow-primary/20"
              >
                Update Rules
              </Button>
            </motion.div>
          </div>

          {/* Key Intelligence Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Revenue Uplift", value: "+28.4%", sub: "vs static pricing", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Active Strategies", value: "12", sub: "Price optimization rules", icon: Activity, color: "text-primary-light", bg: "bg-primary/10" },
              { label: "Price Efficiency", value: "94.2%", sub: "Yield management score", icon: Percent, color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: "AI Confidence", value: "High", sub: "Forecast reliability", icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-500/10" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                id={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white/[0.03] backdrop-blur-glass border border-white/10 rounded-card p-6 flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{stat.sub}</p>
                </div>
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Main Optimization Matrix */}
            <motion.div variants={itemVariants} className="xl:col-span-8 space-y-8">
              <Card id="card-pricing-matrix" className="bg-white/[0.02] backdrop-blur-glass border-white/10 rounded-card overflow-hidden shadow-2xl shadow-black/50">
                <CardHeader className="border-b border-white/5 py-6 px-8 bg-white/[0.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-primary-light" />
                      </div>
                      <CardTitle className="text-xl font-semibold">Yield Pricing Matrix</CardTitle>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-slate-400">Occupancy vs. Lead Time</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {isTableLoading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 space-y-6"
                      >
                        <div className="flex gap-4">
                          <Skeleton className="h-10 w-32" />
                          <Skeleton className="h-10 flex-1" />
                          <Skeleton className="h-10 flex-1" />
                          <Skeleton className="h-10 flex-1" />
                          <Skeleton className="h-10 flex-1" />
                        </div>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex gap-4">
                            <Skeleton className="h-16 w-32" />
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                          </div>
                        ))}
                      </motion.div>
                    ) : tableError ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 gap-4 px-8 text-center"
                      >
                        <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-rose-500" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-bold">Calculation Interrupted</h4>
                          <p className="text-slate-500 text-sm">{tableError}</p>
                        </div>
                        <Button 
                          onClick={fetchPricingTable}
                          variant="outline" 
                          className="bg-white/5 border-white/10 hover:bg-white/10 gap-2"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Re-run AI Analysis
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-0"
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-white/[0.02] text-slate-400 text-xs uppercase tracking-widest font-semibold">
                                <th className="py-5 px-8 text-left">Booking Window</th>
                                <th className="py-5 px-8 text-center bg-white/[0.01]">0-15% Full</th>
                                <th className="py-5 px-8 text-center">15-30% Full</th>
                                <th className="py-5 px-8 text-center bg-white/[0.01]">30-40% Full</th>
                                <th className="py-5 px-8 text-center">40%+ Full</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {[">30", "30-14", "14-7", "<7"].map((timeBucket) => (
                                <tr key={timeBucket} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="py-6 px-8">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-white group-hover:text-primary-light transition-colors">
                                        {pricingTable?.time_buckets?.[timeBucket] || timeBucket}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono">DAYS OUT</span>
                                    </div>
                                  </td>
                                  {["0-15", "15-30", "30-40", ">40"].map((invBucket, idx) => {
                                    const rule = pricingTable?.table?.[`${timeBucket},${invBucket}`];
                                    const discount = rule ? rule[0] : 0;
                                    const extent = rule ? rule[1] : 0;
                                    
                                    return (
                                      <td key={invBucket} className={`py-6 px-8 text-center ${idx % 2 === 0 ? 'bg-white/[0.005]' : ''}`}>
                                        {discount > 0 ? (
                                          <div className="flex flex-col items-center gap-2">
                                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-sm shadow-emerald-500/10">
                                              -{discount}%
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                                                LT: {extent}%
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col items-center gap-1">
                                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-xs font-medium">
                                              Base Rate
                                            </div>
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

                        <div className="grid md:grid-cols-2 bg-gradient-to-b from-white/[0.01] to-transparent border-t border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
                          <div className="p-8 space-y-4">
                            <h4 className="font-semibold text-white flex items-center gap-2">
                              <Info className="h-4 w-4 text-primary-light" />
                              Strategy Overview
                            </h4>
                            <div className="space-y-4">
                              {[
                                "Early bird incentives prioritize long-term occupancy stability.",
                                "Dynamic floors adjust automatically to competitive signals.",
                                "Inventory fencing prevents dilution during peak cycles."
                              ].map((text, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                  <div className="mt-1.5 h-1 w-1 rounded-full bg-primary-light group-hover:scale-150 transition-transform" />
                                  <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-8 space-y-4">
                            <h4 className="font-semibold text-white flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-400" />
                              Dynamic Components
                            </h4>
                            <div className="space-y-3">
                              {[
                                { label: "Weekend Factor", value: "+12%", type: "premium" },
                                { label: "Cultural Event", value: "+45%", type: "premium" },
                                { label: "Group Attrition", value: "-5%", type: "adjust" }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                                  <span className="text-sm text-slate-300">{item.label}</span>
                                  <span className={`text-sm font-bold ${item.type === 'premium' ? 'text-rose-400' : 'text-emerald-400'}`}>{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Dynamic Rate Tiers */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <Tags className="h-5 w-5 text-primary-light" />
                  <h3 className="text-xl font-bold tracking-tight">Personalized Rate Tiers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Non-Refundable", discount: "12% OFF", desc: "Highest revenue security", color: "from-rose-500/20", text: "text-rose-400" },
                    { title: "Standard", discount: "7% OFF", desc: "Optimized conversion", color: "from-orange-500/20", text: "text-orange-400" },
                    { title: "Semi-Flex", discount: "4% OFF", desc: "Balanced availability", color: "from-blue-500/20", text: "text-blue-400" },
                    { title: "Flexible", discount: "BASE", desc: "Maximum profitability", color: "from-indigo-500/20", text: "text-indigo-400" }
                  ].map((tier, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gradient-to-br ${tier.color} to-white/[0.02] backdrop-blur-glass border border-white/10 rounded-card p-6 space-y-4`}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">{tier.title}</h4>
                      <div className={`text-3xl font-extrabold tracking-tight ${tier.text}`}>{tier.discount}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-white/40" />
                          <span className="text-[10px] text-slate-400">Inventory limit matched</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-white/40" />
                          <span className="text-[10px] text-slate-400">Dynamic fencing active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Demand Intelligence Sidebar */}
            <motion.div variants={itemVariants} className="xl:col-span-4 gap-8 flex flex-col">
              <Card id="card-demand-intelligence" className="bg-[#0F172A]/80 backdrop-blur-xl border-white/10 rounded-card sticky top-24 shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-indigo-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold">Demand Intelligence</CardTitle>
                    </div>
                    <Select
                      value={selectedDestination}
                      onValueChange={setSelectedDestination}
                    >
                      <SelectTrigger id="select-destination" className="w-full bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary/20">
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F172A] border-white/10 text-white">
                        <SelectItem value="AWASH">Kuriftu Resort Awash</SelectItem>
                        <SelectItem value="ENTOTO">Kuriftu Resort Entoto</SelectItem>
                        <SelectItem value="TANA">Kuriftu Resort Lake Tana</SelectItem>
                        <SelectItem value="BISHOFTU">Kuriftu Resort Bishoftu</SelectItem>
                        <SelectItem value="AFRICAN_VILLAGE">African Village</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6 py-4 bg-white/[0.02] flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <span>Forecast Period</span>
                    <span>Demand Level</span>
                  </div>
                  
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6 space-y-6"
                        >
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-12 w-12 rounded-xl" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                          ))}
                        </motion.div>
                      ) : forecastError ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-12 text-center space-y-4"
                        >
                          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                            <Info className="h-6 w-6 text-rose-500" />
                          </div>
                          <p className="text-slate-500 text-xs font-mono">{forecastError}</p>
                          <Button 
                            variant="link" 
                            onClick={fetchForecast}
                            className="text-primary-light h-auto p-0 font-bold text-xs"
                          >
                            RETRY SIGNAL
                          </Button>
                        </motion.div>
                      ) : forecast.length === 0 ? (
                        <div className="p-16 text-center space-y-4">
                           <div className="h-12 w-12 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto">
                            <CalendarDays className="h-6 w-6 text-slate-500" />
                          </div>
                          <p className="text-slate-500 text-sm italic">No market signals received for the chosen destination.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {forecast.slice(0, 14).map((day, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-5 hover:bg-white/[0.03] transition-all group cursor-default"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/30 transition-colors">
                                    <span className="text-xs font-bold font-mono text-white leading-none">{day.date?.substring(8, 10)}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">{day.day_of_week?.substring(0, 3)}</span>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      {day.demand_multiplier >= 1.1 ? (
                                        <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
                                      ) : day.demand_multiplier <= 0.9 ? (
                                        <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                                      ) : (
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                                      )}
                                      <span className="text-sm font-bold text-white font-mono">
                                        {(day.demand_multiplier * 100).toFixed(0)}% <span className="text-[10px] text-slate-500 font-normal ml-0.5 tracking-tight font-sans">LOAD</span>
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors italic">
                                      {day.recommended_strategy}
                                    </p>
                                  </div>
                                </div>

                                <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border ${getDemandColor(day.demand_level)} transition-all group-hover:scale-105`}>
                                  {day.demand_level}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {!loading && forecast.length > 0 && (
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                        Next {forecast.length > 14 ? 14 : forecast.length} Days Yield Projection
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Suggestion Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-primary/10 border border-primary/20 rounded-card p-6 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="h-32 w-32 text-primary" />
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary-light" />
                  </div>
                  <h4 className="font-bold text-white">AI Recommendation</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Detected low occupancy for next week. Recommend activating the <span className="text-primary-light font-bold">"Early Week Flash Sale"</span> to capture business travelers.
                  </p>
                  <Button 
                    id="btn-deploy-ai-strategy"
                    variant="link" 
                    className="p-0 text-primary-light h-auto font-bold flex items-center gap-1.5 hover:no-underline hover:text-white transition-colors"
                  >
                    Deploy Strategy <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Styles for the custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}