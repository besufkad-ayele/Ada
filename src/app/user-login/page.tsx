"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";

export default function UserLoginPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Store auth token and user data
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect to booking page
        router.push("/book");
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Log in to continue your booking
          </p>
        </div>

        <Card className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-t-2xl">
            <CardTitle className="text-2xl flex items-center gap-2">
              <LogIn className="h-6 w-6" />
              Log In
            </CardTitle>
            <p className="text-blue-100 mt-2">Enter your credentials</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white rounded-xl h-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white rounded-xl h-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:brightness-110 text-white py-6 text-lg font-bold rounded-xl shadow-[0_2px_4px_rgba(59,130,246,0.2)] transition-all duration-200 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Logging in...
                  </div>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
              <p className="text-sm text-slate-500">
                <Link href="/login" className="text-primary hover:underline">
                  Admin Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
