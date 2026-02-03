"use client";

import { Video, TrendingUp, TrendingDown, UserX, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeeklyCallsMetrics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WeeklyCallsCardProps {
  metrics: WeeklyCallsMetrics;
}

export function WeeklyCallsCard({ metrics }: WeeklyCallsCardProps) {
  const attendanceDiff =
    metrics.attendancePercent - metrics.lastWeekAttendancePercent;
  const isImproved = attendanceDiff >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Video className="h-4 w-4 text-purple-500" />
          Weekly Leadership Calls Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Attendance Overview */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Attendance Overview
            </h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">
                {metrics.attendancePercent}%
              </span>
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
              vs {metrics.lastWeekAttendancePercent}% last week
            </p>
          </div>

          <Separator className="md:hidden" />

          {/* Call Issues */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Call Issues
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">No-show leaders</span>
                </div>
                <span className="text-sm font-semibold">
                  {metrics.noShowCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Missed 2+ consecutive</span>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  {metrics.missedConsecutiveCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
