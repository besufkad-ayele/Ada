"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Hotel, TrendingUp } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface Booking {
  id: number;
  booking_ref: string;
  guest_name: string;
  room_type: string;
  check_in: string;
  nights: number;
  total_revenue_etb: number;
  ai_segment: string;
  booking_date: string;
  package_name?: string;
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/recent?limit=10`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to fetch recent bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 10000); // Refresh every 10s
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
    <Card className="glass-card shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-gradient-to-br from-black/40 via-transparent to-transparent relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointers-events-none" />
        <CardTitle className="text-white flex items-center text-xl tracking-tight">
          <Calendar className="h-5 w-5 mr-3 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="gold-gradient-text">Recent Bookings</span>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
          Latest reservations processed by the AI
        </p>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {bookings.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No recent bookings. Try the booking simulator!</p>
            </div>
          )}
          {bookings.map((booking) => (
            <div key={booking.id} className="p-5 hover:bg-white/5 transition-all duration-300 group border-l-2 border-transparent hover:border-primary">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 group-hover:text-primary group-hover:bg-primary/20 transition-colors">
                    <User className="h-4 w-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{booking.guest_name}</span>
                </div>
                <Badge variant="outline" className="bg-black/40 border-white/10 text-xs font-mono text-slate-400">
                  {booking.booking_ref}
                </Badge>
              </div>
              
              <div className="flex items-center gap-5 text-xs text-slate-400 mb-4 bg-white/5 p-2 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Hotel className="h-3.5 w-3.5 text-accent" />
                  <span className="uppercase tracking-widest">{booking.room_type}</span>
                </div>
                <div className="h-1 w-1 bg-slate-600 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  <span>{new Date(booking.check_in).toLocaleDateString()} <span className="text-slate-500">· {booking.nights}n</span></span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-[0_0_10px_-2px_rgba(245,158,11,0.2)]">
                  {booking.ai_segment?.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="text-sm font-extrabold text-emerald-400">
                    ETB {booking.total_revenue_etb.toLocaleString()}
                  </span>
                </div>
              </div>

              {booking.package_name && (
                <div className="mt-3 flex items-center gap-2 text-xs text-accent bg-accent/5 p-2 rounded border border-accent/10">
                  <div className="bg-accent h-1.5 w-1.5 rounded-full animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Upsold:</span> {booking.package_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
