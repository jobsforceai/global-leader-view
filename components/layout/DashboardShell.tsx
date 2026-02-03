"use client";

import { useState, ReactNode, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, TopNav, StickyKpiStrip } from "@/components/layout";
import { NAV_ROUTES, UserRole } from "@/lib/constants";
import { KpiData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DashboardContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (value: string) => void;
  selectedGeography: string;
  setSelectedGeography: (value: string) => void;
  userRole: UserRole;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

interface DashboardShellProps {
  children: ReactNode;
  kpiData?: KpiData[];
}

export function DashboardShell({ children, kpiData }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedGeography, setSelectedGeography] = useState("global");

  // Mock user role - in production this would come from auth
  const userRole: UserRole = "ceo";

  // Get current page title from routes
  const currentRoute = NAV_ROUTES.find(
    (route) =>
      route.href === pathname ||
      (route.href !== "/" && pathname.startsWith(route.href))
  );
  const pageTitle = currentRoute?.label || "Dashboard";

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <DashboardContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        selectedTimeRange,
        setSelectedTimeRange,
        selectedGeography,
        setSelectedGeography,
        userRole,
      }}
    >
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

        {/* Top Navigation */}
        <TopNav
          pageTitle={pageTitle}
          userRole={userRole}
          selectedTimeRange={selectedTimeRange}
          selectedGeography={selectedGeography}
          onTimeRangeChange={setSelectedTimeRange}
          onGeographyChange={setSelectedGeography}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Sticky KPI Strip */}
        <StickyKpiStrip
          sidebarCollapsed={sidebarCollapsed}
          data={kpiData}
        />

        {/* Main Content */}
        <main
          className={cn(
            "pt-[132px] min-h-screen transition-all duration-300",
            sidebarCollapsed ? "pl-16" : "pl-64"
          )}
        >
          <div className="container py-6 px-6">{children}</div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
