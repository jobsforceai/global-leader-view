"use client";

import { useState } from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Link2,
  MessageSquare,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Intervention, InterventionStatus } from "@/lib/alerts-mock-data";

interface InterventionDetailPanelProps {
  intervention: Intervention | null;
  open: boolean;
  onClose: () => void;
}

const statusStyles: Record<InterventionStatus, string> = {
  Open: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Blocked: "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
  Ignored: "bg-slate-100 text-slate-500",
};

const statusIcons: Record<InterventionStatus, React.ReactNode> = {
  Open: <Clock className="h-3 w-3" />,
  "In Progress": <AlertTriangle className="h-3 w-3" />,
  Blocked: <AlertTriangle className="h-3 w-3" />,
  Resolved: <CheckCircle className="h-3 w-3" />,
  Ignored: <X className="h-3 w-3" />,
};

export function InterventionDetailPanel({
  intervention,
  open,
  onClose,
}: InterventionDetailPanelProps) {
  const [progressNote, setProgressNote] = useState("");

  if (!intervention) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <SheetTitle className="text-lg">Intervention Details</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "font-normal gap-1",
                  statusStyles[intervention.status]
                )}
              >
                {statusIcons[intervention.status]}
                {intervention.status}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {intervention.alertType}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{intervention.targetName}</h3>
              <p className="text-sm text-muted-foreground">
                {intervention.targetType} • {intervention.id}
              </p>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Assigned Owner</p>
                <p className="font-medium">{intervention.assignedOwner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium">{intervention.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{intervention.lastUpdated}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Summary</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {intervention.summary}
            </p>
          </div>

          {/* Action Plan */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Action Plan</p>
            <ul className="space-y-2">
              {intervention.actionPlan.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Timeline</p>
            <div className="space-y-3">
              {intervention.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5" />
                    {index < intervention.timeline.length - 1 && (
                      <div className="w-px h-full bg-border flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-muted-foreground">
                      {event.date} • {event.user}
                    </p>
                    <p className="text-sm">{event.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Alerts */}
          {intervention.linkedAlertIds.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Linked Alerts
                </div>
                <div className="flex flex-wrap gap-2">
                  {intervention.linkedAlertIds.map((alertId) => (
                    <Badge
                      key={alertId}
                      variant="outline"
                      className="font-normal"
                    >
                      {alertId}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Resolution Reason */}
          {intervention.resolutionReason && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Resolution Reason</p>
                <p className="text-sm bg-green-50 text-green-700 p-3 rounded-lg">
                  {intervention.resolutionReason}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-sm font-medium">Actions</p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Update Status
                </label>
                <Select defaultValue={intervention.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Ignored">Ignored</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Add Progress Note
                </label>
                <Textarea
                  placeholder="Enter update or progress note..."
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline">
                  Mark as Resolved
                </Button>
                <Button className="flex-1" variant="outline">
                  Mark as Ignored
                </Button>
              </div>

              <Button className="w-full">Save Changes</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
