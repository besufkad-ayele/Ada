"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Zap, TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface AIActivity {
  id: string;
  timestamp: string;
  action_type: string;
  room_type: string;
  old_rate?: number;
  new_rate: number;
  reason: string;
  confidence: number;
}

export function LiveAIActivity() {
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/ai-activity`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch AI activity:", err);
    }
  };

  const triggerAIUpdate = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`${API_BASE}/api/dashboard/trigger-ai-update`, { method: "POST" });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await fetchActivities();
    } catch (err) {
      console.error("Failed to trigger AI update:", err);
    } finally {
      setIsRefreshing(false);
    }
  };


  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex justify-between items-center relative z-10">
          <CardTitle className="text-white flex items-center tracking-tight text-xl">
            <span className="relative flex h-3 w-3 mr-3 mt-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_rgba(245,158,11,1)]"></span>
            </span>
            <span className="gold-gradient-text">Live AI Activity</span>
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={triggerAIUpdate}
            disabled={isRefreshing}
            className="border-primary/20 bg-black/20 text-primary hover:bg-primary/20 hover:text-white transition-all duration-300"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Zap className="h-4 w-4 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            )}
            <span className="ml-2">Run Engine</span>
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
          Last processed: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {activities.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <BrainCircuit className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No recent AI activity. Click "Run AI Update" to see the engine in action.</p>
            </div>
          )}
          {activities.map((activity) => (
            <div key={activity.id} className="p-5 hover:bg-white/5 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-accent/10 border border-accent/20 text-accent">
                    <BrainCircuit className="h-4 w-4 drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]" />
                  </div>
                  <span className="text-sm font-bold text-white capitalize tracking-wide">
                    {activity.action_type.replace('_', ' ')}
                  </span>
                  <Badge variant="outline" className="bg-black/20 border-white/10 text-xs px-2">
                    {activity.room_type.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-3 bg-black/20 rounded-lg p-3 border border-white/5">
                {activity.old_rate && (
                  <>
                    <span className="text-slate-500 line-through text-sm">
                      ETB {activity.old_rate.toLocaleString()}
                    </span>
                    {activity.new_rate > activity.old_rate ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-400 drop-shadow-[0_0_3px_rgba(243,114,114,0.5)]" />
                    )}
                  </>
                )}
                <span className="text-white font-extrabold text-lg">
                  ETB {activity.new_rate.toLocaleString()}
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] ml-auto">
                  {Math.round(activity.confidence * 100)}% Conf
                </Badge>
              </div>
              
              <div className="flex items-start gap-2 text-xs text-slate-400 italic">
                <div className="mt-0.5 min-w-[4px] h-[4px] rounded-full bg-accent/50" />
                <p>{activity.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
