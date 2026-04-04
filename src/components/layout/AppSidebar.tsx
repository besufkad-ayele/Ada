"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  BarChart3, 
  Settings, 
  CalendarDays,
  Sparkles,
  PackageCheck,
  MessageSquare,
  LogOut,
  Users,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Airline Pricing", href: "/airline-pricing", icon: Sparkles, badge: "NEW" },
  { name: "Pricing & Inventory", href: "/pricing", icon: CalendarDays },
  { name: "Packages", href: "/packages", icon: PackageCheck },
  { name: "AI Simulator", href: "/simulate", icon: Sparkles, badge: "Demo" },
  { name: "Ask Revenue AI", href: "/ask", icon: MessageSquare, badge: "AI" },
  { name: "User Management", href: "/admin-users", icon: Users, adminOnly: true },
  { name: "All Bookings", href: "/admin-bookings", icon: CalendarDays, adminOnly: true },
  // { name: "My Profile", href: "/profile", icon: UserCircle },
  { name: "Configuration", href: "/settings", icon: Settings },
];

interface User {
  name: string;
  role: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("kuraz_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kuraz_user");
    router.push("/login");
  };

  // Don't render anything until mounted (prevents flash)
  if (!mounted) {
    return null;
  }

  // Hide sidebar on public pages and auth pages
  const hideSidebarPaths = [
    "/book",
    "/landing",
    "/login",
    "/user-login",
    "/signup",
    "/register",
    "/user-dashboard",
    "/booking",
  ];
  
  if (hideSidebarPaths.some(path => pathname.startsWith(path))) {
    return null;
  }

  // Hide sidebar on admin pages if not logged in
  if ((pathname === "/admin-users" || pathname === "/profile") && !user) {
    return null;
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col glass-card border-r border-r-white/5 z-10">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        <Image src="/logo.svg" alt="Kuraz AI Logo" width={32} height={32} className="mr-3" />
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Kuraz AI
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            // Hide admin-only items for non-admin users
            if (item.adminOnly && user?.role !== "admin" && user?.role !== "manager") {
              return null;
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white",
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-white",
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors"
                  )}
                  aria-hidden="true"
                />
                {item.name}
                
                {item.badge === "NEW" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                    NEW
                  </span>
                )}
                {item.badge === "Demo" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Demo
                  </span>
                )}
                {item.badge === "AI" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile/Status Area */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {user && (
          <div className="px-2 py-2 rounded-xl bg-black/20 border border-white/5">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.role}</p>
          </div>
        )}
        
        <div className="flex items-center px-2 py-2 rounded-xl bg-black/20 border border-white/5">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">Kuriftu Resort</p>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Engine Active
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
