"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLeadersCard } from "@/components/cards";
import { LeaderSnapshot } from "@/lib/types";

type WindowMode = "period" | "lifetime";

interface CommandCenterTopLeadersToggleProps {
  periodSelf: LeaderSnapshot[];
  periodTeam: LeaderSnapshot[];
  lifetimeSelf: LeaderSnapshot[];
  lifetimeTeam: LeaderSnapshot[];
}

export function CommandCenterTopLeadersToggle({
  periodSelf,
  periodTeam,
  lifetimeSelf,
  lifetimeTeam,
}: CommandCenterTopLeadersToggleProps) {
  const [windowMode, setWindowMode] = useState<WindowMode>("period");

  const selfLeaders = windowMode === "lifetime" ? lifetimeSelf : periodSelf;
  const teamLeaders = windowMode === "lifetime" ? lifetimeTeam : periodTeam;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Top Leaders
        </h3>
        <Tabs value={windowMode} onValueChange={(v) => setWindowMode(v as WindowMode)}>
          <TabsList className="h-8">
            <TabsTrigger value="period" className="text-xs px-3">
              Period
            </TabsTrigger>
            <TabsTrigger value="lifetime" className="text-xs px-3">
              Lifetime
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeadersCard
          leaders={selfLeaders}
          title={`Top Leaders (Self Volume)`}
        />
        <TopLeadersCard
          leaders={teamLeaders}
          title={`Top Leaders (Team Volume)`}
        />
      </div>
    </div>
  );
}
