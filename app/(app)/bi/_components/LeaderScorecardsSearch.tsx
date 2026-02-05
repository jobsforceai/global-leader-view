"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { LeaderScorecards } from "./LeaderScorecards";
import { Input } from "@/components/ui/input";
import { getLeaderScorecards } from "@/actions/bi";
import { BiLeaderScorecard } from "@/lib/types";

interface LeaderScorecardsSearchProps {
  initialLeaders: BiLeaderScorecard[];
  startDate: string;
  endDate: string;
}

export function LeaderScorecardsSearch({
  initialLeaders,
  startDate,
  endDate,
}: LeaderScorecardsSearchProps) {
  const [query, setQuery] = useState("");
  const [leaders, setLeaders] = useState<BiLeaderScorecard[]>(initialLeaders);
  const [windowMode, setWindowMode] = useState<"period" | "lifetime">("period");
  const [isPending, startTransition] = useTransition();

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        const data =
          windowMode === "lifetime"
            ? await getLeaderScorecards(undefined, undefined, {
                search: trimmedQuery || undefined,
                limit: 50,
              })
            : await getLeaderScorecards(startDate, endDate, {
                search: trimmedQuery || undefined,
                limit: 50,
              });
        setLeaders(data);
      });
    }, 450);

    return () => clearTimeout(handle);
  }, [startDate, endDate, trimmedQuery, windowMode, startTransition]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, ID, country, region, or city"
            className="sm:max-w-sm"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Window:</span>
            <div className="inline-flex rounded-md border p-1">
              <button
                type="button"
                onClick={() => setWindowMode("period")}
                className={`px-2 py-1 rounded text-xs ${
                  windowMode === "period"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Period
              </button>
              <button
                type="button"
                onClick={() => setWindowMode("lifetime")}
                className={`px-2 py-1 rounded text-xs ${
                  windowMode === "lifetime"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Lifetime
              </button>
            </div>
          </div>
        </div>
        {isPending && (
          <span className="text-xs text-muted-foreground">Searching...</span>
        )}
      </div>
      <LeaderScorecards leaders={leaders} windowMode={windowMode} />
    </div>
  );
}
