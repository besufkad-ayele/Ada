"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  DollarSign, 
  Users, 
  Sparkles,
  TrendingUp,
  MapPin,
  Heart,
  Palmtree,
  Mountain,
  Coffee,
  Briefcase
} from "lucide-react";

function PackagesPageContent() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("AWASH");
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const destRes = await fetch(`${API_BASE}/api/destinations/list`);
        if (destRes.ok) {
          const dests = await destRes.json();
          setDestinations(dests);
          if (dests.length > 0) {
            setSelectedDestination(dests[0].code);
          }
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetchPackages();
    }
  }, [selectedDestination]);

  const fetchPackages = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/destinations/packages?destination_code=${selectedDestination}&room_type=DELUXE&adults=2`
      );
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const getPackageIcon = (id: string) => {
    switch (id) {
      case "romance": return <Heart className="h-8 w-8" />;
      case "family": return <Users className="h-8 w-8" />;
      case "wellness": return <Sparkles className="h-8 w-8" />;
      case "adventure": return <Mountain className="h-8 w-8" />;
      case "cultural": return <Coffee className="h-8 w-8" />;
      default: return <Package className="h-8 w-8" />;
    }
  };

  const getPackageColor = (id: string) => {
    switch (id) {
      case "romance": return "from-pink-600 to-rose-600";
      case "family": return "from-blue-600 to-cyan-600";
      case "wellness": return "from-green-600 to-emerald-600";
      case "adventure": return "from-orange-600 to-amber-600";
      case "cultural": return "from-purple-600 to-indigo-600";
      default: return "from-gray-600 to-slate-600";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Package className="h-10 w-10 text-amber-500" />
          <h1 className="text-4xl font-bold text-white">AI-Powered Service Packages</h1>
        </div>
        <p className="text-lg text-gray-300">
          Dynamic package pricing integrated with airline-style revenue management
        </p>
        <Badge className="mt-2 bg-blue-600 text-white">
          Packages Adjust with Room Pricing
        </Badge>
      </div>

      {/* Destination Selector */}
      <Card className="bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            Select Destination
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-4">
            {destinations.map((dest) => (
              <Button
                key={dest.code}
                onClick={() => setSelectedDestination(dest.code)}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  selectedDestination === dest.code
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <MapPin className="h-6 w-6" />
                <span className="text-sm font-semibold">{dest.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Dynamic Package Pricing</h3>
              <p className="text-gray-300 mb-4">
                Package prices are calculated based on the current airline-style room pricing. 
                When room rates increase due to high demand, package values automatically adjust to maintain profitability.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Base Package Price</h4>
                  <p className="text-xs text-gray-400">
                    Each package has a base price that covers services, amenities, and experiences included.
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Room Rate Integration</h4>
                  <p className="text-xs text-gray-400">
                    Total booking cost = Optimized room rate (from airline pricing) + Selected packages.
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-400 mb-2">AI Recommendations</h4>
                  <p className="text-xs text-gray-400">
                    System recommends packages based on guest profile, destination, and booking patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Packages */}
      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="bg-gray-800/50 hover:scale-105 transition-transform duration-300"
          >
            <CardHeader className={`bg-gradient-to-r ${getPackageColor(pkg.id)} text-white`}>
              <CardTitle className="flex items-center gap-3">
                {getPackageIcon(pkg.id)}
                <div>
                  <p className="text-xl font-bold">{pkg.name}</p>
                  <p className="text-sm text-white/80">{pkg.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Package Price</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      ETB {pkg.price_etb.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">per booking</p>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-300 mb-2 font-semibold">Included Services:</p>
                  <ul className="space-y-2">
                    {pkg.services.map((service: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-xs text-amber-300">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    This package integrates with airline-style room pricing. Total cost = Room rate + Package price.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                Add to Booking
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Example */}
      <Card className="bg-gray-800/50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Example: Complete Booking Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-3">Room Rate (Airline Pricing)</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span className="line-through">ETB 8,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount (Early Bird):</span>
                  <span className="text-green-400">-10%</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Optimized Rate:</span>
                  <span>ETB 7,200</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>× 3 nights:</span>
                  <span>ETB 21,600</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-3">Selected Packages</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Romance Package:</span>
                  <span>ETB 3,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Wellness Package:</span>
                  <span>ETB 5,500</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-purple-500/30">
                  <span>Packages Total:</span>
                  <span>ETB 9,000</span>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-400 mb-3">Total Booking Cost</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Room Total:</span>
                  <span>ETB 21,600</span>
                </div>
                <div className="flex justify-between">
                  <span>Packages Total:</span>
                  <span>ETB 9,000</span>
                </div>
                <div className="flex justify-between font-bold text-white text-xl pt-3 border-t border-green-500/30">
                  <span>Grand Total:</span>
                  <span className="text-green-400">ETB 30,600</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-amber-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Impact: By combining airline-style room pricing with strategic package offerings, 
              the system maximizes revenue per booking while providing clear value to guests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <ProtectedRoute>
      <PackagesPageContent />
    </ProtectedRoute>
  );
}
