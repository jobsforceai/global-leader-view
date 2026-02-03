"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Phone,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BiLeader } from "@/lib/bi-mock-data";
import { formatCurrency, cn } from "@/lib/utils";

interface LeaderScorecardsProps {
  leaders: BiLeader[];
}

const consistencyColors = {
  consistent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  improving: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  volatile: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  declining: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  "at-risk": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

function MetricCard({
  icon,
  label,
  value,
  suffix,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
}) {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className="p-2 bg-muted rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-lg font-bold", getTrendColor())}>
          {value.toFixed(1)}
          {suffix}
        </p>
      </div>
    </div>
  );
}

export function LeaderScorecards({ leaders }: LeaderScorecardsProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(
    leaders[0]?.id || ""
  );
  const [showDrawer, setShowDrawer] = useState(false);

  const selectedLeader = leaders.find((l) => l.id === selectedLeaderId);

  const handleLeaderSelect = (id: string) => {
    setSelectedLeaderId(id);
    setShowDrawer(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Leader Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Select Leader
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select value={selectedLeaderId} onValueChange={handleLeaderSelect}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a leader" />
              </SelectTrigger>
              <SelectContent>
                {leaders.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    <div className="flex items-center gap-2">
                      <span>{leader.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({leader.market})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Scorecard Preview */}
        {selectedLeader && (
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setShowDrawer(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedLeader.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeader.role} • {selectedLeader.market}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("capitalize", statusColors[selectedLeader.status])}
                  >
                    {selectedLeader.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "capitalize",
                      consistencyColors[selectedLeader.consistencyIndicator]
                    )}
                  >
                    {selectedLeader.consistencyIndicator}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                  label="Business Volume"
                  value={selectedLeader.businessVolume / 1000}
                  suffix="K"
                  trend={selectedLeader.growthPercent > 0 ? "up" : "down"}
                />
                <MetricCard
                  icon={<RefreshCw className="h-4 w-4 text-blue-500" />}
                  label="Reinvestment Rate"
                  value={selectedLeader.reinvestmentRate}
                  suffix="%"
                  trend={selectedLeader.reinvestmentRate > 60 ? "up" : "down"}
                />
                <MetricCard
                  icon={<UserCheck className="h-4 w-4 text-purple-500" />}
                  label="Retention Rate"
                  value={selectedLeader.retentionRate}
                  suffix="%"
                  trend={selectedLeader.retentionRate > 85 ? "up" : "down"}
                />
                <MetricCard
                  icon={<Users className="h-4 w-4 text-amber-500" />}
                  label="Team Size"
                  value={selectedLeader.teamSize}
                  trend="neutral"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Click to view full scorecard →
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Scorecard Drawer */}
      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedLeader?.name}</SheetTitle>
            <SheetDescription>
              {selectedLeader?.role} • {selectedLeader?.market}
            </SheetDescription>
          </SheetHeader>

          {selectedLeader && (
            <div className="mt-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn("capitalize", statusColors[selectedLeader.status])}
                >
                  {selectedLeader.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "capitalize",
                    consistencyColors[selectedLeader.consistencyIndicator]
                  )}
                >
                  {selectedLeader.consistencyIndicator}
                </Badge>
              </div>

              {/* Volume Trend Chart */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Volume Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={selectedLeader.volumeTrend}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="leaderGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => [formatCurrency(value as number), "Volume"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="url(#leaderGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator />

              {/* Key Metrics */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Reinvestment %</p>
                    <p className="text-xl font-bold">
                      {selectedLeader.reinvestmentRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Retention %</p>
                    <p className="text-xl font-bold">
                      {selectedLeader.retentionRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p
                      className={cn(
                        "text-xl font-bold",
                        selectedLeader.growthPercent > 0
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {selectedLeader.growthPercent > 0 ? "+" : ""}
                      {selectedLeader.growthPercent}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Team Size</p>
                    <p className="text-xl font-bold">{selectedLeader.teamSize}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Communication Health */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Communication Health</h4>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last contact:</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      selectedLeader.lastContactDays <= 7
                        ? "text-green-500"
                        : selectedLeader.lastContactDays <= 14
                        ? "text-amber-500"
                        : "text-red-500"
                    )}
                  >
                    {selectedLeader.lastContactDays} days ago
                  </span>
                </div>
              </div>

              {/* Period Comparison */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Period Comparison</h4>
                <div className="p-4 rounded-lg border bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    Current vs Previous Period comparison placeholder
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
