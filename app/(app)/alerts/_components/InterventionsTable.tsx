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
  MOCK_INTERVENTIONS,
  INTERVENTION_STATUS_OPTIONS,
  ALERT_TYPE_OPTIONS,
  type Intervention,
  type InterventionStatus,
} from "@/lib/alerts-mock-data";
import { InterventionDetailPanel } from "./InterventionDetailPanel";

const statusStyles: Record<InterventionStatus, string> = {
  Open: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  "In Progress": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Blocked: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Resolved: "bg-green-100 text-green-700 hover:bg-green-100",
  Ignored: "bg-slate-100 text-slate-500 hover:bg-slate-100",
};

export function InterventionsTable() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedIntervention, setSelectedIntervention] =
    useState<Intervention | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const filteredInterventions = MOCK_INTERVENTIONS.filter((intervention) => {
    if (statusFilter !== "All" && intervention.status !== statusFilter)
      return false;
    if (typeFilter !== "All" && intervention.alertType !== typeFilter)
      return false;
    return true;
  });

  const handleRowClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setPanelOpen(true);
  };

  const getDueDateStyle = (dueDate: string, status: InterventionStatus) => {
    if (status === "Resolved" || status === "Ignored") return "";
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0) return "text-red-600 font-medium";
    if (diffDays <= 3) return "text-amber-600 font-medium";
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {INTERVENTION_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Statuses" : option}
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
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Alert Type</TableHead>
              <TableHead>Assigned Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Updated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterventions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No interventions match the selected filters
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredInterventions.map((intervention) => (
                <TableRow
                  key={intervention.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(intervention)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{intervention.targetName}</p>
                      <p className="text-xs text-muted-foreground">
                        {intervention.targetType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {intervention.alertType}
                  </TableCell>
                  <TableCell className="text-sm">
                    {intervention.assignedOwner}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal",
                        statusStyles[intervention.status]
                      )}
                    >
                      {intervention.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      getDueDateStyle(intervention.dueDate, intervention.status)
                    )}
                  >
                    {intervention.dueDate}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell text-muted-foreground">
                    {intervention.lastUpdated}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <InterventionDetailPanel
        intervention={selectedIntervention}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
