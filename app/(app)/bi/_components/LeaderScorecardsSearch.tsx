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
  const [isPending, startTransition] = useTransition();

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        const data = await getLeaderScorecards(startDate, endDate, {
          search: trimmedQuery || undefined,
          limit: 50,
        });
        setLeaders(data);
      });
    }, 450);

    return () => clearTimeout(handle);
  }, [startDate, endDate, trimmedQuery, startTransition]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, ID, country, region, or city"
          className="sm:max-w-sm"
        />
        {isPending && (
          <span className="text-xs text-muted-foreground">Searching...</span>
        )}
      </div>
      <LeaderScorecards leaders={leaders} />
    </div>
  );
}
