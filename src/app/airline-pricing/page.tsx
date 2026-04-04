"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Info
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ResortRevenuePage() {
  const router = useRouter();
  const [pricingTable, setPricingTable] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("AWASH");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingTable();
    fetchForecast();
  }, [selectedDestination]);

  const fetchPricingTable = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pricing/pricing-table`);
      if (res.ok) {
        const data = await res.json();
        setPricingTable(data);
      }
    } catch (err) {
      console.error("Failed to fetch pricing table:", err);
    }
  };

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/pricing/demand-forecast/${selectedDestination}?days_ahead=30`
      );
      if (res.ok) {
        const data = await res.json();
        setForecast(data.forecast || []);
      }
    } catch (err) {
      console.error("Failed to fetch forecast:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDemandColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "very high":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "very low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-slate-700" />
              Dynamic Revenue Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Automated smart pricing based on booking windows, occupancy rates, and demand forecasts.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="bg-white">
            Back to Dashboard
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-16 w-16 text-emerald-600" />
            </div>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Revenue Uplift</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">+25%</p>
                <p className="text-xs font-medium text-emerald-600">vs static pricing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Active Rules</p>
                <p className="text-3xl font-bold text-slate-900">16</p>
                <p className="text-xs text-slate-400 mt-1">Time × Occupancy matrix</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Rate Tiers</p>
                <p className="text-3xl font-bold text-slate-900">4</p>
                <p className="text-xs text-slate-400 mt-1">Non-Ref to Premium</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Tags className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Automation</p>
                <p className="text-3xl font-bold text-slate-900">80%</p>
                <p className="text-xs text-slate-400 mt-1">AI-driven decisions</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Pricing Matrix */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-lg font-semibold text-slate-900">Occupancy-Based Discount Matrix</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {pricingTable ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                          <th className="p-4 text-left font-semibold">Booking Window</th>
                          <th className="p-4 text-center font-semibold">0-15% Full</th>
                          <th className="p-4 text-center font-semibold">15-30% Full</th>
                          <th className="p-4 text-center font-semibold">30-40% Full</th>
                          <th className="p-4 text-center font-semibold">&gt;40% Full</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[">30", "30-14", "14-7", "<7"].map((timeBucket) => (
                          <tr key={timeBucket} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-medium text-slate-900">
                              {pricingTable.time_buckets?.[timeBucket] || timeBucket}
                            </td>
                            {["0-15", "15-30", "30-40", ">40"].map((invBucket) => {
                              const rule = pricingTable.table?.[`${timeBucket},${invBucket}`];
                              const discount = rule ? rule[0] : 0;
                              const extent = rule ? rule[1] : 0;
                              
                              return (
                                <td key={invBucket} className="p-4 text-center">
                                  {discount > 0 ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                        {discount}% OFF
                                      </Badge>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                        Max {extent}% Rooms
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md">
                                      Base Rate
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">Loading matrix...</div>
                )}
                
                {/* Matrix Explanations */}
                <div className="grid md:grid-cols-2 gap-0 border-t border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/50">
                  <div className="p-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" /> Standard Rules
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span> 
                        Early bookings are incentivized with up to 10% discounts.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span> 
                        Discounts automatically retract as occupancy increases.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span> 
                        Last-minute reservations default to premium/base rates.
                      </li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" /> Dynamic Adjustments
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span> 
                        Weekend multiplier: <span className="font-medium text-slate-900">+8% premium</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span> 
                        Holiday periods: <span className="font-medium text-slate-900">+15% premium</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span> 
                        AI High Demand: Auto-reduces discounts by 5%
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Rate Tiers Explanation */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Tags className="h-5 w-5 text-slate-500" />
                  Dynamic Rate Tiers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Tier 1 */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-rose-50 px-4 py-3 border-b border-rose-100">
                      <h4 className="font-semibold text-rose-900 text-sm">NON-REFUNDABLE</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-2xl font-bold text-rose-700 mb-3">10% OFF</p>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-center gap-1.5"><span className="text-rose-500">✗</span> No refunds</li>
                        <li className="flex items-center gap-1.5"><span className="text-rose-500">✗</span> No date changes</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Full prepay required</li>
                        <li className="flex items-center gap-1.5 font-medium text-slate-900">Highest value</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                      <h4 className="font-semibold text-orange-900 text-sm">STANDARD</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-2xl font-bold text-orange-700 mb-3">5% OFF</p>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-center gap-1.5"><span className="text-rose-500">✗</span> Non-refundable</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Date changes allowed</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> ETB 500 fee</li>
                        <li className="flex items-center gap-1.5 font-medium text-slate-900">Balanced option</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                      <h4 className="font-semibold text-blue-900 text-sm">FLEXIBLE</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-2xl font-bold text-blue-700 mb-3">2.5% OFF</p>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Refundable</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Free date changes</li>
                        <li className="flex items-center gap-1.5"><span className="text-rose-500">✗</span> 25% cancel fee</li>
                        <li className="flex items-center gap-1.5 font-medium text-slate-900">High flexibility</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tier 4 */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                      <h4 className="font-semibold text-indigo-900 text-sm">PREMIUM</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-2xl font-bold text-indigo-700 mb-3">BASE RATE</p>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Fully refundable</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Free changes</li>
                        <li className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Zero restrictions</li>
                        <li className="flex items-center gap-1.5 font-medium text-slate-900">Max flexibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="xl:col-span-1">
            <Card className="border-slate-200 shadow-sm bg-white sticky top-8">
              <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <CardTitle className="text-lg font-semibold text-slate-900">Demand Forecast</CardTitle>
                  </div>
                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                  >
                    <SelectTrigger className="w-full bg-white border-slate-200">
                      <SelectValue placeholder="Select Resort" />
                    </SelectTrigger>
                    <SelectContent>
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
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-sm text-slate-500">Analyzing demand signals...</p>
                  </div>
                ) : forecast.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No forecast data available for this location.</div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {forecast.slice(0, 14).map((day, idx) => (
                      <div
                        key={idx}
                        className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 text-center">
                            <p className="text-xs font-bold text-slate-900">{day.date?.substring(8, 10)} {day.date?.substring(5, 7)}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{day.day_of_week?.substring(0, 3)}</p>
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              {day.demand_multiplier >= 1.1 ? (
                                <TrendingUp className="h-4 w-4 text-rose-500" />
                              ) : day.demand_multiplier <= 0.9 ? (
                                <TrendingDown className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                              )}
                              <span className="font-semibold text-sm text-slate-900">
                                {day.demand_multiplier}x
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                              {day.recommended_strategy}
                            </p>
                          </div>
                        </div>

                        <Badge className={`text-[10px] px-2 py-0.5 border ${getDemandColor(day.demand_level)}`}>
                          {day.demand_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                {forecast.length > 0 && !loading && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">Showing next 14 days forecast</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}