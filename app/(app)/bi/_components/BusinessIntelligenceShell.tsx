"use client";

import { PageHeader } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusinessIntelligenceShellProps {
  ceoContent: React.ReactNode;
  scorecardsContent: React.ReactNode;
  growthContent: React.ReactNode;
  weakContent: React.ReactNode;
  investorsContent: React.ReactNode;
}

export function BusinessIntelligenceShell({
  ceoContent,
  scorecardsContent,
  growthContent,
  weakContent,
  investorsContent,
}: BusinessIntelligenceShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence"
        description="Performance, growth, and risk insights across the leadership network"
      />

      {/* Filters UI intentionally hidden until API supports filtering */}

      <Tabs defaultValue="ceo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ceo">CEO Dashboard</TabsTrigger>
          <TabsTrigger value="scorecards">Leader Scorecards</TabsTrigger>
          <TabsTrigger value="growth">High Growth Leaders</TabsTrigger>
          <TabsTrigger value="weak">Weak Markets</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
        </TabsList>

        <TabsContent value="ceo" className="space-y-6">
          {ceoContent}
        </TabsContent>

        <TabsContent value="scorecards" className="space-y-6">
          {scorecardsContent}
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          {growthContent}
        </TabsContent>

        <TabsContent value="weak" className="space-y-6">
          {weakContent}
        </TabsContent>

        <TabsContent value="investors" className="space-y-6">
          {investorsContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
