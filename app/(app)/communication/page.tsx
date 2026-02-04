import { Suspense } from "react";
import { CommunicationShell } from "./_components/CommunicationShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommunicationHealthSection } from "./_components/sections/CommunicationHealthSection";
import { CommunicationCallsSection } from "./_components/sections/CommunicationCallsSection";

export default async function CommunicationPage() {
  return (
    <CommunicationShell
      healthContent={
        <Suspense fallback={<CardSkeleton lines={6} />}>
          <CommunicationHealthSection />
        </Suspense>
      }
      callsContent={
        <Suspense fallback={<CardSkeleton lines={6} />}>
          <CommunicationCallsSection />
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
