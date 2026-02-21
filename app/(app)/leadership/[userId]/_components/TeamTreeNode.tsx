"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";

interface TeamTreeNodeProps {
  name: string;
  userId: string;
  businessVolume?: number;
  isPackageActive: boolean;
  isRoot?: boolean;
  compact?: boolean;
}

export function TeamTreeNode({
  name,
  userId,
  businessVolume,
  isPackageActive,
  isRoot = false,
  compact = false,
}: TeamTreeNodeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md border bg-background text-sm min-w-[140px]">
        <div
          className={cn(
            "h-2 w-2 rounded-full shrink-0",
            isPackageActive ? "bg-green-500" : "bg-red-500"
          )}
        />
        <div className="min-w-0">
          <p className="font-medium truncate text-xs">{name}</p>
          <p className="text-[10px] text-muted-foreground font-mono">{userId}</p>
          {businessVolume !== undefined && (
            <p className="text-[10px] text-muted-foreground">
              {formatCurrency(businessVolume)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-3 bg-background shadow-sm min-w-[160px] max-w-[200px] text-center",
        isRoot && "border-primary/50 bg-primary/5 min-w-[180px]"
      )}
    >
      <p
        className={cn(
          "font-semibold truncate",
          isRoot ? "text-sm" : "text-xs"
        )}
      >
        {name}
      </p>
      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
        ID: {userId}
      </p>
      {businessVolume !== undefined && (
        <p className="text-xs font-medium mt-1">
          {formatCurrency(businessVolume)}
        </p>
      )}
      <Badge
        variant="secondary"
        className={cn(
          "text-[10px] mt-1.5",
          isPackageActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        )}
      >
        {isPackageActive ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}
