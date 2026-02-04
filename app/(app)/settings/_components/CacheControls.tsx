"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearGlobalViewCache } from "@/actions/admin";

export function CacheControls() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Global View Cache
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Clear cached Global View data to force fresh results across dashboards.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              setMessage(null);
              setError(null);
              startTransition(async () => {
                try {
                  const res = await clearGlobalViewCache();
                  setMessage(res.message || "Cache cleared.");
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Failed to clear cache."
                  );
                }
              });
            }}
            disabled={isPending}
          >
            {isPending ? "Clearing..." : "Clear Cache"}
          </Button>
          {message && <span className="text-sm text-green-600">{message}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
