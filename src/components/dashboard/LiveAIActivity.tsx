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
    <Card className="glass-card border-white/5 shadow-lg">
      <CardHeader className="border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary animate-pulse" />
            Live AI Activity
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={triggerAIUpdate}
            disabled={isRefreshing}
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            <span className="ml-2">Run AI Update</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {activities.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <BrainCircuit className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No recent AI activity. Click "Run AI Update" to see the engine in action.</p>
            </div>
          )}
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white capitalize">
                    {activity.action_type.replace('_', ' ')}
                  </span>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-xs">
                    {activity.room_type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                {activity.old_rate && (
                  <>
                    <span className="text-slate-400 line-through text-sm">
                      ETB {activity.old_rate.toLocaleString()}
                    </span>
                    {activity.new_rate > activity.old_rate ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-400" />
                    )}
                  </>
                )}
                <span className="text-white font-semibold">
                  ETB {activity.new_rate.toLocaleString()}
                </span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {Math.round(activity.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                {activity.reason}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
