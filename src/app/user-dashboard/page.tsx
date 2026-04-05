"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Calendar, Award, MapPin, CreditCard, Star, TrendingUp, 
  Plus, CheckCircle2, Clock, Map, Phone, Mail, ChevronRight, Zap,
  Navigation, Shield, Info, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE } from "@/lib/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

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
  fare_class?: string;
  is_refundable?: boolean;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  } as const;

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
        let bookingsData = await res.json();
        
        // Frontend-side Fix for "Unknown" destinations
        // We fetch the destinations list to map room types to real places
        try {
          const destRes = await fetch(`${API_BASE}/api/destinations/list`);
          if (destRes.ok) {
            const destinations = await destRes.json();
            
            // Build a mapping of room_type_name to destination_name
            // Note: This is a fallback strategy since we can't edit the backend
            const roomToDestMap: Record<string, string> = {};
            
            for (const dest of destinations) {
              const roomsRes = await fetch(`${API_BASE}/api/destinations/${dest.code}/rooms`);
              if (roomsRes.ok) {
                const rooms = await roomsRes.json();
                rooms.forEach((r: any) => {
                  roomToDestMap[r.room_type_name] = dest.name;
                });
              }
            }
            
            // Apply mapping where destination is "Unknown"
            bookingsData = bookingsData.map((b: any) => {
              if (b.destination_name === "Unknown" && roomToDestMap[b.room_type_name]) {
                return { ...b, destination_name: roomToDestMap[b.room_type_name] };
              }
              return b;
            });
          }
        } catch (mapErr) {
          console.error("Mapping failed:", mapErr);
        }
        
        setBookings(bookingsData);
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "loyalty", label: "Rewards", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#020617] relative font-sans text-slate-300 pb-20 selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[130px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px]"
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-8 px-6 md:px-8 max-w-7xl mx-auto"
      >
        
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="h-1 w-8 bg-blue-500 rounded-full"></span>
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Premium Member</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Center</span>
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
              Welcome home, <span className="font-semibold text-white">{userData.full_name}</span>
              <span className="inline-block animate-bounce-slow">✨</span>
            </p>
          </div>
          <Link 
            href="/book" 
            className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[14px] font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
            <Plus className="h-5 w-5" /> 
            <span>New Booking</span>
          </Link>
        </motion.div>

        {/* KPI / Metric Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Points Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 hover:border-blue-500/50 rounded-[24px] p-8 shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award className="h-24 w-24 text-blue-400 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7 text-blue-400" />
                </div>
                <Badge className={`px-4 py-1.5 text-xs font-bold rounded-full ${loyaltyTier.bgColor} ${loyaltyTier.color} ${loyaltyTier.border} border-2 backdrop-blur-sm shadow-lg`}>
                  {loyaltyTier.name}
                </Badge>
              </div>
              <p className="text-4xl font-black text-white tracking-tighter mb-2">
                {userData.loyalty_points.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Loyalty Points</p>
            </div>
          </motion.div>

          {/* Bookings Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 hover:border-emerald-500/50 rounded-[24px] p-8 shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="h-24 w-24 text-emerald-400 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter mb-2">
                {userData.total_bookings}
              </p>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Total Bookings</p>
            </div>
          </motion.div>

          {/* Spent Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 hover:border-amber-500/50 rounded-[24px] p-8 shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard className="h-24 w-24 text-amber-400 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="h-7 w-7 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-bold text-slate-500">ETB</span>
                <p className="text-4xl font-black text-white tracking-tighter">
                  {userData.total_spent_etb.toLocaleString()}
                </p>
              </div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">Total Investment</p>
            </div>
          </motion.div>

          {/* Member Since Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 hover:border-purple-500/50 rounded-[24px] p-8 shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="h-24 w-24 text-purple-400 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-purple-400" />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter mb-2">
                2026
              </p>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em]">Year of Legend</p>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="mb-8">
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col items-center"
          >
            <TabsList className="relative p-1.5 h-auto bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-[20px] flex items-center shadow-2xl overflow-hidden mb-12">
              <LayoutGroup>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`relative flex items-center gap-3 px-8 py-3.5 rounded-[14px] text-sm font-bold transition-all duration-300 z-10 ${
                        isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-600 rounded-[14px] shadow-[0_8px_20px_rgba(37,99,235,0.4)]"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        />
                      )}
                      <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span className="relative z-10">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </LayoutGroup>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
                  {activeTab === "bookings" && (
                    <div className="bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                      <div className="border-b border-white/5 bg-white/[0.02] px-10 py-8 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                          <Clock className="text-blue-500" />
                          Reservation History
                        </h2>
                        <div className="flex items-center gap-2">
                          <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        {bookings.length === 0 ? (
                          <div className="text-center py-32 px-4">
                            <div className="h-28 w-28 bg-slate-800/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5 rotate-3">
                              <Calendar className="h-12 w-12 text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No adventures yet</h3>
                            <p className="text-slate-400 mb-10 max-w-sm mx-auto text-base">
                              Your travel history is a blank canvas. Let's paint it with optimized luxury experiences.
                            </p>
                            <Link 
                              href="/book" 
                              className="inline-flex items-center justify-center bg-white text-slate-950 px-10 py-4 rounded-[16px] font-bold hover:bg-blue-400 transition-all shadow-xl hover:shadow-blue-500/20"
                            >
                              Explore Destinations
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-4 p-4">
                            {bookings.map((booking, index) => (
                              <motion.div 
                                key={booking.id} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                                className="group p-8 border border-white/5 bg-white/[0.01] rounded-[24px] transition-all duration-300 flex flex-col lg:flex-row gap-8 lg:items-center justify-between relative overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between lg:justify-start gap-4 mb-6">
                                    <Badge className={`font-black tracking-widest text-[10px] uppercase px-4 py-1.5 shadow-xl border-2 ${
                                      booking.status === "CONFIRMED" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                      "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    }`}>
                                      {booking.status}
                                    </Badge>
                                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-800/40 px-3 py-1 rounded-full">
                                      {booking.booking_code}
                                    </span>
                                  </div>
                                  
                                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors tracking-tighter">
                                    {booking.destination_name}
                                  </h3>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-xl border border-white/5">
                                      <MapPin className="h-4 w-4 text-blue-500" /> 
                                      <span className="font-medium text-slate-200">{booking.room_type_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-xl border border-white/5">
                                      <Calendar className="h-4 w-4 text-emerald-500" /> 
                                      <span className="font-medium text-slate-200">{booking.check_in}</span>
                                      <ChevronRight className="h-3 w-3 text-slate-600" />
                                      <span className="font-medium text-slate-200">{booking.check_out}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-xl border border-white/5 order-3 md:order-none">
                                      <User className="h-4 w-4 text-amber-500" /> 
                                      <span className="font-medium text-slate-200">
                                        {booking.adults + (booking.children || 0)} Travelers
                                      </span>
                                    </div>
                                  </div>

                                  {/* Additional Details Grid */}
                                  <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/20 px-4 py-2 rounded-lg border border-white/5">
                                      <Clock className="h-3 w-3 text-blue-400" />
                                      {(() => {
                                        const cin = new Date(booking.check_in);
                                        const cout = new Date(booking.check_out);
                                        const nights = Math.ceil((cout.getTime() - cin.getTime()) / (1000 * 3600 * 24));
                                        return <span>{nights} Nights Stay</span>;
                                      })()}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/20 px-4 py-2 rounded-lg border border-white/5">
                                      <Shield className="h-3 w-3 text-emerald-400" />
                                      <span>Travel Protection Active</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/20 px-4 py-2 rounded-lg border border-white/5">
                                      <Activity className="h-3 w-3 text-purple-400" />
                                      <span>AI-Optimized Rate</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="lg:text-right pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 min-w-[200px]">
                                  <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Stay Value</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">
                                      <span className="text-sm font-bold text-slate-500 mr-1.5 uppercase">ETB</span>
                                      {booking.total_amount_etb.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="p-3 bg-slate-800/40 border border-white/10 hover:bg-slate-700 text-slate-300 rounded-[12px] transition-all">
                                      <Info className="h-4 w-4" />
                                    </button>
                                    <button className="px-6 py-3 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-[14px] text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-500/10">
                                      Manage
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "profile" && (
                    <div className="bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                      <div className="border-b border-white/5 bg-white/[0.02] px-10 py-8 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white tracking-tight">Identity Details</h2>
                        <button className="px-6 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-sm font-bold text-blue-400 hover:bg-white/10 transition-all">
                          Edit Identity
                        </button>
                      </div>
                      
                      <div className="p-10">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {[
                            { icon: User, label: "Full Name", value: userData.full_name, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { icon: Mail, label: "Email Address", value: userData.email, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { icon: Phone, label: "Phone Number", value: userData.phone_number, color: "text-amber-400", bg: "bg-amber-500/10" },
                            { icon: Map, label: "Geographical Zone", value: userData.location || "Orbiting", color: "text-purple-400", bg: "bg-purple-500/10" },
                            { icon: Calendar, label: "Chronological Age", value: userData.age ? `${userData.age} Yrs` : "Ageless", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                            { icon: CheckCircle2, label: "Membership Tier", value: loyaltyTier.name, color: "text-pink-400", bg: "bg-pink-500/10" },
                          ].map((field, idx) => (
                            <motion.div 
                              key={field.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group p-6 bg-white/[0.02] rounded-[24px] border border-white/5 hover:border-blue-500/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-xl ${field.bg} ${field.color} border border-white/5`}>
                                  <field.icon className="h-5 w-5" />
                                </div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</label>
                              </div>
                              <p className="text-lg font-bold text-white pl-1 truncate" title={field.value.toString()}>{field.value}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "loyalty" && (
                    <div className="bg-[#1e293b]/40 backdrop-blur-[20px] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                      <div className="relative py-24 px-10 text-center border-b border-white/5">
                        <div className="absolute inset-0 bg-blue-600/5" />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative z-10"
                        >
                          <div className={`inline-flex items-center justify-center p-6 rounded-[32px] mb-8 shadow-2xl ${loyaltyTier.bgColor} ${loyaltyTier.color} ${loyaltyTier.border} border-2 backdrop-blur-md`}>
                            <Award className="h-14 w-14" />
                          </div>
                          <h3 className="text-6xl font-black text-white mb-4 tracking-tighter">
                            {userData.loyalty_points.toLocaleString()} 
                            <span className="text-blue-500 text-3xl font-black ml-3 uppercase">Pts</span>
                          </h3>
                          <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                            You are in the <span className="text-white font-bold">{loyaltyTier.name} Tier</span>. 
                            Only {(5000 - userData.loyalty_points) > 0 ? (5000 - userData.loyalty_points) : 0} points away from Diamond!
                          </p>
                          <div className="w-full max-w-md mx-auto h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((userData.loyalty_points / 5000) * 100, 100)}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            />
                          </div>
                        </motion.div>
                      </div>

                      <div className="p-10">
                        <h4 className="text-2xl font-black text-white mb-8 tracking-tight">Active Privileges</h4>
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                          {[
                            { icon: TrendingUp, title: "10% Velocity", desc: "Dynamic discount on all stays", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { icon: Star, title: "Elite Access", desc: "AI-priority room upgrades", color: "text-amber-400", bg: "bg-amber-500/10" },
                            { icon: CheckCircle2, title: "Zero Friction", desc: "Instant concierge support", color: "text-blue-400", bg: "bg-blue-500/10" },
                          ].map((perk, idx) => (
                            <motion.div 
                              key={perk.title}
                              whileHover={{ y: -5 }}
                              className="p-8 bg-white/[0.02] border border-white/5 rounded-[28px] text-center"
                            >
                              <div className={`h-16 w-16 mx-auto mb-6 rounded-2xl ${perk.bg} ${perk.color} flex items-center justify-center border border-white/5`}>
                                <perk.icon className="h-8 w-8" />
                              </div>
                              <p className="text-xl font-black text-white mb-2">{perk.title}</p>
                              <p className="text-sm text-slate-500">{perk.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}