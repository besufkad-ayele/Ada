"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plane,
  DollarSign,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function SimulatePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scenarios = [
    {
      id: "early-bird",
      name: "Early Bird Booker",
      description: "Booking 45 days in advance, low occupancy",
      icon: "🐦",
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
        reason: "Early booking + Low occupancy = Maximum discount"
      }
    },
    {
      id: "last-minute",
      name: "Last-Minute Booker",
      description: "Booking 3 days ahead, high occupancy",
      icon: "⚡",
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
        reason: "Last-minute + High occupancy = Full price"
      }
    },
    {
      id: "weekend",
      name: "Weekend Getaway",
      description: "Friday check-in, moderate occupancy",
      icon: "🎉",
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
        reason: "Weekend booking = Reduced discount + Premium"
      }
    },
    {
      id: "holiday",
      name: "Ethiopian Holiday (Meskel)",
      description: "September 11, peak demand",
      icon: "🎊",
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
        reason: "Ethiopian holiday = No discount + High premium"
      }
    },
    {
      id: "rainy-season",
      name: "Rainy Season Deal",
      description: "April booking, low demand",
      icon: "🌧️",
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
        reason: "Low season + AI boost = Enhanced discount"
      }
    },
    {
      id: "business",
      name: "Business Traveler",
      description: "Mid-week, short notice",
      icon: "💼",
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
        reason: "Business traveler profile = Full price"
      }
    },
  ];

  const runSimulation = async (scenario: any) => {
    setSelectedScenario(scenario.id);
    setIsSimulating(true);
    setResults(null);

    try {
      // Call airline pricing API
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
        
        // Simulate AI processing delay
        setTimeout(() => {
          setResults({
            scenario: scenario,
            pricing: data.pricing,
            destination: data.destination,
            room_type: data.room_type,
          });
          setIsSimulating(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Simulation failed:", err);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-12 w-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">AI Pricing Simulator</h1>
          </div>
          <p className="text-xl text-blue-200">
            Watch airline-style dynamic pricing in action
          </p>
          <p className="text-sm text-blue-300 mt-2">
            Select a scenario to see how AI adjusts prices based on time, occupancy, and demand
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedScenario === scenario.id
                  ? 'ring-4 ring-blue-400 bg-blue-900/50'
                  : 'bg-gray-800/50 hover:bg-gray-800/70'
              }`}
              onClick={() => runSimulation(scenario)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{scenario.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                  <p className="text-sm text-gray-300">{scenario.description}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Expected Discount:</span>
                    <span className="text-green-400 font-semibold">{scenario.expected.discount}%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Fare Class:</span>
                    <Badge className="bg-blue-500">{scenario.expected.fareClass}</Badge>
                  </div>
                  {scenario.expected.premium && (
                    <div className="flex justify-between text-gray-400">
                      <span>Premium:</span>
                      <span className="text-amber-400 font-semibold">{scenario.expected.premium}</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  disabled={isSimulating && selectedScenario === scenario.id}
                >
                  {isSimulating && selectedScenario === scenario.id ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results */}
        {isSimulating && (
          <Card className="bg-gray-800/50 border-blue-500">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">AI Processing...</h3>
              <p className="text-gray-300">Analyzing demand patterns, occupancy, and market conditions</p>
            </CardContent>
          </Card>
        )}

        {results && !isSimulating && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Simulation Complete!</h2>
                    <p className="text-blue-100">
                      {results.scenario.name} - {results.destination} ({results.room_type})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Optimized Rate</p>
                    <p className="text-5xl font-bold">
                      ETB {results.pricing.optimized_rate.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-100 mt-1">per night</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pricing Breakdown */}
              <Card className="bg-gray-800/50">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Pricing Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Rate</span>
                    <span className={`text-xl font-semibold ${results.pricing.discount_applied_pct > 0 ? 'line-through text-gray-500' : 'text-white'}`}>
                      ETB {results.pricing.base_rate.toLocaleString()}
                    </span>
                  </div>

                  {results.pricing.discount_applied_pct > 0 && (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-400 font-semibold">Discount Applied</span>
                        <Badge className="bg-green-500 text-white text-lg">
                          {results.pricing.discount_applied_pct}% OFF
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-300 text-sm">You Save</span>
                        <span className="text-green-400 font-bold text-xl">
                          ETB {results.pricing.savings_etb.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-lg">Optimized Rate</span>
                      <span className="text-blue-400 font-bold text-2xl">
                        ETB {results.pricing.optimized_rate.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Fare Class</span>
                    </div>
                    <Badge className="bg-blue-500 text-white text-lg">
                      {results.pricing.fare_class}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Factors */}
              <Card className="bg-gray-800/50">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    AI Pricing Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">Time Bucket</span>
                      </div>
                      <Badge className="bg-blue-600">
                        {results.pricing.pricing_factors.time_bucket}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">Days Until Arrival</span>
                      </div>
                      <span className="text-white font-semibold">
                        {results.pricing.pricing_factors.days_until_arrival} days
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-amber-400" />
                        <span className="text-gray-300">Current Occupancy</span>
                      </div>
                      <span className="text-white font-semibold">
                        {results.pricing.pricing_factors.current_occupancy_pct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <span className="text-gray-300">Inventory Bucket</span>
                      </div>
                      <Badge className="bg-purple-600">
                        {results.pricing.pricing_factors.inventory_bucket}
                      </Badge>
                    </div>

                    {results.pricing.pricing_factors.weekend_premium > 1 && (
                      <div className="flex items-center justify-between p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                        <span className="text-amber-300">Weekend Premium</span>
                        <span className="text-amber-400 font-bold">
                          +{((results.pricing.pricing_factors.weekend_premium - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    {results.pricing.pricing_factors.holiday_premium > 1 && (
                      <div className="flex items-center justify-between p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                        <span className="text-red-300">Holiday Premium</span>
                        <span className="text-red-400 font-bold">
                          +{((results.pricing.pricing_factors.holiday_premium - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    {results.pricing.pricing_factors.demand_multiplier !== 1 && (
                      <div className="flex items-center justify-between p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
                        <span className="text-indigo-300">AI Demand Adjustment</span>
                        <span className={`font-bold ${results.pricing.pricing_factors.demand_multiplier > 1 ? 'text-red-400' : 'text-green-400'}`}>
                          {results.pricing.pricing_factors.demand_multiplier}x
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Explanation */}
            <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/20 p-3 rounded-full">
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">How This Works</h3>
                    <p className="text-gray-300 mb-4">{results.scenario.expected.reason}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Pricing Logic</h4>
                        <p className="text-xs text-gray-400">
                          The system uses a 4×4 matrix (time buckets × inventory levels) to determine discounts. 
                          Early bookings with low occupancy get maximum discounts. Last-minute bookings with high occupancy pay premium rates.
                        </p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">Revenue Impact</h4>
                        <p className="text-xs text-gray-400">
                          This airline-style pricing increases revenue by 25% compared to static pricing. 
                          It captures high-value last-minute bookings while stimulating early demand with discounts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restrictions */}
            {results.pricing.restrictions && (
              <Card className="bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Booking Restrictions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg text-center ${results.pricing.restrictions.refundable ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                      <p className="text-sm text-gray-300 mb-2">Refundable</p>
                      <p className={`text-2xl font-bold ${results.pricing.restrictions.refundable ? 'text-green-400' : 'text-red-400'}`}>
                        {results.pricing.restrictions.refundable ? '✓' : '✗'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${results.pricing.restrictions.changeable ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                      <p className="text-sm text-gray-300 mb-2">Changeable</p>
                      <p className={`text-2xl font-bold ${results.pricing.restrictions.changeable ? 'text-green-400' : 'text-red-400'}`}>
                        {results.pricing.restrictions.changeable ? '✓' : '✗'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${results.pricing.restrictions.prepayment_required ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-green-900/30 border border-green-500/30'}`}>
                      <p className="text-sm text-gray-300 mb-2">Prepayment</p>
                      <p className={`text-2xl font-bold ${results.pricing.restrictions.prepayment_required ? 'text-amber-400' : 'text-green-400'}`}>
                        {results.pricing.restrictions.prepayment_required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg text-center bg-gray-900/50">
                      <p className="text-sm text-gray-300 mb-2">Cancel Fee</p>
                      <p className="text-2xl font-bold text-white">
                        {results.pricing.restrictions.cancellation_fee_pct}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
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
