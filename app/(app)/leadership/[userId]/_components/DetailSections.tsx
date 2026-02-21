"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaderPerformanceDetail, VolumeDataPoint } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

// ── Helpers ──

function normalizeRole(roleType: string | null) {
  if (!roleType) return "Unknown";
  return roleType
    .toLowerCase()
    .split("_")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ");
}

function normalizeChannel(ch: string | null) {
  if (!ch) return "—";
  const map: Record<string, string> = {
    WHATSAPP: "WhatsApp",
    TELEGRAM: "Telegram",
    PHONE: "Phone",
    EMAIL: "Email",
    ZOOM: "Zoom",
  };
  return map[ch.toUpperCase()] || ch;
}

// ── Header Section ──

interface HeaderSectionProps {
  leader: LeaderPerformanceDetail["leader"];
}

export function HeaderSection({ leader }: HeaderSectionProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">{leader.fullName}</h2>
        {leader.roleType && (
          <Badge variant="secondary" className="text-xs">
            {normalizeRole(leader.roleType)}
          </Badge>
        )}
        <Badge
          variant="secondary"
          className={cn(
            "text-xs",
            leader.isPackageActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          )}
        >
          {leader.isPackageActive ? "Active" : "Inactive"}
        </Badge>
        {leader.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px] gap-0.5">
            <Tag className="h-2.5 w-2.5" />
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
        <span className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" /> {leader.email}
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5" /> {leader.phone}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {[leader.country, leader.region, leader.city]
            .filter(Boolean)
            .join(", ")}
        </span>
      </div>
    </div>
  );
}

// ── Gap Banner ──

interface GapBannerProps {
  gap: LeaderPerformanceDetail["gapAnalysis"];
}

