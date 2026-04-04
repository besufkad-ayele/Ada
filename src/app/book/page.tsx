"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, X, ChevronDown, Star, MapPin, Phone, Mail, 
  Wifi, Coffee, Waves, Dumbbell, UtensilsCrossed, Sparkles,
  User, LogOut, Hotel, Mountain, Palmtree, Sun, Calendar, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/modern-card";
import { ModernBadge } from "@/components/ui/modern-badge";

export default function KuriftuResortPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ["home", "about", "rooms", "amenities", "gallery", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push("/user-login");
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "rooms", label: "Rooms" },
    { id: "amenities", label: "Amenities" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sticky Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => scrollToSection("home")}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <Mountain className="h-8 w-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold text-white">
                Kuriftu Resort
              </span>
            </button>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-all ${
                    activeSection === item.id 
                      ? 'text-amber-400' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && currentUser ? (
                <>
                  <Link href="/user-dashboard">
                    <div className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-amber-500/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {currentUser.full_name}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/user-login">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left py-2 text-slate-300 hover:text-white transition-colors">
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t border-white/10">
                {isAuthenticated && currentUser ? (
                  <>
                    <Link href="/user-dashboard">
                      <div className="bg-white/5 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-sm font-semibold text-white">{currentUser.full_name}</span>
                      </div>
                    </Link>
                    <Button onClick={handleLogout} variant="outline" className="w-full border-white/20 text-white">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/user-login"><Button variant="outline" className="w-full border-white/20 text-white">Log In</Button></Link>
                    <Link href="/signup"><Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">Sign Up</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/kuriftu.png" alt="Kuriftu Resort" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/80"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <ModernBadge variant="primary" className="mb-6 text-sm px-6 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Ethiopia's Premier Luxury Resort
          </ModernBadge>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
            Welcome to<br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Kuriftu Resort
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Experience Ethiopian luxury where nature meets world-class hospitality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection("rooms")} 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-10 py-7 text-lg font-semibold shadow-2xl shadow-amber-500/30"
            >
              Explore Rooms 
              <ChevronDown className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              onClick={() => scrollToSection("contact")} 
              size="lg" 
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg font-semibold backdrop-blur-sm"
            >
              Contact Us
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ModernBadge variant="primary" className="mb-4">
              About Us
            </ModernBadge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Ethiopian <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Escape</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Nestled in Ethiopia's breathtaking landscape, Kuriftu Resort offers an unparalleled blend of luxury, 
              natural beauty, and world-class hospitality. Experience the perfect harmony of modern comfort and traditional Ethiopian warmth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center group hover:border-amber-500/30 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Luxury Redefined</h3>
              <p className="text-slate-400">
                Premium accommodations with stunning lake views and modern amenities
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center group hover:border-emerald-500/30 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Waves className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Natural Paradise</h3>
              <p className="text-slate-400">
                Surrounded by pristine nature and breathtaking Ethiopian landscapes
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center group hover:border-primary/30 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Service</h3>
              <p className="text-slate-400">
                Personalized experiences powered by Kuraz AI technology
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ModernBadge variant="primary" className="mb-4">
              Accommodations
            </ModernBadge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Rooms</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Choose from our carefully curated selection of luxury accommodations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Deluxe Room */}
            <GlassCard className="p-8 group hover:border-amber-400/50 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Hotel className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Deluxe Room</h3>
              <p className="text-slate-400 mb-6 text-base leading-relaxed">
                Spacious rooms with stunning lake views and modern amenities for ultimate comfort
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  Lake view balcony
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  King-size bed
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  Premium amenities
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-slate-400 mb-1">Starting from</div>
                <div className="text-4xl font-bold text-white">ETB 5,500</div>
                <div className="text-sm text-slate-400 mt-1">per night</div>
              </div>

              <Button 
                onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
              >
                Book Now
              </Button>
            </GlassCard>

            {/* Executive Suite - Featured */}
            <GlassCard className="p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-400/50 group relative overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <ModernBadge variant="warning" className="shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  POPULAR
                </ModernBadge>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Executive Suite</h3>
                <p className="text-slate-300 mb-6 text-base leading-relaxed">
                  Premium suite with separate living area and exclusive amenities for discerning guests
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-200">
                    <Check className="h-4 w-4 text-amber-400 mr-2" />
                    Separate living room
                  </div>
                  <div className="flex items-center text-sm text-slate-200">
                    <Check className="h-4 w-4 text-amber-400 mr-2" />
                    Premium lake view
                  </div>
                  <div className="flex items-center text-sm text-slate-200">
                    <Check className="h-4 w-4 text-amber-400 mr-2" />
                    Luxury bathroom
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30">
                  <div className="text-sm text-amber-200 mb-1">Starting from</div>
                  <div className="text-4xl font-bold text-white">ETB 8,500</div>
                  <div className="text-sm text-amber-200 mt-1">per night</div>
                </div>

                <Button 
                  onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base shadow-lg"
                >
                  Book Now
                </Button>
              </div>
            </GlassCard>

            {/* Presidential Villa */}
            <GlassCard className="p-8 group hover:border-emerald-400/50 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palmtree className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Presidential Villa</h3>
              <p className="text-slate-400 mb-6 text-base leading-relaxed">
                Ultimate luxury experience with private pool and dedicated butler service
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  Private infinity pool
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  Butler service
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 mr-2" />
                  Multiple bedrooms
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-slate-400 mb-1">Starting from</div>
                <div className="text-4xl font-bold text-white">ETB 15,000</div>
                <div className="text-sm text-slate-400 mt-1">per night</div>
              </div>

              <Button 
                onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
              >
                Book Now
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ModernBadge variant="primary" className="mb-4">
              World-Class Facilities
            </ModernBadge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Resort <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Amenities</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Indulge in our comprehensive range of luxury amenities and services
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Waves, title: "Infinity Pool & Spa", desc: "Stunning infinity pool overlooking the lake with full-service spa treatments", color: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
              { icon: UtensilsCrossed, title: "Fine Dining", desc: "Authentic Ethiopian cuisine and international dishes by award-winning chefs", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
              { icon: Dumbbell, title: "Fitness Center", desc: "State-of-the-art 24/7 gym with personal training and yoga classes", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
              { icon: Wifi, title: "High-Speed WiFi", desc: "Complimentary high-speed internet access throughout the resort", color: "from-primary/20 to-blue-500/20", iconColor: "text-primary" },
              { icon: Coffee, title: "Coffee Ceremony", desc: "Experience traditional Ethiopian coffee ceremony daily", color: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-400" },
              { icon: Sun, title: "Outdoor Activities", desc: "Guided hiking, boat tours, bird watching, and cultural excursions", color: "from-yellow-500/20 to-amber-500/20", iconColor: "text-yellow-400" },
            ].map((amenity, i) => (
              <GlassCard key={i} className="p-8 group hover:border-amber-400/30 transition-all">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${amenity.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <amenity.icon className={`h-7 w-7 ${amenity.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{amenity.title}</h3>
                <p className="text-slate-400 leading-relaxed">{amenity.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ModernBadge variant="primary" className="mb-4">
              Get In Touch
            </ModernBadge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Us</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our team is ready to assist you with your reservation and inquiries
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <GlassCard className="p-8 hover:border-amber-400/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-7 w-7 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Location</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Lake Ziway, Ethiopia<br />
                      Surrounded by pristine nature and breathtaking views
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8 hover:border-emerald-400/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
                    <Phone className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Phone</h3>
                    <p className="text-slate-400 leading-relaxed">
                      +251 11 123 4567<br />
                      Available 24/7 for reservations and inquiries
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center shrink-0">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Email</h3>
                    <p className="text-slate-400 leading-relaxed">
                      info@kuriftu.com<br />
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-400/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="relative text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Book?</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Experience Ethiopian luxury with AI-powered personalization and world-class service
                </p>
                {isAuthenticated ? (
                  <Button 
                    onClick={() => scrollToSection("rooms")} 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-10 py-6 text-lg font-semibold shadow-2xl"
                  >
                    View Rooms
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Link href="/signup">
                      <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-10 py-6 text-lg font-semibold shadow-2xl">
                        Sign Up Now
                      </Button>
                    </Link>
                    <Link href="/user-login">
                      <Button size="lg" variant="outline" className="w-full border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold">
                        Log In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Mountain className="h-8 w-8 text-amber-500" />
                <div className="absolute inset-0 bg-amber-500/20 blur-xl"></div>
              </div>
              <span className="text-2xl font-bold text-white">Kuriftu Resort</span>
            </div>
            <p className="text-slate-400 mb-6">Ethiopia's premier luxury resort</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-6">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Powered by Kuraz AI</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span>© 2026 Kuriftu Resort</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
