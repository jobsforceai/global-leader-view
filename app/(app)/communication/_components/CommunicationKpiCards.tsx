"use client";

import { Phone, Users, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommunicationKpiCardsProps {
  contactedLast7Days: number;
  contactedLast14Days: number;
  contactedLast30Days: number;
  avgDaysSinceContact: number;
}

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "good" | "warning" | "bad";
}

function KpiCard({ title, value, icon, trend = "good" }: KpiCardProps) {
  const trendColors = {
    good: "text-green-500",
    warning: "text-amber-500",
    bad: "text-red-500",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", trendColors[trend])}>
              {value}
            </p>
          </div>
          <div className="p-2 bg-muted rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommunicationKpiCards({
  contactedLast7Days,
  contactedLast14Days,
  contactedLast30Days,
  avgDaysSinceContact,
}: CommunicationKpiCardsProps) {
  const getTrend = (value: number): "good" | "warning" | "bad" => {
    if (value >= 80) return "good";
    if (value >= 60) return "warning";
    return "bad";
  };

  const getAvgTrend = (value: number): "good" | "warning" | "bad" => {
    if (value <= 7) return "good";
    if (value <= 14) return "warning";
    return "bad";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Contacted (7 days)"
        value={`${contactedLast7Days}%`}
        icon={<Phone className="h-5 w-5 text-muted-foreground" />}
        trend={getTrend(contactedLast7Days)}
      />
      <KpiCard
        title="Contacted (14 days)"
        value={`${contactedLast14Days}%`}
        icon={<Users className="h-5 w-5 text-muted-foreground" />}
        trend={getTrend(contactedLast14Days)}
      />
      <KpiCard
        title="Contacted (30 days)"
        value={`${contactedLast30Days}%`}
        icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
        trend={getTrend(contactedLast30Days)}
      />
      <KpiCard
        title="Avg Days Since Contact"
        value={`${avgDaysSinceContact} days`}
        icon={<Clock className="h-5 w-5 text-muted-foreground" />}
        trend={getAvgTrend(avgDaysSinceContact)}
      />
    </div>
  );
}
