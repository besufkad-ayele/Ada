"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    location: "",
    age: "",
    sex: "Male",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          location: formData.location,
          age: parseInt(formData.age),
          sex: formData.sex,
        }),
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
        setError(errorData.detail || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">Join Us</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Create your account to start booking
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Sign Up
            </CardTitle>
            <p className="text-amber-50 mt-2">Fill in your details below</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="+251 912 345 678"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="Addis Ababa, Ethiopia"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Age
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                    placeholder="25"
                    min="18"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Gender
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="w-full h-10 px-3 border-2 border-gray-300 focus:border-amber-500 text-gray-900 rounded-md"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="border-2 border-gray-300 focus:border-amber-500 text-gray-900"
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-bold shadow-lg"
              >
                {isProcessing ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-gray-700">
                Already have an account?{" "}
                <Link href="/user-login" className="text-amber-600 font-semibold hover:underline">
                  Log In
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
