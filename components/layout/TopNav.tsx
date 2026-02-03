"use client";

import { useState } from "react";
import { Globe, Calendar, User, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TIME_RANGE_OPTIONS,
  GEOGRAPHY_OPTIONS,
  UserRole,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TopNavProps {
  pageTitle: string;
  userRole: UserRole;
  selectedTimeRange: string;
  selectedGeography: string;
  onTimeRangeChange: (value: string) => void;
  onGeographyChange: (value: string) => void;
  sidebarCollapsed: boolean;
}

export function TopNav({
  pageTitle,
  userRole,
  selectedTimeRange,
  selectedGeography,
  onTimeRangeChange,
  onGeographyChange,
  sidebarCollapsed,
}: TopNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const timeRangeLabel =
    TIME_RANGE_OPTIONS.find((opt) => opt.value === selectedTimeRange)?.label ||
    "Select";
  const geographyLabel =
    GEOGRAPHY_OPTIONS.find((opt) => opt.value === selectedGeography)?.label ||
    "Select";

  const roleDisplayName: Record<UserRole, string> = {
    ceo: "CEO",
    executive: "Executive",
    regional_director: "Regional Director",
    manager: "Manager",
    analyst: "Analyst",
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/gv/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>

        {/* Right Section: Filters & User */}
        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2"
              onClick={() => {
                // Cycle through time ranges for demo
                const currentIndex = TIME_RANGE_OPTIONS.findIndex(
                  (opt) => opt.value === selectedTimeRange
                );
                const nextIndex =
                  (currentIndex + 1) % TIME_RANGE_OPTIONS.length;
                onTimeRangeChange(TIME_RANGE_OPTIONS[nextIndex].value);
              }}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{timeRangeLabel}</span>
            </Button>
          </div>

          {/* Geography Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2"
              onClick={() => {
                // Cycle through geographies for demo
                const currentIndex = GEOGRAPHY_OPTIONS.findIndex(
                  (opt) => opt.value === selectedGeography
                );
                const nextIndex =
                  (currentIndex + 1) % GEOGRAPHY_OPTIONS.length;
                onGeographyChange(GEOGRAPHY_OPTIONS[nextIndex].value);
              }}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{geographyLabel}</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-border" />

          {/* Theme Toggle Placeholder */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Role Indicator */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              {roleDisplayName[userRole]}
            </Badge>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Logging out" : "Logout"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
