"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout";
import { VolumeChart } from "@/components/charts";
import {
  TopLeadersCard,
  StagnatingLeadersCard,
  CommunicationHealthCard,
  WeeklyCallsCard,
} from "@/components/cards";
import { MarketsInterventionTable } from "@/components/tables";
import {
  MOCK_VOLUME_DAILY,
  MOCK_VOLUME_WEEKLY,
  MOCK_VOLUME_MONTHLY,
  MOCK_TOP_LEADERS,
  MOCK_STAGNATING_LEADERS,
  MOCK_MARKET_ALERTS,
  MOCK_COMMUNICATION_METRICS,
  MOCK_WEEKLY_CALLS,
} from "@/lib/mock-data";

type TimeGranularity = "daily" | "weekly" | "monthly";

export default function CommandCenterPage() {
  const [timeGranularity, setTimeGranularity] =
    useState<TimeGranularity>("daily");

  const volumeData = {
    daily: MOCK_VOLUME_DAILY,
    weekly: MOCK_VOLUME_WEEKLY,
    monthly: MOCK_VOLUME_MONTHLY,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Command Center"
        description="Executive overview of global leadership operations"
      />

      {/* Section 1: Global Volume Trend */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">
              Global Business Volume
            </CardTitle>
            <Tabs
              value={timeGranularity}
              onValueChange={(v) => setTimeGranularity(v as TimeGranularity)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs px-3">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-3">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-3">
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <VolumeChart data={volumeData[timeGranularity]} />
        </CardContent>
      </Card>

      {/* Section 2: Leader Performance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeadersCard leaders={MOCK_TOP_LEADERS} />
        <StagnatingLeadersCard leaders={MOCK_STAGNATING_LEADERS} />
      </div>

      {/* Section 3: Markets Needing Intervention */}
      <MarketsInterventionTable alerts={MOCK_MARKET_ALERTS} />

      {/* Section 4 & 5: Communication Health & Weekly Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunicationHealthCard metrics={MOCK_COMMUNICATION_METRICS} />
        <WeeklyCallsCard metrics={MOCK_WEEKLY_CALLS} />
      </div>
    </div>
  );
}