export function GapBanner({ gap }: GapBannerProps) {
  const warnings: string[] = [];
  if (gap.decliningVolume) warnings.push("Volume is declining");
  if (gap.notContactedDays !== null && gap.notContactedDays > 14)
    warnings.push(`Not contacted in ${gap.notContactedDays} days`);
  else if (gap.notContactedDays === null)
    warnings.push("Never been contacted");
  if (gap.weakLegs > 0)
    warnings.push(
      `${gap.weakLegs} weak leg${gap.weakLegs > 1 ? "s" : ""}`
    );
  if (gap.inactiveTeamMembers > 0)
    warnings.push(
      `${gap.inactiveTeamMembers} inactive team member${gap.inactiveTeamMembers > 1 ? "s" : ""}`
    );

  if (warnings.length === 0) return null;

  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className="font-medium text-amber-800 dark:text-amber-400">
          Gaps Detected
        </p>
        <ul className="mt-1 space-y-0.5 text-amber-700 dark:text-amber-300">
          {warnings.map((w) => (
            <li key={w} className="text-xs">
              • {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Scorecard Grid ──

interface ScorecardGridProps {
  scorecard: LeaderPerformanceDetail["scorecard"];
  finance: LeaderPerformanceDetail["finance"];
}

export function ScorecardGrid({ scorecard, finance }: ScorecardGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <MetricTile
        label="Business Volume"
        value={formatCurrency(scorecard.businessVolume)}
        sub={`Lifetime: ${formatCurrency(scorecard.lifetimeBusinessVolume)}`}
      />
      <MetricTile
        label="Growth"
        value={`${scorecard.growthPercent > 0 ? "+" : ""}${scorecard.growthPercent.toFixed(1)}%`}
        valueColor={
          scorecard.growthPercent >= 0 ? "text-green-600" : "text-red-600"
        }
      />
      <MetricTile
        label="Team Size"
        value={String(scorecard.teamSize)}
        sub={`${scorecard.activeLegsCount} active legs`}
      />
      <MetricTile
        label="Total Invested"
        value={formatCurrency(finance.totalInvested)}
      />
      <MetricTile
        label="Cap Total"
        value={formatCurrency(finance.capTotal)}
        sub={`${formatCurrency(finance.capRemaining)} remaining`}
      />
      <MetricTile
        label="Reinvestment"
        value={
          scorecard.reinvestmentRate !== null
            ? `${scorecard.reinvestmentRate.toFixed(1)}%`
            : "—"
        }
      />
    </div>
  );
}

function MetricTile({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <div className="p-3 rounded-lg border bg-muted/30">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-lg font-bold leading-tight", valueColor)}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      )}
    </div>
  );
}

// ── Volume Trend Chart ──

interface VolumeTrendChartProps {
  data: VolumeDataPoint[];
}

export function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-52 rounded-lg border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
        No volume trend data available
      </div>
    );
  }

  return (
    <div className="h-52 lg:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="detailPageGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [
              formatCurrency(value as number),
              "Volume",
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="url(#detailPageGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Leg Strength Section ──

interface LegStrengthSectionProps {
  legStrength: LeaderPerformanceDetail["legStrength"];
}

export function LegStrengthSection({ legStrength }: LegStrengthSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Leg Strength</CardTitle>
          {legStrength && (
            <Badge variant="outline" className="text-[10px]">
              Threshold: {formatCurrency(legStrength.threshold)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {legStrength ? (
          <div className="grid grid-cols-2 gap-3">
            <LegList
              title="Strong Legs"
              legs={legStrength.strong}
              variant="strong"
            />
            <LegList
              title="Weak Legs"
              legs={legStrength.weak}
              variant="weak"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Leg strength data unavailable
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function LegList({
  title,
  legs,
  variant,
}: {
  title: string;
  legs: Array<{ userId: string; fullName: string; volume: number }>;
  variant: "strong" | "weak";
}) {
  const isStrong = variant === "strong";
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        isStrong
          ? "bg-green-50/60 dark:bg-green-950/20"
          : "bg-red-50/60 dark:bg-red-950/20"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className={cn(
            "text-xs font-semibold",
            isStrong
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          )}
        >
          {title}
        </p>
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px]",
            isStrong
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {legs.length}
        </Badge>
      </div>
      {legs.length === 0 ? (
        <p className="text-xs text-muted-foreground">None</p>
      ) : (
        <div className="space-y-1.5">
          {legs.map((leg) => (
            <div
              key={leg.userId}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate mr-2">{leg.fullName}</span>
              <span className="font-medium shrink-0">
                {formatCurrency(leg.volume)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Communication Section ──

interface CommunicationSectionProps {
  communication: LeaderPerformanceDetail["communicationSummary"];
  callAttendance: LeaderPerformanceDetail["callAttendance"];
  preferredChannel: string | null;
}

export function CommunicationSection({
  communication,
  callAttendance,
  preferredChannel,
}: CommunicationSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> Communication
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Contact</span>
              <span
                className={cn(
                  "font-medium",
                  communication.daysSinceContact === null
                    ? "text-muted-foreground"
                    : communication.daysSinceContact <= 7
                    ? "text-green-600"
                    : communication.daysSinceContact <= 14
                    ? "text-amber-600"
                    : "text-red-600"
                )}
              >
                {communication.daysSinceContact === null
                  ? "Never"
                  : `${communication.daysSinceContact}d ago`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Logs</span>
              <span className="font-medium">
                {communication.totalLogs}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Channel</span>
              <span className="font-medium">
                {normalizeChannel(preferredChannel)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Call Attendance
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attendance</span>
              <span className="font-medium">
                {callAttendance.attended}/{callAttendance.totalCalls} (
                {callAttendance.attendanceRate.toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participation</span>
              <span className="font-medium">
                {callAttendance.avgParticipationScore !== null
                  ? `${callAttendance.avgParticipationScore.toFixed(1)}/3`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">No-Show Streak</span>
              <span
                className={cn(
                  "font-medium",
                  callAttendance.noShowStreak > 0 && "text-red-600"
                )}
              >
                {callAttendance.noShowStreak}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Follow-Ups Section ──

interface FollowUpsSectionProps {
  followUps: LeaderPerformanceDetail["recentFollowUps"];
}

export function FollowUpsSection({ followUps }: FollowUpsSectionProps) {
  if (followUps.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Follow-Ups</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">No follow-ups</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Follow-Ups</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {followUps.map((fu) => (
          <div
            key={fu.id}
            className="flex items-start gap-2 p-2.5 rounded-lg border text-sm"
          >
            {fu.status === "RESOLVED" || fu.status === "IGNORED" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{fu.title}</p>
              <p className="text-xs text-muted-foreground">
                Due: {new Date(fu.dueDate).toLocaleDateString()} ·{" "}
                {fu.status}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Notes Section ──

interface NotesSectionProps {
  notes: string | null;
}

export function NotesSection({ notes }: NotesSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Notes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          {notes || "No notes available"}
        </p>
      </CardContent>
    </Card>
  );
}
