"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, Award, MapPin, CreditCard, Star, TrendingUp } from "lucide-react";
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
        console.log("User data fetched:", data); // Debug log
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

  const getLoyaltyTier = (points: number) => {
    if (points >= 5000) return { name: "Platinum", color: "text-purple-600", bgColor: "bg-purple-100" };
    if (points >= 3000) return { name: "Gold", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (points >= 1000) return { name: "Silver", color: "text-gray-600", bgColor: "bg-gray-100" };
    return { name: "Bronze", color: "text-orange-600", bgColor: "bg-orange-100" };
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const loyaltyTier = getLoyaltyTier(userData.loyalty_points);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userData.full_name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-100">Loyalty Points</p>
                  <p className="text-3xl font-bold">{userData.loyalty_points.toLocaleString()}</p>
                  <Badge className={`mt-2 ${loyaltyTier.bgColor} ${loyaltyTier.color}`}>
                    {loyaltyTier.name} Member
                  </Badge>
                </div>
                <Award className="h-12 w-12 text-amber-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{userData.total_bookings}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ETB {userData.total_spent_etb.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-bold text-gray-900">2026</p>
                </div>
                <Star className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md bg-white border border-gray-200 h-9">
              <TabsTrigger value="profile" className="data-active:bg-amber-500 data-active:text-white text-xs font-medium">Profile</TabsTrigger>
              <TabsTrigger value="bookings" className="data-active:bg-amber-500 data-active:text-white text-xs font-medium">My Bookings</TabsTrigger>
              <TabsTrigger value="loyalty" className="data-active:bg-amber-500 data-active:text-white text-xs font-medium">Loyalty Rewards</TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="w-full">
            <Card className="shadow-xl bg-white w-full">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Location</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Age</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{userData.sex}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="w-full">
            <Card className="shadow-xl bg-white w-full">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 mb-4">No bookings yet</p>
                    <a
                      href="/booking"
                      className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Book Your First Stay
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-2 border-gray-200 hover:border-amber-500 transition-colors bg-white">
                        <CardContent className="p-6 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <MapPin className="h-5 w-5 text-amber-600" />
                                <h3 className="text-xl font-bold text-gray-900">{booking.destination_name}</h3>
                                <Badge className={
                                  booking.status === "CONFIRMED" ? "bg-green-500" :
                                  booking.status === "PENDING" ? "bg-yellow-500" :
                                  "bg-gray-500"
                                }>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Booking Code</p>
                                  <p className="font-mono font-bold text-amber-600">{booking.booking_code}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Room Type</p>
                                  <p className="font-semibold text-gray-900">{booking.room_type_name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Dates</p>
                                  <p className="font-semibold text-gray-900">
                                    {booking.check_in} to {booking.check_out}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-2xl font-bold text-gray-900">
                                ETB {booking.total_amount_etb.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="w-full">
            <Card className="shadow-xl bg-white w-full">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Loyalty Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="text-center mb-8">
                  <div className="inline-block p-6 bg-white border-2 border-amber-200 rounded-full mb-4">
                    <Award className="h-16 w-16 text-amber-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {userData.loyalty_points.toLocaleString()} Points
                  </h3>
                  <Badge className={`text-lg px-4 py-2 ${loyaltyTier.bgColor} ${loyaltyTier.color}`}>
                    {loyaltyTier.name} Member
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white border-2 border-gray-200">
                    <CardContent className="p-6 text-center bg-white">
                      <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-gray-900">10%</p>
                      <p className="text-sm text-gray-600">Discount on Next Booking</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-2 border-gray-200">
                    <CardContent className="p-6 text-center bg-white">
                      <Star className="h-10 w-10 text-amber-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-gray-900">Free</p>
                      <p className="text-sm text-gray-600">Room Upgrade</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-2 border-gray-200">
                    <CardContent className="p-6 text-center bg-white">
                      <Award className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-gray-900">Priority</p>
                      <p className="text-sm text-gray-600">Check-in & Support</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">How to Earn More Points</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                      Earn 100 points for every ETB 1,000 spent
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                      Bonus 500 points on your birthday
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                      Refer a friend and get 1,000 points
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                      Complete 5 stays to reach Gold tier
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
