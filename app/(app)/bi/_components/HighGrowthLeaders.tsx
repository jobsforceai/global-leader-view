"use client";

import { useState } from "react";
import { TrendingUp, Zap, Award } from "lucide-react";
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
import { HighGrowthLeader } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface HighGrowthLeadersProps {
  leaders: HighGrowthLeader[];
}

const insightConfig = {
  top: {
    label: "Fastest Growing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Zap,
  },
  strong: {
    label: "Consistent Performer",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: Award,
  },
  steady: {
    label: "Steady Growth",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    icon: TrendingUp,
  },
};

function getInsight(growthPercent: number) {
  if (growthPercent >= 40) return insightConfig.top;
  if (growthPercent >= 20) return insightConfig.strong;
  return insightConfig.steady;
}

export function HighGrowthLeaders({ leaders }: HighGrowthLeadersProps) {
  const [selectedLeader, setSelectedLeader] = useState<HighGrowthLeader | null>(
    null
  );

  // Sort by growth percent descending
  const sortedLeaders = [...leaders].sort(
    (a, b) => b.growthPercent - a.growthPercent
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            High Growth Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden md:table-cell">Market</TableHead>
                  <TableHead>Growth</TableHead>
                  <TableHead className="hidden sm:table-cell">Volume</TableHead>
                  <TableHead className="hidden lg:table-cell">Insight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeaders.map((leader, index) => {
                  const config = getInsight(leader.growthPercent);
                  const InsightIcon = config.icon;
                  return (
                    <TableRow
                      key={leader.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedLeader(leader)}
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{leader.name}</p>
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
                      <TableCell>
                        <span className="text-green-500 font-bold">
                          +{leader.growthPercent}%
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-medium">
                        {formatCurrency(leader.currentValue)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge
                          variant="secondary"
                          className={cn("gap-1", config.color)}
                        >
                          <InsightIcon className="h-3 w-3" />
                          {config.label}
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

      {/* Leader Detail Drawer */}
      <Sheet open={!!selectedLeader} onOpenChange={() => setSelectedLeader(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedLeader?.name}</SheetTitle>
            <SheetDescription>
              <span className="font-mono">{selectedLeader?.id}</span>
              {" · "}
              {selectedLeader?.market}
            </SheetDescription>
          </SheetHeader>

          {selectedLeader && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-xl font-bold text-green-500">
                    +{selectedLeader.growthPercent}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Current Volume</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedLeader.currentValue)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Previous Volume</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedLeader.previousValue)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Delta</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedLeader.currentValue - selectedLeader.previousValue)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Badge
                  variant="secondary"
                  className={cn("gap-1", getInsight(selectedLeader.growthPercent).color)}
                >
                  {getInsight(selectedLeader.growthPercent).label}
                </Badge>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Full leader scorecard available in Leader Scorecards tab
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
