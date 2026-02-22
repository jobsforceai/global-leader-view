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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BiLeaderScorecard } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface LeaderScorecardsProps {
  leaders: BiLeaderScorecard[];
  windowMode?: "period" | "lifetime";
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
  value: number | null;
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
          {value === null ? "--" : value.toFixed(1)}
          {value === null ? "" : suffix}
        </p>
      </div>
    </div>
  );
}

export function LeaderScorecards({ leaders, windowMode = "period" }: LeaderScorecardsProps) {
  const [selectedLeader, setSelectedLeader] = useState<BiLeaderScorecard | null>(null);

  const statusKey = selectedLeader?.status || "active";
  const consistencyKey = selectedLeader?.consistencyIndicator || "consistent";
  const lastContactDays = selectedLeader?.lastContactDays ?? null;

  return (
    <>
      <Card>
        <CardContent className="pt-4 pb-2">
          {leaders.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No leaders found for this search.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leader</TableHead>
                    <TableHead className="hidden md:table-cell">Market</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead className="hidden sm:table-cell">Growth</TableHead>
                    <TableHead className="hidden lg:table-cell">Team</TableHead>
                    <TableHead className="hidden lg:table-cell">Consistency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow
                      key={leader.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedLeader(leader)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p>{leader.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {leader.id}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {leader.market}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {leader.market}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="secondary"
                          className={cn("capitalize", statusColors[leader.status])}
                        >
                          {leader.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {windowMode === "lifetime"
                          ? leader.lifetimeBusinessVolume == null
                            ? "--"
                            : formatCurrency(leader.lifetimeBusinessVolume)
                          : formatCurrency(leader.businessVolume)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={cn(
                            "font-bold",
                            leader.growthPercent > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {leader.growthPercent > 0 ? "+" : ""}
                          {leader.growthPercent}%
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {leader.teamSize}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {leader.consistencyIndicator && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "capitalize",
                              consistencyColors[leader.consistencyIndicator]
                            )}
                          >
                            {leader.consistencyIndicator}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Scorecard Drawer */}
      <Sheet open={!!selectedLeader} onOpenChange={() => setSelectedLeader(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedLeader?.name}</SheetTitle>
            <SheetDescription>
              <span className="font-mono">{selectedLeader?.id}</span>
              {" · "}
              {selectedLeader?.market}
            </SheetDescription>
          </SheetHeader>

          {selectedLeader && (
            <div className="mt-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn("capitalize", statusColors[statusKey])}
                >
                  {selectedLeader.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn("capitalize", consistencyColors[consistencyKey])}
                >
                  {selectedLeader.consistencyIndicator || "unknown"}
                </Badge>
              </div>

              {/* Volume Trend Chart */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Volume Trend</h4>
                {selectedLeader.volumeTrend.length === 0 ? (
                  <div className="h-40 rounded-lg border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                    No volume trend data available for this window.
                  </div>
                ) : (
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
                )}
              </div>

              <Separator />

              {/* Key Metrics */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Business Volume
                      <span className="ml-1 text-[10px] uppercase tracking-wide">
                        {windowMode === "lifetime" ? "lifetime" : "period"}
                      </span>
                    </p>
                    <p
                      className={cn(
                        "text-xl font-bold",
                        selectedLeader.growthPercent > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {windowMode === "lifetime"
                        ? selectedLeader.lifetimeBusinessVolume == null
                          ? "--"
                          : formatCurrency(selectedLeader.lifetimeBusinessVolume)
                        : formatCurrency(selectedLeader.businessVolume)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Reinvestment %</p>
                    <p className="text-xl font-bold">
                      {selectedLeader.reinvestmentRate === null
                        ? "--"
                        : `${selectedLeader.reinvestmentRate}%`}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Retention %</p>
                    <p className="text-xl font-bold">
                      {selectedLeader.retentionRate === null
                        ? "--"
                        : `${selectedLeader.retentionRate}%`}
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    icon={<Users className="h-4 w-4 text-amber-500" />}
                    label="Team Size"
                    value={selectedLeader.teamSize}
                    trend="neutral"
                  />
                  <MetricCard
                    icon={<UserCheck className="h-4 w-4 text-purple-500" />}
                    label="Retention Rate"
                    value={selectedLeader.retentionRate}
                    suffix="%"
                    trend={
                      selectedLeader.retentionRate === null
                        ? "neutral"
                        : selectedLeader.retentionRate > 85
                        ? "up"
                        : "down"
                    }
                  />
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
                      lastContactDays === null
                        ? "text-muted-foreground"
                        : lastContactDays <= 7
                        ? "text-green-500"
                        : lastContactDays <= 14
                        ? "text-amber-500"
                        : "text-red-500"
                    )}
                  >
                    {lastContactDays === null
                      ? selectedLeader.lastContactAt || "--"
                      : `${lastContactDays} days ago`}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last activity:</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedLeader.lastActivityAt || "--"}
                  </span>
                </div>
              </div>

              {/* Strong vs Weak Legs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Strong & Weak Legs</h4>
                  {selectedLeader.legStrength && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-700"
                    >
                      Threshold {formatCurrency(selectedLeader.legStrength.threshold)}
                    </Badge>
                  )}
                </div>
                {selectedLeader.legStrength ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-green-50/60 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-green-700">
                          Strong Legs
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700"
                        >
                          {selectedLeader.legStrength.strong.length}
                        </Badge>
                      </div>
                      {selectedLeader.legStrength.strong.length === 0 ? (
                        <p className="text-xs text-muted-foreground">None</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedLeader.legStrength.strong.map((leg) => (
                            <div
                              key={leg.userId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-green-900">{leg.userId}</span>
                              <span className="font-medium text-green-800">
                                {formatCurrency(leg.volume)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg border bg-red-50/60 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-red-700">
                          Weak Legs
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-red-100 text-red-700"
                        >
                          {selectedLeader.legStrength.weak.length}
                        </Badge>
                      </div>
                      {selectedLeader.legStrength.weak.length === 0 ? (
                        <p className="text-xs text-muted-foreground">None</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedLeader.legStrength.weak.map((leg) => (
                            <div
                              key={leg.userId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-red-900">{leg.userId}</span>
                              <span className="font-medium text-red-800">
                                {formatCurrency(leg.volume)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Leg strength data unavailable
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
