"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Calendar, Users, CreditCard, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Hotel, Star, Package,
  User, AlertCircle
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
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({ show: false, message: '', type: 'error' });

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
  };

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
      showToast("Please select a destination", 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.room_type || !formData.check_in || !formData.check_out) {
      showToast("Please select room type and dates", 'error');
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
        showToast("Booking failed. Please try again.", 'error');
      }
    } catch (err) {
      console.error("Booking error:", err);
      showToast("Booking failed. Please try again.", 'error');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-50 relative font-sans text-slate-900 pb-20">
    {/* Subtle Background Pattern */}
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
         style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
    </div>

    {/* Toast Notification */}
    {toast.show && (
      <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    )}

    <div className="relative z-10 pt-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-10 text-center relative">
          <Link href="/user-dashboard" className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> AI-Powered Booking
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3">
            Book Your Escape
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Experience intelligent pricing and seamless reservations.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-0.5 before:bg-slate-200 before:-z-10">
            {[
              { num: 1, label: "Destination", icon: MapPin },
              { num: 2, label: "Dates & Room", icon: Hotel },
              { num: 3, label: "Enhancements", icon: Package },
              { num: 4, label: "Payment", icon: CreditCard },
              { num: 5, label: "Confirm", icon: CheckCircle2 },
            ].map((s) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center bg-slate-50 px-2 sm:px-4">
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2 ${
                    isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' :
                    isCompleted ? 'bg-indigo-600 text-white border-indigo-600' :
                    'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" /> : <s.icon className="h-4 w-4 md:h-5 md:w-5" />}
                  </div>
                  <span className={`text-xs md:text-sm mt-3 font-medium ${isActive ? 'text-indigo-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'} hidden sm:block`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto">
          
          {/* Step 1: Destination */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Destination</h2>
                  <p className="text-slate-500 text-sm">Where would you like to go?</p>
                </div>
              </div>

              {destinations.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading destinations...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {destinations.map((dest) => {
                    const isSelected = formData.destination_code === dest.code;
                    return (
                      <Card
                        key={dest.code}
                        onClick={() => handleDestinationSelect(dest.code)}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                          isSelected 
                            ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/30' 
                            : 'border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white'
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                              <Hotel className="h-6 w-6" />
                            </div>
                            {isSelected && (
                              <Badge className="bg-indigo-600 hover:bg-indigo-600 shadow-sm">Selected</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{dest.name}</h3>
                          <p className="text-sm font-medium text-indigo-600 mb-3 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {dest.location}
                          </p>
                          <p className="text-slate-600 text-sm mb-5 line-clamp-2">{dest.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {dest.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button
                  onClick={handleStep1Next}
                  disabled={!formData.destination_code}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-base rounded-xl"
                >
                  Continue to Rooms <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Rooms & Dates */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Hotel className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Rooms & Dates</h2>
                      <p className="text-slate-500 text-sm">Configure your stay details</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
               </div>

              {/* Dates & Guests Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  When are you traveling?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700">Check-In</label>
                    <Input
                      type="date"
                      value={formData.check_in}
                      onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                      className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-indigo-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700">Check-Out</label>
                    <Input
                      type="date"
                      value={formData.check_out}
                      onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                      className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-indigo-500"
                      min={formData.check_in || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700">Adults</label>
                    <Input
                      type="number"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                      className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-indigo-500"
                      min="1" max="10" required
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700">Children</label>
                    <Input
                      type="number"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                      className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-indigo-500"
                      min="0" max="10"
                    />
                  </div>
                </div>
              </div>

              {/* Room Types */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Available Rooms</h3>
                {roomTypes.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">Loading rooms...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-5">
                    {roomTypes.map((room) => {
                      const isSelected = formData.room_type === room.room_type;
                      return (
                        <Card
                          key={room.room_type}
                          onClick={() => handleRoomTypeSelect(room.room_type)}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/20' 
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">{room.room_type_name}</h4>
                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Max {room.max_occupancy}</span>
                                  <span>•</span>
                                  <span>{room.size_sqm} sqm</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-indigo-600">ETB {room.base_rate_etb.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">/ night (base rate)</div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-4">{room.description}</p>
                            
                            <div className="space-y-2">
                              {room.services_included.slice(0, 3).map((service, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  <span>{service}</span>
                                </div>
                              ))}
                            </div>

                            {isSelected && (
                               <div className="mt-5 pt-4 border-t border-indigo-100 flex justify-end">
                                  <Badge className="bg-indigo-600 px-3 py-1">Selected Room</Badge>
                               </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button
                  onClick={handleStep2Next}
                  disabled={!formData.room_type || !formData.check_in || !formData.check_out}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-base rounded-xl"
                >
                  Confirm Dates & Room <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Packages & Enhancements */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Enhance Your Stay</h2>
                      <p className="text-slate-500 text-sm">Add curated experiences to your booking</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
               </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Packages List */}
                <div className="lg:col-span-2 space-y-6">
                  {packages.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                      <p className="text-slate-500">No additional packages available for this selection.</p>
                    </div>
                  ) : (
                    packages.map((pkg) => {
                      const isSelected = formData.selected_packages.includes(pkg.id);
                      return (
                        <Card
                          key={pkg.id}
                          className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                            isSelected 
                              ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' 
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                          onClick={() => togglePackage(pkg.id)}
                        >
                          <div className="flex flex-col sm:flex-row p-6 gap-6 items-start sm:items-center">
                            <div className={`h-14 w-14 shrink-0 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                              <Package className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-lg font-bold text-slate-900">{pkg.name}</h4>
                                <span className="font-bold text-lg text-slate-900">+ETB {pkg.price_etb.toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{pkg.description}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {pkg.services.map((service, idx) => (
                                  <span key={idx} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="shrink-0">
                               <Button variant={isSelected ? "default" : "outline"} className={isSelected ? "bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" : "w-full sm:w-auto"}>
                                 {isSelected ? "Added" : "Add to Booking"}
                               </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>

                {/* AI Pricing Summary Widget */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white sticky top-6 shadow-xl">
                     <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-semibold text-lg">Price Summary</h3>
                     </div>

                     {priceCalculation ? (
                       <div className="space-y-4 text-sm text-slate-300">
                          {priceCalculation.discount_applied_pct > 0 && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-300 mb-4">
                              <div className="flex justify-between font-semibold mb-1">
                                <span>{priceCalculation.fare_class} Discount</span>
                                <span>-{priceCalculation.discount_applied_pct}%</span>
                              </div>
                              <p className="text-xs opacity-80">Saved ETB {priceCalculation.savings_etb.toLocaleString()}!</p>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span>{priceCalculation.nights} Nights Rate</span>
                            <span className="font-medium text-white">ETB {priceCalculation.room_total_etb.toLocaleString()}</span>
                          </div>

                          {formData.selected_packages.map(pkgId => {
                              const pkg = packages.find(p => p.id === pkgId);
                              if (!pkg) return null;
                              return (
                                <div key={pkgId} className="flex justify-between text-indigo-200">
                                  <span className="truncate pr-4">+ {pkg.name}</span>
                                  <span>{pkg.price_etb.toLocaleString()}</span>
                                </div>
                              )
                          })}

                          <div className="pt-4 border-t border-slate-700 flex justify-between items-center mt-6">
                            <span className="text-base font-medium text-slate-100">Total</span>
                            <span className="text-2xl font-bold text-white">
                              ETB {calculateTotal().toLocaleString()}
                            </span>
                          </div>
                       </div>
                     ) : (
                       <p className="text-slate-400 text-sm">Calculating best price...</p>
                     )}

                     <Button
                        onClick={handleStep3Next}
                        className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-6"
                      >
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Secure Checkout</h2>
                      <p className="text-slate-500 text-sm">Complete your payment securely</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(3)} className="text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
               </div>

              <div className="grid lg:grid-cols-5 gap-8">
                {/* Form area */}
                <div className="lg:col-span-3 space-y-6">
                  
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p><strong>Demo Mode Active.</strong> This is a simulation environment. No actual charges will be processed to the provided card details.</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                      Credit Card Details
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Name on Card</label>
                        <Input
                          value={formData.card_name}
                          onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                          className="bg-slate-50 border-slate-200 h-11"
                          placeholder="John Doe" required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Card Number</label>
                        <Input
                          value={formData.card_number}
                          onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                          className="bg-slate-50 border-slate-200 h-11 font-mono"
                          placeholder="0000 0000 0000 0000" maxLength={19} required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">Expiry</label>
                          <Input
                            value={formData.card_expiry}
                            onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                            className="bg-slate-50 border-slate-200 h-11 font-mono"
                            placeholder="MM/YY" maxLength={5} required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">CVC</label>
                          <Input
                            value={formData.card_cvv}
                            onChange={(e) => setFormData({ ...formData, card_cvv: e.target.value })}
                            className="bg-slate-50 border-slate-200 h-11 font-mono"
                            placeholder="123" maxLength={4} type="password" required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Final Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-6">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Booking Review</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Destination</p>
                          <p className="font-medium text-slate-900">{destinations.find(d => d.code === formData.destination_code)?.name}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Dates</p>
                          <p className="font-medium text-slate-900 text-sm">{formData.check_in} to {formData.check_out}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Guests</p>
                          <p className="font-medium text-slate-900 text-sm">{formData.adults}A, {formData.children}C</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-3 mb-6 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Room ({priceCalculation?.nights} nights)</span>
                        <span className="font-medium text-slate-900">ETB {priceCalculation?.room_total_etb.toLocaleString()}</span>
                      </div>
                      {formData.selected_packages.map(pkgId => {
                          const pkg = packages.find(p => p.id === pkgId);
                          return pkg ? (
                            <div key={pkgId} className="flex justify-between text-slate-600">
                              <span className="truncate pr-4">{pkg.name}</span>
                              <span className="font-medium text-slate-900">ETB {pkg.price_etb.toLocaleString()}</span>
                            </div>
                          ) : null;
                      })}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-300 flex justify-between items-end mb-8">
                      <span className="font-semibold text-slate-900">Total to Pay</span>
                      <span className="text-2xl font-bold text-indigo-600">ETB {calculateTotal().toLocaleString()}</span>
                    </div>

                    <Button
                      onClick={handleBooking}
                      disabled={isLoading || !formData.card_name || !formData.card_number}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base rounded-xl disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>Pay ETB {calculateTotal().toLocaleString()}</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
             </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && bookingResult && (
            <div className="animate-in zoom-in-95 fade-in duration-500 max-w-2xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-10">{bookingResult.message}</p>

                <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 text-left mb-10 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Confirmation Code</p>
                  <p className="text-4xl font-black text-slate-900 text-center tracking-widest mb-8">{bookingResult.booking_code}</p>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Destination</p>
                      <p className="font-medium text-slate-900">{bookingResult.destination_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Room</p>
                      <p className="font-medium text-slate-900">{bookingResult.room_type_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Dates</p>
                      <p className="font-medium text-slate-900 text-sm">{bookingResult.check_in} to {bookingResult.check_out}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Amount Paid</p>
                      <p className="font-bold text-emerald-600">ETB {bookingResult.total_amount_etb.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/user-dashboard">
                    <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl">
                      View in Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => window.location.reload()} className="w-full sm:w-auto px-8 py-6 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
                    Book Another
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
  );
}