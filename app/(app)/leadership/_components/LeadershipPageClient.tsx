"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { LeaderPerformanceGrid } from "./LeaderPerformanceGrid";
import { LeaderPerformanceGridData } from "@/lib/types";

interface LeadershipPageClientProps {
  initialData: LeaderPerformanceGridData;
}

export function LeadershipPageClient({ initialData }: LeadershipPageClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Network"
        description="Explore leader performance, team strength, and engagement gaps"
      />

      <LeaderPerformanceGrid
        initialData={initialData}
        onLeaderClick={(userId) => router.push(`/leadership/${userId}`)}
      />
    </div>
  );
}
