"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Calendar, Users, CreditCard, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Hotel, Star, Package,
  User, Mail, Phone, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_BASE } from "@/lib/api";

interface Destination {
  id: number;
  code: string;
  name: string;
  location: string;
  description: string;
  amenities: string[];
}

interface RoomType {
  id: number;
  room_type: string;
  room_type_name: string;
  total_rooms: number;
  base_rate_etb: number;
  max_occupancy: number;
  size_sqm: number;
  description: string;
  amenities: string[];
  services_included: string[];
}

interface Package {
  id: string;
  name: string;
  description: string;
  price_etb: number;
  services: string[];
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    destination_code: "",
    room_type: "",
    check_in: "",
    check_out: "",
    adults: 2,
    children: 0,
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    selected_packages: [] as string[],
    payment_method: "card",
    // Card payment
    card_number: "",
    card_name: "",
    card_expiry: "",
    card_cvv: "",
    // Mobile payment (TeleBirr)
    telebirr_phone: "",
    // Bank transfer
    bank_name: "",
    bank_account: "",
    bank_holder: "",
  });

  // Booking Result
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setIsAuthenticated(true);
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setFormData(prev => ({
        ...prev,
        guest_name: userData.full_name || "",
        guest_email: userData.email || "",
        guest_phone: userData.phone_number || "",
      }));
    } else {
      router.push("/user-login");
    }
  }, [router]);

  // Fetch destinations
  useEffect(() => {
    if (isAuthenticated) {
      fetchDestinations();
    }
  }, [isAuthenticated]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/destinations/list`);
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
    }
  };

  const fetchRoomTypes = async (destinationCode: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/destinations/${destinationCode}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRoomTypes(data);
      }
    } catch (err) {
      console.error("Failed to fetch room types:", err);
    }
  };

  const calculatePrice = async () => {
    if (!formData.destination_code || !formData.room_type || !formData.check_in || !formData.check_out) {
      return;
    }

    try {
      // Use new airline pricing API
      const res = await fetch(`${API_BASE}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_code: formData.destination_code,
          room_type: formData.room_type,
          check_in: formData.check_in,
          adults: formData.adults,
          use_ai: true
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Transform to match existing structure
        const nights = Math.ceil((new Date(formData.check_out).getTime() - new Date(formData.check_in).getTime()) / (1000 * 60 * 60 * 24));
        setPriceCalculation({
          base_rate_etb: data.pricing.base_rate,
          optimized_rate_etb: data.pricing.optimized_rate,
          nights: nights,
          room_total_etb: data.pricing.optimized_rate * nights,
          occupancy_rate: data.pricing.pricing_factors.current_occupancy_pct,
          pricing_factors: data.pricing.pricing_factors,
          discount_applied_pct: data.pricing.discount_applied_pct,
          savings_etb: data.pricing.savings_etb,
          fare_class: data.pricing.fare_class,
          restrictions: data.pricing.restrictions
        });
      }
    } catch (err) {
      console.error("Failed to calculate price:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/destinations/packages?` +
        `destination_code=${formData.destination_code}&` +
        `room_type=${formData.room_type}&` +
        `adults=${formData.adults}`
      );
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  const handleDestinationSelect = (code: string) => {
    setFormData({ ...formData, destination_code: code, room_type: "" });
    fetchRoomTypes(code);
  };

  const handleRoomTypeSelect = (roomType: string) => {
    setFormData({ ...formData, room_type: roomType });
  };

  const handleStep1Next = () => {
    if (!formData.destination_code) {
      alert("Please select a destination");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.room_type || !formData.check_in || !formData.check_out) {
      alert("Please select room type and dates");
      return;
    }
    calculatePrice();
    fetchPackages();
    setStep(3);
  };

  const handleStep3Next = () => {
    setStep(4);
  };

  const handleBooking = async () => {
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/destinations/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_code: formData.destination_code,
          room_type: formData.room_type,
          check_in: formData.check_in,
          check_out: formData.check_out,
          adults: formData.adults,
          children: formData.children,
          guest_email: formData.guest_email,
          guest_name: formData.guest_name,
          guest_phone: formData.guest_phone,
          selected_packages: formData.selected_packages,
          payment_method: formData.payment_method,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookingResult(data);
        setStep(5);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePackage = (packageId: string) => {
    if (formData.selected_packages.includes(packageId)) {
      setFormData({
        ...formData,
        selected_packages: formData.selected_packages.filter(id => id !== packageId)
      });
    } else {
      setFormData({
        ...formData,
        selected_packages: [...formData.selected_packages, packageId]
      });
    }
  };

  const calculateTotal = () => {
    let total = priceCalculation?.room_total_etb || 0;
    
    formData.selected_packages.forEach(pkgId => {
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg) {
        total += pkg.price_etb;
      }
    });
    
    return total;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 text-sm font-semibold">
              AI-Powered Booking
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Book Your Dream Escape
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience luxury redefined with our intelligent booking system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
            {[
              { num: 1, label: "Destination", icon: MapPin },
              { num: 2, label: "Room & Dates", icon: Hotel },
              { num: 3, label: "Packages", icon: Package },
              { num: 4, label: "Payment", icon: CreditCard },
              { num: 5, label: "Confirmation", icon: CheckCircle2 },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex flex-col items-center transition-all duration-300 ${
                  step >= s.num ? 'opacity-100 scale-100' : 'opacity-40 scale-90'
                }`}>
                  <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-300' 
                      : 'bg-white text-gray-400 shadow-gray-200'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <s.icon className="h-6 w-6" />
                    )}
                    {step === s.num && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold hidden md:block text-gray-700">{s.label}</span>
                </div>
                {idx < 4 && (
                  <div className={`h-1 w-8 md:w-16 mx-1 md:mx-2 rounded-full transition-all duration-300 ${
                    step > s.num 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Destination */}
        {step === 1 && (
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MapPin className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Select Your Destination</CardTitle>
                  <p className="text-indigo-100 mt-1">Choose your perfect getaway location</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <Card
                    key={dest.code}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 group ${
                      formData.destination_code === dest.code
                        ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-xl shadow-indigo-200'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleDestinationSelect(dest.code)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all ${
                          formData.destination_code === dest.code
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-300'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
                        }`}>
                          <Hotel className={`h-7 w-7 ${
                            formData.destination_code === dest.code ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'
                          }`} />
                        </div>
                        {formData.destination_code === dest.code && (
                          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                            ✓ Selected
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h3>
                      <p className="text-sm text-indigo-600 font-semibold mb-3 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {dest.location}
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">{dest.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-10 flex justify-end">
                <Button
                  onClick={handleStep1Next}
                  disabled={!formData.destination_code}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 py-7 text-lg font-bold shadow-xl shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continue to Rooms <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Room Type & Dates */}
        {step === 2 && (
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Hotel className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Choose Your Room</CardTitle>
                  <p className="text-purple-100 mt-1">Select room type and travel dates</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Room Types */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-purple-600" />
                  Available Room Types
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roomTypes.map((room) => (
                    <Card
                      key={room.room_type}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 group ${
                        formData.room_type === room.room_type
                          ? 'border-purple-500 ring-4 ring-purple-200 shadow-xl shadow-purple-200'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleRoomTypeSelect(room.room_type)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                            formData.room_type === room.room_type
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-pink-100'
                          }`}>
                            <Star className={`h-6 w-6 ${
                              formData.room_type === room.room_type ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                            }`} />
                          </div>
                          {formData.room_type === room.room_type && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                              ✓ Selected
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{room.room_type_name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">{room.size_sqm} sqm • {room.max_occupancy} guests max</span>
                          </div>
                          {room.services_included.slice(0, 2).map((service, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t-2 border-purple-100">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ETB {room.base_rate_etb.toLocaleString()}
                          </div>
                          <span className="text-sm text-gray-600">per night</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  Travel Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Check-In Date
                    </label>
                    <Input
                      type="date"
                      value={formData.check_in}
                      onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                      className="border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 h-12 text-lg rounded-xl"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Check-Out Date
                    </label>
                    <Input
                      type="date"
                      value={formData.check_out}
                      onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                      className="border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 h-12 text-lg rounded-xl"
                      min={formData.check_in || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Adults
                    </label>
                    <Input
                      type="number"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                      className="border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 h-12 text-lg rounded-xl"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Children
                    </label>
                    <Input
                      type="number"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                      className="border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 h-12 text-lg rounded-xl"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline" 
                  className="px-8 py-6 border-2 hover:bg-gray-50 font-semibold"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  onClick={handleStep2Next}
                  disabled={!formData.room_type || !formData.check_in || !formData.check_out}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-7 text-lg font-bold shadow-xl shadow-purple-300"
                >
                  Continue to Packages <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Packages */}
        {step === 3 && (
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Enhance Your Experience</CardTitle>
                  <p className="text-pink-100 mt-1">AI-curated packages just for you</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Price Summary */}
              {priceCalculation && (
                <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 border-2 border-pink-300 mb-10 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl">AI-Optimized Pricing</h3>
                        <p className="text-sm text-gray-600">Dynamic pricing based on demand & preferences</p>
                      </div>
                    </div>
                    <div className="space-y-3 bg-white/60 backdrop-blur-sm rounded-xl p-6">
                      {priceCalculation.discount_applied_pct > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-green-700 font-semibold flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              {priceCalculation.fare_class} Fare
                            </span>
                            <span className="text-green-700 font-bold">
                              {priceCalculation.discount_applied_pct}% OFF
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            You save ETB {priceCalculation.savings_etb.toLocaleString()} per night!
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-500 text-sm">
                        <span>Base Rate</span>
                        <span className={priceCalculation.discount_applied_pct > 0 ? 'line-through' : ''}>
                          ETB {priceCalculation.base_rate_etb.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-gray-700 text-lg">
                        <span className="font-medium">Nightly Rate (Optimized)</span>
                        <span className="font-bold text-pink-600">
                          ETB {priceCalculation.optimized_rate_etb.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Number of Nights</span>
                        <span className="font-bold">{priceCalculation.nights}</span>
                      </div>
                      
                      {priceCalculation.pricing_factors && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                          <p className="font-semibold text-blue-900 mb-2">Pricing Factors:</p>
                          <div className="flex justify-between text-blue-700">
                            <span>Days until arrival:</span>
                            <span className="font-medium">{priceCalculation.pricing_factors.days_until_arrival} days</span>
                          </div>
                          <div className="flex justify-between text-blue-700">
                            <span>Current occupancy:</span>
                            <span className="font-medium">{priceCalculation.pricing_factors.current_occupancy_pct}%</span>
                          </div>
                          {priceCalculation.pricing_factors.weekend_premium > 1 && (
                            <div className="flex justify-between text-blue-700">
                              <span>Weekend premium:</span>
                              <span className="font-medium">+{((priceCalculation.pricing_factors.weekend_premium - 1) * 100).toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="border-t-2 border-pink-300 pt-3 flex justify-between text-2xl font-bold">
                        <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                          Room Total
                        </span>
                        <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                          ETB {priceCalculation.room_total_etb.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Packages */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="h-6 w-6 text-pink-600" />
                  Available Packages
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => {
                    const isSelected = formData.selected_packages.includes(pkg.id);
                    return (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 group ${
                          isSelected 
                            ? 'border-green-500 ring-4 ring-green-200 shadow-xl shadow-green-200' 
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                        onClick={() => togglePackage(pkg.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-pink-100 group-hover:to-rose-100'
                            }`}>
                              <Package className={`h-6 w-6 ${
                                isSelected ? 'text-white' : 'text-gray-600 group-hover:text-pink-600'
                              }`} />
                            </div>
                            {isSelected && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                ✓ Added
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                          <div className="space-y-2 mb-4 bg-green-50 rounded-xl p-4">
                            {pkg.services.map((service, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>{service}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4 border-t-2 border-gray-100">
                            <div className="text-2xl font-bold text-green-600">
                              +ETB {pkg.price_etb.toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={() => setStep(2)} 
                  variant="outline" 
                  className="px-8 py-6 border-2 hover:bg-gray-50 font-semibold"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  onClick={handleStep3Next}
                  className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 px-10 py-7 text-lg font-bold shadow-xl shadow-pink-300"
                >
                  Continue to Payment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Secure Payment</CardTitle>
                  <p className="text-blue-100 mt-1">Your information is encrypted and secure</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Payment Form */}
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      Payment Information
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          Cardholder Name
                        </label>
                        <Input
                          value={formData.card_name}
                          onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 h-12 text-lg rounded-xl"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          Card Number
                        </label>
                        <Input
                          value={formData.card_number}
                          onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 h-12 text-lg rounded-xl font-mono"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 block">Expiry Date</label>
                          <Input
                            value={formData.card_expiry}
                            onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                            className="border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 h-12 text-lg rounded-xl font-mono"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 block">CVV</label>
                          <Input
                            value={formData.card_cvv}
                            onChange={(e) => setFormData({ ...formData, card_cvv: e.target.value })}
                            className="border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 h-12 text-lg rounded-xl font-mono"
                            placeholder="123"
                            maxLength={3}
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-cyan-900 mb-1">Demo Mode Active</p>
                          <p className="text-sm text-cyan-800">
                            This is a simulation. No actual payment will be processed.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Summary */}
                <div>
                  <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0 shadow-2xl shadow-indigo-300 sticky top-4">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6" />
                        Booking Summary
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-sm text-indigo-200 mb-1">Destination</p>
                          <p className="font-bold text-xl">
                            {destinations.find(d => d.code === formData.destination_code)?.name}
                          </p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-sm text-indigo-200 mb-1">Room Type</p>
                          <p className="font-bold text-lg">
                            {roomTypes.find(r => r.room_type === formData.room_type)?.room_type_name}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-sm text-indigo-200 mb-1">Check-In</p>
                            <p className="font-bold">{formData.check_in}</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-sm text-indigo-200 mb-1">Check-Out</p>
                            <p className="font-bold">{formData.check_out}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-sm text-indigo-200 mb-1">Guests</p>
                          <p className="font-bold">
                            {formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                            {formData.children > 0 && `, ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`}
                          </p>
                        </div>
                      </div>

                      <div className="border-t-2 border-white/30 pt-6 space-y-3">
                        <div className="flex justify-between text-indigo-100">
                          <span>Room ({priceCalculation?.nights} nights)</span>
                          <span className="font-bold">ETB {priceCalculation?.room_total_etb.toLocaleString()}</span>
                        </div>
                        
                        {formData.selected_packages.length > 0 && (
                          <div className="space-y-2 pb-3 border-b border-white/30">
                            {formData.selected_packages.map(pkgId => {
                              const pkg = packages.find(p => p.id === pkgId);
                              return pkg ? (
                                <div key={pkgId} className="flex justify-between text-indigo-100 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />
                                    {pkg.name}
                                  </span>
                                  <span className="font-bold">ETB {pkg.price_etb.toLocaleString()}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center">
                          <span className="text-xl font-bold">Total Amount</span>
                          <span className="text-3xl font-black">ETB {calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <Button 
                  onClick={() => setStep(3)} 
                  variant="outline" 
                  className="px-8 py-6 border-2 hover:bg-gray-50 font-semibold"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={isLoading || !formData.card_name || !formData.card_number}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-12 py-7 text-lg font-bold shadow-xl shadow-green-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm & Pay
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && bookingResult && (
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white p-8">
              <div className="flex items-center gap-3 justify-center">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-3xl font-bold">Booking Confirmed!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <div className="mb-10">
                <div className="relative inline-block mb-8">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto shadow-2xl shadow-green-300">
                    <CheckCircle2 className="h-20 w-20 text-green-600" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                  Payment Successful!
                </h2>
                
                <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                  {bookingResult.message}
                </p>

                <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 max-w-3xl mx-auto shadow-xl">
                  <CardContent className="p-10">
                    <div className="mb-8">
                      <p className="text-sm text-gray-600 mb-3 font-semibold">Your Booking Code</p>
                      <div className="bg-white rounded-2xl p-6 shadow-inner">
                        <p className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-wider">
                          {bookingResult.booking_code}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Destination</p>
                        <p className="font-bold text-gray-900 text-lg">{bookingResult.destination_name}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Room Type</p>
                        <p className="font-bold text-gray-900 text-lg">{bookingResult.room_type_name}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Check-In</p>
                        <p className="font-bold text-gray-900">{bookingResult.check_in}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Check-Out</p>
                        <p className="font-bold text-gray-900">{bookingResult.check_out}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Total Paid</p>
                        <p className="font-bold text-green-600 text-2xl">ETB {bookingResult.total_amount_etb.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Status</p>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-4 py-1">
                          ✓ {bookingResult.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
                <Link href="/user-dashboard">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 py-7 text-lg font-bold shadow-xl shadow-indigo-300">
                    <User className="mr-2 h-5 w-5" />
                    View My Bookings
                  </Button>
                </Link>
                <Link href="/book">
                  <Button variant="outline" className="px-10 py-7 text-lg font-bold border-2 hover:bg-gray-50">
                    Back to Resorts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}