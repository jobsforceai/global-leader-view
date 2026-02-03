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
import { TrendingUp, Users, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { CampaignImpact, CampaignStatus } from "@/lib/types";

interface CampaignDetailViewProps {
  campaign: CampaignImpact;
}

const statusStyles: Record<CampaignStatus, string> = {
  Planned: "bg-slate-100 text-slate-700",
  Active: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const hasData = campaign.trend.length > 0;
  const trendData = campaign.trend.map((point) => ({
    date: point.date,
    volume: point.metrics.volume,
  }));

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

      {/* Impact Summary */}
      {hasData && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-3">Impact Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              {/* Baseline */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Baseline</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <span className="text-sm">
                        {formatCurrency(campaign.baseline)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* During */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">During</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <span className="text-sm">
                        {formatCurrency(campaign.during)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Post */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Post</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <span className="text-sm">
                        {formatCurrency(campaign.post)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium text-right pt-1",
                        campaign.changePercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {campaign.changePercent >= 0 ? "+" : ""}
                      {campaign.changePercent.toFixed(1)}%
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
                    data={trendData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
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
                      y={campaign.baseline}
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

      {/* Planned campaign placeholder */}
      {!hasData && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Campaign is planned. Data will be available once it starts.</p>
        </div>
      )}
    </div>
  );
}
