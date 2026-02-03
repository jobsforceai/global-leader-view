"use client";

import { TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaderSnapshot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StagnatingLeadersCardProps {
  leaders: LeaderSnapshot[];
}

export function StagnatingLeadersCard({ leaders }: StagnatingLeadersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Stagnating / Weak Leaders
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
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {leader.reasonTag}
                </Badge>
                <div className="flex items-center gap-1 text-amber-500">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {leader.daysStagnant}d
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
