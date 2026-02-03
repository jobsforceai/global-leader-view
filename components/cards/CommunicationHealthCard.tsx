"use client";

import { Phone, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunicationMetrics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CommunicationHealthCardProps {
  metrics: CommunicationMetrics;
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={cn("h-2 rounded-full transition-all", className)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function CommunicationHealthCard({
  metrics,
}: CommunicationHealthCardProps) {
  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          Communication Health Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Last 7 Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contacted (7 days)</span>
              <span className="font-semibold">
                {metrics.contactedLast7Days}%
              </span>
            </div>
            <ProgressBar
              value={metrics.contactedLast7Days}
              className={getProgressColor(metrics.contactedLast7Days)}
            />
          </div>

          {/* Last 14 Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contacted (14 days)</span>
              <span className="font-semibold">
                {metrics.contactedLast14Days}%
              </span>
            </div>
            <ProgressBar
              value={metrics.contactedLast14Days}
              className={getProgressColor(metrics.contactedLast14Days)}
            />
          </div>

          {/* Last 30 Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contacted (30 days)</span>
              <span className="font-semibold">
                {metrics.contactedLast30Days}%
              </span>
            </div>
            <ProgressBar
              value={metrics.contactedLast30Days}
              className={getProgressColor(metrics.contactedLast30Days)}
            />
          </div>

          {/* Overdue Follow-ups */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">
                  Overdue Follow-ups
                </span>
              </div>
              <span className="text-lg font-bold text-amber-500">
                {metrics.overdueFollowups}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
