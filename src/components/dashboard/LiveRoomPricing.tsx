"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel, TrendingUp, TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";

interface RoomPricing {
  room_type_code: string;
  room_type_name: string;
  base_rate_etb: number;
  recommended_rate_etb: number;
  occupancy_rate: number;
  ai_confidence: number;
  pricing_reason: string;
  fare_classes: Array<{
    fare_class: string;
    label: string;
    rate_etb: number;
    available: boolean;
  }>;
}

export function LiveRoomPricing() {
  const [rooms, setRooms] = useState<RoomPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPricing = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const roomTypes = ['standard', 'deluxe', 'suite', 'royal_suite'];
      
      const promises = roomTypes.map(code =>
        fetch(`${API_BASE}/api/pricing/optimal-price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_type_code: code,
            date: today,
          }),
        }).then(r => r.ok ? r.json() : null)
      );
      
      const results = await Promise.all(promises);
      const validResults = results.filter(r => r !== null && r.base_rate_etb !== undefined);
      
      if (validResults.length > 0) {
        setRooms(validResults);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch room pricing:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
    const interval = setInterval(fetchPricing, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card border-white/5 shadow-lg">
        <CardContent className="p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/5 shadow-lg">
      <CardHeader className="border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Hotel className="h-5 w-5 mr-2 text-primary" />
            Live Room Pricing
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {rooms.length === 0 && !isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              <Hotel className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No pricing data available. Make sure the backend is seeded.</p>
              <p className="text-xs mt-2">Run: POST /api/seed</p>
            </div>
          )}
          {rooms.map((room) => {
            const priceChange = room.recommended_rate_etb - room.base_rate_etb;
            const priceChangePct = (priceChange / room.base_rate_etb) * 100;
            const isIncreased = priceChange > 0;
            
            return (
              <div key={room.room_type_code} className="p-6 hover:bg-white/5 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{room.room_type_name}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        {Math.round(room.ai_confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Base Rate</p>
                        <p className="text-sm text-slate-400 line-through">
                          ETB {room.base_rate_etb.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isIncreased ? (
                          <TrendingUp className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-rose-400" />
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">AI Optimized</p>
                          <p className="text-2xl font-bold text-white">
                            ETB {room.recommended_rate_etb.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline"
                        className={`${
                          isIncreased 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {isIncreased ? '+' : ''}{priceChangePct.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${room.occupancy_rate * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {(room.occupancy_rate * 100).toFixed(0)}% occupied
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic">
                      {room.pricing_reason}
                    </p>
                  </div>
                  
                  <Link href="/book">
                    <Button 
                      size="sm"
                      className="bg-primary hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/5">
                  {room.fare_classes.map((fc) => (
                    <div 
                      key={fc.fare_class}
                      className={`flex-1 p-2 rounded-lg border ${
                        fc.available 
                          ? 'border-primary/20 bg-primary/5' 
                          : 'border-white/5 bg-white/5 opacity-50'
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">{fc.label}</p>
                      <p className={`text-sm font-semibold ${fc.available ? 'text-white' : 'text-slate-500'}`}>
                        ETB {fc.rate_etb.toLocaleString()}
                      </p>
                      {!fc.available && (
                        <p className="text-xs text-rose-400 mt-1">Sold Out</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
