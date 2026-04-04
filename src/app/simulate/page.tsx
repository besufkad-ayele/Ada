"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Play, UserCircle, Hotel, Zap, PackageCheck, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/layout/PageHeader";

function SimulatePageContent() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    guest_first_name: "John",
    guest_last_name: "Doe",
    guest_email: "john@example.com",
    guest_nationality: "Ethiopian",
    is_corporate: false,
    company_name: "",
    room_type_code: "standard",
    check_in: format(addDays(new Date(), 14), "yyyy-MM-dd"),
    check_out: format(addDays(new Date(), 16), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    channel: "direct",
    accept_package: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    async function fetchConfig() {
      try {
        const [scenRes, rtRes] = await Promise.all([
          fetch(`${API_BASE}/api/simulate/scenarios`),
          fetch(`${API_BASE}/api/room-types`),
        ]);
        if (scenRes.ok) setScenarios(await scenRes.json());
        if (rtRes.ok) setRoomTypes(await rtRes.json());
      } catch (err) {
        console.error("Failed to load simulation config:", err);
      }
    }
    fetchConfig();
  }, []);

  const handleScenarioLoad = (scenario: any) => {
    setFormData({ ...formData, ...scenario.request });
    setResult(null); // Clear previous result
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/simulate/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // Brief "AI thinking" delay for demo effect
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 1200);

    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        icon={Sparkles}
        title="Live AI"
        highlight="Simulation"
        description="Demo environment demonstrating dynamic pricing and segmentation in real-time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COMPONENT - Form Setup */}
        <div className="space-y-6">
          <Card className="glass-card shadow-lg border-white/5">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-white text-lg">1. Load Scenario</CardTitle>
              <CardDescription>Select a pre-configured guest profile for the demo</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {scenarios.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScenarioLoad(s)}
                  className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-primary transition-colors">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-lg border-white/5">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="text-white text-lg">2. Booking Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Nationality</label>
                  <Input 
                    value={formData.guest_nationality} 
                    onChange={e => setFormData({...formData, guest_nationality: e.target.value})}
                    className="bg-black/20 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Booking Channel</label>
                  <select
                    value={formData.channel}
                    onChange={e => setFormData({...formData, channel: e.target.value})}
                    className="w-full h-10 px-3 py-2 rounded-md bg-black/20 border border-white/10 text-white text-sm"
                  >
                    <option value="direct">Direct</option>
                    <option value="ota_booking">Booking.com</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Room Type</label>
                  <select
                    value={formData.room_type_code}
                    onChange={e => setFormData({...formData, room_type_code: e.target.value})}
                    className="w-full h-10 px-3 py-2 rounded-md bg-black/20 border border-white/10 text-white text-sm capitalize"
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.code} value={rt.code}>{rt.name}</option>
                    ))}
                    {roomTypes.length === 0 && <option value="standard">Standard</option>}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Adults</label>
                  <Input 
                    type="number"
                    min="1"
                    max="6"
                    value={formData.adults} 
                    onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})}
                    className="bg-black/20 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-1 pt-6">
                  <label className="flex items-center text-xs text-white">
                    <input
                      type="checkbox"
                      checked={formData.accept_package}
                      onChange={e => setFormData({...formData, accept_package: e.target.checked})}
                      className="mr-2"
                    />
                    Accept AI Package Recommendation
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Check In</label>
                  <Input 
                    type="date"
                    value={formData.check_in} 
                    onChange={e => setFormData({...formData, check_in: e.target.value})}
                    className="bg-black/20 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Check Out</label>
                  <Input 
                    type="date"
                    value={formData.check_out} 
                    onChange={e => setFormData({...formData, check_out: e.target.value})}
                    className="bg-black/20 border-white/10 text-white" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button 
                onClick={handleSimulate} 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 text-lg"
              >
                {isLoading ? (
                  <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                ) : (
                  <Play className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "AI is processing..." : "Run Simulation"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* RIGHT COMPONENT - Results */}
        <div className="space-y-6">
          <Card className={`glass-card shadow-lg border-white/5 h-full transition-all duration-500 relative overflow-hidden ${result ? 'ring-1 ring-primary/50 bg-primary/5' : ''}`}>
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <BrainCircuit className="h-16 w-16 text-primary animate-pulse mb-4" />
                <div className="text-lg font-medium text-white animate-pulse tracking-widest">ANALYZING SCENARIO</div>
                <div className="text-sm text-primary/80 mt-2 font-mono">Calculating semantic pricing vectors...</div>
              </div>
            )}

            {!result && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground opacity-50">
                <BrainCircuit className="h-24 w-24 mb-4 opacity-20" />
                <p>Awaiting scenario execution...</p>
              </div>
            )}

            {result && !isLoading && (
              <>
                <CardHeader className="bg-primary/10 border-b border-primary/20">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white text-xl flex items-center">
                      <Zap className="h-5 w-5 text-primary mr-2 fill-primary" /> 
                      AI Decision Logic
                    </CardTitle>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {result.booking.booking_ref}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Segmentation Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" /> Guest Identity Classification
                    </h3>
                    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Identified Segment</p>
                          <p className="text-xl font-bold text-white uppercase tracking-tight">
                            {result.ai_analysis.segmentation.segment.replace('_', ' ')}
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {Math.round(result.ai_analysis.segmentation.confidence * 100)}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 italic border-l-2 border-primary/50 pl-3">
                        "{result.ai_analysis.segmentation.reason}"
                      </p>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center">
                      <Hotel className="mr-2 h-4 w-4" /> Dynamic Rate Engine
                    </h3>
                    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Base Room Rate</p>
                          <p className="text-md text-slate-300 line-through">ETB {result.ai_analysis.pricing.base_rate_etb}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-primary font-medium mb-1 drop-shadow-md">Optimized Rate</p>
                          <p className="text-2xl font-bold text-white text-shadow">
                            ETB {result.booking.rate_per_night_etb.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                          </p>
                          <p className="text-xs text-emerald-400 mt-1">Total: ETB {result.booking.total_room_revenue_etb.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 pt-4 border-t border-white/5">
                        <p className="text-xs text-muted-foreground mb-2">Price Modifier Stack:</p>
                        {result.ai_analysis.pricing.multipliers && Object.entries(result.ai_analysis.pricing.multipliers).map(([key, val]: any) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                            <span className={val > 1 ? "text-emerald-400" : val < 1 ? "text-rose-400" : "text-slate-500"}>
                              x{val.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Package Section */}
                  {result.ai_analysis.package_recommendation.top_recommendation && (
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center">
                        <PackageCheck className="mr-2 h-4 w-4" /> Strategic Upsell
                      </h3>
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">Recommended Add-on</Badge>
                            <p className="text-lg font-bold text-white">
                              {result.ai_analysis.package_recommendation.top_recommendation.package_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded">
                              + ETB {result.booking.total_package_revenue_etb.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3 break-words whitespace-pre-wrap">
                          AI applied a {(result.ai_analysis.package_recommendation.top_recommendation.discount_pct * 100).toFixed(0)}% dynamic discount to maximize conversion probability for the {result.ai_analysis.segmentation.segment.replace('_', ' ')} segment.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-dashed border-white/20 flex flex-col items-end">
                    <div className="flex justify-between items-end w-full mb-2">
                      <div>
                        <p className="text-sm text-slate-400">Total Captured Revenue</p>
                        <p className="text-3xl font-black text-white mt-1">ETB {result.booking.total_revenue_etb.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm flex flex-col items-end">
                        <span>{result.revenue_impact.uplift_pct} TRevPAR Impact</span>
                      </Badge>
                    </div>
                    <div className="w-full mt-2 text-right text-xs text-emerald-500/80 font-medium">
                      Net System Uplift: + ETB {result.revenue_impact.uplift_etb.toLocaleString()} over baseline
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <ProtectedRoute>
      <SimulatePageContent />
    </ProtectedRoute>
  );
}
