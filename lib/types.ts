export interface VolumeDataPoint {
  date: string;
  value: number;
}

export interface LeaderSnapshot {
  id: string;
  name: string;
  country?: string;
  city?: string;
  growthPercent?: number;
  daysStagnant?: number;
  reasonTag?: string;
  businessVolume?: number;
}

export type MarketSeverity = "low" | "medium" | "high";
export type MarketStatus = "open" | "in-progress" | "resolved";

export interface MarketIntervention {
  id: string;
  market: string;
  severity: MarketSeverity;
  reason: string;
  alertType?: string;
  assignedOwner?: string;
  status?: MarketStatus;
  changePercent?: number;
}

export interface CommunicationMetrics {
  contactedLast7Days: number;
  contactedLast14Days: number;
  contactedLast30Days: number;
  overdueFollowups: number;
  totalLeaders: number;
  avgDaysSinceContact?: number;
}

export interface LeaderContact {
  id: string;
  name: string;
  role: string;
  market: string;
  country?: string;
  city?: string;
  daysSinceLastContact: number | null;
  preferredChannel: string;
  businessVolume?: number;
  lastContactDate?: string | null;
}

export interface WeeklyCallsMetrics {
  attendancePercent: number;
  lastWeekAttendancePercent: number;
  noShowCount: number;
  missedConsecutiveCount: number;
}

export interface KpiData {
  id: string;
  value: number;
  trend: number;
  trendDirection: "up" | "down" | "neutral";
}

export interface WeeklyCallListItem {
  id: string;
  dateTime: string;
  callName: string;
  requiredRoles: string[];
  attendancePercent: number;
  meetingLink: string;
}

export interface CallAttendee {
  id: string;
  name: string;
  present: boolean;
  participationScore: 0 | 1 | 2 | 3;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  status: "pending" | "completed";
}

export interface WeeklyCallDetail extends WeeklyCallListItem {
  attendees: CallAttendee[];
  actionItems: ActionItem[];
}

export interface FollowUp {
  id: string;
  leaderId: string;
  leaderName: string;
  taskDescription: string;
  owner: string;
  dueDate: string;
  status: "open" | "overdue" | "completed";
  source: "call" | "manual" | "alert";
}

export interface WeeklyBoardLeader {
  id: string;
  name: string;
  phone?: string | null;
  market: string;
  status: "NOT_CONTACTED" | "CONTACTED" | "NEED_FOLLOWUP" | "COMPLETED";
  statusNotes?: string | null;
  followUp?: {
    id: string;
    dueDate: string;
    status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED" | "IGNORED";
    notes?: string | null;
  } | null;
}

export interface WeeklyBoardSummary {
  weekStart: string;
  weekEnd: string;
  totalLeaders: number;
  contacted: number;
  followUps: number;
  statusCounts: {
    NOT_CONTACTED: number;
    CONTACTED: number;
    NEED_FOLLOWUP: number;
    COMPLETED: number;
  };
}

export interface WeeklyBoardData {
  weekStart: string;
  weekEnd: string;
  leaders: WeeklyBoardLeader[];
}

export interface TopLeader {
  id: string;
  name: string;
  market: string;
  businessVolume: number;
  growthPercent: number;
}

export interface DailyClosureTracker {
  date: string;
  leadsGenerated: number;
  newIds: number;
  capitalCollected: number;
  closers: string[];
  presentationsDone: number | null;
  conversionRate: number | null;
  revenuePerDay: number | null;
}

export interface BiLeaderScorecard {
  id: string;
  name: string;
  country: string;
  region: string;
  city: string;
  market: string;
  businessVolume: number;
  lifetimeBusinessVolume?: number | null;
  reinvestmentRate: number | null;
  retentionRate: number | null;
  growthPercent: number;
  consistencyIndicator: "consistent" | "volatile" | "improving" | "declining" | null;
  teamSize: number;
  status: "active" | "inactive" | "at-risk";
  lastContactDays: number | null;
  lastContactAt?: string | null;
  lastActivityAt?: string | null;
  volumeTrend: VolumeDataPoint[];
  legStrength?: {
    threshold: number;
    strong: Array<{ userId: string; volume: number }>;
    weak: Array<{ userId: string; volume: number }>;
  } | null;
}

export interface HighGrowthLeader {
  id: string;
  name: string;
  market: string;
  growthPercent: number;
  currentValue: number;
  previousValue: number;
}

export interface Investor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  status: string | null;
  isPackageActive: boolean;
  totalInvested: number;
  capTotal: number;
  capRemaining: number;
}

export interface BiFilters {
  timeRange: string;
  country: string;
  city: string;
  role: string;
  status: string;
}

export interface WeakMarket {
  id: string;
  market: string;
  country?: string;
  city?: string;
  businessVolume: number;
  volumeTrend: "up" | "down" | "flat";
  volumeChange: number;
  retentionRate?: number | null;
  reinvestmentRate?: number | null;
  primaryRiskReason: string;
  severity: MarketSeverity;
  riskTags?: string[];
}

export interface TopRegion {
  id: string;
  name: string;
  businessVolume: number;
  growthPercent: number;
}

export type GrowthEventStatus = "Planned" | "In Progress" | "Completed" | "On Hold";
export type GrowthEventType =
  | "City Launch"
  | "Country Expansion"
  | "Leadership Promotion"
  | "Special Growth Campaign";

export interface GrowthEventKpiSnapshot {
  volume: number;
  volumeChange: number;
  leaderActivations: number;
  activationsChange: number;
  retention: number;
  retentionChange: number;
}

export interface GrowthEvent {
  id: string;
  name: string;
  type: GrowthEventType;
  market: string;
  marketType: "Country" | "City";
  owner: string;
  startDate: string;
  endDate?: string | null;
  status: GrowthEventStatus;
  objective: string;
  targetKpis: string[];
  kpiSnapshot: GrowthEventKpiSnapshot;
  notes: string;
}

export type CampaignStatus = "Planned" | "Active" | "Completed" | "Cancelled";

export interface CampaignListItem {
  id: string;
  name: string;
  market: string;
  startDate: string;
  endDate: string;
  duration: string;
  primaryObjective: string;
  status: CampaignStatus;
}

export interface CampaignImpact {
  id: string;
  name: string;
  market: string;
  startDate: string;
  endDate: string;
  duration: string;
  primaryObjective: string;
  status: CampaignStatus;
  baseline: number;
  during: number;
  post: number;
  changePercent: number;
  trend: Array<{ date: string; metrics: { volume: number } }>;
}
