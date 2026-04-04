"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, ArrowRight, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Log in to continue your booking
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <LogIn className="h-6 w-6" />
              Log In
            </CardTitle>
            <p className="text-amber-50 mt-2">Enter your credentials</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-bold shadow-lg"
              >
                {isProcessing ? (
                  "Logging in..."
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-gray-700">
                Don't have an account?{" "}
                <Link href="/signup" className="text-amber-600 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link href="/login" className="text-amber-600 hover:underline">
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
