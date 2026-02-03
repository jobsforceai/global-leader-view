"use client";

import { useState } from "react";
import { MapPin, Globe, Star, Megaphone, User, Calendar } from "lucide-react";
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
  MOCK_GROWTH_EVENTS,
  GROWTH_EVENT_TYPE_OPTIONS,
  GROWTH_EVENT_STATUS_OPTIONS,
  type GrowthEvent,
  type GrowthEventType,
  type GrowthEventStatus,
} from "@/lib/growth-mock-data";
import { EventDetailDrawer } from "./EventDetailDrawer";

const typeIcons: Record<GrowthEventType, React.ReactNode> = {
  "City Launch": <MapPin className="h-4 w-4" />,
  "Country Expansion": <Globe className="h-4 w-4" />,
  "Leadership Promotion": <Star className="h-4 w-4" />,
  "Special Growth Campaign": <Megaphone className="h-4 w-4" />,
};

const typeStyles: Record<GrowthEventType, string> = {
  "City Launch": "bg-blue-100 text-blue-700 border-blue-200",
  "Country Expansion": "bg-purple-100 text-purple-700 border-purple-200",
  "Leadership Promotion": "bg-amber-100 text-amber-700 border-amber-200",
  "Special Growth Campaign": "bg-green-100 text-green-700 border-green-200",
};

const statusStyles: Record<GrowthEventStatus, string> = {
  Planned: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  "On Hold": "bg-amber-100 text-amber-700",
};

const typeDotStyles: Record<GrowthEventType, string> = {
  "City Launch": "bg-blue-500",
  "Country Expansion": "bg-purple-500",
  "Leadership Promotion": "bg-amber-500",
  "Special Growth Campaign": "bg-green-500",
};

export function GrowthTimeline() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<GrowthEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredEvents = MOCK_GROWTH_EVENTS.filter((event) => {
    if (typeFilter !== "All" && event.type !== typeFilter) return false;
    if (statusFilter !== "All" && event.status !== statusFilter) return false;
    return true;
  }).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const handleEventClick = (event: GrowthEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            {GROWTH_EVENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Event Types" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {GROWTH_EVENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Statuses" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 ml-12">
              No events match the selected filters
            </p>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="relative pl-12 cursor-pointer group"
                onClick={() => handleEventClick(event)}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-2.5 top-3 h-3 w-3 rounded-full border-2 border-background",
                    typeDotStyles[event.type]
                  )}
                />

                {/* Event card */}
                <div
                  className={cn(
                    "border rounded-lg p-4 transition-all",
                    "hover:shadow-md hover:border-blue-200",
                    "group-hover:bg-muted/30"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "p-1.5 rounded",
                          typeStyles[event.type]
                        )}
                      >
                        {typeIcons[event.type]}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {event.market}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "font-normal text-xs",
                        statusStyles[event.status]
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {event.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.startDate}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <EventDetailDrawer
        event={selectedEvent}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
