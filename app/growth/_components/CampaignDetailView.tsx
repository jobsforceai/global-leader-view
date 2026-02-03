"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Users, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Campaign, CampaignStatus } from "@/lib/growth-mock-data";

interface CampaignDetailViewProps {
  campaign: Campaign;
}

const statusStyles: Record<CampaignStatus, string> = {
  Planned: "bg-slate-100 text-slate-700",
  Active: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const hasData = campaign.trendData.length > 0;
  const hasCheckpoints = campaign.checkpoints.length > 0;

  // Calculate before vs after changes
  const volumeChange =
    campaign.afterKpis.volume > 0
      ? ((campaign.afterKpis.volume - campaign.beforeKpis.volume) /
          campaign.beforeKpis.volume) *
        100
      : 0;
  const activationsChange =
    campaign.afterKpis.activations > 0
      ? ((campaign.afterKpis.activations - campaign.beforeKpis.activations) /
          campaign.beforeKpis.activations) *
        100
      : 0;
  const retentionChange =
    campaign.afterKpis.retention > 0
      ? campaign.afterKpis.retention - campaign.beforeKpis.retention
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{campaign.name}</h3>
            <Badge className={cn("font-normal", statusStyles[campaign.status])}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {campaign.market} • {campaign.duration} • {campaign.startDate} to{" "}
            {campaign.endDate}
          </p>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium mb-1">Primary Objective</p>
        <p className="text-sm text-muted-foreground">
          {campaign.primaryObjective}
        </p>
      </div>

      {/* Before vs After Comparison */}
      {hasData && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-3">Before vs After</h4>
            <div className="grid grid-cols-3 gap-4">
              {/* Volume */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Volume
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        Before
                      </span>
                      <span className="text-sm">
                        {formatCurrency(campaign.beforeKpis.volume)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        After
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(campaign.afterKpis.volume)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium text-right pt-1",
                        volumeChange >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {volumeChange >= 0 ? "+" : ""}
                      {volumeChange.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activations */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Activations
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        Before
                      </span>
                      <span className="text-sm">
                        {campaign.beforeKpis.activations}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        After
                      </span>
                      <span className="text-sm font-medium">
                        {campaign.afterKpis.activations}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium text-right pt-1",
                        activationsChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {activationsChange >= 0 ? "+" : ""}
                      {activationsChange.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Retention */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Retention
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        Before
                      </span>
                      <span className="text-sm">
                        {campaign.beforeKpis.retention}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">
                        After
                      </span>
                      <span className="text-sm font-medium">
                        {campaign.afterKpis.retention}%
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium text-right pt-1",
                        retentionChange >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {retentionChange >= 0 ? "+" : ""}
                      {retentionChange}pp
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Volume Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pre-campaign → During → Post-campaign
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={campaign.trendData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `$${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Volume",
                      ]}
                    />
                    <ReferenceLine
                      y={campaign.beforeKpis.volume}
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      label={{
                        value: "Baseline",
                        fontSize: 10,
                        fill: "#94a3b8",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Checkpoints */}
      {hasCheckpoints && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Follow-up Checkpoints</h4>
            <div className="grid grid-cols-3 gap-4">
              {campaign.checkpoints.map((checkpoint) => (
                <Card
                  key={checkpoint.label}
                  className={cn(
                    checkpoint.volume === 0 && "opacity-50"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{checkpoint.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {checkpoint.volume > 0 ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Volume</span>
                          <span className="font-medium">
                            {formatCurrency(checkpoint.volume)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            vs Pre-Campaign
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              checkpoint.volumeVsPreCampaign >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {checkpoint.volumeVsPreCampaign >= 0 ? (
                              <TrendingUp className="h-3 w-3 inline mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 inline mr-1" />
                            )}
                            {checkpoint.volumeVsPreCampaign >= 0 ? "+" : ""}
                            {checkpoint.volumeVsPreCampaign.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Retention
                          </span>
                          <span>{checkpoint.retention}%</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Pending
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Planned campaign placeholder */}
      {!hasData && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Campaign is planned. Data will be available once it starts.</p>
        </div>
      )}
    </div>
  );
}
