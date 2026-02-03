import { Suspense } from "react";
import { BusinessIntelligenceShell } from "./_components/BusinessIntelligenceShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CeoVolumeTrendsSection } from "./_components/sections/CeoVolumeTrendsSection";
import { CeoTopRegionsSection } from "./_components/sections/CeoTopRegionsSection";
import { CeoCommunicationSection } from "./_components/sections/CeoCommunicationSection";
import { CeoDailyClosureSection } from "./_components/sections/CeoDailyClosureSection";
import { LeaderScorecardsSection } from "./_components/sections/LeaderScorecardsSection";
import { HighGrowthLeadersSection } from "./_components/sections/HighGrowthLeadersSection";
import { WeakMarketsSection } from "./_components/sections/WeakMarketsSection";

export default async function BusinessIntelligencePage() {
  return (
    <BusinessIntelligenceShell
      ceoContent={
        <>
          <Suspense fallback={<CardSkeleton lines={6} />}>
            <CeoVolumeTrendsSection />
          </Suspense>
          <Suspense fallback={<TwoUpSkeleton />}>
            <CeoTopRegionsSection />
          </Suspense>
          <Suspense fallback={<TwoUpSkeleton />}>
            <CeoCommunicationSection />
          </Suspense>
          <Suspense fallback={<CardSkeleton lines={4} />}>
            <CeoDailyClosureSection />
          </Suspense>
        </>
      }
      scorecardsContent={
        <Suspense fallback={<CardSkeleton lines={8} />}>
          <LeaderScorecardsSection />
        </Suspense>
      }
      growthContent={
        <Suspense fallback={<CardSkeleton lines={8} />}>
          <HighGrowthLeadersSection />
        </Suspense>
      }
      weakContent={
        <Suspense fallback={<CardSkeleton lines={8} />}>
          <WeakMarketsSection />
        </Suspense>
      }
    />
  );
}

function CardSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 w-full bg-muted/70 rounded animate-pulse"
          />
        ))}
      </CardContent>
    </Card>
  );
}

function TwoUpSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton lines={4} />
      <CardSkeleton lines={4} />
    </div>
  );
}
