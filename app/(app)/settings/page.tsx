import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your dashboard preferences"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Settings
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            This page will display user preferences, notification settings, and account management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
