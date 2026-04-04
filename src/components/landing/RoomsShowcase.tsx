"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel, Users, Sparkles, ArrowRight, Zap } from "lucide-react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";

interface RoomType {
  code: string;
  name: string;
  description: string;
  base_rate_etb: number;
  current_rate_etb: number;
  max_occupancy: number;
  amenities: string[];
}

export function RoomsShowcase() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${API_BASE}/api/room-types`);
        if (res.ok) {
          const data = await res.json();
          
          // Fetch current pricing for each room
          const today = new Date().toISOString().split('T')[0];
          const roomsWithPricing = await Promise.all(
            data.map(async (room: RoomType) => {
              try {
                const priceRes = await fetch(`${API_BASE}/api/pricing/optimal-price`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    room_type_code: room.code,
                    date: today,
                  }),
                });
                
                if (priceRes.ok) {
                  const pricing = await priceRes.json();
                  return {
                    code: room.code,
                    name: room.name,
                    description: room.description || `Experience luxury at ${room.name}`,
                    base_rate_etb: room.base_rate_etb,
                    current_rate_etb: pricing.recommended_rate_etb,
                    max_occupancy: room.max_occupancy,
                    amenities: room.amenities || [],
                  };
                }
              } catch (err) {
                console.error(`Failed to fetch pricing for ${room.code}:`, err);
              }
              
              return {
                code: room.code,
                name: room.name,
                description: room.description || `Experience luxury at ${room.name}`,
                base_rate_etb: room.base_rate_etb,
                current_rate_etb: room.base_rate_etb,
                max_occupancy: room.max_occupancy,
                amenities: room.amenities || [],
              };
            })
          );
          
          setRooms(roomsWithPricing);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section id="rooms" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            AI-Optimized Pricing
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Our Rooms</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Prices dynamically optimized by AI based on demand, seasonality, and your preferences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const discount = room.current_rate_etb < room.base_rate_etb;
            const savingsPercent = discount 
              ? Math.round(((room.base_rate_etb - room.current_rate_etb) / room.base_rate_etb) * 100)
              : 0;

            return (
              <Card 
                key={room.code} 
                className="glass-card border-white/10 hover:border-primary/50 transition-all group overflow-hidden"
              >
                <CardHeader className="border-b border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-start justify-between mb-2">
                    <Hotel className="h-8 w-8 text-primary" />
                    {discount && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Save {savingsPercent}%
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-xl">{room.name}</CardTitle>
                  <p className="text-sm text-slate-400 mt-2">{room.description}</p>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Up to {room.max_occupancy} guests</span>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    {discount && (
                      <p className="text-sm text-slate-400 line-through mb-1">
                        ETB {room.base_rate_etb.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white">
                        ETB {room.current_rate_etb.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-400">/ night</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <p className="text-xs text-primary">AI-optimized rate</p>
                    </div>
                  </div>

                  <Link href={`/book?room=${room.code}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
