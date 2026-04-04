"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, BarChart3, Brain, Sparkles, TrendingUp, Users, Zap, 
  Star, CheckCircle2, Globe, Calendar, DollarSign, Target, 
  Award, ChevronRight, Play, Menu, X, Activity, Cpu, Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
        <div className="relative">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          {/* Futuristic loader */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-r-amber-400 rounded-full animate-spin-slow"></div>
              <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse-slow" />
            </div>
            
            <div className="space-y-2">
              <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-amber-400 rounded-full animate-shimmer"></div>
              </div>
              <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-primary to-amber-400 rounded-full animate-shimmer delay-500"></div>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm animate-pulse-slow">Initializing Kuraz AI...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden relative">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with complex animations */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-2xl animate-ping delay-2000"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-amber-500/20 animate-gradient"></div>
        </div>
        
        {/* Particle grid effect */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse-glow group-hover:scale-150 transition-transform duration-500"></div>
                <Sparkles className="relative h-7 w-7 text-primary animate-spin-slow" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-primary to-amber-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-tracking-wide">
                Kuraz AI
              </span>
            </div>
            
            <nav className="hidden lg:flex space-x-8 text-sm font-medium">
              <a href="#features" className="text-slate-300 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-primary transition-colors">How It Works</a>
              <a href="#demo" className="text-slate-300 hover:text-primary transition-colors">Demo</a>
              <a href="#impact" className="text-slate-300 hover:text-primary transition-colors">Impact</a>
            </nav>
            
            <div className="hidden lg:flex gap-3">
              <Link href="/book">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-primary/50 transition-all">
                  Book a Stay
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white shadow-lg shadow-primary/25">
                  Dashboard Login
                </Button>
              </Link>
            </div>

            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-primary transition-colors py-2">Features</a>
              <a href="#how-it-works" className="block text-slate-300 hover:text-primary transition-colors py-2">How It Works</a>
              <a href="#demo" className="block text-slate-300 hover:text-primary transition-colors py-2">Demo</a>
              <a href="#impact" className="block text-slate-300 hover:text-primary transition-colors py-2">Impact</a>
              <div className="pt-4 space-y-3">
                <Link href="/book" className="block">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Book a Stay
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-amber-500">
                    Dashboard Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/30 text-primary text-sm font-semibold mb-8 animate-fade-in shadow-lg shadow-primary/10">
              <Award className="h-4 w-4" />
              Ethiopia Hospitality Hackathon 2026
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-fade-in-up">
              <span className="block animate-slide-in-left">Revenue Management</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-amber-400 via-orange-500 to-purple-500 bg-clip-text text-transparent bg-[length:300%_auto] animate-gradient-slow font-black animate-slide-in-right">
                Powered by AI
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-300">
              <span className="animate-pulse-slow">Transform</span> Ethiopian hospitality with 
              <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg backdrop-blur-sm animate-pulse">airline-style dynamic pricing</span>, 
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg backdrop-blur-sm animate-pulse delay-200">intelligent guest segmentation</span>, and 
              <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-1 rounded-lg backdrop-blur-sm animate-pulse delay-400">AI-powered package recommendations</span>. 
              <span className="block mt-3 text-white font-bold text-2xl bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent animate-pulse-slow">Increase revenue by 25%</span> while delivering personalized guest experiences.
            </p>
            
            {/* Value Proposition Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto animate-fade-in-up delay-500">
              <div className="group px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                <Zap className="inline h-4 w-4 mr-1.5 text-primary group-hover:animate-bounce" />
                Real-time Pricing
                <Activity className="inline h-3 w-3 ml-1.5 text-emerald-400 animate-pulse" />
              </div>
              <div className="group px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                <Users className="inline h-4 w-4 mr-1.5 text-primary group-hover:animate-bounce" />
                8 Guest Segments
                <Cpu className="inline h-3 w-3 ml-1.5 text-amber-400 animate-pulse" />
              </div>
              <div className="group px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                <Target className="inline h-4 w-4 mr-1.5 text-primary group-hover:animate-bounce" />
                60% Package Acceptance
                <TrendingUp className="inline h-3 w-3 ml-1.5 text-emerald-400 animate-pulse" />
              </div>
              <div className="group px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                <Calendar className="inline h-4 w-4 mr-1.5 text-primary group-hover:animate-bounce" />
                Ethiopian Seasonality
                <Globe className="inline h-3 w-3 ml-1.5 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up delay-700">
              <Link href="/login">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white px-10 py-7 text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 border-2 border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <BarChart3 className="mr-2 h-6 w-6 relative z-10 group-hover:animate-bounce" />
                  <span className="relative z-10">View Live Dashboard</span>
                  <ArrowRight className="ml-2 h-6 w-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="/book">
                <Button size="lg" variant="outline" className="group relative overflow-hidden border-2 border-white/30 text-white hover:bg-white/10 hover:border-primary/50 px-10 py-7 text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Play className="mr-2 h-5 w-5 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Try Guest Booking</span>
                  <Wifi className="ml-2 h-5 w-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto animate-fade-in-up delay-1000">
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse-slow">
                    +25%
                  </div>
                  <div className="text-slate-300 font-medium group-hover:text-white transition-colors">Total Revenue Increase</div>
                  <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">Proven with synthetic data</div>
                  <TrendingUp className="h-4 w-4 text-emerald-400 mt-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all" />
                </div>
              </div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse-slow">
                    60%
                  </div>
                  <div className="text-slate-300 font-medium group-hover:text-white transition-colors">Package Acceptance</div>
                  <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">AI-powered upsells</div>
                  <Target className="h-4 w-4 text-amber-400 mt-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all" />
                </div>
              </div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse-slow">
                    8
                  </div>
                  <div className="text-slate-300 font-medium group-hover:text-white transition-colors">Guest Segments</div>
                  <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">Real-time classification</div>
                  <Users className="h-4 w-4 text-primary mt-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className={`relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950 transition-all duration-1000 ${
        isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 delay-200 ${
            isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4 animate-pulse-slow">
              The Challenge
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Why Ethiopian Resorts
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Need Kuraz AI
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl max-w-3xl mx-auto">
              Traditional revenue management leaves 20-30% of potential revenue on the table
            </p>
          </div>

          {/* Problem Cards */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-400 ${
            isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                  <DollarSign className="h-6 w-6 text-red-400 group-hover:animate-bounce" />
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Static Pricing</h3>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Fixed rates regardless of demand, seasonality, or events</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                  <Target className="h-6 w-6 text-red-400 group-hover:animate-bounce" />
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Missed Upsells</h3>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">No systematic approach to package recommendations</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                  <Users className="h-6 w-6 text-red-400 group-hover:animate-bounce" />
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Poor Insights</h3>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Limited understanding of guest preferences and behavior</p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-red-400 group-hover:animate-bounce" />
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">Manual Work</h3>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Time-consuming decisions without data-driven insights</p>
              </CardContent>
            </Card>
          </div>

          <div className={`text-center mb-20 transition-all duration-1000 delay-600 ${
            isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4 animate-pulse-slow">
              Three Intelligent Engines
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              AI-Powered Revenue
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Optimization
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl max-w-3xl mx-auto">
              Three intelligent engines working together to maximize every booking
            </p>
          </div>

          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 delay-800 ${
            isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Dynamic Pricing */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <TrendingUp className="h-8 w-8 text-primary group-hover:animate-bounce" />
                  </div>
                  <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  Dynamic Pricing Engine
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  Airline-style yield management with 7-tier occupancy multipliers, 
                  Ethiopian seasonality, and real-time competitor benchmarking.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0 group-hover:animate-pulse" />
                    <span>Saver/Standard/Premium fare classes</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-100" />
                    <span>Event-driven pricing (Timkat +70%)</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-200" />
                    <span>Automatic inventory fencing</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                    Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Segmentation */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="h-8 w-8 text-emerald-400 group-hover:animate-bounce" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                  Guest Segmentation
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  AI classifies every booking into 8 segments with price sensitivity 
                  and package affinity scoring.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse" />
                    <span>International vs. domestic patterns</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-100" />
                    <span>Business, honeymoon, family detection</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-200" />
                    <span>Real-time classification at booking</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                    Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Recommender */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Zap className="h-8 w-8 text-amber-400 group-hover:animate-bounce" />
                  </div>
                  <div className="absolute inset-0 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  Package Recommender
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  10 pre-built service bundles with dynamic discounting based on 
                  segment and occupancy.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse" />
                    <span>Romance, Family, Business packages</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-100" />
                    <span>5-25% dynamic discounts</span>
                  </li>
                  <li className="flex items-start text-slate-300 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mr-3 mt-0.5 shrink-0 group-hover:animate-pulse delay-200" />
                    <span>+ETB 3,300 avg revenue uplift</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center text-amber-400 font-semibold group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                    Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
              Simple Integration
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              How Kuraz AI
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <div className="text-primary font-bold text-sm mb-2">STEP 1</div>
                <h3 className="text-xl font-bold text-white mb-3">Guest Arrives</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Guest visits booking portal and selects dates, room type, and party size
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center mb-6">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <div className="text-primary font-bold text-sm mb-2">STEP 2</div>
                <h3 className="text-xl font-bold text-white mb-3">AI Analyzes</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Dynamic pricing calculates optimal rate based on occupancy, lead time, and events
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <div className="text-primary font-bold text-sm mb-2">STEP 3</div>
                <h3 className="text-xl font-bold text-white mb-3">Segment & Recommend</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  AI identifies guest segment and recommends personalized package bundles
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-amber-500/10 backdrop-blur-sm border border-primary/30 rounded-2xl p-8">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <div className="text-primary font-bold text-sm mb-2">RESULT</div>
              <h3 className="text-xl font-bold text-white mb-3">Revenue Maximized</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Guest books at optimal price with high-value package add-ons
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
              Interactive Experience
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              See It In
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl">
              Three ways to experience Kuraz AI
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Link href="/login" className="group block">
              <Card className="h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <BarChart3 className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    Revenue Dashboard
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    KPIs, pricing heatmap, AI insights, and package performance metrics
                  </p>
                  <div className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Login as Manager <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/simulate" className="group block">
              <Card className="h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Brain className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    AI Simulator
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Watch the AI analyze bookings and show multiplier breakdowns
                  </p>
                  <div className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Try Simulation <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/book" className="group block">
              <Card className="h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Star className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    Guest Booking
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Experience the AI upsell flow from a guest's perspective
                  </p>
                  <div className="text-primary text-sm font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                    Book a Room <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
              Proven Results
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Measurable Revenue
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Impact
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl">
              Real numbers from our synthetic Ethiopian resort data
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-slate-500"></div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Without Kuraz AI</div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-sm">100 room nights × $120 ADR</span>
                    <span className="font-semibold">$12,000</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-sm">Ancillary (random walk-ins)</span>
                    <span className="font-semibold">$1,500</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">TOTAL REVENUE</span>
                    <span className="text-white font-bold text-2xl">$13,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-primary/20 via-amber-500/10 to-orange-500/20 border-2 border-primary/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <CardContent className="relative p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                  <div className="text-sm font-bold text-primary uppercase tracking-wider">With Kuraz AI</div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Dynamic pricing (30/45/25 mix)</span>
                    <span className="font-semibold">$13,550</span>
                  </div>
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Package recommendations (60%)</span>
                    <span className="font-semibold text-emerald-400">+$3,300</span>
                  </div>
                  <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">TOTAL REVENUE</span>
                    <span className="text-white font-bold text-2xl">$16,850</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/40 rounded-xl p-5 text-center">
                  <div className="text-4xl font-black text-emerald-400 mb-1">+25%</div>
                  <div className="text-sm font-semibold text-emerald-300">Revenue Increase</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
              Built with Modern Tech
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Enterprise-Grade
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Technology Stack
              </span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl max-w-3xl mx-auto">
              Production-ready architecture designed for scale and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Frontend</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Next.js 14 (App Router)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    React 18 with TypeScript
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Tailwind CSS + shadcn/ui
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Data & AI</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Dynamic Pricing Engine
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Guest Segmentation AI
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Package Recommender
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Visualization</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Recharts for analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Real-time dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Interactive heatmaps
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Deployment</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Vercel Edge Network
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Global CDN
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Auto-scaling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Ethiopian Context</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Local holiday awareness
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Seasonal patterns
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Cultural events (Timkat)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg">UX Design</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Glassmorphism UI
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Responsive design
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Smooth animations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Your Resort Revenue?
              </span>
            </h2>
            <p className="text-slate-300 text-lg lg:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Built for the <span className="text-primary font-semibold">Ethiopia Hospitality Hackathon 2026</span>. 
              Designed for real-world deployment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="group bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white px-10 py-7 text-lg font-semibold shadow-2xl shadow-primary/30">
                  <BarChart3 className="mr-2 h-6 w-6" />
                  Access Dashboard
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/book">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-primary/50 px-10 py-7 text-lg font-semibold backdrop-blur-sm">
                  Try Guest Experience
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl"></div>
                </div>
                <span className="font-bold text-white text-xl">Kuraz AI</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 max-w-md">
                AI-powered revenue management system for Ethiopian resorts. 
                Increase revenue by 25% with dynamic pricing, guest segmentation, 
                and intelligent package recommendations.
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span>Ethiopia Hospitality Hackathon 2026</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-slate-400 hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-slate-400 hover:text-primary transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-slate-400 hover:text-primary transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#impact" className="text-slate-400 hover:text-primary transition-colors">
                    Impact
                  </a>
                </li>
              </ul>
            </div>

            {/* Try It */}
            <div>
              <h4 className="text-white font-semibold mb-4">Try It Now</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-primary transition-colors">
                    Manager Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-slate-400 hover:text-primary transition-colors">
                    Guest Booking
                  </Link>
                </li>
                <li>
                  <Link href="/simulate" className="text-slate-400 hover:text-primary transition-colors">
                    AI Simulator
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              © 2026 Kuraz AI. Built for Ethiopian hospitality innovation.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Powered by AI
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Made in Ethiopia
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
