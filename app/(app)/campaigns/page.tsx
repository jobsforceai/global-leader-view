import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Manage and track campaign performance"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Campaign Management
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            This page will display active campaigns, performance metrics, and campaign analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
