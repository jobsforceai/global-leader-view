"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Investor } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface InvestorsTableProps {
  investors: Investor[];
  title?: string;
}

export function InvestorsTable({
  investors,
  title = "Investors",
}: InvestorsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {investors.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No investors found
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Market</TableHead>
                  <TableHead>Total Invested</TableHead>
                  <TableHead className="hidden lg:table-cell">Cap Remaining</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Package</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{inv.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      <div className="space-y-1 text-xs">
                        <p>{inv.email || "—"}</p>
                        <p>{inv.phone || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {[inv.country, inv.region, inv.city]
                        .filter(Boolean)
                        .join(" - ") || "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(inv.totalInvested)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatCurrency(inv.capRemaining)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="secondary"
                        className={cn(
                          inv.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {inv.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge
                        variant="secondary"
                        className={cn(
                          inv.isPackageActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {inv.isPackageActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
