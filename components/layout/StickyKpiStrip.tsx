"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { KPI_DEFINITIONS, MOCK_KPI_DATA } from "@/lib/constants";
import { formatValue, cn } from "@/lib/utils";

interface KpiData {
  id: string;
  value: number;
  trend: number;
  trendDirection: "up" | "down" | "neutral";
}

interface StickyKpiStripProps {
  data?: KpiData[];
  sidebarCollapsed: boolean;
}

export function StickyKpiStrip({
  data = MOCK_KPI_DATA,
  sidebarCollapsed,
}: StickyKpiStripProps) {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const getKpiDefinition = (id: string) => {
    return KPI_DEFINITIONS.find((kpi) => kpi.id === id);
  };

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const selectedKpiData = data.find((kpi) => kpi.id === selectedKpi);
  const selectedKpiDef = selectedKpi ? getKpiDefinition(selectedKpi) : null;

  return (
    <>
      <div
        className={cn(
          "fixed top-16 right-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          sidebarCollapsed ? "left-16" : "left-64"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
          {data.map((kpi) => {
            const definition = getKpiDefinition(kpi.id);
            if (!definition) return null;

            return (
              <Card
                key={kpi.id}
                className={cn(
                  "flex-shrink-0 cursor-pointer p-3 transition-all hover:shadow-md hover:border-primary/50",
                  "min-w-[140px] group"
                )}
                onClick={() => setSelectedKpi(kpi.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">
                      {definition.label}
                    </p>
                    <p className="text-lg font-bold">
                      {formatValue(kpi.value, definition.format)}
                    </p>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trendDirection)}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          getTrendColor(kpi.trendDirection)
                        )}
                      >
                        {kpi.trend > 0 ? "+" : ""}
                        {kpi.trend}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* KPI Detail Sheet */}
      <Sheet open={!!selectedKpi} onOpenChange={() => setSelectedKpi(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedKpiDef?.label || "KPI Details"}</SheetTitle>
            <SheetDescription>
              Detailed breakdown and historical trends
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Current Value */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-4xl font-bold">
                {selectedKpiData && selectedKpiDef
                  ? formatValue(selectedKpiData.value, selectedKpiDef.format)
                  : "-"}
              </p>
              {selectedKpiData && (
                <div className="flex items-center gap-2">
                  {getTrendIcon(selectedKpiData.trendDirection)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getTrendColor(selectedKpiData.trendDirection)
                    )}
                  >
                    {selectedKpiData.trend > 0 ? "+" : ""}
                    {selectedKpiData.trend}% vs previous period
                  </span>
                </div>
              )}
            </div>

            {/* Placeholder for Chart */}
            <div className="rounded-lg border bg-muted/50 h-48 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Trend chart placeholder
              </p>
            </div>

            {/* Placeholder for Breakdown */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Regional Breakdown</p>
              <div className="space-y-2">
                {["North America", "Europe", "Asia Pacific", "Latin America"].map(
                  (region) => (
                    <div
                      key={region}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm">{region}</span>
                      <span className="text-sm font-medium text-muted-foreground">
                        --
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
