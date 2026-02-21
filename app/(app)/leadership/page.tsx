import { Suspense } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeadershipPageClient } from "./_components/LeadershipPageClient";
import { getLeaderPerformanceGrid } from "@/actions/leader-performance";

export default async function LeadershipPage() {
  return (
    <Suspense fallback={<LeadershipSkeleton />}>
      <LeadershipContent />
    </Suspense>
  );
}

async function LeadershipContent() {
  let initialData;
  try {
    initialData = await getLeaderPerformanceGrid({ page: 1, limit: 20 });
  } catch {
    initialData = {
      leaders: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
    };
  }

  return <LeadershipPageClient initialData={initialData} />;
}

function LeadershipSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Network"
        description="Explore leader performance, team strength, and engagement gaps"
      />
      <Card>
        <CardHeader className="pb-4">
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
          <div className="flex gap-3 mt-3">
            <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-9 w-[160px] bg-muted rounded animate-pulse" />
            <div className="h-9 w-[130px] bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <div className="space-y-3 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted/70 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
