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
import { cn } from "@/lib/utils";
import {
  MOCK_ALERTS,
  ALERT_SEVERITY_OPTIONS,
  ALERT_TYPE_OPTIONS,
  ALERT_STATUS_OPTIONS,
  type Alert,
  type AlertSeverity,
  type AlertStatus,
} from "@/lib/alerts-mock-data";
import { AlertDetailDrawer } from "./AlertDetailDrawer";

const severityStyles: Record<AlertSeverity, string> = {
  Low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  Medium: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  High: "bg-red-100 text-red-700 hover:bg-red-100",
};

const statusStyles: Record<AlertStatus, string> = {
  Active: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  "Under Review": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Resolved: "bg-green-100 text-green-700 hover:bg-green-100",
  Dismissed: "bg-slate-100 text-slate-600 hover:bg-slate-100",
};

export function AlertsTable() {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    if (severityFilter !== "All" && alert.severity !== severityFilter)
      return false;
    if (typeFilter !== "All" && alert.type !== typeFilter) return false;
    if (statusFilter !== "All" && alert.status !== statusFilter) return false;
    return true;
  });

  const handleRowClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            {ALERT_SEVERITY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Severities" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Alert Type" />
          </SelectTrigger>
          <SelectContent>
            {ALERT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Types" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {ALERT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Statuses" : option}
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
              <TableHead>Alert Type</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No alerts match the selected filters
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(alert)}
                >
                  <TableCell className="font-medium">{alert.type}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.targetName}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.targetType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal",
                        severityStyles[alert.severity as AlertSeverity]
                      )}
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px]">
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.reason}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">{alert.createdDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal",
                        statusStyles[alert.status as AlertStatus]
                      )}
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
