"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return (
    <div className="glass-card shadow-lg border-white/5 h-full flex items-center justify-center min-h-[300px]">
      <p className="text-muted-foreground text-sm">No revenue data available yet. Seed the database first.</p>
    </div>
  );

  return (
    <Card className="glass-card shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 relative bg-gradient-to-br from-black/40 via-transparent to-transparent">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointers-events-none" />
        <CardTitle className="text-white text-xl tracking-tight gold-gradient-text">Revenue Trends</CardTitle>
        <CardDescription className="text-slate-400">Daily revenue split by room vs. package</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRoom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPkg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43 96% 56%)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(43 96% 56%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), "MMM d")}
                stroke="transparent"
                tick={{fill: '#64748b', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                stroke="transparent" 
                tick={{fill: '#64748b', fontSize: 12}}
                tickFormatter={(val) => `ETB ${(val / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15,23,42,0.85)', 
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                }}
                labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                formatter={(value: any, name: any) => [
                  <span key={name} className="font-semibold text-white">ETB {Number(value || 0).toLocaleString()}</span>, 
                  <span key={name+"_label"} className="text-slate-300">{name === "room_revenue" ? "Room" : "Package"} Revenue</span>
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="room_revenue" 
                stackId="1" 
                stroke="hsl(199 89% 48%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRoom)" 
                activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(199 89% 48%)" }}
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="package_revenue" 
                stackId="1" 
                stroke="hsl(43 96% 56%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPkg)" 
                activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(43 96% 56%)", className: "shadow-[0_0_15px_rgba(245,158,11,0.8)]" }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
