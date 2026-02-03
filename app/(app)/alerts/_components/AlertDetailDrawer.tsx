"use client";

import { X, AlertTriangle, Calendar, FileText, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Alert, AlertSeverity, AlertStatus } from "@/lib/alerts-mock-data";

interface AlertDetailDrawerProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
}

const severityStyles: Record<AlertSeverity, string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

const statusStyles: Record<AlertStatus, string> = {
  Active: "bg-orange-100 text-orange-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Dismissed: "bg-slate-100 text-slate-600",
};

export function AlertDetailDrawer({
  alert,
  open,
  onClose,
}: AlertDetailDrawerProps) {
  if (!alert) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <SheetTitle className="text-lg">Alert Details</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Alert Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn("font-normal", severityStyles[alert.severity])}>
                {alert.severity} Severity
              </Badge>
              <Badge className={cn("font-normal", statusStyles[alert.status])}>
                {alert.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Alert ID</p>
                <p className="font-medium">{alert.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{alert.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Target</p>
                <p className="font-medium">
                  {alert.targetName}{" "}
                  <span className="text-muted-foreground">
                    ({alert.targetType})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Detected On</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {alert.createdDate}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Trigger Rule */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Trigger Rule
            </div>
            <p className="text-sm bg-muted/50 p-3 rounded-lg">
              {alert.triggerRule}
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Reason</p>
            <p className="text-sm text-muted-foreground">{alert.reason}</p>
          </div>

          {/* Why This Alert */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Why This Alert Was Triggered</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {alert.explainableText}
            </p>
          </div>

          <Separator />

          {/* Affected Metrics */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <List className="h-4 w-4 text-muted-foreground" />
              Affected Metrics
            </div>
            <ul className="text-sm space-y-1">
              {alert.affectedMetrics.map((metric) => (
                <li
                  key={metric}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-sm font-medium">Actions</p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Change Status
                </label>
                <Select defaultValue={alert.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" variant="outline">
                Assign Intervention Owner
              </Button>

              <Button className="w-full">Create Intervention Plan</Button>
            </div>
          </div>

          {/* Linked Intervention */}
          {alert.linkedInterventionId && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Linked Intervention</p>
                <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg">
                  Intervention {alert.linkedInterventionId} is tracking this
                  alert
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
