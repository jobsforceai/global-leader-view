"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolumeChart } from "@/components/charts";
import {
  BiFilterBar,
  TopRegionsChart,
  TopPerformersTable,
  CommunicationMiniKpis,
  WeakAlertsCompact,
  LeaderScorecards,
  HighGrowthLeaders,
  WeakMarketsTable,
} from "./_components";
import {
  BiFilters,
  MOCK_BI_VOLUME_DAILY,
  MOCK_BI_VOLUME_WEEKLY,
  MOCK_BI_VOLUME_MONTHLY,
  MOCK_TOP_REGIONS,
  MOCK_TOP_PERFORMERS,
  MOCK_BI_COMMUNICATION,
  MOCK_WEAK_ALERTS,
  MOCK_ALL_LEADERS,
  MOCK_HIGH_GROWTH_LEADERS,
  MOCK_WEAK_MARKETS,
} from "@/lib/bi-mock-data";

type TimeGranularity = "daily" | "weekly" | "monthly";

export default function BusinessIntelligencePage() {
  const [filters, setFilters] = useState<BiFilters>({
    timeRange: "30d",
    country: "all",
    city: "all",
    role: "all",
    status: "all",
  });

  const [volumeGranularity, setVolumeGranularity] =
    useState<TimeGranularity>("daily");

  const volumeData = {
    daily: MOCK_BI_VOLUME_DAILY,
    weekly: MOCK_BI_VOLUME_WEEKLY,
    monthly: MOCK_BI_VOLUME_MONTHLY,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Business Intelligence"
        description="Performance, growth, and risk insights across the leadership network"
      />

      {/* Global Filter Bar */}
      <BiFilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Main Tabs */}
      <Tabs defaultValue="ceo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ceo">CEO Dashboard</TabsTrigger>
          <TabsTrigger value="scorecards">Leader Scorecards</TabsTrigger>
          <TabsTrigger value="growth">High Growth Leaders</TabsTrigger>
          <TabsTrigger value="weak">Weak Markets</TabsTrigger>
        </TabsList>

        {/* Tab 1: CEO Dashboard */}
        <TabsContent value="ceo" className="space-y-6">
          {/* Volume Trends */}
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

          {/* Top Growth Regions + Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Top Growth Regions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <TopRegionsChart data={MOCK_TOP_REGIONS} />
              </CardContent>
            </Card>
            <TopPerformersTable leaders={MOCK_TOP_PERFORMERS} />
          </div>

          {/* Communication Health + Weak Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommunicationMiniKpis
              contactedLast7Days={MOCK_BI_COMMUNICATION.contactedLast7Days}
              contactedLast14Days={MOCK_BI_COMMUNICATION.contactedLast14Days}
              contactedLast30Days={MOCK_BI_COMMUNICATION.contactedLast30Days}
              overdueFollowups={MOCK_BI_COMMUNICATION.overdueFollowups}
            />
            <WeakAlertsCompact alerts={MOCK_WEAK_ALERTS} />
          </div>
        </TabsContent>

        {/* Tab 2: Leader Scorecards */}
        <TabsContent value="scorecards" className="space-y-6">
          <LeaderScorecards leaders={MOCK_ALL_LEADERS} />
        </TabsContent>

        {/* Tab 3: High Growth Leaders */}
        <TabsContent value="growth" className="space-y-6">
          <HighGrowthLeaders leaders={MOCK_HIGH_GROWTH_LEADERS} />
        </TabsContent>

        {/* Tab 4: Weak Markets */}
        <TabsContent value="weak" className="space-y-6">
          <WeakMarketsTable markets={MOCK_WEAK_MARKETS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
