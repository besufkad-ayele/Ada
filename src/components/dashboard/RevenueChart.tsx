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
    <Card className="glass-card shadow-lg border-white/5 h-full">
      <CardHeader>
        <CardTitle className="text-white">Revenue Trends</CardTitle>
        <CardDescription>Daily revenue split by room vs. package</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRoom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPkg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), "MMM d")}
                stroke="#64748b"
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(val) => `ETB ${(val / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                formatter={(value: number, name: string) => [
                  `ETB ${value.toLocaleString()}`, 
                  name === "room_revenue" ? "Room Revenue" : "Package Revenue"
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="room_revenue" 
                stackId="1" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorRoom)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="package_revenue" 
                stackId="1" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorPkg)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
