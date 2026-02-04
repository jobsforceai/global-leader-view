import { Suspense } from "react";
import { CommandCenterShell } from "@/app/_components/CommandCenterShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommandCenterVolumeSection } from "@/app/_components/sections/CommandCenterVolumeSection";
import { CommandCenterTopLeadersSection } from "@/app/_components/sections/CommandCenterTopLeadersSection";
import { CommandCenterMarketsSection } from "@/app/_components/sections/CommandCenterMarketsSection";
import { CommandCenterCommunicationSection } from "@/app/_components/sections/CommandCenterCommunicationSection";
import { CommandCenterWeeklyCallsSection } from "@/app/_components/sections/CommandCenterWeeklyCallsSection";

export default async function CommandCenterPage() {
  return (
    <CommandCenterShell
      volumeContent={
        <Suspense fallback={<CardSkeleton lines={6} />}>
          <CommandCenterVolumeSection />
        </Suspense>
      }
      topLeadersContent={
        <Suspense fallback={<TwoUpSkeleton />}>
          <CommandCenterTopLeadersSection />
        </Suspense>
      }
      marketsContent={
        <Suspense fallback={<CardSkeleton lines={6} />}>
          <CommandCenterMarketsSection />
        </Suspense>
      }
      communicationContent={
        <Suspense fallback={<CardSkeleton lines={4} />}>
          <CommandCenterCommunicationSection />
        </Suspense>
      }
      callsContent={
        <Suspense fallback={<CardSkeleton lines={4} />}>
          <CommandCenterWeeklyCallsSection />
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
