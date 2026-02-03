"use client";

import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BI_TIME_RANGE_OPTIONS,
  BI_COUNTRY_OPTIONS,
  BI_ROLE_OPTIONS,
  BI_STATUS_OPTIONS,
} from "@/lib/bi-mock-data";
import { BiFilters } from "@/lib/types";

interface BiFilterBarProps {
  filters: BiFilters;
  onFiltersChange: (filters: BiFilters) => void;
}

export function BiFilterBar({ filters, onFiltersChange }: BiFilterBarProps) {
  const updateFilter = (key: keyof BiFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <Select
          value={filters.timeRange}
          onValueChange={(v) => updateFilter("timeRange", v)}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            {BI_TIME_RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.country}
          onValueChange={(v) => updateFilter("country", v)}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {BI_COUNTRY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.role}
          onValueChange={(v) => updateFilter("role", v)}
        >
          <SelectTrigger className="w-[150px] h-8">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {BI_ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {BI_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
