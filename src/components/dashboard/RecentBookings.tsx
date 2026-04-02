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
    <Card className="glass-card border-white/5 shadow-lg">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Recent Bookings
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          Latest reservations processed by the AI
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {bookings.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No recent bookings. Try the booking simulator!</p>
            </div>
          )}
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white">{booking.guest_name}</span>
                </div>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-xs">
                  {booking.booking_ref}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Hotel className="h-3 w-3" />
                  <span>{booking.room_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(booking.check_in).toLocaleDateString()} · {booking.nights}n</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {booking.ai_segment?.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    ETB {booking.total_revenue_etb.toLocaleString()}
                  </span>
                </div>
              </div>

              {booking.package_name && (
                <p className="text-xs text-primary mt-2">
                  + {booking.package_name}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
