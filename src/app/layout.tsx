"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "../components/layout/AppSidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Logic to determine if we should hide the sidebar
  const isFullPage = hideSidebarPaths.some(path => pathname?.startsWith(path));

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-foreground antialiased selection:bg-primary/30 selection:text-white`}>
        {/* Absolute Background Elements for Premium Feel */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[400px] bg-blue-500/5 blur-[150px] rounded-[100%]" />
          <div className="absolute top-[20%] left-[-5%] w-[300px] h-[600px] bg-amber-500/3 blur-[100px] rounded-full" />
        </div>

        <div className="flex h-screen overflow-hidden">
          {!isFullPage && <AppSidebar />}
          
          <main className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden relative",
            !isFullPage ? "bg-slate-950/20 backdrop-blur-[2px]" : "bg-transparent"
          )}>
            {/* Mobile Header Holder - pt-16 is often used for this */}
            {!isFullPage && (
              <div className="md:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-primary font-black text-xs">K</span>
                  </div>
                  <span className="text-sm font-bold text-white tracking-widest uppercase">
                    Kuraz <span className="text-primary font-black">AI</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-slate-400"
                  onClick={() => {/* Toggle logic if needed */}}
                >
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            )}

            <div className={cn(
              "relative z-10",
              !isFullPage ? "min-h-full" : ""
            )}>
              {children}
            </div>
          </main>
        </div>

        {/* Global Styles for the whole app */}
        <style jsx global>{`
          /* Smooth page transitions if needed */
          .page-transition {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </body>
    </html>
  );
}
