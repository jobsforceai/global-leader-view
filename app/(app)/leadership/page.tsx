import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function LeadershipPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Network"
        description="Explore and manage your global leadership hierarchy"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Leadership Network
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            This page will display leader hierarchy, performance metrics, and network visualization.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
