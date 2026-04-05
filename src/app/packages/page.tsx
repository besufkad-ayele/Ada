"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  DollarSign, 
  Users, 
  Sparkles,
  TrendingUp,
  MapPin,
  Heart,
  Mountain,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getPackageIcon = (id: string) => {
    switch (id) {
      case "romance": return <Heart className="h-6 w-6" />;
      case "family": return <Users className="h-6 w-6" />;
      case "wellness": return <Sparkles className="h-6 w-6" />;
      case "adventure": return <Mountain className="h-6 w-6" />;
      case "cultural": return <Coffee className="h-6 w-6" />;
      default: return <Package className="h-6 w-6" />;
    }
  };

  const getPackageColor = (id: string) => {
    switch (id) {
      case "romance": return "from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/20";
      case "family": return "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20";
      case "wellness": return "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20";
      case "adventure": return "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20";
      case "cultural": return "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/20";
      default: return "from-slate-500/20 to-gray-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin"></div>
          <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Curating Luxury Experiences...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-2">
              <Sparkles className="h-3 w-3" />
              Dynamic Personalization
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              AI-Powered <span className="gold-gradient-text">Service Packages</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Experience the future of value-based pricing where every service adapts to market signals, 
              ensuring luxury remains accessible yet premium.
            </p>
          </div>
          <Badge className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 rounded-full px-6 py-2 h-fit text-sm">
            Next-Gen Revenue Management
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Destination Selector */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-panel border-white/5 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Select Destination
                </CardTitle>
                <p className="text-sm text-slate-500">Choose a resort to see available packages</p>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {destinations.map((dest) => (
                    <button
                      key={dest.code}
                      onClick={() => setSelectedDestination(dest.code)}
                      className={cn(
                        "group relative w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                        selectedDestination === dest.code
                          ? "bg-primary/20 border border-primary/30 text-white"
                          : "bg-white/5 border border-transparent text-slate-400 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          selectedDestination === dest.code ? "bg-primary text-slate-950" : "bg-white/5 text-slate-400 group-hover:text-white"
                        )}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-sm">{dest.name}</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        selectedDestination === dest.code ? "rotate-90 text-primary" : "text-slate-600 group-hover:translate-x-1"
                      )} />
                      
                      {selectedDestination === dest.code && (
                        <motion.div 
                          layoutId="active-dest"
                          className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logic Banner */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl glass-panel border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
          >
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">Dynamic Revenue Logic</h3>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">Yield-Optimized Packaging</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Our AI doesn't just price rooms. Packages are dynamically mapped to your <span className="text-primary font-medium">customer segment</span> and <span className="text-primary font-medium">booking velocity</span>.
            </p>
            <div className="space-y-3">
              {[
                { title: "Base Price Stabilization", icon: <DollarSign className="w-4 h-4" /> },
                { title: "Demand Class Mapping", icon: <Users className="w-4 h-4" /> },
                { title: "Predictive Upselling", icon: <Sparkles className="w-4 h-4" /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                  <span className="text-primary">{item.icon}</span>
                  {item.title}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Packages Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Available <span className="text-primary">Experiences</span>
              <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-slate-500">
                {packages.length} Packages Found
              </Badge>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card h-full group hover:border-primary/20 flex flex-col">
                    <div className={cn(
                      "p-6 rounded-t-2xl bg-gradient-to-br border-b border-white/5",
                      getPackageColor(pkg.id)
                    )}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                          {getPackageIcon(pkg.id)}
                        </div>
                        <Badge className="bg-black/20 border-white/5 text-xs text-white/70">
                          ID: {pkg.id.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{pkg.name}</h3>
                      <p className="text-sm text-white/60 line-clamp-2 mt-1">{pkg.description}</p>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Retail Value</p>
                          <p className="text-3xl font-black text-white">
                            <span className="text-lg text-primary mr-1">ETB</span>
                            {pkg.price_etb.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-1">
                            Live Price
                          </Badge>
                          <p className="text-[10px] text-slate-500">Per Booking Total</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          Included Premium Services
                        </p>
                        <ul className="grid grid-cols-1 gap-2">
                          {pkg.services.map((service: string, sIdx: number) => (
                            <li key={sIdx} className="text-xs text-slate-300 flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/5">
                        <Button className="w-full h-12 bg-white/5 hover:bg-primary hover:text-slate-950 border border-white/10 rounded-xl transition-all duration-500 group">
                          Configure Package
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pricing Example: Invoice Style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-panel overflow-hidden border-emerald-500/10">
          <div className="bg-gradient-to-r from-emerald-600/20 via-primary/10 to-transparent p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Visual Breakdown: <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-8">Total Value Realized</span></h2>
                <p className="text-sm text-slate-500 mt-1">Simulated calculation based on current yield parameters</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Room Rate Component */}
              <div className="space-y-6 relative">
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block text-slate-700 text-3xl font-light">+</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Optimized Room Rate</h4>
                </div>
                
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Standard Rate</span>
                    <span className="line-through text-slate-600">ETB 8,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 text-sm">Early Bird Signal</span>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/20 text-[10px]">AI APPLIED</Badge>
                    </div>
                    <span className="text-emerald-400 font-bold">- 10%</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Stay Total (3 Nights)</p>
                        <p className="text-2xl font-black text-white">ETB 21,600</p>
                      </div>
                      <Badge variant="outline" className="border-white/10 text-[10px] text-slate-500">SAVER CLASS</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Packages Component */}
              <div className="space-y-6 relative">
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block text-slate-700 text-3xl font-light">=</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Selected Packages</h4>
                </div>
                
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Romance Tier</span>
                      <span className="text-white font-medium">ETB 3,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Wellness Tier</span>
                      <span className="text-white font-medium">ETB 5,500</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Add-on Total</p>
                        <p className="text-2xl font-black text-white">ETB 9,000</p>
                      </div>
                      <Badge variant="outline" className="border-white/10 text-[10px] text-slate-500">2 ITEMS</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Component */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Final Booking Value</h4>
                </div>
                
                <div className="bg-emerald-950/20 rounded-2xl p-6 border border-emerald-500/20 space-y-4 h-[168px] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest">Consolidated Rate</p>
                      <p className="text-xs text-slate-500 mt-1">Tax Inclusive</p>
                    </div>
                    <Info className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">GRAND TOTAL</p>
                    <p className="text-4xl font-black text-white glow-primary">
                      <span className="text-xl text-emerald-500 mr-2">ETB</span>
                      30,600
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h5 className="text-white font-bold text-sm mb-1">Revenue Performance Insight</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  By bundling AI-optimized room inventory with static-margin service packages, the system achieved a <span className="text-emerald-400 font-bold">+22% Yield Premium</span> for this specific booking window compared to unbundled sales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
