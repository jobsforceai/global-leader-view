"use client";

import { TrendingUp, TrendingDown, UserX, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CallsSummaryMetricsProps {
  attendancePercent: number;
  lastWeekAttendancePercent: number;
  noShowCount: number;
  missedConsecutiveCount: number;
}

export function CallsSummaryMetrics({
  attendancePercent,
  lastWeekAttendancePercent,
  noShowCount,
  missedConsecutiveCount,
}: CallsSummaryMetricsProps) {
  const attendanceDiff = attendancePercent - lastWeekAttendancePercent;
  const isImproved = attendanceDiff >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Call Summary Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">This Week Attendance</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{attendancePercent}%</span>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium pb-1",
                  isImproved ? "text-green-500" : "text-red-500"
                )}
              >
                {isImproved ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isImproved ? "+" : ""}
                  {attendanceDiff.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              vs {lastWeekAttendancePercent}% last week
            </p>
          </div>

          <Separator className="md:hidden" />

          {/* No-shows */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-muted-foreground">No-show Leaders</p>
            </div>
            <p className="text-3xl font-bold text-amber-500">{noShowCount}</p>
            <p className="text-xs text-muted-foreground">
              Leaders who missed this week
            </p>
          </div>

          <Separator className="md:hidden" />

          {/* Consecutive Misses */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-muted-foreground">Missed 2+ Consecutive</p>
            </div>
            <p className="text-3xl font-bold text-red-500">
              {missedConsecutiveCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
