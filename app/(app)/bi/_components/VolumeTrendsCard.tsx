"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolumeChart } from "@/components/charts";
import { VolumeDataPoint } from "@/lib/types";

type TimeGranularity = "daily" | "weekly" | "monthly";

interface VolumeTrendsCardProps {
  daily: VolumeDataPoint[];
  weekly: VolumeDataPoint[];
  monthly: VolumeDataPoint[];
}

export function VolumeTrendsCard({
  daily,
  weekly,
  monthly,
}: VolumeTrendsCardProps) {
  const [volumeGranularity, setVolumeGranularity] =
    useState<TimeGranularity>("daily");

  const volumeData = {
    daily,
    weekly,
    monthly,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Volume Trends</CardTitle>
          <Tabs
            value={volumeGranularity}
            onValueChange={(v) => setVolumeGranularity(v as TimeGranularity)}
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
  );
}
