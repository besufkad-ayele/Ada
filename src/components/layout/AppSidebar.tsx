"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ShieldCheck,
  Activity,
  LayoutDashboard,
  BrainCircuit,
  Settings2
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dynamic Pricing", href: "/dynamci-pricing", icon: BrainCircuit, badge: "AI" },
  { name: "Pricing & Inventory", href: "/pricing", icon: CalendarDays },
  { name: "Packages", href: "/packages", icon: PackageCheck },
  { name: "AI Simulator", href: "/simulate", icon: Sparkles, badge: "Lab" },
  { name: "Ask Revenue AI", href: "/ask", icon: MessageSquare, badge: "Pro" },
  { name: "User Management", href: "/admin-users", icon: Users, adminOnly: true },
  { name: "All Bookings", href: "/admin-bookings", icon: CalendarDays, adminOnly: true },
  { name: "Configuration", href: "/settings", icon: Settings2 },
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

  if (!mounted) {
    return null;
  }

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
  
  if (hideSidebarPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  return (
    <div className="hidden md:flex md:w-80 md:flex-col h-screen sticky top-0 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 z-50">
      {/* Premium Decorative Glows */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-20" />
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Sidebar Header/Logo */}
      <div className="relative flex h-28 shrink-0 items-center px-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={() => router.push("/dashboard")}
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-700 opacity-50 group-hover:opacity-100" />
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="relative h-6 w-6">
                <span className="absolute inset-0 flex items-center justify-center text-primary-light font-black text-xs">K</span>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-none">
              Kuraz <span className="text-primary-light">AI</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1.5 ml-0.5">Systems v4.0</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Links Area */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 custom-scrollbar space-y-12">
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 mb-6 flex items-center gap-3">
             <div className="h-px flex-1 bg-white/5"></div>
             Navigation
             <div className="h-px flex-1 bg-white/5"></div>
          </h3>
          
          <nav className="space-y-1.5">
            {navigation.map((item, idx) => {
              if (item.adminOnly && user?.role !== "admin" && user?.role !== "manager") {
                return null;
              }

              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3.5 px-4 py-3.5 text-[13px] font-bold rounded-2xl transition-all duration-500",
                      isActive
                        ? "bg-primary/10 text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] border border-primary/20 ring-1 ring-primary/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    )}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bar"
                        className="absolute left-[-1.5px] w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
                      />
                    )}

                    <div className={cn(
                      "relative flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-500",
                      isActive ? "bg-primary/20 text-primary-light" : "bg-slate-900/50 text-slate-500 group-hover:text-white"
                    )}>
                       <item.icon className={cn("h-4 w-4 transition-all duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                    </div>
                    
                    <span className="flex-1 transition-all duration-300 group-hover:translate-x-1">
                      {item.name}
                    </span>
                    
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-lg border",
                        isActive ? "bg-primary/20 border-primary/20 text-white" : "bg-slate-900/80 border-white/5 text-slate-500"
                      )}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-1.5 w-1.5 rounded-full bg-primary-light"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Module status snippet */}
        {/* <div className="px-4 py-6 rounded-[2rem] bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary/20 border border-primary/20 text-primary-light">
                 <BrainCircuit className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Yield Engine</span>
                 <span className="text-xs font-bold text-white">Live Optimization</span>
              </div>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
              />
           </div>
           <p className="text-[9px] font-bold text-slate-600 mt-2.5 flex justify-between">
              <span>Health Status</span>
              <span>78% Optimality</span>
           </p>
        </div> */}
      </div>

      {/* User Footer / Sign Out */}
      <div className="mt-auto p-10 space-y-6">
        {user && (
          <div className="flex items-center gap-4 p-1">
             <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative z-10">
                   <UserCircle className="h-7 w-7 text-primary-light/80" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-lg bg-emerald-500 border border-slate-950 flex items-center justify-center z-20">
                   <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </div>
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-white truncate tracking-tight">{user.name}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.role}</span>
             </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur-xl" />
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl bg-slate-900/50 border border-rose-500/10 group-hover:border-rose-500 group-hover:bg-rose-500 text-rose-400 group-hover:text-white transition-all duration-500 shadow-2xl">
            <LogOut className="h-4 w-4" />
            Sign Out
          </div>
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.2);
        }
      `}</style>
    </div>
  );
}
