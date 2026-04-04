"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart3, Brain, Sparkles, TrendingUp, Users, Zap, 
  Star, CheckCircle2, Globe, Calendar, DollarSign, Target, 
  Award, ChevronRight, Play, Menu, X, Activity, Cpu, Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Reusable animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center"
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-2 border-b-2 border-l-2 border-amber-400 rounded-full"
            />
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-8 text-slate-400 font-mono tracking-widest text-sm uppercase"
          >
            Initializing Kuraz AI
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kuraz<span className="text-primary">AI</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {['Features', 'How It Works', 'Impact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex gap-4">
            <Link href="/book">
              <Button variant="ghost" className="hover:bg-white/5">Book Stay</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Dashboard Login
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {['Features', 'How It Works', 'Impact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                    {item}
                  </a>
                ))}
                <div className="h-px bg-white/10 w-full my-2" />
                <Button variant="outline" className="w-full justify-center">Book Stay</Button>
                <Button className="w-full justify-center bg-primary text-white">Dashboard Login</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8 backdrop-blur-md"
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>Ethiopia Hospitality Hackathon 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              Hotel Revenue Management, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400">
                Powered by AI.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Transform Ethiopian hospitality with airline-style dynamic pricing, intelligent guest segmentation, and AI-powered recommendations. <span className="text-white font-medium">Increase revenue by 25%</span> automatically.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-white text-slate-950 hover:bg-slate-200 text-base font-semibold transition-all">
                <BarChart3 className="mr-2 h-5 w-5" /> View Live Dashboard
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-white/20 hover:bg-white/5 text-base font-semibold backdrop-blur-sm transition-all">
                <Play className="mr-2 h-5 w-5" /> Try Guest Booking
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={staggerContainer} initial="hidden" animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-white/10"
            >
              {[
                { label: "Revenue Increase", value: "+25%", icon: TrendingUp, color: "text-emerald-400" },
                { label: "Package Acceptance", value: "60%", icon: Target, color: "text-blue-400" },
                { label: "Guest Segments", value: "8", icon: Users, color: "text-amber-400" },
                { label: "Local Events Tracked", value: "24/7", icon: Calendar, color: "text-purple-400" }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeInUp} className="text-center p-4">
                  <stat.icon className={`h-6 w-6 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Three Intelligent Engines</h2>
              <p className="text-lg text-slate-400">Our AI analyzes thousands of data points to optimize every single booking in real-time.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Dynamic Pricing",
                  desc: "Airline-style yield management with 7-tier occupancy multipliers and real-time competitor benchmarking.",
                  features: ["Event-driven pricing (Timkat +70%)", "Automatic inventory fencing", "Saver/Standard/Premium tiers"],
                  color: "from-blue-500/20 to-blue-500/0",
                  iconColor: "text-blue-400"
                },
                {
                  icon: Brain,
                  title: "Guest Segmentation",
                  desc: "AI classifies every booking into 8 unique segments with deep price sensitivity and package affinity scoring.",
                  features: ["International vs. domestic", "Business, honeymoon, family", "Real-time classification"],
                  color: "from-emerald-500/20 to-emerald-500/0",
                  iconColor: "text-emerald-400"
                },
                {
                  icon: Sparkles,
                  title: "Package Recommender",
                  desc: "Pre-built service bundles with dynamic discounting based on the detected segment and current hotel occupancy.",
                  features: ["5-25% dynamic discounts", "Context-aware upsells", "+ETB 3,300 avg revenue uplift"],
                  color: "from-amber-500/20 to-amber-500/0",
                  iconColor: "text-amber-400"
                }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${card.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <Card className="h-full bg-slate-950/50 border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors z-10 relative">
                    <CardContent className="p-8">
                      <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                        <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                      <p className="text-slate-400 mb-8 leading-relaxed">{card.desc}</p>
                      <ul className="space-y-4">
                        {card.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-300">
                            <CheckCircle2 className={`h-5 w-5 mr-3 shrink-0 ${card.iconColor}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (Timeline Flow) */}
        <section id="how-it-works" className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-slate-400">A seamless integration that works entirely behind the scenes.</p>
            </motion.div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-800 via-primary/50 to-emerald-500/50 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-4 gap-8 relative z-10">
                {[
                  { step: "01", title: "Guest Books", desc: "User selects dates and room via your existing booking portal.", icon: Globe },
                  { step: "02", title: "AI Analyzes", desc: "Engine calculates optimal rate based on local demand & events.", icon: Cpu },
                  { step: "03", title: "Segment Match", desc: "System recommends personalized packages (e.g., Romance, Tour).", icon: Target },
                  { step: "04", title: "Rev Maxed", desc: "Guest books higher value cart; data feeds back to dashboard.", icon: DollarSign, highlight: true }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="relative"
                  >
                    <div className={`p-8 rounded-2xl border backdrop-blur-md h-full transition-transform hover:-translate-y-2 ${
                      item.highlight 
                        ? 'bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-900/80 border-white/10'
                    }`}>
                      <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 ${
                        item.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-primary'
                      }`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-500 mb-2">STEP {item.step}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact / Proof Section */}
        <section id="impact" className="py-24 px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Proven Results in Synthetic Data</h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  We modeled 100 room nights using standard Ethiopian hospitality metrics. By applying dynamic pricing and AI-driven package recommendations, the difference is undeniable.
                </p>
                <ul className="space-y-6">
                  {[
                    { title: "Standard Management", value: "$13,500", desc: "Fixed ADR + Random Ancillary" },
                    { title: "With Kuraz AI", value: "$16,850", desc: "Dynamic Pricing + Segmented Upsells" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between p-5 rounded-xl border border-white/10 bg-slate-950/50">
                      <div>
                        <div className="font-semibold text-white mb-1">{item.title}</div>
                        <div className="text-sm text-slate-400">{item.desc}</div>
                      </div>
                      <div className={`text-2xl font-bold ${i === 1 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {item.value}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/20 rounded-3xl blur-3xl" />
                <Card className="relative bg-slate-950/80 border-white/10 backdrop-blur-xl overflow-hidden">
                  <CardContent className="p-10 text-center">
                    <div className="text-emerald-400 font-mono mb-4 text-sm tracking-widest uppercase">Net Revenue Increase</div>
                    <div className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter">25<span className="text-emerald-500">%</span></div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                      <motion.div 
                        initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-emerald-400"
                      />
                    </div>
                    <p className="text-slate-400">Achieved without increasing baseline occupancy limits.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950 -z-10" />
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to modernize your resort?</h2>
            <p className="text-xl text-slate-400 mb-12">
              Experience the future of Ethiopian hospitality. Try the manager dashboard or test the guest booking flow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white text-base font-semibold w-full sm:w-auto">
                  Access Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/book">
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 hover:bg-white/10 text-base font-semibold w-full sm:w-auto backdrop-blur-sm">
                  Try Guest Booking
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/50 py-12 px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 opacity-80">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-white">KurazAI</span>
          </div>
          <div className="text-sm text-slate-500 text-center md:text-left">
            Built for the Ethiopia Hospitality Hackathon 2026.
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Brain className="h-4 w-4" /> Powered by AI</span>
            <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Addis Ababa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}