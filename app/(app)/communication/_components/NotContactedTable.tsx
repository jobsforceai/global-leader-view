"use client";

import { useState } from "react";
import { UserX } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderContact } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NotContactedTableProps {
  leaders: LeaderContact[];
}

const channelColors: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Telegram: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Phone: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Email: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  Zoom: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
};

export function NotContactedTable({ leaders }: NotContactedTableProps) {
  const [threshold, setThreshold] = useState("7");
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);

  const filteredLeaders = leaders.filter(
    (leader) =>
      (leader.daysSinceLastContact ?? -1) >= parseInt(threshold, 10)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-500" />
            Not Contacted in X Days
          </CardTitle>
          <Select value={threshold} onValueChange={setThreshold}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7+ days</SelectItem>
              <SelectItem value="14">14+ days</SelectItem>
              <SelectItem value="21">21+ days</SelectItem>
              <SelectItem value="30">30+ days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredLeaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UserX className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              All leaders contacted within {threshold} days
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Market</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead className="hidden sm:table-cell">Channel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaders.map((leader) => (
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
                      {leader.role}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {leader.market}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-semibold",
                          (leader.daysSinceLastContact ?? -1) >= 21
                            ? "text-red-500"
                            : (leader.daysSinceLastContact ?? -1) >= 14
                            ? "text-amber-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {leader.daysSinceLastContact ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className={cn(channelColors[leader.preferredChannel])}
                      >
                        {leader.preferredChannel}
                      </Badge>
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
