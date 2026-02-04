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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [pendingLeader, setPendingLeader] = useState<WeeklyBoardLeader | null>(null);
  const [pendingStatus, setPendingStatus] = useState<WeeklyBoardLeader["status"] | null>(null);
  const [statusNotes, setStatusNotes] = useState("");
  const [, startTransition] = useTransition();

  const filteredLeaders = useMemo(() => {
    if (statusFilter === "all") return leaders;
    return leaders.filter((leader) => leader.status === statusFilter);
  }, [leaders, statusFilter]);

  const getStatusValue = (leader: WeeklyBoardLeader) =>
    localStatus[leader.id] || leader.status;

  const handleStatusUpdate = (
    leader: WeeklyBoardLeader,
    nextStatus: WeeklyBoardLeader["status"]
  ) => {
    if (nextStatus === "NEED_FOLLOWUP") {
      setPendingLeader(leader);
      setPendingStatus(nextStatus);
      setStatusNotes(leader.statusNotes || "");
      setNotesDialogOpen(true);
      return;
    }

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
  };

  const handleNotesSubmit = () => {
    if (!pendingLeader || !pendingStatus) return;
    const notes = statusNotes.trim();
    if (!notes) return;

    const leaderId = pendingLeader.id;
    setLocalStatus((prev) => ({
      ...prev,
      [leaderId]: pendingStatus,
    }));
    setUpdatingId(leaderId);
    setNotesDialogOpen(false);
    startTransition(async () => {
      try {
        await updateWeeklyStatus({
          leaderUserId: leaderId,
          date: weekStart,
          status: pendingStatus,
          notes,
        });
      } finally {
        setUpdatingId(null);
      }
    });
  };

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
          <>
            <div className="space-y-3 sm:hidden">
              {filteredLeaders.map((leader) => (
                <div key={leader.id} className="rounded-md border p-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{leader.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {leader.market || "Market unavailable"} • {leader.phone || "Phone —"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {leader.id}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(statusColors[getStatusValue(leader)])}
                    >
                      {getStatusValue(leader).replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Follow-up:</span>{" "}
                    {leader.followUp
                      ? `${leader.followUp.status} • ${leader.followUp.dueDate}`
                      : "—"}
                    {leader.statusNotes && (
                      <span className="block text-xs text-muted-foreground mt-1">
                        Notes: {leader.statusNotes}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Update Status
                    </p>
                    <Select
                      value={getStatusValue(leader)}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          leader,
                          value as WeeklyBoardLeader["status"]
                        )
                      }
                    >
                      <SelectTrigger className="h-9 w-full">
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
                      <p className="text-xs text-muted-foreground">
                        Updating...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block rounded-md border">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Market</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Follow-up</TableHead>
                  <TableHead className="hidden md:table-cell">Update Status</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredLeaders.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{leader.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ({leader.id})
                          </p>
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
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <div className="space-y-1 text-xs">
                          <p>
                            {leader.followUp
                              ? `${leader.followUp.status} • ${leader.followUp.dueDate}`
                              : "—"}
                          </p>
                          {leader.statusNotes && (
                            <p className="text-muted-foreground">
                              Notes: {leader.statusNotes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Select
                          value={getStatusValue(leader)}
                          onValueChange={(value) =>
                            handleStatusUpdate(
                              leader,
                              value as WeeklyBoardLeader["status"]
                            )
                          }
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
          </>
        )}
      </CardContent>

      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Follow-up Notes Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Add notes for setting status to Need Follow-up.
            </p>
            <Textarea
              value={statusNotes}
              onChange={(event) => setStatusNotes(event.target.value)}
              placeholder="Reached on WhatsApp, needs follow-up..."
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setNotesDialogOpen(false);
                setPendingLeader(null);
                setPendingStatus(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNotesSubmit}
              disabled={!statusNotes.trim() || !pendingLeader}
            >
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
