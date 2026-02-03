"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderSnapshot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TopLeadersCardProps {
  leaders: LeaderSnapshot[];
}

export function TopLeadersCard({ leaders }: TopLeadersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Top Growing Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={cn(
                "flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer transition-colors",
                "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {index + 1}.
                </span>
                <div>
                  <p className="text-sm font-medium">{leader.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {leader.city}, {leader.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm font-semibold">
                  +{leader.growthPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
