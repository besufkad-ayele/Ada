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
    return (
      <Card className="shadow-lg border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ethiopian Events & AI Pricing Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6" />
              Ethiopian Events & AI Pricing Impact
            </CardTitle>
            <p className="text-amber-50 text-sm mt-2">
              AI automatically adjusts room rates based on Ethiopian calendar events
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border-2 border-white/30">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide">Live AI Engine</p>
                <p className="text-sm font-bold">Actively Optimizing</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-b from-white to-amber-50/30">
        {/* Explanation Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 rounded-full p-2 mt-1">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">How AI Pricing Works</h4>
              <p className="text-sm text-gray-800 leading-relaxed">
                The AI pricing engine <span className="font-bold text-blue-700">automatically detects</span> Ethiopian 
                holidays and festivals, then <span className="font-bold text-blue-700">increases room rates in real-time</span> based 
                on expected demand. When you book during these events, you'll see the adjusted prices. The system also 
                closes discount fare classes and shifts inventory to maximize revenue during peak periods.
              </p>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No major events in the next 90 days</p>
            <p className="text-sm text-gray-500 mt-2">AI will maintain standard pricing optimization</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-xl transition-all bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-4xl">{getEventIcon(event.event_type)}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 flex-wrap">
                        {event.name}
                        {event.impact_level >= 5 && (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-700 font-medium mt-1">
                        {new Date(event.date_start).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {event.date_start !== event.date_end && (
                          <> - {new Date(event.date_end).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-2">
                    <Badge
                      className={`${getImpactColor(event.impact_level)} text-white border-0 font-bold whitespace-nowrap`}
                    >
                      Level {event.impact_level}/5
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300 font-semibold whitespace-nowrap">
                      {event.event_type}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-800 mb-4 leading-relaxed">
                  {event.description}
                </p>

                {/* AI Pricing Impact */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-green-500 rounded-full p-1.5">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">AI Price Adjustment</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-700 font-semibold mb-1">Base Rate</p>
                      <p className="text-base font-bold text-gray-900">
                        ETB {event.pricing_impact?.base_rate.toLocaleString() || "5,000"}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-300">
                      <p className="text-xs text-gray-700 font-semibold mb-1">Event Rate</p>
                      <p className="text-base font-bold text-green-700">
                        ETB {event.pricing_impact?.event_rate.toLocaleString() || 
                          Math.round((event.pricing_impact?.base_rate || 5000) * event.demand_multiplier).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-300">
                      <p className="text-xs text-gray-700 font-semibold mb-1">Increase</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-base font-bold text-green-700">
                          +{Math.round((event.demand_multiplier - 1) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-green-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                      <span className="font-bold text-green-700">✓ Active Strategy:</span> AI applies {event.demand_multiplier}x 
                      multiplier. Closes Saver class, shifts to Standard/Premium for max revenue.
                    </p>
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
