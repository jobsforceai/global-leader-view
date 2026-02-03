"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout";
import { VolumeChart } from "@/components/charts";
import {
  TopLeadersCard,
  CommunicationHealthCard,
  WeeklyCallsCard,
} from "@/components/cards";
import { MarketsInterventionTable } from "@/components/tables";
import {
  CommunicationMetrics,
  LeaderSnapshot,
  MarketIntervention,
  VolumeDataPoint,
  WeeklyCallsMetrics,
} from "@/lib/types";

type TimeGranularity = "daily" | "weekly" | "monthly";

interface CommandCenterClientProps {
  volumeDaily: VolumeDataPoint[];
  volumeWeekly: VolumeDataPoint[];
  volumeMonthly: VolumeDataPoint[];
  topLeaders: LeaderSnapshot[];
  teamTopLeaders: LeaderSnapshot[];
  marketInterventions: MarketIntervention[];
  communicationMetrics: CommunicationMetrics;
  weeklyCallsMetrics: WeeklyCallsMetrics;
}

export function CommandCenterClient({
  volumeDaily,
  volumeWeekly,
  volumeMonthly,
  topLeaders,
  teamTopLeaders,
  marketInterventions,
  communicationMetrics,
  weeklyCallsMetrics,
}: CommandCenterClientProps) {
  const [timeGranularity, setTimeGranularity] =
    useState<TimeGranularity>("daily");

  const volumeData = {
    daily: volumeDaily,
    weekly: volumeWeekly,
    monthly: volumeMonthly,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Executive overview of global leadership operations"
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeadersCard leaders={topLeaders} title="Top Leaders (Self Volume)" />
        <TopLeadersCard
          leaders={teamTopLeaders}
          title="Top Leaders (Team Volume)"
        />
      </div>

      <MarketsInterventionTable alerts={marketInterventions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunicationHealthCard metrics={communicationMetrics} />
        <WeeklyCallsCard metrics={weeklyCallsMetrics} />
      </div>
    </div>
  );
}
