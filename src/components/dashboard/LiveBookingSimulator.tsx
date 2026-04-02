"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Play, CheckCircle2, Loader2, User } from "lucide-react";
import { API_BASE } from "@/lib/api";

export function LiveBookingSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);

  const simulateRandomBooking = async () => {
    setIsSimulating(true);
    try {
      // Get scenarios
      const scenariosRes = await fetch(`${API_BASE}/api/simulate/scenarios`);
      const scenarios = await scenariosRes.json();
      
      // Pick random scenario
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      // Simulate booking
      const res = await fetch(`${API_BASE}/api/simulate/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario.request),
      });
      
      if (res.ok) {
        const data = await res.json();
        setLastBooking(data);
      }
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="glass-card shadow-2xl border-primary/20 overflow-hidden relative group h-full flex flex-col">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointers-events-none" />
      <CardHeader className="border-b border-white/5 bg-gradient-to-br from-black/40 via-transparent to-transparent relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center text-lg tracking-tight">
            <Users className="h-5 w-5 mr-3 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="gold-gradient-text tracking-wide">Live Booking Simulator</span>
          </CardTitle>
          <Button
            size="sm"
            onClick={simulateRandomBooking}
            disabled={isSimulating}
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:text-white transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]"
          >
            {isSimulating ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
            ) : (
              <Play className="h-4 w-4 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
            )}
            <span className="ml-2 font-bold tracking-wide uppercase text-[10px]">Simulate</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 relative z-10 flex-1 flex flex-col justify-center">
        {!lastBooking && (
          <div className="text-center text-muted-foreground w-full py-2">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Users className="h-14 w-14 text-slate-600 relative z-10 opacity-40 mx-auto" />
            </div>
            <p className="text-sm font-medium tracking-wide">Click <span className="text-primary italic">Simulate</span> to watch AI process a reservation.</p>
          </div>
        )}
        
        {lastBooking && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col justify-center space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Booking Ref</p>
                <p className="text-xl font-extrabold text-white tracking-widest bg-black/40 px-3 py-1 rounded inline-block border border-white/10 shadow-inner">
                  {lastBooking.booking.booking_ref}
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] bg-emerald-500/10 rounded-full p-1" />
            </div>

            <div className="grid grid-cols-2 gap-5 p-5 bg-black/20 rounded-xl border border-white/5 relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 blur-xl rounded-full" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Guest</p>
                <div className="flex items-center text-sm font-semibold text-slate-200">
                  <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  {lastBooking.booking.guest_name}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Room</p>
                <p className="text-sm font-semibold text-slate-300">{lastBooking.booking.room_type}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">AI Segment</p>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-2 py-0.5 tracking-wider uppercase shadow-[0_0_8px_-2px_rgba(245,158,11,0.3)]">
                  {lastBooking.ai_analysis.segmentation.segment.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-bold mb-1">Total Revenue</p>
                <p className="text-lg font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                  ETB {lastBooking.booking.total_revenue_etb.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl relative shadow-inner">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                  AI Decision Matrix
                </p>
                <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                  "{lastBooking.ai_analysis.pricing.pricing_reason}"
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
