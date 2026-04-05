"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  Plane,
  DollarSign,
  Clock,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SimulatePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scenarios = [
    {
      id: "early-bird",
      name: "Early Bird Booker",
      description: "Booking 45 days in advance, low occupancy",
      icon: <Clock className="h-6 w-6" />,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20",
      params: {
        destination_code: "AWASH",
        room_type: "DELUXE",
        check_in: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adults: 2,
        occupancy: 12,
      },
      expected: {
        discount: 10,
        fareClass: "SAVER",
        reason: "Early booking + Low occupancy = Maximum discount triggered by AI yield matrix."
      }
    },
    {
      id: "last-minute",
      name: "Last-Minute Booker",
      description: "Booking 3 days ahead, high occupancy",
      icon: <Zap className="h-6 w-6" />,
      color: "from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/20",
      params: {
        destination_code: "AWASH",
        room_type: "DELUXE",
        check_in: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adults: 2,
        occupancy: 85,
      },
      expected: {
        discount: 0,
        fareClass: "PREMIUM",
        reason: "Last-minute + High occupancy = Full price to protect core inventory value."
      }
    },
    {
      id: "weekend",
      name: "Weekend Getaway",
      description: "Friday check-in, moderate occupancy",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20",
      params: {
        destination_code: "BISHOFTU",
        room_type: "STANDARD",
        check_in: getNextFriday(),
        adults: 2,
        occupancy: 25,
      },
      expected: {
        discount: 2.5,
        fareClass: "FLEX",
        premium: "+8% weekend premium",
        reason: "Weekend booking detection adds premium while allowing slight discounts for low volume."
      }
    },
    {
      id: "holiday",
      name: "Peak Demand (Meskel)",
      description: "September 11, high market demand",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/20",
      params: {
        destination_code: "TANA",
        room_type: "SUITE",
        check_in: "2026-09-11",
        adults: 4,
        occupancy: 45,
      },
      expected: {
        discount: 0,
        fareClass: "PREMIUM",
        premium: "+15% holiday premium",
        reason: "Ethiopian holiday calendar integration triggers demand multipliers automatically."
      }
    },
    {
      id: "rainy-season",
      name: "Off-Season Deal",
      description: "April booking, low demand signal",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20",
      params: {
        destination_code: "ENTOTO",
        room_type: "DELUXE",
        check_in: "2026-04-20",
        adults: 2,
        occupancy: 18,
      },
      expected: {
        discount: 13,
        fareClass: "SAVER",
        reason: "Low season + AI stimulation factor = Enhanced discount to drive occupancy."
      }
    },
    {
      id: "business",
      name: "Business Traveler",
      description: "Mid-week, short notice cluster",
      icon: <ShieldCheck className="h-6 w-6" />,
      color: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/20",
      params: {
        destination_code: "AFRICAN_VILLAGE",
        room_type: "STANDARD",
        check_in: getNextTuesday(),
        adults: 1,
        occupancy: 55,
      },
      expected: {
        discount: 0,
        fareClass: "PREMIUM",
        reason: "Business traveler clustering logic ensures higher price points for high-intent visitors."
      }
    },
  ];

  const runSimulation = async (scenario: any) => {
    setSelectedScenario(scenario.id);
    setIsSimulating(true);
    setResults(null);

    try {
      const res = await fetch(`${API_BASE}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scenario.params,
          use_ai: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Premium animation delay
        setTimeout(() => {
          setResults({
            scenario: scenario,
            pricing: data.pricing,
            destination: data.destination,
            room_type: data.room_type,
          });
          setIsSimulating(false);
          // Auto-scroll to results
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }, 2000);
      }
    } catch (err) {
      console.error("Simulation failed:", err);
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-2">
          <Plane className="h-3 w-3" />
          Revenue Simulator Engine
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
          AI <span className="gold-gradient-text">Pricing Simulator</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Witness airline-style dynamic pricing in action. Select a lifestyle scenario 
          to see how our neural models adjust fares based on real-time market signals.
        </p>
      </motion.div>

      {/* Scenarios Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card
              className={cn(
                "glass-card h-full cursor-pointer group transition-all duration-500 overflow-hidden",
                selectedScenario === scenario.id ? "border-primary/50 ring-1 ring-primary/20" : "border-white/5"
              )}
              onClick={() => runSimulation(scenario)}
            >
              <div className={cn(
                "p-6 bg-gradient-to-br border-b border-white/5",
                scenario.color
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    {scenario.icon}
                  </div>
                  {selectedScenario === scenario.id && (
                    <Badge className="bg-primary text-slate-950 font-bold animate-pulse">ACTIVE</Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{scenario.name}</h3>
                <p className="text-sm text-white/60 line-clamp-2">{scenario.description}</p>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Expectation</p>
                    <p className="text-sm font-semibold text-white">-{scenario.expected.discount}% Fares</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Fare Tier</p>
                    <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                      {scenario.expected.fareClass}
                    </Badge>
                  </div>
                </div>

                <Button
                  className={cn(
                    "w-full rounded-xl transition-all duration-300 h-11",
                    selectedScenario === scenario.id 
                      ? "bg-primary text-slate-950 hover:bg-primary/90" 
                      : "bg-white/5 hover:bg-white/10 text-white"
                  )}
                  disabled={isSimulating && selectedScenario === scenario.id}
                >
                  {isSimulating && selectedScenario === scenario.id ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Neural Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Run Simulation
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress & Results */}
      <AnimatePresence mode="wait">
        {isSimulating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Card className="glass-panel p-20 text-center border-primary/20">
              <div className="relative mb-8 inline-block">
                <div className="h-32 w-32 rounded-full border-t-2 border-primary animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Neural Logic Mapping...</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Analyzing historical demand curves, competitor signals, and 
                inventory velocity to calculate the optimal yield point.
              </p>
              <div className="mt-8 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        ) : results ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Result Banner */}
            <Card className="overflow-hidden glass-panel border-emerald-500/20">
              <div className="bg-gradient-to-r from-emerald-600/20 via-primary/10 to-transparent p-8 md:p-12 border-b border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                      <ShieldCheck className="h-3 w-3" />
                      Simulation Finalized
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      Optimal <span className="text-emerald-400">Target Rate</span>
                    </h2>
                    <p className="text-xl text-slate-400">
                      {results.scenario.name} at {results.destination} — <span className="text-primary">{results.room_type}</span>
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center min-w-[280px]">
                    <p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Live Yield Calculation</p>
                    <p className="text-6xl font-black text-white glow-primary tracking-tighter">
                      <span className="text-2xl text-emerald-500 font-bold mr-2 uppercase">etb</span>
                      {results.pricing.optimized_rate.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Inclusive of all AI factors</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Breakdown */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      Price Engineering
                    </h4>
                    
                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Base Inventory Rate</span>
                        <span className={cn(
                          "font-mono font-bold",
                          results.pricing.discount_applied_pct > 0 ? "line-through text-slate-600" : "text-white"
                        )}>
                          ETB {results.pricing.base_rate.toLocaleString()}
                        </span>
                      </div>

                      {results.pricing.discount_applied_pct > 0 && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                          <div>
                            <p className="text-emerald-400 font-bold text-lg leading-tight">-{results.pricing.discount_applied_pct}% Yield Strategy</p>
                            <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest">Stimulus Applied</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-white">
                              <span className="text-xs mr-1">ETB</span>
                              {results.pricing.savings_etb.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-500">SAVINGS</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Optimized Outcome</p>
                          <p className="text-3xl font-black text-white tracking-tighter">ETB {results.pricing.optimized_rate.toLocaleString()}</p>
                        </div>
                        <Badge className="bg-primary text-slate-950 font-black h-8 px-4 rounded-lg">
                          {results.pricing.fare_class}
                        </Badge>
                      </div>
                    </div>

                    {/* Restrictions Chips */}
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(results.pricing.restrictions || {}).map(([key, val]: any) => {
                         if (typeof val === 'boolean') {
                           return (
                             <Badge key={key} variant="outline" className={cn(
                               "text-[10px] uppercase font-black border-transparent",
                               val ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                             )}>
                               {val ? '✓' : '✗'} {key.replace('_', ' ')}
                             </Badge>
                           );
                         }
                         return null;
                       })}
                    </div>
                  </div>

                  {/* Right Column: AI Insights */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Neural Insights
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Demand Signal", value: results.pricing.pricing_factors.time_bucket, icon: <Clock className="w-4 h-4" />, color: "text-blue-400" },
                        { label: "Adv. Booking", value: `${results.pricing.pricing_factors.days_until_arrival} Days`, icon: <Calendar className="w-4 h-4" />, color: "text-emerald-400" },
                        { label: "Occupancy Cap", value: `${results.pricing.pricing_factors.current_occupancy_pct}%`, icon: <Users className="w-4 h-4" />, color: "text-amber-400" },
                        { label: "Inventory Cluster", value: results.pricing.pricing_factors.inventory_bucket, icon: <TrendingUp className="w-4 h-4" />, color: "text-purple-400" },
                      ].map((factor, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-2">
                          <div className={cn("flex items-center gap-2", factor.color)}>
                            {factor.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{factor.label}</span>
                          </div>
                          <p className="text-lg font-bold text-white">{factor.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Multipliers */}
                    <div className="space-y-2">
                      {results.pricing.pricing_factors.weekend_premium > 1 && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                          <span className="text-orange-300 font-bold uppercase tracking-widest">Weekend Peak Factor</span>
                          <span className="text-white font-black">+{((results.pricing.pricing_factors.weekend_premium - 1) * 100).toFixed(0)}%</span>
                        </div>
                      )}
                      {results.pricing.pricing_factors.holiday_premium > 1 && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                          <span className="text-rose-300 font-bold uppercase tracking-widest">Holiday Demand Factor</span>
                          <span className="text-white font-black">+{((results.pricing.pricing_factors.holiday_premium - 1) * 100).toFixed(0)}%</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-bold">
                        <span className="uppercase tracking-widest">AI Multiplier Signal</span>
                        <span className="font-black">{results.pricing.pricing_factors.demand_multiplier}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Reasoning Footer */}
              <div className="bg-white/5 p-6 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Neural Rationale</h5>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
                      {results.scenario.expected.reason}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 grayscale opacity-20"
          >
            <Zap className="h-20 w-20 text-slate-400 mb-4" />
            <p className="text-xl font-bold uppercase tracking-[0.3em] text-slate-400">Awaiting Signal Selection</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getNextFriday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date(today.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
  return nextFriday.toISOString().split('T')[0];
}

function getNextTuesday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7;
  const nextTuesday = new Date(today.getTime() + daysUntilTuesday * 24 * 60 * 60 * 1000);
  return nextTuesday.toISOString().split('T')[0];
}
