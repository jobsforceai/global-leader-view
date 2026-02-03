"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolumeChart } from "@/components/charts";
import {
  TopRegionsChart,
  TopPerformersTable,
  CommunicationMiniKpis,
  WeakAlertsCompact,
  LeaderScorecards,
  HighGrowthLeaders,
  WeakMarketsTable,
} from "./index";
import {
  VolumeDataPoint,
  TopRegion,
  TopLeader,
  CommunicationMetrics,
  WeakMarket,
  BiLeaderScorecard,
  HighGrowthLeader,
  DailyClosureTracker,
} from "@/lib/types";
import { DailyClosureCard } from "./DailyClosureCard";

type TimeGranularity = "daily" | "weekly" | "monthly";

interface BusinessIntelligenceClientProps {
  volumeDaily: VolumeDataPoint[];
  volumeWeekly: VolumeDataPoint[];
  volumeMonthly: VolumeDataPoint[];
  topRegions: TopRegion[];
  topPerformers: TopLeader[];
  communicationMetrics: CommunicationMetrics;
  weakAlerts: WeakMarket[];
  leaderScorecards: BiLeaderScorecard[];
  highGrowthLeaders: HighGrowthLeader[];
  weakMarkets: WeakMarket[];
  dailyClosure: DailyClosureTracker | null;
}

export function BusinessIntelligenceClient({
  volumeDaily,
  volumeWeekly,
  volumeMonthly,
  topRegions,
  topPerformers,
  communicationMetrics,
  weakAlerts,
  leaderScorecards,
  highGrowthLeaders,
  weakMarkets,
  dailyClosure,
}: BusinessIntelligenceClientProps) {
  const [volumeGranularity, setVolumeGranularity] =
    useState<TimeGranularity>("daily");

  const volumeData = {
    daily: volumeDaily,
    weekly: volumeWeekly,
    monthly: volumeMonthly,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence"
        description="Performance, growth, and risk insights across the leadership network"
      />

      {/* Filters UI intentionally hidden until API supports filtering */}

      <Tabs defaultValue="ceo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ceo">CEO Dashboard</TabsTrigger>
          <TabsTrigger value="scorecards">Leader Scorecards</TabsTrigger>
          <TabsTrigger value="growth">High Growth Leaders</TabsTrigger>
          <TabsTrigger value="weak">Weak Markets</TabsTrigger>
        </TabsList>

        <TabsContent value="ceo" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold">
                  Volume Trends
                </CardTitle>
                <Tabs
                  value={volumeGranularity}
                  onValueChange={(v) =>
                    setVolumeGranularity(v as TimeGranularity)
                  }
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
              <VolumeChart data={volumeData[volumeGranularity]} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Top Growth Regions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <TopRegionsChart data={topRegions} />
              </CardContent>
            </Card>
            <TopPerformersTable leaders={topPerformers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommunicationMiniKpis
              contactedLast7Days={communicationMetrics.contactedLast7Days}
              contactedLast14Days={communicationMetrics.contactedLast14Days}
              contactedLast30Days={communicationMetrics.contactedLast30Days}
              overdueFollowups={communicationMetrics.overdueFollowups}
            />
            <WeakAlertsCompact alerts={weakAlerts} />
          </div>

          {dailyClosure && <DailyClosureCard data={dailyClosure} />}
        </TabsContent>

        <TabsContent value="scorecards" className="space-y-6">
          <LeaderScorecards leaders={leaderScorecards} />
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <HighGrowthLeaders leaders={highGrowthLeaders} />
        </TabsContent>

        <TabsContent value="weak" className="space-y-6">
          <WeakMarketsTable markets={weakMarkets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
