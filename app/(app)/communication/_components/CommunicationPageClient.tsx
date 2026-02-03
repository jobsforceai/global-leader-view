"use client";

import { PageHeader } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CommunicationKpiCards,
  NotContactedTable,
  HighVolumeLowContactTable,
  WeeklyCallsTable,
  CallsSummaryMetrics,
  FollowupsTable,
} from "./index";
import {
  FollowUp,
  LeaderContact,
  WeeklyCallListItem,
  CommunicationMetrics,
  WeeklyCallsMetrics,
  WeeklyBoardLeader,
  WeeklyBoardSummary,
} from "@/lib/types";
import { WeeklyBoardTable } from "./WeeklyBoardTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunicationPageClientProps {
  metrics: CommunicationMetrics;
  notContacted: LeaderContact[];
  highVolumeLowContact: LeaderContact[];
  weeklyCalls: WeeklyCallListItem[];
  weeklyCallsMetrics: WeeklyCallsMetrics;
  followups: FollowUp[];
  weeklyBoard: WeeklyBoardLeader[];
  weeklyBoardWeekStart: string;
  weeklySummary: WeeklyBoardSummary | null;
}

export function CommunicationPageClient({
  metrics,
  notContacted,
  highVolumeLowContact,
  weeklyCalls,
  weeklyCallsMetrics,
  followups,
  weeklyBoard,
  weeklyBoardWeekStart,
  weeklySummary,
}: CommunicationPageClientProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication & Calls"
        description="Visibility into leadership engagement and follow-up discipline"
      />

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList>
          <TabsTrigger value="health">Communication Health</TabsTrigger>
          <TabsTrigger value="calls">Weekly Calls</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <CommunicationKpiCards
            contactedLast7Days={metrics.contactedLast7Days}
            contactedLast14Days={metrics.contactedLast14Days}
            contactedLast30Days={metrics.contactedLast30Days}
            avgDaysSinceContact={metrics.avgDaysSinceContact || 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotContactedTable leaders={notContacted} />
            <HighVolumeLowContactTable leaders={highVolumeLowContact} />
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <CallsSummaryMetrics
            attendancePercent={weeklyCallsMetrics.attendancePercent}
            lastWeekAttendancePercent={weeklyCallsMetrics.lastWeekAttendancePercent}
            noShowCount={weeklyCallsMetrics.noShowCount}
            missedConsecutiveCount={weeklyCallsMetrics.missedConsecutiveCount}
          />

          <WeeklyCallsTable calls={weeklyCalls} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Weekly Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {weeklySummary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Leaders</p>
                    <p className="text-lg font-semibold">
                      {weeklySummary.totalLeaders}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contacted</p>
                    <p className="text-lg font-semibold">
                      {weeklySummary.contacted}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Needs Follow-up</p>
                    <p className="text-lg font-semibold">
                      {weeklySummary.statusCounts.NEED_FOLLOWUP}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Not Contacted</p>
                    <p className="text-lg font-semibold">
                      {weeklySummary.statusCounts.NOT_CONTACTED}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Weekly summary unavailable
                </p>
              )}
            </CardContent>
          </Card>

          <WeeklyBoardTable
            leaders={weeklyBoard}
            weekStart={weeklyBoardWeekStart}
          />
        </TabsContent>

        <TabsContent value="followups" className="space-y-6">
          <FollowupsTable followups={followups} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
