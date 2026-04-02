"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format, addDays } from "date-fns";
import { 
  CalendarDays, 
  Users, 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Star,
  Hotel,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_BASE } from "@/lib/api";
import Image from "next/image";

interface RoomType {
  code: string;
  name: string;
  description: string;
  base_rate_etb: number;
  current_rate_etb: number;
  max_occupancy: number;
  amenities: string[];
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(searchParams.get('room'));
  
  // Search state
  const [search, setSearch] = useState({
    check_in: format(addDays(new Date(), 10), "yyyy-MM-dd"),
    check_out: format(addDays(new Date(), 12), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    room_type_code: searchParams.get('room') || "",
    guest_nationality: "International",
    is_corporate: false,
    guest_first_name: "",
    guest_last_name: "",
    guest_email: "",
    channel: "direct",
  });

  // API Results
  const [quote, setQuote] = useState<any>(null);
  const [upsell, setUpsell] = useState<any>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Fetch rooms on load
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${API_BASE}/api/room-types`);
        if (res.ok) {
          const data = await res.json();
          
          // Fetch current pricing for each room
          const today = new Date().toISOString().split('T')[0];
          const roomsWithPricing = await Promise.all(
            data.map(async (room: any) => {
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
      }
    }

    fetchRooms();
  }, []);

  const handleRoomSelect = (roomCode: string) => {
    setSelectedRoom(roomCode);
    setSearch({ ...search, room_type_code: roomCode });
    // Don't change step, let them fill the form first
  };

  // Get Quote and continue
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

  // Get Package Upsell
  useEffect(() => {
    if (step === 3 && quote) {
      fetchUpsell();
    }
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
      
      if (res.ok) {
        const data = await res.json();
        setUpsell(data);
      }
    } catch (err) {
      console.error("Failed to fetch upsell:", err);
    }
  };

  // Confirm Booking
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Hero Section with Image */}
      <div className="relative h-[500px] bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <Image
          src="/kuriftu.png"
          alt="Kuriftu Resort"
          fill
          className="object-cover mix-blend-overlay"
          priority
        />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Welcome to Kuriftu Resort & Spa
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
              Experience Ethiopian Luxury with AI-Powered Personalization
            </p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Intelligent pricing • Personalized packages • Seamless booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Showcase Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 mb-12">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Hotel className="h-6 w-6" />
              Choose Your Perfect Room
            </CardTitle>
            <p className="text-amber-50 mt-2">AI-optimized pricing for the best value</p>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-b from-white to-amber-50/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading available rooms...</p>
                </div>
              ) : (
                rooms.map((room) => {
                  const isSelected = selectedRoom === room.code;
                  // Only show if AI gave a discount (optional - for transparency)
                  const hasDiscount = room.current_rate_etb < room.base_rate_etb;
                  const savingsPercent = hasDiscount 
                    ? Math.round(((room.base_rate_etb - room.current_rate_etb) / room.base_rate_etb) * 100)
                    : 0;

                  return (
                    <Card 
                      key={room.code} 
                      className={`cursor-pointer transition-all hover:shadow-2xl border-2 bg-white ${
                        isSelected ? 'ring-4 ring-amber-400 shadow-xl border-amber-500' : 'border-gray-200 hover:border-amber-300'
                      }`}
                      onClick={() => handleRoomSelect(room.code)}
                    >
                      <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 pb-4 border-b-2 border-amber-100">
                        <div className="flex items-start justify-between mb-2">
                          <Hotel className="h-8 w-8 text-amber-600" />
                          <div className="flex gap-2">
                            {hasDiscount && (
                              <Badge className="bg-green-500 text-white border-0 flex items-center gap-1 shadow-md">
                                <TrendingDown className="h-3 w-3" />
                                Save {savingsPercent}%
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge className="bg-amber-600 text-white border-0 shadow-md">✓ Selected</Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-gray-900 text-xl font-bold">{room.name}</CardTitle>
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">{room.description}</p>
                      </CardHeader>
                      
                      <CardContent className="p-5 space-y-3 bg-white">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <Users className="h-4 w-4 text-amber-600" />
                          <span>Up to {room.max_occupancy} guests</span>
                        </div>

                        <div className="pt-3 border-t-2 border-gray-100">
                          {/* Only show AI-optimized price - no base rate confusion */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ETB {room.current_rate_etb.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">/ night</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 bg-amber-50 px-2 py-1 rounded-md">
                            <Sparkles className="h-3 w-3 text-amber-600" />
                            <p className="text-xs text-amber-700 font-semibold">
                              {hasDiscount ? "Special AI rate - limited time!" : "AI-optimized best rate"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="text-xl font-bold">Complete Your Reservation</CardTitle>
                <p className="text-amber-50 text-sm mt-1 font-medium">
                  {selectedRoom ? `Selected: ${rooms.find(r => r.code === selectedRoom)?.name}` : 'Please select a room above'}
                </p>
              </CardHeader>
              <CardContent className="p-8 bg-gradient-to-b from-white to-amber-50/20">
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Guest Details */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-amber-600" />
                      Guest Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">First Name</label>
                        <Input
                          value={search.guest_first_name}
                          onChange={(e) => setSearch({ ...search, guest_first_name: e.target.value })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">Last Name</label>
                        <Input
                          value={search.guest_last_name}
                          onChange={(e) => setSearch({ ...search, guest_last_name: e.target.value })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-semibold text-gray-800 mb-2 block">Email Address</label>
                      <Input
                        type="email"
                        value={search.guest_email}
                        onChange={(e) => setSearch({ ...search, guest_email: e.target.value })}
                        className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <CalendarDays className="h-5 w-5 text-amber-600" />
                      Stay Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">Check In</label>
                        <Input
                          type="date"
                          value={search.check_in}
                          onChange={(e) => setSearch({ ...search, check_in: e.target.value })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">Check Out</label>
                        <Input
                          type="date"
                          value={search.check_out}
                          onChange={(e) => setSearch({ ...search, check_out: e.target.value })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">Adults</label>
                        <Input
                          type="number"
                          min="1"
                          value={search.adults}
                          onChange={(e) => setSearch({ ...search, adults: parseInt(e.target.value) })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-2 block">Children</label>
                        <Input
                          type="number"
                          min="0"
                          value={search.children}
                          onChange={(e) => setSearch({ ...search, children: parseInt(e.target.value) })}
                          className="border-2 border-gray-300 focus:border-amber-500 text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing || !selectedRoom}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-bold shadow-lg"
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

          {/* Right: Resort Info */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-100">
                <CardTitle className="text-lg text-gray-900 font-bold">Resort Amenities</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                    <Wifi className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Free High-Speed WiFi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                    <Waves className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Infinity Pool & Spa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                    <Dumbbell className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-gray-800 font-medium">24/7 Fitness Center</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                    <UtensilsCrossed className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Fine Dining Restaurant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                    <Coffee className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Ethiopian Coffee Ceremony</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">AI-Powered Experience</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Our intelligent system personalizes your stay with optimized pricing and curated package recommendations based on your preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Step 3: Package Upsell Modal/Overlay */}
      {step === 3 && quote && upsell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
              <p className="text-amber-50">Choose your perfect stay option</p>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Room Quote */}
                <Card className="border-2 border-gray-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-100">
                    <CardTitle className="text-lg text-gray-900 font-bold">Your Reservation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 bg-white">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Room</p>
                      <p className="text-lg font-bold text-gray-900">{quote.room_type_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Dates</p>
                      <p className="text-gray-900 font-medium">{search.check_in} to {search.check_out}</p>
                    </div>
                    <div className="pt-4 border-t-2 border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Rate per night</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ETB {quote.recommended_rate_etb.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleConfirmBooking(false)}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full border-2 border-gray-400 text-gray-900 hover:bg-gray-100 font-semibold py-6"
                    >
                      Book Room Only
                    </Button>
                  </CardContent>
                </Card>

                {/* Package Upsell */}
                {upsell.top_recommendation && (
                  <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Recommended Package</CardTitle>
                        <Badge className="bg-yellow-400 text-gray-900 border-0 font-bold shadow-md">⭐ Best Value</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 bg-white">
                      <div>
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          {upsell.top_recommendation.package_name}
                        </p>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">
                          {upsell.top_recommendation.description}
                        </p>
                      </div>

                      <div className="space-y-2 bg-green-50 p-4 rounded-lg">
                        {upsell.top_recommendation.components.slice(0, 3).map((comp: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>{comp.service_name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t-2 border-green-200">
                        <div className="flex justify-between text-sm text-gray-700 font-semibold mb-1">
                          <span>Package value</span>
                          <span className="line-through">ETB {upsell.top_recommendation.individual_total_etb.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-gray-900 font-bold">Your price</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ETB {upsell.top_recommendation.package_price_etb.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-green-100 px-3 py-2 rounded-md">
                          <p className="text-sm text-green-800 font-bold">
                            💰 Save ETB {upsell.top_recommendation.savings_etb.toLocaleString()} ({Math.round(upsell.top_recommendation.discount_pct * 100)}% off)
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleConfirmBooking(true)}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 shadow-lg"
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
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && bookingRef && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-white max-w-2xl w-full shadow-2xl border-4 border-green-300 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-green-50 text-lg font-medium">
                Your reservation has been successfully processed
              </p>
            </div>
            
            <CardContent className="p-12 text-center bg-gradient-to-b from-white to-green-50">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8 mb-8 shadow-md">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Confirmation Number</p>
                <p className="text-3xl font-bold text-gray-900 tracking-wider">{bookingRef}</p>
              </div>
              
              <div className="bg-green-100 border-2 border-green-200 rounded-lg p-6 mb-8">
                <p className="text-gray-900 font-semibold leading-relaxed">
                  ✉️ A confirmation email has been sent to<br />
                  <span className="text-green-700 font-bold">{search.guest_email}</span>
                </p>
              </div>
              
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-6 px-12 text-lg shadow-lg"
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
