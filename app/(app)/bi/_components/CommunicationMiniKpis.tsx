"use client";

import { Phone, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommunicationMiniKpisProps {
  contactedLast7Days: number;
  contactedLast14Days: number;
  contactedLast30Days: number;
  overdueFollowups: number;
}

export function CommunicationMiniKpis({
  contactedLast7Days,
  contactedLast14Days,
  contactedLast30Days,
  overdueFollowups,
}: CommunicationMiniKpisProps) {
  const getColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          Communication Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">7 Days</p>
            <p className={cn("text-xl font-bold", getColor(contactedLast7Days))}>
              {contactedLast7Days}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">14 Days</p>
            <p className={cn("text-xl font-bold", getColor(contactedLast14Days))}>
              {contactedLast14Days}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">30 Days</p>
            <p className={cn("text-xl font-bold", getColor(contactedLast30Days))}>
              {contactedLast30Days}%
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
            <p className="text-xl font-bold text-amber-500">{overdueFollowups}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
