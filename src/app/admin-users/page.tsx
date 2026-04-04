"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Star,
  Award,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Globe,
  Briefcase,
  Wallet,
  Trophy,
  BedDouble,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, tierFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/list?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Users fetched:", data); // Debug log
        setUsers(data);
        setTotalPages(1); // Simple pagination for now
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/list`);
      if (res.ok) {
        const users = await res.json();
        
        // Calculate stats from users
        const tierDistribution = {
          none: 0,
          silver: 0,
          gold: 0,
          platinum: 0
        };
        
        users.forEach((user: any) => {
          const points = user.loyalty_points || 0;
          if (points >= 5000) tierDistribution.platinum++;
          else if (points >= 3000) tierDistribution.gold++;
          else if (points >= 1000) tierDistribution.silver++;
          else tierDistribution.none++;
        });
        
        setStats({
          total_users: users.length,
          tier_distribution: tierDistribution,
          top_spenders: users
            .sort((a: any, b: any) => (b.total_spent_etb || 0) - (a.total_spent_etb || 0))
            .slice(0, 5)
            .map((u: any) => ({
              name: u.full_name,
              total_spend_etb: u.total_spent_etb || 0,
              loyalty_tier: u.loyalty_points >= 5000 ? "platinum" : u.loyalty_points >= 3000 ? "gold" : u.loyalty_points >= 1000 ? "silver" : "none"
            }))
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleUpdateTier = async (userId: number, newTier: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/admin/user/${userId}/tier`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });

      if (res.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update tier:", err);
    }
  };

  // Modern soft-badge color mapping
  const getTierStyles = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
        return "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100";
      case "gold":
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "silver":
        return "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage guest profiles, loyalty tiers, and view revenue analytics
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="bg-white">
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_users}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Members</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.tier_distribution.none || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-slate-200 rounded-xl text-slate-700">
                  <Star className="h-6 w-6 fill-slate-400 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Silver</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.tier_distribution.silver || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Gold</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.tier_distribution.gold || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                  <Star className="h-6 w-6 fill-violet-500 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Platinum</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.tier_distribution.platinum || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Content (Users List) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 bg-white border-slate-200 shadow-sm"
                />
              </div>
              <Button onClick={handleSearch} className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                Search
              </Button>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[180px] bg-white border-slate-200 shadow-sm">
                  <Filter className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Filter Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="none">Member (Base)</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4"></div>
                <p className="text-slate-500">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900">No users found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      
                      {/* Top Row: User Identity & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-lg shrink-0">
                            {getInitials(user.full_name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-slate-900">{user.full_name}</h3>
                              <Badge className={`border ${getTierStyles(user.loyalty_points >= 5000 ? "platinum" : user.loyalty_points >= 3000 ? "gold" : user.loyalty_points >= 1000 ? "silver" : "member")}`}>
                                {user.loyalty_points >= 5000 ? "Platinum" : user.loyalty_points >= 3000 ? "Gold" : user.loyalty_points >= 1000 ? "Silver" : "Member"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" /> {user.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5" /> {user.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Key Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                            <BedDouble className="h-3.5 w-3.5" /> Total Bookings
                          </p>
                          <p className="font-semibold text-slate-900">{user.total_bookings}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5" /> Total Spent
                          </p>
                          <p className="font-semibold text-slate-900">
                            ETB {user.total_spent_etb?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-amber-500" /> Loyalty Points
                          </p>
                          <p className="font-semibold text-slate-900">
                            {user.loyalty_points?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6">
                <p className="text-sm text-slate-500">
                  Showing page <span className="font-medium text-slate-900">{page}</span> of{" "}
                  <span className="font-medium text-slate-900">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    variant="outline"
                    className="bg-white"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    variant="outline"
                    className="bg-white"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Top Spenders */}
          <div className="xl:col-span-1">
            {stats && stats.top_spenders?.length > 0 && (
              <Card className="border-slate-200 shadow-sm bg-white sticky top-8">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Spenders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {stats.top_spenders.map((spender: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            idx === 0 ? "bg-amber-100 text-amber-700" :
                            idx === 1 ? "bg-slate-200 text-slate-700" :
                            idx === 2 ? "bg-amber-50 text-amber-800" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{spender.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-slate-100 text-slate-500">
                                {spender.loyalty_tier === "none" ? "MEMBER" : spender.loyalty_tier.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">
                            ETB {spender.total_spend_etb?.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Total Spent</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}