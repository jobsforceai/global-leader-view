"use client";

import { useState, useCallback, useTransition } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MessageSquareOff,
  TrendingDown,
  PackageX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderPerformanceRow, LeaderPerformanceGridData, GapFlag } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { getLeaderPerformanceGrid } from "@/actions/leader-performance";

interface LeaderPerformanceGridProps {
  initialData: LeaderPerformanceGridData;
  onLeaderClick: (userId: string) => void;
}

const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Country Head", value: "COUNTRY_HEAD" },
  { label: "City Leader", value: "CITY_LEADER" },
  { label: "Regional Leader", value: "REGIONAL_LEADER" },
  { label: "Top Trader", value: "TOP_TRADER" },
  { label: "SGSE Business Head", value: "SGSE_BUSINESS_HEAD" },
  { label: "Academy Director", value: "ACADEMY_DIRECTOR" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

type SortField = "businessVolume" | "growthPercent" | "teamSize" | "daysSinceContact" | "fullName" | "capRemaining";

const GAP_FLAG_CONFIG: Record<GapFlag, { label: string; icon: React.ReactNode; className: string }> = {
  NOT_CONTACTED: {
    label: "Not Contacted",
    icon: <MessageSquareOff className="h-3 w-3" />,
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  },
  DECLINING: {
    label: "Declining",
    icon: <TrendingDown className="h-3 w-3" />,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  INACTIVE: {
    label: "Inactive",
    icon: <PackageX className="h-3 w-3" />,
    className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  },
};

function normalizeRole(roleType: string | null) {
  if (!roleType) return "—";
  return roleType
    .toLowerCase()
    .split("_")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ");
}

function normalizeChannel(ch: string | null) {
  if (!ch) return "—";
  const map: Record<string, string> = { WHATSAPP: "WhatsApp", TELEGRAM: "Telegram", PHONE: "Phone", EMAIL: "Email", ZOOM: "Zoom" };
  return map[ch.toUpperCase()] || ch;
}

export function LeaderPerformanceGrid({
  initialData,
  onLeaderClick,
}: LeaderPerformanceGridProps) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("businessVolume");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback(
    (params: {
      page?: number;
      search?: string;
      sortBy?: SortField;
      sortOrder?: "asc" | "desc";
      roleType?: string;
      status?: string;
    }) => {
      const p = params.page ?? page;
      const s = params.search ?? search;
      const sb = params.sortBy ?? sortBy;
      const so = params.sortOrder ?? sortOrder;
      const r = params.roleType ?? roleFilter;
      const st = params.status ?? statusFilter;

      startTransition(async () => {
        try {
          const result = await getLeaderPerformanceGrid({
            page: p,
            limit: 20,
            search: s || undefined,
            sortBy: sb,
            sortOrder: so,
            roleType: r !== "all" ? r : undefined,
            status: (st !== "all" ? st : undefined) as "ACTIVE" | "INACTIVE" | undefined,
          });
          setData(result);
        } catch {
          // keep existing data on error
        }
      });
    },
    [page, search, sortBy, sortOrder, roleFilter, statusFilter]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchData({ page: 1, search: value });
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(field);
    setSortOrder(newOrder);
    setPage(1);
    fetchData({ page: 1, sortBy: field, sortOrder: newOrder });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData({ page: newPage });
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
    fetchData({ page: 1, roleType: value });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    fetchData({ page: 1, status: value });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />;
    return sortOrder === "desc" ? (
      <ChevronDown className="h-3 w-3" />
    ) : (
      <ChevronUp className="h-3 w-3" />
    );
  };

  const { leaders, pagination } = data;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Leader Performance</CardTitle>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, country..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={cn("rounded-md border", isPending && "opacity-60 pointer-events-none")}>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("fullName")}>
                      Leader <SortIcon field="fullName" />
                    </button>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("businessVolume")}>
                      Volume <SortIcon field="businessVolume" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("growthPercent")}>
                      Growth <SortIcon field="growthPercent" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("teamSize")}>
                      Team <SortIcon field="teamSize" />
                    </button>
                  </TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("capRemaining")}>
                      Cap Left <SortIcon field="capRemaining" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1" onClick={() => handleSort("daysSinceContact")}>
                      Contact <SortIcon field="daysSinceContact" />
                    </button>
                  </TableHead>
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No leaders found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaders.map((leader) => (
                    <DesktopRow key={leader.userId} leader={leader} onClick={() => onLeaderClick(leader.userId)} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y">
            {leaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No leaders found
              </div>
            ) : (
              leaders.map((leader) => (
                <MobileCard key={leader.userId} leader={leader} onClick={() => onLeaderClick(leader.userId)} />
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
              <span className="hidden sm:inline"> ({pagination.totalCount} leaders)</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DesktopRow({ leader, onClick }: { leader: LeaderPerformanceRow; onClick: () => void }) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <TableCell className="text-sm font-mono text-muted-foreground">{leader.userId}</TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{leader.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {[leader.country, leader.city].filter(Boolean).join(" · ")}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {normalizeRole(leader.roleType)}
      </TableCell>
      <TableCell className="font-medium">{formatCurrency(leader.businessVolume)}</TableCell>
      <TableCell>
        <span
          className={cn(
            "font-semibold text-sm",
            leader.growthPercent > 0 ? "text-green-600" : leader.growthPercent < 0 ? "text-red-600" : "text-muted-foreground"
          )}
        >
          {leader.growthPercent > 0 ? "+" : ""}
          {leader.growthPercent.toFixed(1)}%
        </span>
      </TableCell>
      <TableCell className="text-sm">{leader.teamSize}</TableCell>
      <TableCell className="text-sm">{formatCurrency(leader.totalInvested)}</TableCell>
      <TableCell className="text-sm">{formatCurrency(leader.capRemaining)}</TableCell>
      <TableCell>
        <ContactBadge days={leader.daysSinceContact} />
      </TableCell>
      <TableCell>
        <GapFlags flags={leader.gapFlags} />
      </TableCell>
    </TableRow>
  );
}

function MobileCard({ leader, onClick }: { leader: LeaderPerformanceRow; onClick: () => void }) {
  return (
    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors active:bg-muted" onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{leader.fullName}</p>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{leader.userId}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {normalizeRole(leader.roleType)} · {[leader.country, leader.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <GapFlags flags={leader.gapFlags} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Volume</p>
          <p className="font-medium">{formatCurrency(leader.businessVolume)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Growth</p>
          <p
            className={cn(
              "font-semibold",
              leader.growthPercent > 0 ? "text-green-600" : leader.growthPercent < 0 ? "text-red-600" : "text-muted-foreground"
            )}
          >
            {leader.growthPercent > 0 ? "+" : ""}
            {leader.growthPercent.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Team</p>
          <p className="font-medium">{leader.teamSize}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Invested</p>
          <p className="font-medium">{formatCurrency(leader.totalInvested)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Cap Left</p>
          <p className="font-medium">{formatCurrency(leader.capRemaining)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Contact</p>
          <ContactBadge days={leader.daysSinceContact} />
        </div>
      </div>
    </div>
  );
}

function ContactBadge({ days }: { days: number | null }) {
  if (days === null) {
    return <span className="text-xs text-muted-foreground">Never</span>;
  }
  return (
    <span
      className={cn(
        "text-xs font-medium",
        days <= 7 ? "text-green-600" : days <= 14 ? "text-amber-600" : "text-red-600"
      )}
    >
      {days}d ago
    </span>
  );
}

function GapFlags({ flags }: { flags: GapFlag[] }) {
  if (!flags.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((flag) => {
        const config = GAP_FLAG_CONFIG[flag];
        return (
          <Badge key={flag} variant="secondary" className={cn("text-[10px] px-1.5 py-0 gap-0.5", config.className)}>
            {config.icon}
            <span className="hidden lg:inline">{config.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
