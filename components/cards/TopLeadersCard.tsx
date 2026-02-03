"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderSnapshot } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface TopLeadersCardProps {
  leaders: LeaderSnapshot[];
  title?: string;
}

export function TopLeadersCard({
  leaders,
  title = "Top Leaders",
}: TopLeadersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          {title}
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
                    {leader.city || leader.country
                      ? `${leader.city || ""}${
                          leader.city && leader.country ? ", " : ""
                        }${leader.country || ""}`
                      : "Location unavailable"}
                    {" "}
                    <span className="text-muted-foreground/80">
                      ({leader.id})
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                {leader.businessVolume !== undefined ? (
                  <span className="text-green-600">
                    {formatCurrency(leader.businessVolume)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
