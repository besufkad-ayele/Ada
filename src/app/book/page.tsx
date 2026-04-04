"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, X, ChevronDown, Star, MapPin, Phone, Mail, 
  Wifi, Coffee, Waves, Dumbbell, UtensilsCrossed, Sparkles,
  User, LogOut, Hotel, Mountain, Palmtree, Sun, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => scrollToSection("home")}
              className="flex items-center space-x-3"
            >
              <Mountain className={`h-8 w-8 ${scrolled ? 'text-amber-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Kuriftu Resort
              </span>
            </button>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
                  } ${activeSection === item.id ? (scrolled ? 'text-amber-600' : 'text-amber-300') : ''}`}
                >
                  {item.label}
                </button>
              ))}
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && currentUser ? (
                <>
                  <Link href="/user-dashboard">
                    <div className={`px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${scrolled ? 'bg-amber-50 hover:bg-amber-100' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'}`}>
                      <div className="flex items-center gap-2">
                        <User className={`h-4 w-4 ${scrolled ? 'text-amber-600' : 'text-white'}`} />
                        <span className={`text-sm font-semibold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                          {currentUser.full_name}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className={scrolled ? 'border-gray-300' : 'border-white/30 text-white'}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/user-login">
                    <Button variant="outline" className={scrolled ? 'border-gray-300' : 'border-white/30 text-white'}>
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className={`lg:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left py-2 text-gray-700">
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t">
                {isAuthenticated && currentUser ? (
                  <>
                    <Link href="/user-dashboard">
                      <div className="bg-amber-50 px-4 py-3 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                        <span className="text-sm font-semibold">{currentUser.full_name}</span>
                      </div>
                    </Link>
                    <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/user-login"><Button variant="outline" className="w-full">Log In</Button></Link>
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6">
            Welcome to<br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Kuriftu Resort
            </span>
          </h1>
          <p className="text-2xl text-white/90 mb-12">Experience Ethiopian luxury</p>
          <Button onClick={() => scrollToSection("rooms")} size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-7 text-lg">
            Explore Rooms <ChevronDown className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Ethiopian <span className="text-amber-600">Escape</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Nestled in Ethiopia's breathtaking landscape, offering luxury and world-class hospitality.
          </p>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16">
            Our <span className="text-amber-600">Rooms</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Deluxe Room */}
            <Card className="border-2 border-gray-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 bg-white group">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Hotel className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Deluxe Room</h3>
                <p className="text-gray-600 mb-6 text-base">Spacious rooms with stunning lake views and modern amenities</p>
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Starting from</div>
                  <div className="text-4xl font-bold text-gray-900">ETB 5,500</div>
                  <div className="text-sm text-gray-500 mt-1">per night</div>
                </div>
                <Button 
                  onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Executive Suite - Featured */}
            <Card className="border-2 border-amber-400 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 group relative overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
              </div>
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Executive Suite</h3>
                <p className="text-gray-700 mb-6 text-base">Premium suite with separate living area and exclusive amenities</p>
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Starting from</div>
                  <div className="text-4xl font-bold text-gray-900">ETB 8,500</div>
                  <div className="text-sm text-gray-600 mt-1">per night</div>
                </div>
                <Button 
                  onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base shadow-lg"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Presidential Villa */}
            <Card className="border-2 border-gray-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 bg-white group">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palmtree className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Presidential Villa</h3>
                <p className="text-gray-600 mb-6 text-base">Ultimate luxury experience with private pool and butler service</p>
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Starting from</div>
                  <div className="text-4xl font-bold text-gray-900">ETB 15,000</div>
                  <div className="text-sm text-gray-500 mt-1">per night</div>
                </div>
                <Button 
                  onClick={() => !isAuthenticated ? router.push("/user-login") : scrollToSection("contact")} 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16">
            Resort <span className="text-amber-600">Amenities</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Waves, title: "Infinity Pool & Spa", desc: "Stunning pool with spa treatments" },
              { icon: UtensilsCrossed, title: "Fine Dining", desc: "Ethiopian and international cuisine" },
              { icon: Dumbbell, title: "Fitness Center", desc: "24/7 gym with personal training" },
              { icon: Wifi, title: "High-Speed WiFi", desc: "Complimentary internet access" },
              { icon: Coffee, title: "Coffee Ceremony", desc: "Traditional Ethiopian experience" },
              { icon: Sun, title: "Outdoor Activities", desc: "Hiking, boat tours, excursions" },
            ].map((amenity, i) => (
              <div key={i} className="p-8 bg-amber-50 rounded-2xl hover:shadow-xl transition-all">
                <amenity.icon className="h-12 w-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{amenity.title}</h3>
                <p className="text-gray-600">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16">
            Contact <span className="text-amber-600">Us</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6 flex items-start gap-4">
                  <MapPin className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Location</h3>
                    <p className="text-gray-700">Lake Ziway, Ethiopia</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6 flex items-start gap-4">
                  <Phone className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Phone</h3>
                    <p className="text-gray-700">+251 11 123 4567</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6 flex items-start gap-4">
                  <Mail className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Email</h3>
                    <p className="text-gray-700">info@kuriftu.com</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="p-10 text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">Ready to Book?</h3>
                <p className="text-amber-50 mb-8">Experience Ethiopian luxury with AI-powered personalization</p>
                {isAuthenticated ? (
                  <Button onClick={() => scrollToSection("rooms")} size="lg" className="bg-white text-amber-600 px-10 py-6">
                    View Rooms
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Link href="/signup"><Button size="lg" className="w-full bg-white text-amber-600 px-10 py-6">Sign Up Now</Button></Link>
                    <Link href="/user-login"><Button size="lg" variant="outline" className="w-full border-2 border-white text-white px-10 py-6">Log In</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="h-8 w-8 text-amber-500" />
            <span className="text-2xl font-bold">Kuriftu Resort</span>
          </div>
          <p className="text-gray-400 mb-8">Ethiopia's premier luxury resort</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Powered by Kuraz AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
