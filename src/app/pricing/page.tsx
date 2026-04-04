"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Info
} from "lucide-react";

function PricingPageContent() {
  const [pricingTable, setPricingTable] = useState<any>(null);
  const [demandForecast, setDemandForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tableRes, forecastRes] = await Promise.all([
          fetch(`${API_BASE}/api/pricing/pricing-table`),
          fetch(`${API_BASE}/api/pricing/demand-forecast/AWASH?days_ahead=30`)
        ]);

        if (tableRes.ok) {
          setPricingTable(await tableRes.json());
        }
        if (forecastRes.ok) {
          setDemandForecast(await forecastRes.json());
        }
      } catch (err) {
        console.error("Failed to fetch pricing data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="h-10 w-10 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold text-white tracking-tight">Pricing & Inventory</h1>
        </div>
        <p className="text-lg text-slate-400">
          Dynamic revenue management system based on airline yield optimization
        </p>
        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full px-4 py-1.5">
          +25% Revenue Increase vs Static Pricing
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Time Buckets</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <Clock className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Inventory Levels</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <Users className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white border-0 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Pricing Rules</p>
                <p className="text-3xl font-bold">16</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white border-0 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-100">Max Discount</p>
                <p className="text-3xl font-bold">10%</p>
              </div>
              <DollarSign className="h-10 w-10 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Matrix */}
      {pricingTable && (
        <Card className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Dynamic Pricing Matrix (4×4 Rules)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400">Time Until Arrival</th>
                    <th className="text-center p-3 text-gray-400">0-15% Occupancy</th>
                    <th className="text-center p-3 text-gray-400">15-30% Occupancy</th>
                    <th className="text-center p-3 text-gray-400">30-40% Occupancy</th>
                    <th className="text-center p-3 text-gray-400">&gt;40% Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50">
                    <td className="p-3 text-white font-semibold">&gt;1 Month</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-green-600">10% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">up to 15% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-600">5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">15-30% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-gray-600">No Discount</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-gray-600">No Discount</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="p-3 text-white font-semibold">1 Month - 2 Weeks</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-green-600">10% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">up to 20% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-600">5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">15-30% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-yellow-600">2.5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">40-60% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-gray-600">No Discount</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="p-3 text-white font-semibold">2 Weeks - 1 Week</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-green-600">10% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">up to 25% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-600">5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">20-40% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-yellow-600">2.5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">50-75% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-gray-600">No Discount</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-semibold">&lt;1 Week</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-600">5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">up to 50% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-yellow-600">2.5% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">50-75% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-orange-600">1.25% OFF</Badge>
                      <p className="text-xs text-gray-400 mt-1">75-80% inv</p>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-red-600">PREMIUM</Badge>
                      <p className="text-xs text-gray-400 mt-1">Full price</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Inventory Fencing
                </h4>
                <p className="text-xs text-slate-400">
                  Only a limited percentage of rooms get each discount level. This prevents revenue dilution 
                  and ensures high-value bookings pay premium rates.
                </p>
              </div>
              <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Enhancement
                </h4>
                <p className="text-xs text-slate-400">
                  AI predicts demand for Ethiopian holidays (Meskel, Timkat) and seasons, 
                  adjusting discounts beyond the static table for optimal revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fare Classes */}
      <Card className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-6 w-6" />
            Fare Classes (Like Airlines)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
              <Badge className="bg-green-600 mb-3 rounded-full">SAVER</Badge>
              <p className="text-sm text-white font-semibold mb-2">Up to 10% OFF</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✗ Non-refundable</li>
                <li>✗ Non-changeable</li>
                <li>✓ Prepayment required</li>
                <li>✓ Best value</li>
              </ul>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
              <Badge className="bg-blue-600 mb-3 rounded-full">STANDARD</Badge>
              <p className="text-sm text-white font-semibold mb-2">5% OFF</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✗ Non-refundable</li>
                <li>✓ Changeable (fee)</li>
                <li>✓ Prepayment required</li>
                <li>✓ Good value</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
              <Badge className="bg-purple-600 mb-3 rounded-full">FLEX</Badge>
              <p className="text-sm text-white font-semibold mb-2">2.5% OFF</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✓ Refundable</li>
                <li>✓ Changeable</li>
                <li>✓ Flexible payment</li>
                <li>✓ Free cancellation</li>
              </ul>
            </div>

            <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4">
              <Badge className="bg-amber-600 mb-3 rounded-full">PREMIUM</Badge>
              <p className="text-sm text-white font-semibold mb-2">Full Price</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✓ Fully refundable</li>
                <li>✓ Free changes</li>
                <li>✓ No restrictions</li>
                <li>✓ Maximum flexibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Demand Forecast */}
      {demandForecast && demandForecast.forecast && (
        <Card className="bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              30-Day AI Demand Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {demandForecast.forecast.slice(0, 28).map((day: any, idx: number) => {
                const demandLevel = day.demand_multiplier >= 1.2 ? 'high' : 
                                   day.demand_multiplier >= 0.9 ? 'normal' : 'low';
                const bgColor = demandLevel === 'high' ? 'bg-red-600' :
                               demandLevel === 'normal' ? 'bg-blue-600' : 'bg-green-600';
                
                return (
                  <div
                    key={idx}
                    className={`${bgColor} rounded-lg p-3 text-center text-white`}
                    title={`${day.date} - ${day.demand_level}`}
                  >
                    <p className="text-xs font-semibold">
                      {new Date(day.date).getDate()}
                    </p>
                    <p className="text-[10px] opacity-80">
                      {day.day_of_week.slice(0, 3)}
                    </p>
                    <p className="text-xs font-bold mt-1">
                      {day.demand_multiplier}x
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-gray-400">Low Demand (Discount)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-400">Normal Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-gray-400">High Demand (Premium)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Premiums */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Calendar className="h-12 w-12 text-orange-400" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Weekend Premium</h3>
                <p className="text-gray-300 mb-3">
                  Friday, Saturday, Sunday check-ins automatically receive +8% premium pricing
                </p>
                <Badge className="bg-orange-600">+8% Premium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-12 w-12 text-red-400" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Holiday Premium</h3>
                <p className="text-gray-300 mb-3">
                  Ethiopian holidays (Meskel, Timkat, New Year) receive +15% premium with no discounts
                </p>
                <Badge className="bg-red-600">+15% Premium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <ProtectedRoute>
      <PricingPageContent />
    </ProtectedRoute>
  );
}
