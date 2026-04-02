"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Sparkles, TrendingUp, Users, Zap, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-white">Kuraz AI</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm">
            <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
            <a href="#demo" className="text-slate-300 hover:text-white transition">Demo</a>
            <a href="#impact" className="text-slate-300 hover:text-white transition">Impact</a>
          </nav>
          <div className="flex gap-3">
            <Link href="/book">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Book a Stay
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90">
                Dashboard Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Ethiopia Hospitality Hackathon 2026 Winner
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Revenue Management
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Kuraz AI transforms Ethiopian resorts with airline-style dynamic pricing, 
            intelligent guest segmentation, and AI-powered package recommendations. 
            Increase total revenue by 25% while delivering personalized guest experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Live Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Try Guest Booking
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+25%</div>
              <div className="text-slate-400">Total Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <div className="text-slate-400">Package Acceptance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <div className="text-slate-400">Guest Segments Identified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Revenue Optimization</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Three intelligent engines working together to maximize every booking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Dynamic Pricing Engine</h3>
                <p className="text-slate-400 mb-4">
                  Airline-style yield management with 7-tier occupancy multipliers, 
                  Ethiopian seasonality, and real-time competitor benchmarking.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Saver/Standard/Premium fare classes
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Event-driven pricing (Timkat +70%)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Automatic inventory fencing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Guest Segmentation</h3>
                <p className="text-slate-400 mb-4">
                  AI classifies every booking into 8 segments with price sensitivity 
                  and package affinity scoring.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    International vs. domestic patterns
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Business, honeymoon, family detection
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Real-time classification at booking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Package Recommender</h3>
                <p className="text-slate-400 mb-4">
                  10 pre-built service bundles with dynamic discounting based on 
                  segment and occupancy.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    Romance, Family, Business packages
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    5-25% dynamic discounts
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    +ETB 3,300 avg revenue uplift
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-slate-400 text-lg">
              Three ways to experience Kuraz AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/login" className="group">
              <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6">
                  <BarChart3 className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition">
                    Revenue Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    KPIs, pricing heatmap, AI insights, and package performance metrics
                  </p>
                  <div className="text-primary text-sm font-medium flex items-center">
                    Login as Manager <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/simulate" className="group">
              <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition">
                    AI Simulator
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Watch the AI analyze bookings and show multiplier breakdowns
                  </p>
                  <div className="text-primary text-sm font-medium flex items-center">
                    Try Simulation <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/book" className="group">
              <Card className="bg-slate-800/50 border-white/10 hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6">
                  <Star className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition">
                    Guest Booking
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Experience the AI upsell flow from a guest's perspective
                  </p>
                  <div className="text-primary text-sm font-medium flex items-center">
                    Book a Room <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Measurable Revenue Impact</h2>
            <p className="text-slate-400 text-lg">
              Real numbers from our synthetic Ethiopian resort data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="p-8">
                <div className="text-sm text-slate-400 mb-2">WITHOUT KURAZ AI</div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>100 room nights × $120 ADR</span>
                    <span>$12,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Ancillary (random walk-ins)</span>
                    <span>$1,500</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>TOTAL REVENUE</span>
                    <span>$13,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-blue-500/20 border-primary/50">
              <CardContent className="p-8">
                <div className="text-sm text-primary mb-2 font-medium">WITH KURAZ AI</div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white">
                    <span>Dynamic pricing (30/45/25 mix)</span>
                    <span>$13,550</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Package recommendations (60%)</span>
                    <span className="text-emerald-400">+$3,300</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>TOTAL REVENUE</span>
                    <span>$16,850</span>
                  </div>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">+25%</div>
                  <div className="text-xs text-emerald-300">Revenue Increase</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Resort Revenue?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Built for the Ethiopia Hospitality Hackathon 2026. Designed for real-world deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Access Dashboard
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Try Guest Experience
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-white">Kuraz AI</span>
            <span>— Revenue Management System</span>
          </div>
          <div>
            Ethiopia Hospitality Hackathon 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
