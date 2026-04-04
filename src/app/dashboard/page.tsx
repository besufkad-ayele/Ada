"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Clock
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Kuraz AI <span className="text-amber-500">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">AI-Powered Revenue Management System</p>
          </div>
          {user && (
            <div className="text-right bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-medium">{user.name}</p>
              <Badge className="mt-1 bg-amber-500">{user.role}</Badge>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Rooms</p>
                  <p className="text-4xl font-bold mt-2">{totalRooms}</p>
                  <p className="text-blue-100 text-xs mt-2">Across all room types</p>
                </div>
                <Hotel className="h-12 w-12 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Avg Room Rate</p>
                  <p className="text-4xl font-bold mt-2">ETB {avgRoomRate.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  <p className="text-green-100 text-xs mt-2">Base rate per night</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Destinations</p>
                  <p className="text-4xl font-bold mt-2">{destinations.length}</p>
                  <p className="text-purple-100 text-xs mt-2">Kuriftu locations</p>
                </div>
                <MapPin className="h-12 w-12 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Registered Users</p>
                  <p className="text-4xl font-bold mt-2">{users.length}</p>
                  <p className="text-amber-100 text-xs mt-2">Active accounts</p>
                </div>
                <Users className="h-12 w-12 text-amber-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Section */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              AI Revenue Optimization Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
                <Activity className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Dynamic Pricing</h3>
                <p className="text-gray-400 text-sm mb-4">
                  AI adjusts room rates based on occupancy, lead time, and demand patterns
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span>Occupancy-based multipliers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span>Lead time optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span>Weekend premiums</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
                <TrendingUp className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Guest Segmentation</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Intelligent categorization of guests for personalized experiences
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span>Business travelers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span>Leisure tourists</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span>Families & couples</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
                <BarChart3 className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Package Recommender</h3>
                <p className="text-gray-400 text-sm mb-4">
                  AI suggests optimal service packages to maximize revenue
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                    <span>Romance packages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                    <span>Family experiences</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                    <span>Wellness & adventure</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Overview */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-amber-500" />
              Kuriftu Resort Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Card key={dest.id} className="bg-gray-900/50 border-gray-700 hover:border-amber-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Hotel className="h-8 w-8 text-amber-500" />
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{dest.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{dest.location}</p>
                    <p className="text-gray-500 text-xs mb-4">{dest.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {dest.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Destinations & Room Types */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Hotel className="h-6 w-6 text-amber-500" />
              Destinations & Room Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {destinations.map((dest) => (
                <div key={dest.id} className="border-b border-gray-700 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-amber-500" />
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    <Badge className="bg-blue-500">{dest.location}</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Standard Room */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Standard Room</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Base Rate</span>
                            <span className="text-white font-semibold">ETB 8,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rooms</span>
                            <span className="text-white">20-30</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Occupancy</span>
                            <span className="text-white">2 guests</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Deluxe Room */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Deluxe Room</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Base Rate</span>
                            <span className="text-white font-semibold">ETB 12,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rooms</span>
                            <span className="text-white">15-22</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Occupancy</span>
                            <span className="text-white">2-3 guests</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Suite */}
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Suite</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Base Rate</span>
                            <span className="text-white font-semibold">ETB 18,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rooms</span>
                            <span className="text-white">8-12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Occupancy</span>
                            <span className="text-white">3-4 guests</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="text-amber-500 font-semibold">Airline-Style Dynamic Pricing</span>
              </div>
              <p className="text-gray-300 text-sm">
                Prices adjust automatically based on booking time, occupancy, weekends, and Ethiopian holidays. 
                Early bookers get up to 10% discount. Last-minute bookings pay premium rates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Potential */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Monthly Revenue Potential</h3>
                <p className="text-gray-400 mb-4">Based on base rates at 100% occupancy</p>
                <p className="text-5xl font-bold text-amber-500">
                  ETB {totalRevenuePotential.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  AI optimization can increase revenue by 15-25% through dynamic pricing
                </p>
              </div>
              <div className="text-right">
                <TrendingUp className="h-24 w-24 text-amber-500 mb-4" />
                <Badge className="bg-green-500 text-lg px-4 py-2">+25% with AI</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500 transition-colors cursor-pointer"
                onClick={() => router.push('/booking')}>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">New Booking</h3>
              <p className="text-gray-400 text-sm">Create a new reservation</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500 transition-colors cursor-pointer"
                onClick={() => router.push('/admin-bookings')}>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">View Bookings</h3>
              <p className="text-gray-400 text-sm">Manage all reservations</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500 transition-colors cursor-pointer"
                onClick={() => router.push('/admin-users')}>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">User Management</h3>
              <p className="text-gray-400 text-sm">View all registered users</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
