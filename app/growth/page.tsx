"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout";
import { GrowthTimeline, MarketGrowthBoard, CampaignImpact } from "./_components";

export default function GrowthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth & Expansion"
        description="Track launches, campaigns, and long-term market growth"
      />

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="timeline">Growth Timeline</TabsTrigger>
          <TabsTrigger value="board">Market Board</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Impact</TabsTrigger>
        </TabsList>

        {/* Tab 1: Growth Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Growth Timeline</h3>
            <p className="text-sm text-muted-foreground">
              Chronological view of all expansion events and initiatives
            </p>
          </div>
          <GrowthTimeline />
        </TabsContent>

        {/* Tab 2: Market Growth Board */}
        <TabsContent value="board" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Market Growth Board</h3>
            <p className="text-sm text-muted-foreground">
              Kanban-style view of market expansions by status
            </p>
          </div>
          <MarketGrowthBoard />
        </TabsContent>

        {/* Tab 3: Campaign Impact */}
        <TabsContent value="campaigns" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Campaign Impact Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Measure the effectiveness of growth campaigns over time
            </p>
          </div>
          <CampaignImpact />
        </TabsContent>
      </Tabs>
    </div>
  );
}
