"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Star,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("kuraz_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchProfile(userData.email);
    fetchBookings(userData.email);
  }, [router]);

  const fetchProfile = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile/${email}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || "",
          nationality: data.nationality,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile/${email}/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        await fetchProfile(user.email);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-500";
      case "gold":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-400";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "checked_in":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "checked_out":
        return <CheckCircle2 className="h-4 w-4 text-gray-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and view booking history</p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("kuraz_user");
              router.push("/login");
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        {/* Loyalty Card */}
        <Card className="shadow-xl border-2 border-amber-200 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">
                    {profile.tier_info.current_tier.name} Member
                  </h2>
                </div>
                <p className="text-amber-100">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              <Badge className={`${getTierColor(profile.loyalty_tier)} text-white border-0 text-lg px-4 py-2`}>
                <Star className="h-4 w-4 mr-1" />
                {profile.loyalty_points.toLocaleString()} Points
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-amber-100 text-sm mb-1">Total Stays</p>
                <p className="text-2xl font-bold">{profile.total_stays}</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Total Spent</p>
                <p className="text-2xl font-bold">ETB {profile.total_spend_etb.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(profile.member_since).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Tier Progress */}
            {profile.tier_info.next_tier && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-amber-100">
                    Progress to {profile.tier_info.next_tier.name}
                  </span>
                  <span className="font-semibold">{profile.tier_info.progress_percent}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all"
                    style={{ width: `${profile.tier_info.progress_percent}%` }}
                  ></div>
                </div>
                <p className="text-amber-100 text-sm mt-2">
                  Spend ETB {profile.tier_info.spend_to_next_tier.toLocaleString()} more to reach{" "}
                  {profile.tier_info.next_tier.name}
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-white/30">
              <p className="text-sm font-semibold mb-3">Your Benefits:</p>
              <div className="grid grid-cols-2 gap-2">
                {profile.tier_info.current_tier.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      First Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Last Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.phone || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Nationality
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.nationality}
                        onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.nationality}</p>
                    )}
                  </div>

                  {profile.is_corporate && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Company
                      </label>
                      <p className="text-gray-900 font-medium">{profile.company_name || "N/A"}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <p className="text-sm text-gray-600">View all your past and upcoming reservations</p>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No bookings yet</p>
                    <Button
                      onClick={() => router.push("/book")}
                      className="mt-4 bg-amber-500 hover:bg-amber-600"
                    >
                      Make a Booking
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.booking_ref} className="border-2 hover:border-amber-300 transition-all">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{booking.room_type}</h3>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                  {booking.booking_ref}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                {getStatusIcon(booking.status)}
                                <span className="capitalize font-medium">{booking.status.replace("_", " ")}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ETB {booking.total_revenue_etb.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">Total</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Check-in</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.check_in).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Check-out</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.check_out).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Nights</p>
                              <p className="font-semibold text-gray-900">{booking.nights}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Guests</p>
                              <p className="font-semibold text-gray-900">
                                {booking.adults} adults, {booking.children} children
                              </p>
                            </div>
                          </div>

                          {booking.package_accepted && (
                            <div className="mt-4 pt-4 border-t">
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                ✓ Package Included
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
