"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 50;

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        const data = await getInvestors({
          search: trimmedQuery || undefined,
          limit: PAGE_SIZE,
          page: 1,
        });
        setInvestors(data);
        setPage(1);
        setHasMore(data.length === PAGE_SIZE);
      });
    }, 450);

    return () => clearTimeout(handle);
  }, [trimmedQuery, startTransition]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || isPending || !hasMore) return;

        startTransition(async () => {
          const nextPage = page + 1;
          const data = await getInvestors({
            search: trimmedQuery || undefined,
            limit: PAGE_SIZE,
            page: nextPage,
          });

          setInvestors((prev) => {
            const seen = new Map(prev.map((inv) => [inv.id, inv]));
            data.forEach((inv) => seen.set(inv.id, inv));
            return Array.from(seen.values());
          });
          setPage(nextPage);
          setHasMore(data.length === PAGE_SIZE);
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isPending, page, trimmedQuery, startTransition]);

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
      <p className="text-xs text-muted-foreground">
        Showing top investors by total invested. Use search to find a specific
        user.
      </p>
      <InvestorsTable investors={investors} title={title} />
      <div ref={sentinelRef} className="h-6" />
      {hasMore && (
        <p className="text-xs text-muted-foreground text-center">
          Loading more...
        </p>
      )}
    </div>
  );
}
