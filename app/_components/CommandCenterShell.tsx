"use client";

import { PageHeader } from "@/components/layout";

interface CommandCenterShellProps {
  volumeContent: React.ReactNode;
  topLeadersContent: React.ReactNode;
  marketsContent: React.ReactNode;
  communicationContent: React.ReactNode;
  callsContent: React.ReactNode;
}

export function CommandCenterShell({
  volumeContent,
  topLeadersContent,
  marketsContent,
  communicationContent,
  callsContent,
}: CommandCenterShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Executive overview of global leadership operations"
      />

      {volumeContent}

      {topLeadersContent}

      {marketsContent}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {communicationContent}
        {callsContent}
      </div>
    </div>
  );
}
