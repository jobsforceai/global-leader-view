"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_AUDIT_LOG,
  AUDIT_ACTION_OPTIONS,
  AUDIT_USER_OPTIONS,
  type AuditAction,
} from "@/lib/alerts-mock-data";
import { cn } from "@/lib/utils";

const actionStyles: Record<AuditAction, string> = {
  "Alert Created": "bg-orange-100 text-orange-700",
  "Alert Status Changed": "bg-blue-100 text-blue-700",
  "Intervention Created": "bg-purple-100 text-purple-700",
  "Intervention Updated": "bg-cyan-100 text-cyan-700",
  "Intervention Resolved": "bg-green-100 text-green-700",
  "Owner Assigned": "bg-indigo-100 text-indigo-700",
  "Note Added": "bg-slate-100 text-slate-700",
};

export function AuditLogTable() {
  const [userFilter, setUserFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredLogs = MOCK_AUDIT_LOG.filter((log) => {
    if (userFilter !== "All" && log.user !== userFilter) return false;
    if (actionFilter !== "All" && log.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_USER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Users" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ACTION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Actions" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="hidden lg:table-cell">
                Before → After
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No audit logs match the selected filters
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        log.user === "System" && "text-muted-foreground"
                      )}
                    >
                      {log.user}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal",
                        actionStyles[log.action as AuditAction]
                      )}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.target}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm text-muted-foreground max-w-[300px] truncate">
                      {log.beforeAfter}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Read-only notice */}
      <p className="text-xs text-muted-foreground text-center">
        This is a read-only audit log. All actions are automatically recorded.
      </p>
    </div>
  );
}
