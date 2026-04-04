"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard, MetricCard, DataCard, InteractiveCard } from "@/components/ui/modern-card";
import { ModernBadge } from "@/components/ui/modern-badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Hotel,
  MapPin,
  Sparkles,
  Activity,
  BarChart3,
  Clock,
  ArrowRight,
  Zap,
  Target,
  TrendingDown
} from "lucide-react";
import { API_BASE } from "@/lib/api";

interface User {
  name: string;
  role: string;
  email?: string;
}

interface Destination {
  code: string;
  name: string;
  country: string;
}

interface RoomType {
  code: string;
  name: string;
  total_count: number;
  base_rate_etb: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("kuraz_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [destRes, roomRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/destinations/list`),
        fetch(`${API_BASE}/api/room-types`),
        fetch(`${API_BASE}/api/users/list`),
      ]);

      if (destRes.ok) setDestinations(await destRes.json());
      if (roomRes.ok) setRoomTypes(await roomRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalRooms = roomTypes.reduce((sum, rt) => sum + rt.total_count, 0);
  const avgRoomRate = roomTypes.length > 0 
    ? roomTypes.reduce((sum, rt) => sum + rt.base_rate_etb, 0) / roomTypes.length 
    : 0;
  const totalRevenuePotential = roomTypes.reduce((sum, rt) => sum + (rt.base_rate_etb * rt.total_count * 30), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl"></div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white">
                Kuraz AI <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">Dashboard</span>
              </h1>
            </div>
            <p className="text-slate-400 text-lg">AI-Powered Revenue Management System</p>
          </div>
          {user && (
            <GlassCard className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 border border-primary/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="text-white font-semibold text-lg">{user.name}</p>
                  <ModernBadge variant="primary" className="mt-1">{user.role}</ModernBadge>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Hotel}
            label="Total Rooms"
            value={totalRooms}
            trend={{ value: "100%", isPositive: true }}
          />
          <MetricCard
            icon={DollarSign}
            label="Avg Room Rate"
            value={`ETB ${avgRoomRate.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
            trend={{ value: "12%", isPositive: true }}
          />
          <MetricCard
            icon={MapPin}
            label="Destinations"
            value={destinations.length}
            trend={{ value: "Active", isPositive: true }}
          />
          <MetricCard
            icon={Users}
            label="Registered Users"
            value={users.length}
            trend={{ value: "8 new", isPositive: true }}
          />
        </div>

        {/* AI Features Section */}
        <DataCard
          icon={Sparkles}
          title="AI Revenue Optimization Features"
          badge={<ModernBadge variant="success">Active</ModernBadge>}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 rounded-xl border border-white/5 group-hover:border-primary/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Dynamic Pricing</h3>
                <p className="text-slate-400 text-sm mb-4">
                  AI adjusts room rates based on occupancy, lead time, and demand patterns
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <span>Occupancy-based multipliers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <span>Lead time optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <span>Weekend premiums</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 rounded-xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Guest Segmentation</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Intelligent categorization of guests for personalized experiences
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                    <span>Business travelers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                    <span>Leisure tourists</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                    <span>Families & couples</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 rounded-xl border border-white/5 group-hover:border-amber-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Package Recommender</h3>
                <p className="text-slate-400 text-sm mb-4">
                  AI suggests optimal service packages to maximize revenue
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-amber-400 rounded-full"></div>
                    <span>Romance packages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-amber-400 rounded-full"></div>
                    <span>Family experiences</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 bg-amber-400 rounded-full"></div>
                    <span>Wellness & adventure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Destinations Overview */}
        <DataCard
          icon={MapPin}
          title="Kuriftu Resort Destinations"
          badge={<ModernBadge variant="success">{destinations.length} Active</ModernBadge>}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <InteractiveCard key={dest.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
                    <Hotel className="h-6 w-6 text-primary" />
                  </div>
                  <ModernBadge variant="success">Active</ModernBadge>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{dest.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{dest.location}</p>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{dest.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dest.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                    <ModernBadge key={idx} variant="outline" className="text-xs">
                      {amenity}
                    </ModernBadge>
                  ))}
                </div>
              </InteractiveCard>
            ))}
          </div>
        </DataCard>

        {/* Destinations & Room Types */}
        <DataCard
          icon={Hotel}
          title="Destinations & Room Types"
          badge={<ModernBadge variant="info">Pricing Overview</ModernBadge>}
        >
          <div className="space-y-8">
            {destinations.map((dest) => (
              <div key={dest.id} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                  <ModernBadge variant="primary">{dest.location}</ModernBadge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Standard Room */}
                  <GlassCard className="p-5 hover:border-primary/30 transition-all">
                    <h4 className="text-lg font-semibold text-white mb-3">Standard Room</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Base Rate</span>
                        <span className="text-white font-semibold">ETB 8,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Rooms</span>
                        <span className="text-white">20-30</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Occupancy</span>
                        <span className="text-white">2 guests</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Deluxe Room */}
                  <GlassCard className="p-5 hover:border-emerald-500/30 transition-all">
                    <h4 className="text-lg font-semibold text-white mb-3">Deluxe Room</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Base Rate</span>
                        <span className="text-white font-semibold">ETB 12,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Rooms</span>
                        <span className="text-white">15-22</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Occupancy</span>
                        <span className="text-white">2-3 guests</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Suite */}
                  <GlassCard className="p-5 hover:border-amber-500/30 transition-all">
                    <h4 className="text-lg font-semibold text-white mb-3">Suite</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Base Rate</span>
                        <span className="text-white font-semibold">ETB 18,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Rooms</span>
                        <span className="text-white">8-12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Occupancy</span>
                        <span className="text-white">3-4 guests</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold">Airline-Style Dynamic Pricing</span>
            </div>
            <p className="text-slate-300 text-sm">
              Prices adjust automatically based on booking time, occupancy, weekends, and Ethiopian holidays. 
              Early bookers get up to 10% discount. Last-minute bookings pay premium rates.
            </p>
          </div>
        </DataCard>

        {/* Revenue Potential */}
        <GlassCard className="p-8 bg-gradient-to-br from-primary/10 via-amber-500/5 to-orange-500/10 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">Monthly Revenue Potential</h3>
              </div>
              <p className="text-slate-400 mb-6">Based on base rates at 100% occupancy</p>
              <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent mb-4">
                ETB {totalRevenuePotential.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
              <p className="text-slate-400 text-sm">
                AI optimization can increase revenue by 15-25% through dynamic pricing
              </p>
            </div>
            <div className="text-center lg:text-right">
              <div className="relative inline-block mb-6">
                <TrendingUp className="h-32 w-32 text-primary opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-black text-primary">+25%</div>
                </div>
              </div>
              <ModernBadge variant="success" className="text-lg px-6 py-3">
                <Zap className="h-4 w-4 mr-2" />
                AI Powered
              </ModernBadge>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <InteractiveCard onClick={() => router.push('/booking')}>
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">New Booking</h3>
              <p className="text-slate-400 text-sm mb-4">Create a new reservation</p>
              <div className="flex items-center justify-center text-primary text-sm font-semibold">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard onClick={() => router.push('/admin-bookings')}>
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">View Bookings</h3>
              <p className="text-slate-400 text-sm mb-4">Manage all reservations</p>
              <div className="flex items-center justify-center text-emerald-400 text-sm font-semibold">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard onClick={() => router.push('/admin-users')}>
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">User Management</h3>
              <p className="text-slate-400 text-sm mb-4">View all registered users</p>
              <div className="flex items-center justify-center text-amber-400 text-sm font-semibold">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
}
