"use client";

import { PageHeader } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommunicationShellProps {
  healthContent: React.ReactNode;
  callsContent: React.ReactNode;
}

export function CommunicationShell({
  healthContent,
  callsContent,
}: CommunicationShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication & Calls"
        description="Visibility into leadership engagement and follow-up discipline"
      />

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList>
          <TabsTrigger value="health">Communication Health</TabsTrigger>
          <TabsTrigger value="calls">Weekly Calls</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          {healthContent}
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          {callsContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}
