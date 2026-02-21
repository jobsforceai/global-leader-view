import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLeaderPerformanceDetail } from "@/actions/leader-performance";
import { LeaderDetailPage } from "./_components/LeaderDetailPage";
import LeaderDetailSkeleton from "./loading";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function LeaderDetailRoute({ params }: Props) {
  const { userId } = await params;

  return (
    <Suspense fallback={<LeaderDetailSkeleton />}>
      <LeaderDetailContent userId={userId} />
    </Suspense>
  );
}

async function LeaderDetailContent({ userId }: { userId: string }) {
  try {
    const data = await getLeaderPerformanceDetail(userId);
    return <LeaderDetailPage data={data} />;
  } catch {
    notFound();
  }
}
