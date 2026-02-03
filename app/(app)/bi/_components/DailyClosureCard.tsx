"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyClosureTracker } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function DailyClosureCard({ data }: { data: DailyClosureTracker }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Daily Closure Tracker
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {data.date}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Leads Generated</p>
            <p className="text-lg font-semibold">{data.leadsGenerated}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New IDs</p>
            <p className="text-lg font-semibold">{data.newIds}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Capital Collected</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.capitalCollected)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Closers</p>
            <p className="text-lg font-semibold">{data.closers.length}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Presentations: {data.presentationsDone ?? "—"} • Conversion: {data.conversionRate ?? "—"} • Revenue/day: {data.revenuePerDay ?? "—"}
        </div>
      </CardContent>
    </Card>
  );
}
