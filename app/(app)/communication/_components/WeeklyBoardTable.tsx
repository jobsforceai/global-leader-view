"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WeeklyBoardLeader } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateWeeklyStatus } from "@/actions/communication";

const statusColors: Record<WeeklyBoardLeader["status"], string> = {
  NOT_CONTACTED: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-green-100 text-green-700",
  NEED_FOLLOWUP: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const STATUS_OPTIONS: WeeklyBoardLeader["status"][] = [
  "NOT_CONTACTED",
  "CONTACTED",
  "NEED_FOLLOWUP",
  "COMPLETED",
];

export function WeeklyBoardTable({
  leaders,
  weekStart,
}: {
  leaders: WeeklyBoardLeader[];
  weekStart: string;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [localStatus, setLocalStatus] = useState<Record<string, WeeklyBoardLeader["status"]>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filteredLeaders = useMemo(() => {
    if (statusFilter === "all") return leaders;
    return leaders.filter((leader) => leader.status === statusFilter);
  }, [leaders, statusFilter]);

  const getStatusValue = (leader: WeeklyBoardLeader) =>
    localStatus[leader.id] || leader.status;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base font-semibold">
            Weekly Call Board
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredLeaders.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No weekly board data available
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Market</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Follow-up</TableHead>
                  <TableHead className="hidden xl:table-cell">Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaders.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{leader.name}</p>
                        <p className="text-xs text-muted-foreground">({leader.id})</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {leader.phone || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {leader.market}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(statusColors[getStatusValue(leader)])}
                      >
                        {getStatusValue(leader).replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {leader.followUp
                        ? `${leader.followUp.status} • ${leader.followUp.dueDate}`
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Select
                        value={getStatusValue(leader)}
                        onValueChange={(value) => {
                          const nextStatus = value as WeeklyBoardLeader["status"];
                          setLocalStatus((prev) => ({
                            ...prev,
                            [leader.id]: nextStatus,
                          }));
                          setUpdatingId(leader.id);
                          startTransition(async () => {
                            try {
                              await updateWeeklyStatus({
                                leaderUserId: leader.id,
                                date: weekStart,
                                status: nextStatus,
                              });
                            } finally {
                              setUpdatingId(null);
                            }
                          });
                        }}
                      >
                        <SelectTrigger className="h-8 w-[190px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingId === leader.id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Updating...
                        </p>
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
  );
}
