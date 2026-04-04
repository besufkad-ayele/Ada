"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

// Mock users for demo
const MOCK_USERS = [
  {
    email: "manager@kuriftu.com",
    password: "demo123",
    name: "Abebe Tadesse",
    role: "Revenue Manager",
  },
  {
    email: "admin@kuriftu.com",
    password: "admin123",
    name: "Sara Mekonnen",
    role: "General Manager",
  },
  {
    email: "demo@kuraz.ai",
    password: "hackathon2026",
    name: "Demo User",
    role: "System Admin",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Store in localStorage (mock session)
      localStorage.setItem("kuraz_user", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try one of the demo accounts below.");
      setIsLoading(false);
    }
  };

  const quickLogin = (user: typeof MOCK_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold text-white">Kuraz AI</span>
          </div>
          <p className="text-slate-400">Revenue Management Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the revenue management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="manager@kuriftu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-white/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-white/10 text-white"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-rose-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base"
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-3 text-center font-medium uppercase tracking-wider">
                Hackathon Demo Accounts
              </p>
              <div className="space-y-2">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickLogin(user)}
                    className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-primary transition">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Click any account to auto-fill credentials
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <a href="/landing" className="text-sm text-slate-400 hover:text-white transition">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
