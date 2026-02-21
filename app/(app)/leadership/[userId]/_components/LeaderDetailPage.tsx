"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LeaderPerformanceDetail } from "@/lib/types";
import {
  HeaderSection,
  GapBanner,
  ScorecardGrid,
  VolumeTrendChart,
  LegStrengthSection,
  CommunicationSection,
  FollowUpsSection,
  NotesSection,
} from "./DetailSections";
import { TeamTree } from "./TeamTree";

interface LeaderDetailPageProps {
  data: LeaderPerformanceDetail;
}

export function LeaderDetailPage({ data }: LeaderDetailPageProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 mt-15">
      {/* Back button + Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 mt-0.5"
          onClick={() => router.push("/leadership")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <HeaderSection leader={data.leader} />
      </div>

      {/* Gap Analysis Banner */}
      <GapBanner gap={data.gapAnalysis} />

      {/* Scorecard Metrics */}
      <ScorecardGrid scorecard={data.scorecard} finance={data.finance} />

      {/* Volume Trend Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Volume Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <VolumeTrendChart data={data.volumeTrend} />
        </CardContent>
      </Card>

      {/* Two-column: Legs + Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LegStrengthSection legStrength={data.legStrength} />
        <CommunicationSection
          communication={data.communicationSummary}
          callAttendance={data.callAttendance}
          preferredChannel={data.leader.preferredChannel}
        />
      </div>

      {/* Two-column: Follow-Ups + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FollowUpsSection followUps={data.recentFollowUps} />
        <NotesSection notes={data.leader.notes} />
      </div>

      <Separator />

      {/* Team Tree */}
      <TeamTree
        leader={data.leader}
        scorecard={data.scorecard}
        team={data.team}
        gapAnalysis={data.gapAnalysis}
      />
    </div>
  );
}
