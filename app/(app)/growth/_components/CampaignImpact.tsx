"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAMPAIGN_STATUS_OPTIONS } from "@/lib/growth-mock-data";
import { CampaignListItem, CampaignImpact as CampaignImpactData } from "@/lib/types";
import { CampaignDetailView } from "./CampaignDetailView";
import { getCampaignImpact } from "@/actions/campaigns";

const statusStyles: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  Active: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Completed: "bg-green-100 text-green-700 hover:bg-green-100",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function CampaignImpact({ campaigns }: { campaigns: CampaignListItem[] }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignListItem | null>(null);
  const [impact, setImpact] = useState<CampaignImpactData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (statusFilter !== "All" && campaign.status !== statusFilter)
      return false;
    return true;
  });

  const handleRowClick = async (campaign: CampaignListItem) => {
    setSelectedCampaign(campaign);
    setDrawerOpen(true);
    const detail = await getCampaignImpact(campaign.id);
    setImpact(detail);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGN_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Statuses" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="hidden md:table-cell">
                Primary Objective
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No campaigns match the selected filter
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(campaign)}
                >
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell className="text-sm">{campaign.market}</TableCell>
                  <TableCell className="text-sm">{campaign.duration}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px]">
                    <p className="text-sm text-muted-foreground truncate">
                      {campaign.primaryObjective}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal",
                        statusStyles[campaign.status]
                      )}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setImpact(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <SheetTitle className="text-lg">Campaign Impact</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {selectedCampaign && impact && (
            <CampaignDetailView campaign={impact} />
          )}
          {selectedCampaign && !impact && (
            <div className="text-sm text-muted-foreground">
              Loading campaign impact...
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
