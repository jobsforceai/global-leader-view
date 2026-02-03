"use client";

import {
  X,
  Target,
  TrendingUp,
  Users,
  RefreshCw,
  Calendar,
  User,
  FileText,
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
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type {
  GrowthEvent,
  GrowthEventType,
  GrowthEventStatus,
} from "@/lib/types";

interface EventDetailDrawerProps {
  event: GrowthEvent | null;
  open: boolean;
  onClose: () => void;
}

const typeStyles: Record<GrowthEventType, string> = {
  "City Launch": "bg-blue-100 text-blue-700",
  "Country Expansion": "bg-purple-100 text-purple-700",
  "Leadership Promotion": "bg-amber-100 text-amber-700",
  "Special Growth Campaign": "bg-green-100 text-green-700",
};

const statusStyles: Record<GrowthEventStatus, string> = {
  Planned: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  "On Hold": "bg-amber-100 text-amber-700",
};

export function EventDetailDrawer({
  event,
  open,
  onClose,
}: EventDetailDrawerProps) {
  if (!event) return null;

  const kpiCards = [
    {
      label: "Volume",
      value: formatCurrency(event.kpiSnapshot.volume),
      change: event.kpiSnapshot.volumeChange,
      icon: TrendingUp,
    },
    {
      label: "Leader Activations",
      value: event.kpiSnapshot.leaderActivations.toString(),
      change: event.kpiSnapshot.activationsChange,
      icon: Users,
    },
    {
      label: "Retention",
      value: formatPercentage(event.kpiSnapshot.retention),
      change: event.kpiSnapshot.retentionChange,
      icon: RefreshCw,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <SheetTitle className="text-lg">Event Details</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("font-normal", typeStyles[event.type])}>
                {event.type}
              </Badge>
              <Badge className={cn("font-normal", statusStyles[event.status])}>
                {event.status}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {event.market} ({event.marketType})
              </p>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p className="font-medium">{event.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{event.startDate}</p>
              </div>
            </div>
            {event.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{event.endDate}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Objective */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-muted-foreground" />
              Objective
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.objective}
            </p>
          </div>

          {/* Target KPIs */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Target KPIs</p>
            <ul className="space-y-1">
              {event.targetKpis.map((kpi, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {kpi}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Progress Snapshot */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Progress Snapshot</p>
            <div className="grid grid-cols-3 gap-3">
              {kpiCards.map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-muted/50 rounded-lg p-3 text-center"
                >
                  <kpi.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  {kpi.change !== 0 && (
                    <p
                      className={cn(
                        "text-xs font-medium mt-1",
                        kpi.change > 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {kpi.change > 0 ? "+" : ""}
                      {kpi.change}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Notes & Summary
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
              {event.notes}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
