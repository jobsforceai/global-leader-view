"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { InvestorsTable } from "@/components/tables";
import { Investor } from "@/lib/types";
import { getInvestors } from "@/actions/investors";

interface InvestorsSearchProps {
  title?: string;
  initialInvestors: Investor[];
}

export function InvestorsSearch({
  title,
  initialInvestors,
}: InvestorsSearchProps) {
  const [query, setQuery] = useState("");
  const [investors, setInvestors] = useState<Investor[]>(initialInvestors);
  const [isPending, startTransition] = useTransition();

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        const data = await getInvestors({
          search: trimmedQuery || undefined,
          limit: 50,
        });
        setInvestors(data);
      });
    }, 450);

    return () => clearTimeout(handle);
  }, [trimmedQuery, startTransition]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, ID, email, or phone"
          className="sm:max-w-sm"
        />
        {isPending && (
          <span className="text-xs text-muted-foreground">Searching...</span>
        )}
      </div>
      <InvestorsTable investors={investors} title={title} />
    </div>
  );
}
