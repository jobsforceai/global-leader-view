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
} from "./_components";
import {
  MOCK_COMMUNICATION_SUMMARY,
  MOCK_LEADERS_NOT_CONTACTED,
  MOCK_HIGH_VOLUME_LOW_CONTACT,
  MOCK_WEEKLY_CALLS_LIST,
  MOCK_WEEKLY_CALLS,
  MOCK_FOLLOWUPS,
} from "@/lib/mock-data";

export default function CommunicationPage() {
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

        {/* Tab 1: Communication Health */}
        <TabsContent value="health" className="space-y-6">
          {/* KPI Cards */}
          <CommunicationKpiCards
            contactedLast7Days={MOCK_COMMUNICATION_SUMMARY.contactedLast7Days}
            contactedLast14Days={MOCK_COMMUNICATION_SUMMARY.contactedLast14Days}
            contactedLast30Days={MOCK_COMMUNICATION_SUMMARY.contactedLast30Days}
            avgDaysSinceContact={MOCK_COMMUNICATION_SUMMARY.avgDaysSinceContact}
          />

          {/* Flagged Leaders Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotContactedTable leaders={MOCK_LEADERS_NOT_CONTACTED} />
            <HighVolumeLowContactTable leaders={MOCK_HIGH_VOLUME_LOW_CONTACT} />
          </div>
        </TabsContent>

        {/* Tab 2: Weekly Calls */}
        <TabsContent value="calls" className="space-y-6">
          {/* Summary Metrics */}
          <CallsSummaryMetrics
            attendancePercent={MOCK_WEEKLY_CALLS.attendancePercent}
            lastWeekAttendancePercent={MOCK_WEEKLY_CALLS.lastWeekAttendancePercent}
            noShowCount={MOCK_WEEKLY_CALLS.noShowCount}
            missedConsecutiveCount={MOCK_WEEKLY_CALLS.missedConsecutiveCount}
          />

          {/* Calls List */}
          <WeeklyCallsTable calls={MOCK_WEEKLY_CALLS_LIST} />
        </TabsContent>

        {/* Tab 3: Follow-ups */}
        <TabsContent value="followups" className="space-y-6">
          <FollowupsTable followups={MOCK_FOLLOWUPS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

