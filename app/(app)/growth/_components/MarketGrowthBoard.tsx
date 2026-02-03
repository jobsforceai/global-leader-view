"use client";

import { useState } from "react";
import { MapPin, Globe, Star, Megaphone, User, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { GrowthEvent, GrowthEventType, GrowthEventStatus } from "@/lib/types";
import { EventDetailDrawer } from "./EventDetailDrawer";

const typeIcons: Record<GrowthEventType, React.ReactNode> = {
  "City Launch": <MapPin className="h-3 w-3" />,
  "Country Expansion": <Globe className="h-3 w-3" />,
  "Leadership Promotion": <Star className="h-3 w-3" />,
  "Special Growth Campaign": <Megaphone className="h-3 w-3" />,
};

const typeStyles: Record<GrowthEventType, string> = {
  "City Launch": "bg-blue-100 text-blue-700",
  "Country Expansion": "bg-purple-100 text-purple-700",
  "Leadership Promotion": "bg-amber-100 text-amber-700",
  "Special Growth Campaign": "bg-green-100 text-green-700",
};

interface BoardColumnProps {
  title: string;
  status: GrowthEventStatus;
  events: GrowthEvent[];
  onEventClick: (event: GrowthEvent) => void;
}

function BoardColumn({ title, events, onEventClick }: BoardColumnProps) {
  const columnColors: Record<string, string> = {
    Planned: "border-t-slate-400",
    "In Progress": "border-t-blue-500",
    Completed: "border-t-green-500",
  };

  return (
    <div className="flex-shrink-0 w-[320px]">
      <Card className={cn("border-t-4", columnColors[title] || "border-t-slate-400")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {events.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                onClick={() => onEventClick(event)}
              >
                <div className="space-y-2">
                  {/* Type badge */}
                  <Badge
                    className={cn(
                      "font-normal text-xs gap-1",
                      typeStyles[event.type]
                    )}
                  >
                    {typeIcons[event.type]}
                    {event.type}
                  </Badge>

                  {/* Event name and market */}
                  <div>
                    <h4 className="font-medium text-sm">{event.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.market}
                    </p>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {event.owner}
                  </div>

                  {/* KPI Snapshot (only if has data) */}
                  {event.kpiSnapshot.volume > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {formatCurrency(event.kpiSnapshot.volume)}
                        </span>
                      </div>
                      {event.kpiSnapshot.volumeChange !== 0 && (
                        <span
                          className={cn(
                            "text-xs font-medium",
                            event.kpiSnapshot.volumeChange > 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {event.kpiSnapshot.volumeChange > 0 ? "+" : ""}
                          {event.kpiSnapshot.volumeChange}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function MarketGrowthBoard({ events }: { events: GrowthEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<GrowthEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: { title: string; status: GrowthEventStatus }[] = [
    { title: "Planned", status: "Planned" },
    { title: "In Progress", status: "In Progress" },
    { title: "Completed", status: "Completed" },
  ];

  const getEventsForColumn = (status: GrowthEventStatus) => {
    return events.filter((event) => event.status === status);
  };

  const handleEventClick = (event: GrowthEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        View and track market expansions and growth initiatives by status.
        Click any card for details.
      </p>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              title={column.title}
              status={column.status}
              events={getEventsForColumn(column.status)}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Detail Drawer */}
      <EventDetailDrawer
        event={selectedEvent}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
