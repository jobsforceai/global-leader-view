"use client";

import { useState } from "react";
import { Video, ExternalLink, ChevronDown, Check, X, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { WeeklyCallListItem, WeeklyCallDetail } from "@/lib/types";
import { getCallSummary } from "@/actions/calls";
import { cn } from "@/lib/utils";

interface WeeklyCallsTableProps {
  calls: WeeklyCallListItem[];
}

function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ParticipationBadge({ score }: { score: 0 | 1 | 2 | 3 }) {
  const labels = ["None", "Low", "Medium", "High"];
  const colors = [
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ];

  return (
    <Badge variant="secondary" className={cn(colors[score])}>
      {labels[score]}
    </Badge>
  );
}

export function WeeklyCallsTable({ calls }: WeeklyCallsTableProps) {
  const [selectedCall, setSelectedCall] = useState<WeeklyCallDetail | null>(null);
  const [loadingCallId, setLoadingCallId] = useState<string | null>(null);

  const getAttendanceColor = (percent: number) => {
    if (percent >= 90) return "text-green-500";
    if (percent >= 75) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Video className="h-4 w-4 text-purple-500" />
            Weekly Leadership Calls
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Call Name</TableHead>
                  <TableHead className="hidden md:table-cell">Required Roles</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead className="hidden sm:table-cell">Link</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={async () => {
                      setLoadingCallId(call.id);
                      try {
                        const detail = await getCallSummary(call.id);
                        setSelectedCall(detail);
                      } finally {
                        setLoadingCallId(null);
                      }
                    }}
                  >
                    <TableCell className="font-medium">
                      {formatDateTime(call.dateTime)}
                    </TableCell>
                    <TableCell>{call.callName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {call.requiredRoles.slice(0, 2).map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {call.requiredRoles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{call.requiredRoles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-semibold",
                          getAttendanceColor(call.attendancePercent)
                        )}
                      >
                        {call.attendancePercent}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    </TableCell>
                    <TableCell>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          loadingCallId === call.id && "animate-pulse"
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Call Detail Sheet */}
      <Sheet open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCall?.callName}</SheetTitle>
            <SheetDescription>
              {selectedCall && formatDateTime(selectedCall.dateTime)}
            </SheetDescription>
          </SheetHeader>

          {selectedCall && (
            <div className="mt-6 space-y-6">
              {/* Attendance Summary */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Attendance</span>
                </div>
                <span
                  className={cn(
                    "text-2xl font-bold",
                    getAttendanceColor(selectedCall.attendancePercent)
                  )}
                >
                  {selectedCall.attendancePercent}%
                </span>
              </div>

              {/* Attendees List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Attendees</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Participation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCall.attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell className="font-medium">
                            {attendee.name}
                          </TableCell>
                          <TableCell>
                            {attendee.present ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <Check className="h-4 w-4" />
                                <span className="text-xs">Present</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-500">
                                <X className="h-4 w-4" />
                                <span className="text-xs">Absent</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <ParticipationBadge score={attendee.participationScore} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Action Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">
                  Action Items ({selectedCall.actionItems.length})
                </h4>
                {selectedCall.actionItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No action items from this call
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCall.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-3 rounded-lg border"
                      >
                        <div className="space-y-1">
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Owner: {item.owner}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            item.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
