"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { format, addDays } from "date-fns";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Hotel,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  TrendingDown,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_BASE } from "@/lib/api";

interface RoomType {
  code: string;
  name: string;
  description: string;
  base_rate_etb: number;
  current_rate_etb: number;
  max_occupancy: number;
  amenities: string[];
}

const AMENITIES = [
  { icon: Wifi, label: "Free High-Speed WiFi" },
  { icon: Waves, label: "Infinity Pool & Spa" },
  { icon: Dumbbell, label: "24/7 Fitness Center" },
  { icon: UtensilsCrossed, label: "Fine Dining Restaurant" },
  { icon: Coffee, label: "Ethiopian Coffee Ceremony" },
];

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(searchParams.get("room"));

  const [search, setSearch] = useState({
    check_in: format(addDays(new Date(), 10), "yyyy-MM-dd"),
    check_out: format(addDays(new Date(), 12), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    room_type_code: searchParams.get("room") || "",
    guest_nationality: "International",
    is_corporate: false,
    guest_first_name: "",
    guest_last_name: "",
    guest_email: "",
    channel: "direct",
  });

  const [quote, setQuote] = useState<any>(null);
  const [upsell, setUpsell] = useState<any>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${API_BASE}/api/room-types`);
        if (!res.ok) return;
        const data = await res.json();
        const today = new Date().toISOString().split("T")[0];

        const roomsWithPricing = await Promise.all(
          data.map(async (room: any) => {
            try {
              const priceRes = await fetch(`${API_BASE}/api/pricing/optimal-price`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room_type_code: room.code, date: today }),
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
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    }
    fetchRooms();
  }, []);

  const handleRoomSelect = (roomCode: string) => {
    setSelectedRoom(roomCode);
    setSearch({ ...search, room_type_code: roomCode });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.room_type_code) {
      alert("Please select a room type first");
      return;
    }
    setIsProcessing(true);
    setStep(2);
    try {
      const res = await fetch(`${API_BASE}/api/pricing/optimal-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_type_code: search.room_type_code,
          date: search.check_in,
          guest_nationality: search.guest_nationality,
          booking_channel: search.is_corporate ? "corporate" : "direct",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
        setStep(3);
      }
    } catch (err) {
      console.error("Failed to get quote:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (step === 3 && quote) fetchUpsell();
  }, [step, quote]);

  const fetchUpsell = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/packages/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_nationality: search.guest_nationality,
          is_corporate: search.is_corporate,
          adults: search.adults,
          children: search.children,
          check_in: search.check_in,
          check_out: search.check_out,
          room_type_code: search.room_type_code,
          booking_channel: search.channel,
          room_rate_etb: quote.recommended_rate_etb,
        }),
      });
      if (res.ok) setUpsell(await res.json());
    } catch (err) {
      console.error("Failed to fetch upsell:", err);
    }
  };

  const handleConfirmBooking = async (acceptPackage: boolean) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulate/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_first_name: search.guest_first_name,
          guest_last_name: search.guest_last_name,
          guest_email: search.guest_email,
          guest_nationality: search.guest_nationality,
          is_corporate: search.is_corporate,
          room_type_code: search.room_type_code,
          check_in: search.check_in,
          check_out: search.check_out,
          adults: search.adults,
          children: search.children,
          channel: search.channel,
          accept_package: acceptPackage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookingRef(data.booking.booking_ref);
        setStep(4);
      }
    } catch (err) {
      console.error("Failed to confirm booking:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/landing" className="flex items-center space-x-2 text-slate-300 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-white">Kuraz AI</span>
          </Link>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            Guest Booking
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/kuriftu.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Intelligent pricing · Personalized packages
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Kuriftu Resort & Spa
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Book Your Stay
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience Ethiopian luxury with AI-optimized rates tailored to your travel profile.
          </p>
        </div>
      </section>

      {/* Rooms */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Hotel className="h-6 w-6 text-primary" />
            Choose Your Room
          </h2>
          <p className="text-slate-400 text-sm mt-1">Select a room type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
              <p className="text-slate-400 text-sm">Loading available rooms...</p>
            </div>
          ) : (
            rooms.map((room) => {
              const isSelected = selectedRoom === room.code;
              const hasDiscount = room.current_rate_etb < room.base_rate_etb;
              const savingsPercent = hasDiscount
                ? Math.round(((room.base_rate_etb - room.current_rate_etb) / room.base_rate_etb) * 100)
                : 0;

              return (
                <Card
                  key={room.code}
                  onClick={() => handleRoomSelect(room.code)}
                  className={`cursor-pointer bg-slate-800/50 border transition-all h-full ${
                    isSelected
                      ? "border-primary/60 ring-1 ring-primary/40 shadow-[0_0_30px_-10px] shadow-primary/30"
                      : "border-white/10 hover:border-primary/40"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Hotel className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {hasDiscount && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {savingsPercent}% off
                          </Badge>
                        )}
                        {isSelected && (
                          <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg font-bold">{room.name}</CardTitle>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{room.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Users className="h-4 w-4 text-primary" />
                      Up to {room.max_occupancy} guests
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                          ETB {room.current_rate_etb.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">/ night</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-primary">
                        <Sparkles className="h-3 w-3" />
                        {hasDiscount ? "Limited AI rate" : "AI-optimized rate"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xl font-bold text-white">Complete Your Reservation</CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedRoom
                    ? `Selected: ${rooms.find((r) => r.code === selectedRoom)?.name}`
                    : "Please select a room above"}
                </p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSearch} className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <Users className="h-4 w-4 text-primary" />
                      Guest Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">First Name</label>
                        <Input
                          value={search.guest_first_name}
                          onChange={(e) => setSearch({ ...search, guest_first_name: e.target.value })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Last Name</label>
                        <Input
                          value={search.guest_last_name}
                          onChange={(e) => setSearch({ ...search, guest_last_name: e.target.value })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          placeholder="Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs text-slate-400 font-medium">Email Address</label>
                        <Input
                          type="email"
                          value={search.guest_email}
                          onChange={(e) => setSearch({ ...search, guest_email: e.target.value })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Stay Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Check In</label>
                        <Input
                          type="date"
                          value={search.check_in}
                          onChange={(e) => setSearch({ ...search, check_in: e.target.value })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Check Out</label>
                        <Input
                          type="date"
                          value={search.check_out}
                          onChange={(e) => setSearch({ ...search, check_out: e.target.value })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Adults</label>
                        <Input
                          type="number"
                          min="1"
                          value={search.adults}
                          onChange={(e) => setSearch({ ...search, adults: parseInt(e.target.value) })}
                          className="bg-slate-900/50 border-white/10 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Children</label>
                        <Input
                          type="number"
                          min="0"
                          value={search.children}
                          onChange={(e) => setSearch({ ...search, children: parseInt(e.target.value) })}
                          className="bg-slate-900/50 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing || !selectedRoom}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Continue to Booking
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-base text-white font-semibold">Resort Amenities</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <a.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-slate-300">{a.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/15 to-blue-500/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">AI-Powered Experience</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Our intelligent system personalizes your stay with optimized pricing and curated
                      package recommendations based on your profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Step 3: Upsell Modal */}
      {step === 3 && quote && upsell && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Complete Your Booking</h2>
              <p className="text-slate-400">Choose your perfect stay option</p>
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
              {/* Room only */}
              <Card className="bg-slate-800/50 border-white/10">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-base text-white font-semibold">Your Reservation</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Room</p>
                    <p className="text-lg font-semibold text-white">{quote.room_type_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dates</p>
                    <p className="text-sm text-slate-300">
                      {search.check_in} → {search.check_out}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rate per night</p>
                    <p className="text-3xl font-bold text-white">
                      ETB {quote.recommended_rate_etb.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleConfirmBooking(false)}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 py-6"
                  >
                    Book Room Only
                  </Button>
                </CardContent>
              </Card>

              {/* Package */}
              {upsell.top_recommendation && (
                <Card className="bg-gradient-to-br from-primary/15 to-blue-500/10 border-primary/40">
                  <CardHeader className="border-b border-primary/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-white font-semibold">Recommended Package</CardTitle>
                      <Badge className="bg-primary/20 text-primary border border-primary/30">Best Value</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-white mb-1">
                        {upsell.top_recommendation.package_name}
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {upsell.top_recommendation.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {upsell.top_recommendation.components.slice(0, 3).map((comp: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{comp.service_name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Package value</span>
                        <span className="line-through">
                          ETB {upsell.top_recommendation.individual_total_etb.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-300">Your price</span>
                        <span className="text-2xl font-bold text-white">
                          ETB {upsell.top_recommendation.package_price_etb.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium pt-1">
                        Save ETB {upsell.top_recommendation.savings_etb.toLocaleString()} (
                        {Math.round(upsell.top_recommendation.discount_pct * 100)}% off)
                      </p>
                    </div>

                    <Button
                      onClick={() => handleConfirmBooking(true)}
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold"
                    >
                      {isProcessing ? "Processing..." : "Book with Package"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && bookingRef && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-slate-900 border border-white/10 max-w-lg w-full shadow-2xl">
            <CardContent className="p-10 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed</h2>
              <p className="text-slate-400 mb-8">Your reservation has been successfully processed</p>

              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Confirmation Number</p>
                <p className="text-2xl font-bold text-white tracking-wider font-mono">{bookingRef}</p>
              </div>

              <p className="text-sm text-slate-400 mb-8">
                A confirmation email has been sent to{" "}
                <span className="text-white font-medium">{search.guest_email}</span>
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold"
              >
                Make Another Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
