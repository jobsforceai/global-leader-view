"use client";

import { useState } from "react";
import {
  ClipboardList,
  Check,
  Clock,
  AlertTriangle,
  UserPlus,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowUp } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FollowupsTableProps {
  followups: FollowUp[];
}

const statusConfig = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Clock,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: AlertTriangle,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: Check,
  },
};

const sourceConfig = {
  call: {
    label: "Call",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  manual: {
    label: "Manual",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  },
  alert: {
    label: "Alert",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  },
};

type FilterType = "all" | "due-this-week" | "overdue";

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

export function FollowupsTable({ followups }: FollowupsTableProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedFollowup, setSelectedFollowup] = useState<FollowUp | null>(null);
  const [actionType, setActionType] = useState<"complete" | "reassign" | "reschedule" | null>(null);

  const filteredFollowups = followups.filter((f) => {
    if (filter === "due-this-week") return isThisWeek(f.dueDate) && f.status !== "completed";
    if (filter === "overdue") return f.status === "overdue";
    return true;
  });

  const openActionDialog = (followup: FollowUp, action: "complete" | "reassign" | "reschedule") => {
    setSelectedFollowup(followup);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedFollowup(null);
    setActionType(null);
  };

  const overdueCount = followups.filter((f) => f.status === "overdue").length;
  const dueThisWeekCount = followups.filter((f) => isThisWeek(f.dueDate) && f.status !== "completed").length;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-500" />
              Follow-ups
            </CardTitle>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-3">
                  All
                </TabsTrigger>
                <TabsTrigger value="due-this-week" className="text-xs px-3">
                  This Week ({dueThisWeekCount})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="text-xs px-3">
                  Overdue ({overdueCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredFollowups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === "overdue"
                  ? "No overdue follow-ups!"
                  : filter === "due-this-week"
                  ? "No follow-ups due this week"
                  : "No follow-ups found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leader</TableHead>
                    <TableHead className="hidden md:table-cell">Task</TableHead>
                    <TableHead className="hidden lg:table-cell">Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Source</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFollowups.map((followup) => {
                    const StatusIcon = statusConfig[followup.status].icon;
                    return (
                      <TableRow key={followup.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {followup.leaderName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground max-w-[200px] truncate">
                          {followup.taskDescription}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {followup.owner}
                        </TableCell>
                        <TableCell
                          className={cn(
                            followup.status === "overdue" && "text-red-500 font-medium"
                          )}
                        >
                          {followup.dueDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1",
                              statusConfig[followup.status].color
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[followup.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className={cn(sourceConfig[followup.source].color)}
                          >
                            {sourceConfig[followup.source].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openActionDialog(followup, "complete")}
                              disabled={followup.status === "completed"}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openActionDialog(followup, "reassign")}
                            >
                              <UserPlus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openActionDialog(followup, "reschedule")}
                            >
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "complete" && "Mark as Completed"}
              {actionType === "reassign" && "Reassign Owner"}
              {actionType === "reschedule" && "Change Due Date"}
            </DialogTitle>
            <DialogDescription>
              {selectedFollowup?.taskDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {actionType === "complete" && (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to mark this follow-up as completed?
              </p>
            )}
            {actionType === "reassign" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Current owner: <span className="font-medium">{selectedFollowup?.owner}</span>
                </p>
                <div className="p-4 border rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
                  Owner selection form placeholder
                </div>
              </div>
            )}
            {actionType === "reschedule" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Current due date: <span className="font-medium">{selectedFollowup?.dueDate}</span>
                </p>
                <div className="p-4 border rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
                  Date picker placeholder
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={closeDialog}>
              {actionType === "complete" && "Complete"}
              {actionType === "reassign" && "Reassign"}
              {actionType === "reschedule" && "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
