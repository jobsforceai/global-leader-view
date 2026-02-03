"use client";

import { useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { WeakMarket } from "@/lib/bi-mock-data";
import { formatCurrency, cn } from "@/lib/utils";

interface WeakMarketsTableProps {
  markets: WeakMarket[];
}

const severityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendColors = {
  up: "text-green-500",
  down: "text-red-500",
  flat: "text-muted-foreground",
};

export function WeakMarketsTable({ markets }: WeakMarketsTableProps) {
  const [selectedMarket, setSelectedMarket] = useState<WeakMarket | null>(null);

  // Sort by severity (high first) then by volume change
  const sortedMarkets = [...markets].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.volumeChange - b.volumeChange;
  });

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Weak Markets
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market</TableHead>
                  <TableHead className="hidden sm:table-cell">Trend</TableHead>
                  <TableHead className="hidden md:table-cell">Retention</TableHead>
                  <TableHead className="hidden lg:table-cell">Reinvestment</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMarkets.map((market) => {
                  const TrendIcon = trendIcons[market.volumeTrend];
                  return (
                    <TableRow
                      key={market.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedMarket(market)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{market.market}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {market.volumeChange > 0 ? "+" : ""}
                            {market.volumeChange}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <TrendIcon
                            className={cn(
                              "h-4 w-4",
                              trendColors[market.volumeTrend]
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              trendColors[market.volumeTrend]
                            )}
                          >
                            {market.volumeChange > 0 ? "+" : ""}
                            {market.volumeChange}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={cn(
                            "font-medium",
                            market.retentionRate < 75
                              ? "text-red-500"
                              : market.retentionRate < 85
                              ? "text-amber-500"
                              : "text-green-500"
                          )}
                        >
                          {market.retentionRate}%
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span
                          className={cn(
                            "font-medium",
                            market.reinvestmentRate < 40
                              ? "text-red-500"
                              : market.reinvestmentRate < 55
                              ? "text-amber-500"
                              : "text-green-500"
                          )}
                        >
                          {market.reinvestmentRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {market.primaryRiskReason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("capitalize", severityColors[market.severity])}
                        >
                          {market.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Market Detail Drawer */}
      <Sheet open={!!selectedMarket} onOpenChange={() => setSelectedMarket(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedMarket?.market}</SheetTitle>
            <SheetDescription>Market Risk Analysis</SheetDescription>
          </SheetHeader>

          {selectedMarket && (
            <div className="mt-6 space-y-6">
              {/* Severity Badge */}
              <Badge
                variant="secondary"
                className={cn(
                  "capitalize text-sm px-3 py-1",
                  severityColors[selectedMarket.severity]
                )}
              >
                {selectedMarket.severity} severity
              </Badge>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedMarket.businessVolume)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Volume Change</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      trendColors[selectedMarket.volumeTrend]
                    )}
                  >
                    {selectedMarket.volumeChange > 0 ? "+" : ""}
                    {selectedMarket.volumeChange}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Retention</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      selectedMarket.retentionRate < 75
                        ? "text-red-500"
                        : selectedMarket.retentionRate < 85
                        ? "text-amber-500"
                        : ""
                    )}
                  >
                    {selectedMarket.retentionRate}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Reinvestment</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      selectedMarket.reinvestmentRate < 40
                        ? "text-red-500"
                        : selectedMarket.reinvestmentRate < 55
                        ? "text-amber-500"
                        : ""
                    )}
                  >
                    {selectedMarket.reinvestmentRate}%
                  </p>
                </div>
              </div>

              <Separator />

              {/* Primary Risk */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Primary Risk Reason</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMarket.primaryRiskReason}
                </p>
              </div>

              {/* Risk Tags */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Risk Flags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMarket.riskTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Placeholder */}
              <div className="p-4 rounded-lg border bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Intervention actions and drill-down coming soon
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
