"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Sparkles, Star } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface EthiopianEvent {
  name: string;
  date_start: string;
  date_end: string;
  event_type: string;
  impact_level: number;
  demand_multiplier: number;
  description: string;
  pricing_impact?: {
    base_rate: number;
    event_rate: number;
    increase_pct: number;
  };
}

export default function EventPricingCalendar() {
  const [events, setEvents] = useState<EthiopianEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventPricing();
    const interval = setInterval(fetchEventPricing, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchEventPricing = async () => {
    try {
      // Get upcoming Ethiopian events with pricing impact
      const res = await fetch(`${API_BASE}/api/dashboard/ethiopian-events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch event pricing:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level: number) => {
    if (level >= 5) return "bg-red-500";
    if (level >= 4) return "bg-orange-500";
    if (level >= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "festival":
        return "🎉";
      case "holiday":
        return "🎊";
      case "sport":
        return "🏃";
      case "cultural":
        return "🎭";
      default:
        return "📅";
    }
  };

  if (loading) {
    <Card className="glass-card shadow-[0_0_50px_-15px_rgba(245,158,11,0.15)] border-primary/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-black/60 to-primary/5 border-b border-white/5 text-white">
        <CardTitle className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="gold-gradient-text tracking-tight">Ethiopian Events & AI Pricing Impact</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  }

  return (
    <Card className="glass-card shadow-[0_0_50px_-15px_rgba(245,158,11,0.15)] border-primary/20 overflow-hidden mt-8">
      <CardHeader className="bg-gradient-to-b from-black/60 to-transparent border-b border-primary/10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[100px] bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <CardTitle className="flex items-center gap-3 text-3xl font-extrabold pb-1">
              <Calendar className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span className="gold-gradient-text">Ethiopian Events & AI Pricing Impact</span>
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1 ml-11">
              AI automatically detects and adjusts rates based on local calendar events
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-5 py-3 border border-primary/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Live AI Engine</p>
                <p className="text-sm font-extrabold tracking-tight">Actively Optimizing</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 bg-black/10">
        {/* Explanation Banner */}
        <div className="mb-8 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-accent/20 rounded-xl p-3 border border-accent/30 shadow-[0_0_15px_-5px_rgba(14,165,233,0.5)]">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-2 text-lg tracking-wide">How AI Event Pricing Works</h4>
              <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                The AI pricing engine <span className="font-bold text-accent">automatically detects</span> Ethiopian 
                holidays and festivals, then <span className="font-bold text-accent">increases room rates in real-time</span> based 
                on historical demand patterns. When guests search during these precise dates, they see fully optimized pricing.
              </p>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-20 w-20 mx-auto mb-6 text-slate-600 opacity-50" />
            <p className="text-2xl font-bold text-white tracking-tight">No major events in the next 90 days</p>
            <p className="text-base text-slate-400 mt-2">AI will maintain standard algorithmic pricing optimization</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="bg-black/30 border border-white/10 rounded-2xl p-6 hover:border-primary/40 hover:bg-black/50 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)] transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointers-events-none" />
                <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{getEventIcon(event.event_type)}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-xl flex items-center gap-2 flex-wrap tracking-wide">
                        {event.name}
                        {event.impact_level >= 5 && (
                          <Star className="h-5 w-5 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,1)]" />
                        )}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">
                        {new Date(event.date_start).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {event.date_start !== event.date_end && (
                          <> - {new Date(event.date_end).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge
                      className={`${getImpactColor(event.impact_level)} text-white border-0 font-bold px-3 py-1 shadow-lg`}
                    >
                      Impact Level {event.impact_level}
                    </Badge>
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5">
                      {event.event_type}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {event.description}
                </p>

                {/* AI Pricing Impact */}
                <div className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/10 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[30px] rounded-full pointers-events-none" />
                  
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="bg-emerald-500/20 text-emerald-400 rounded-lg p-2 border border-emerald-500/40">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold text-white tracking-wide text-lg">AI Scenario Projection</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 relative z-10">
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Base Rate</p>
                      <p className="text-lg font-semibold text-slate-300 line-through">
                        ETB {event.pricing_impact?.base_rate.toLocaleString() || "5,000"}
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Event Rate</p>
                      <p className="text-lg font-extrabold text-white">
                        ETB {event.pricing_impact?.event_rate.toLocaleString() || 
                          Math.round((event.pricing_impact?.base_rate || 5000) * event.demand_multiplier).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 flex flex-col justify-center">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Increase</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                        <p className="text-xl font-black text-emerald-400">
                          +{Math.round((event.demand_multiplier - 1) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 relative z-10 flex gap-3 items-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      AI activates <span className="font-bold text-emerald-400">{event.demand_multiplier}x</span> multiplier. 
                    </p>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
