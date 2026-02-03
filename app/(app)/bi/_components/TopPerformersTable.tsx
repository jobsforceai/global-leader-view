"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopLeader } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface TopPerformersTableProps {
  leaders: TopLeader[];
  onLeaderClick?: (leader: TopLeader) => void;
}

export function TopPerformersTable({
  leaders,
  onLeaderClick,
}: TopPerformersTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Top Performing Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leader</TableHead>
                <TableHead className="hidden md:table-cell">Market</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaders.map((leader) => (
                <TableRow
                  key={leader.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50 transition-colors",
                    onLeaderClick && "cursor-pointer"
                  )}
                  onClick={() => onLeaderClick?.(leader)}
                >
                  <TableCell className="font-medium">{leader.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {leader.market}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(leader.businessVolume)}
                  </TableCell>
                  <TableCell>
                    <span className="text-green-500 font-semibold">
                      +{leader.growthPercent}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
