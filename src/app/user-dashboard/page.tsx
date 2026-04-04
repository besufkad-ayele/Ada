"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Calendar, Award, MapPin, CreditCard, Star, TrendingUp, 
  Plus, CheckCircle2, Clock, Map, Phone, Mail 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE } from "@/lib/api";

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  age: number;
  sex: string;
  role: string;
  loyalty_points: number;
  total_bookings: number;
  total_spent_etb: number;
}

interface Booking {
  id: number;
  booking_code: string;
  destination_name: string;
  room_type_name: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_amount_etb: number;
  status: string;
  created_at: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      router.push("/user-login");
      return;
    }

    const parsedUser = JSON.parse(user);
    fetchUserData(parsedUser.id);
    fetchUserBookings(parsedUser.id);
  }, [router]);

  const fetchUserData = async (userId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/users/${userId}?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        console.log("User data fetched:", data);
        setUserData(data);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBookings = async (userId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  // Updated to match the dark theme semantic colors from the design spec
  const getLoyaltyTier = (points: number) => {
    if (points >= 5000) return { name: "Platinum", color: "text-purple-400", bgColor: "bg-purple-500/20", border: "border-purple-500/30" };
    if (points >= 3000) return { name: "Gold", color: "text-amber-400", bgColor: "bg-amber-500/20", border: "border-amber-500/30" };
    if (points >= 1000) return { name: "Silver", color: "text-slate-300", bgColor: "bg-white/10", border: "border-white/20" };
    return { name: "Bronze", color: "text-orange-400", bgColor: "bg-orange-500/20", border: "border-orange-500/30" };
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
          <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  const loyaltyTier = getLoyaltyTier(userData.loyalty_points);

  return (
    <div className="min-h-screen bg-[#020617] relative font-sans text-slate-300 pb-20 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Ambient Glassmorphism Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 pt-8 px-6 md:px-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">My Dashboard</h1>
            <p className="text-slate-400 text-lg">
              Welcome back, <span className="font-semibold text-blue-400">{userData.full_name}</span>
            </p>
          </div>
          <Link 
            href="/book" 
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-[10px] font-medium transition-all duration-200 shadow-[0_2px_10px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_15px_rgba(59,130,246,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" /> New Booking
          </Link>
        </div>

        {/* KPI / Metric Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Points Card */}
          <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 hover:border-blue-500/30 rounded-[16px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Award className="h-6 w-6 text-blue-400" />
              </div>
              <Badge className={`px-3 py-1 text-xs font-medium rounded-full ${loyaltyTier.bgColor} ${loyaltyTier.color} ${loyaltyTier.border} border`}>
                {loyaltyTier.name}
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight font-mono mb-1">
                {userData.loyalty_points.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Loyalty Points</p>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 hover:border-blue-500/30 rounded-[16px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Calendar className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight font-mono mb-1">
                {userData.total_bookings}
              </p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Bookings</p>
            </div>
          </div>

          {/* Spent Card */}
          <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 hover:border-blue-500/30 rounded-[16px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <CreditCard className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight font-mono mb-1">
                <span className="text-sm text-slate-500 font-sans mr-1">ETB</span>
                {userData.total_spent_etb.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Spent</p>
            </div>
          </div>

          {/* Member Since Card */}
          <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 hover:border-blue-500/30 rounded-[16px] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight font-mono mb-1">
                2026
              </p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Member Since</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="bookings" className="space-y-8">
          <div className="flex justify-start md:justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-xl inline-flex h-auto w-max items-center justify-center shadow-lg">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[10px] px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
              >
                <User className="h-4 w-4 mr-2 inline-block" /> Profile
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[10px] px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
              >
                <Calendar className="h-4 w-4 mr-2 inline-block" /> My Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="loyalty" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[10px] px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
              >
                <Award className="h-4 w-4 mr-2 inline-block" /> Rewards
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Bookings Tab (Default) */}
          <TabsContent value="bookings" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="border-b border-white/10 bg-white/[0.02] px-8 py-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                  Recent Reservations
                </h2>
              </div>
              
              <div className="p-0">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
                      <Calendar className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No bookings found</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
                      You haven't made any reservations yet. Ready to experience smart dynamic pricing?
                    </p>
                    <Link 
                      href="/book" 
                      className="inline-flex items-center justify-center bg-transparent border border-white/20 hover:bg-white/5 hover:border-white/30 text-white px-8 py-3 rounded-[10px] font-medium transition-colors"
                    >
                      Book Your First Stay
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row gap-6 lg:items-center justify-between group cursor-default"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className={`font-semibold px-3 py-1 shadow-sm border ${
                              booking.status === "CONFIRMED" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                              booking.status === "PENDING" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                              "bg-slate-800 text-slate-300 border-slate-600"
                            }`}>
                              {booking.status === "CONFIRMED" && <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />}
                              {booking.status === "PENDING" && <Clock className="w-3.5 h-3.5 mr-1 inline" />}
                              {booking.status}
                            </Badge>
                            <span className="text-sm font-mono text-slate-500">#{booking.booking_code}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
                            {booking.destination_name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-500/70" /> {booking.room_type_name}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-emerald-500/70" /> {booking.check_in} — {booking.check_out}</span>
                            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-amber-500/70" /> {booking.adults} Adults {booking.children > 0 && `, ${booking.children} Children`}</span>
                          </div>
                        </div>

                        <div className="lg:text-right pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 mt-2 lg:mt-0 lg:pl-6 lg:border-l">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-white font-mono">
                            <span className="text-sm text-slate-500 font-sans mr-1">ETB</span>
                            {booking.total_amount_etb.toLocaleString()}
                          </p>
                          <button className="mt-4 w-full lg:w-auto px-4 py-2 bg-transparent border border-white/20 hover:bg-white/5 hover:border-blue-500/50 hover:text-blue-400 rounded-[10px] text-sm font-medium transition-all">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="border-b border-white/10 bg-white/[0.02] px-8 py-6 flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">Personal Information</h2>
                <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">Edit Profile</button>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Data Cards */}
                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6">{userData.full_name}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-emerald-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6 truncate" title={userData.email}>{userData.email}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-amber-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6 font-mono">{userData.phone_number}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="h-4 w-4 text-purple-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6">{userData.location || "Not specified"}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Age</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6">{userData.age ? `${userData.age} years` : "Not specified"}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-[12px] p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-pink-400" />
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
                    </div>
                    <p className="text-base font-medium text-white mt-1 pl-6 capitalize">{userData.sex || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#0f172a]/60 backdrop-blur-[12px] border border-white/10 rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              
              {/* Hero section */}
              <div className="relative text-center py-16 px-4 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-blue-600/5"></div>
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"
                ></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 shadow-xl ${loyaltyTier.bgColor} ${loyaltyTier.color} ${loyaltyTier.border} border backdrop-blur-md`}>
                    <Award className="h-10 w-10" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight font-mono">
                    {userData.loyalty_points.toLocaleString()} <span className="text-blue-400/80 text-2xl md:text-3xl font-bold font-sans">Pts</span>
                  </h3>
                  <Badge className={`text-sm px-4 py-1.5 ${loyaltyTier.bgColor} ${loyaltyTier.color} ${loyaltyTier.border} border font-medium`}>
                    {loyaltyTier.name} Tier Status
                  </Badge>
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-xl font-bold text-white mb-6 tracking-tight">Your AI-Powered Benefits</h4>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[16px] p-6 text-center shadow-[0_4px_15px_rgba(16,185,129,0.05)]">
                    <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-1 font-mono">10% Off</p>
                    <p className="text-sm text-emerald-200/80">Dynamic discount on next stay</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-[16px] p-6 text-center shadow-[0_4px_15px_rgba(245,158,11,0.05)]">
                    <Star className="h-8 w-8 text-amber-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-1 font-mono">Free</p>
                    <p className="text-sm text-amber-200/80">AI-recommended Room Upgrade*</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-[16px] p-6 text-center shadow-[0_4px_15px_rgba(59,130,246,0.05)]">
                    <CheckCircle2 className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-1 font-mono">Priority</p>
                    <p className="text-sm text-blue-200/80">Check-in & Concierge Support</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/5 rounded-[16px] p-6 md:p-8">
                  <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    How to Accelerate Your Earnings
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-[12px] border border-white/5">
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Book Direct</p>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">Earn 100 points for every ETB 1,000 spent on bookings via Kuraz AI.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-[12px] border border-white/5">
                      <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                        <Star className="h-5 w-5 text-pink-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Birthday Bonus</p>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">Receive a special automated 500 point bonus every year.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-[12px] border border-white/5">
                      <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Refer a Friend</p>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">Get 1,000 points when they complete their first optimized stay.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-[12px] border border-white/5">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Tier Progression</p>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">Complete 5 stays to automatically unlock Gold tier privileges.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}