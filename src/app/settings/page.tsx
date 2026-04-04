"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Brain, Hotel, Zap } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const sections = [
  {
    title: "Resort Configuration",
    icon: Hotel,
    items: [
      { label: "Resort Name", value: "Kuriftu Resort and Spa" },
      { label: "Total Rooms", value: "120" },
      { label: "Room Types", value: "Standard, Deluxe, Suite, Royal Suite" },
      { label: "Base Currency", value: "ETB (Ethiopian Birr)" },
    ],
  },
  {
    title: "Pricing Engine",
    icon: Zap,
    items: [
      { label: "Saver Class Closes At", value: "60% occupancy or <14 days" },
      { label: "Standard Class Closes At", value: "85% occupancy or <3 days" },
      { label: "Premium Class", value: "Always open" },
      { label: "Max Price Multiplier", value: "1.50× (same-day)" },
      { label: "Min Price Multiplier", value: "0.75× (low occupancy)" },
    ],
  },
  {
    title: "ML / AI Model",
    icon: Brain,
    items: [
      { label: "Forecasting Model", value: "XGBoost (demand)" },
      { label: "Segmentation", value: "Rule-based + ML override" },
      { label: "Package Recommendation", value: "Scoring algorithm" },
      { label: "Training Data", value: "2 years synthetic history" },
      { label: "Forecast Horizon", value: "90 days" },
    ],
  },
  {
    title: "Data & API",
    icon: Database,
    items: [
      { label: "Database", value: "SQLite (demo) / PostgreSQL (prod)" },
      { label: "API Backend", value: API_BASE },
      { label: "Packages Defined", value: "10 pre-built bundles" },
      { label: "Ethiopian Events", value: "15+ holidays & festivals" },
      { label: "Competitor Benchmarks", value: "5 Ethiopian resorts" },
    ],
  },
];

function SettingsPageContent() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          System Configuration
        </h1>
        <p className="text-muted-foreground">
          Current engine parameters and system settings for Kuraz AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="glass-card shadow-lg border-white/5">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-white flex items-center text-lg">
                <section.icon className="h-5 w-5 mr-2 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between items-center px-6 py-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-300 font-mono text-xs">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <p className="text-sm text-primary font-medium mb-1">Hackathon Demo Mode</p>
          <p className="text-sm text-muted-foreground">
            This system is running with synthetic data generated for the Ethiopia Hospitality Hackathon 2026.
            To reset and re-seed data, call <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">POST /api/seed</code> on the backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
