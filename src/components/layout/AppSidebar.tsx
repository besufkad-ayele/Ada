"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  Settings, 
  CalendarDays,
  Sparkles,
  PackageCheck,
  Building2,
  Globe,
  MessageSquare,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Pricing & Inventory", href: "/pricing", icon: CalendarDays },
  { name: "Packages", href: "/packages", icon: PackageCheck },
  { name: "AI Simulator", href: "/simulate", icon: Sparkles, badge: "Demo" },
  { name: "Ask Revenue AI", href: "/ask", icon: MessageSquare, badge: "Gemini" },
  { name: "Configuration", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("kuraz_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kuraz_user");
    router.push("/login");
  };

  if (pathname.startsWith("/book") || pathname === "/landing" || pathname === "/login") {
    return null; // Hide sidebar on public pages
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col glass-card border-r border-r-white/5 z-10">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        <Building2 className="h-6 w-6 text-primary mr-3" />
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Kuraz AI
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
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
                
                {item.name === "AI Simulator" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Demo
                  </span>
                )}
                {item.name === "Ask Revenue AI" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    Gemini
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
