"use client";

import { AlertTriangle, AlertCircle, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AlertSummaryMetrics } from "@/lib/alerts-mock-data";

interface AlertSummaryCardsProps {
  metrics: AlertSummaryMetrics;
}

export function AlertSummaryCards({ metrics }: AlertSummaryCardsProps) {
  const cards = [
    {
      label: "Total Active Alerts",
      value: metrics.totalActive,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "High Severity",
      value: metrics.highSeverity,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Created This Week",
      value: metrics.createdThisWeek,
      icon: Plus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Resolved",
      value: metrics.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
