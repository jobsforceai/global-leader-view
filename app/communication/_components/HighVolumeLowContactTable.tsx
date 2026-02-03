"use client";

import { useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderContact } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HighVolumeLowContactTableProps {
  leaders: LeaderContact[];
}

export function HighVolumeLowContactTable({
  leaders,
}: HighVolumeLowContactTableProps) {
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          High Volume, Low Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              All high-volume leaders are well contacted
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden md:table-cell">Market</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader) => (
                  <TableRow
                    key={leader.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedLeader === leader.id
                        ? "bg-accent"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() =>
                      setSelectedLeader(
                        selectedLeader === leader.id ? null : leader.id
                      )
                    }
                  >
                    <TableCell className="font-medium">{leader.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {leader.market}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(leader.businessVolume || 0)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {leader.lastContactDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
