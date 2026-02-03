"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout";
import { MOCK_ALERT_SUMMARY } from "@/lib/alerts-mock-data";
import {
  AlertSummaryCards,
  AlertsTable,
  InterventionsTable,
  AuditLogTable,
} from "./_components";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Interventions"
        description="Identify risks early and enforce corrective action"
      />

      <Tabs defaultValue="active-alerts" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active-alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
        </TabsList>

        {/* Tab 1: Active Alerts */}
        <TabsContent value="active-alerts" className="space-y-6">
          {/* Alert Summary KPIs */}
          <AlertSummaryCards metrics={MOCK_ALERT_SUMMARY} />

          {/* Alerts Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">All Alerts</h3>
            <AlertsTable />
          </div>
        </TabsContent>

        {/* Tab 2: Interventions */}
        <TabsContent value="interventions" className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Intervention Tracker</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage all intervention plans linked to alerts
              </p>
            </div>
            <InterventionsTable />
          </div>
        </TabsContent>

        {/* Tab 3: Audit Log */}
        <TabsContent value="audit-log" className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Audit Trail</h3>
              <p className="text-sm text-muted-foreground">
                Complete history of all alert and intervention actions
              </p>
            </div>
            <AuditLogTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
