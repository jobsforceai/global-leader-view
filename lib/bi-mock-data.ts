// ============================================
// Business Intelligence Module Types & Mock Data
// ============================================

// Standardized metric types
export interface BusinessMetrics {
  businessVolume: number;
  reinvestmentRate: number;
  retentionRate: number;
  growthPercent: number;
}

export interface BiLeader extends BusinessMetrics {
  id: string;
  name: string;
  country: string;
  city: string;
  market: string;
  role: string;
  status: "active" | "inactive" | "at-risk";
  consistencyIndicator: "consistent" | "volatile" | "improving" | "declining";
  teamSize: number;
  lastContactDays: number;
  volumeTrend: VolumeTrendPoint[];
}

export interface VolumeTrendPoint {
  date: string;
  value: number;
}

export interface RegionPerformance {
  id: string;
  name: string;
  country: string;
  city?: string;
  businessVolume: number;
  growthPercent: number;
  leaderCount: number;
}

export interface WeakMarket {
  id: string;
  market: string;
  country: string;
  city: string;
  businessVolume: number;
  volumeTrend: "up" | "down" | "flat";
  volumeChange: number;
  retentionRate: number;
  reinvestmentRate: number;
  primaryRiskReason: string;
  severity: "low" | "medium" | "high";
  riskTags: string[];
}

export interface BiFilters {
  timeRange: string;
  country: string;
  city: string;
  role: string;
  status: string;
}

// Filter options
export const BI_COUNTRY_OPTIONS = [
  { label: "All Countries", value: "all" },
  { label: "USA", value: "usa" },
  { label: "Brazil", value: "brazil" },
  { label: "India", value: "india" },
  { label: "Singapore", value: "singapore" },
  { label: "UK", value: "uk" },
  { label: "Mexico", value: "mexico" },
  { label: "Germany", value: "germany" },
  { label: "Canada", value: "canada" },
  { label: "Australia", value: "australia" },
];

export const BI_ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Regional Director", value: "regional_director" },
  { label: "Senior Leader", value: "senior_leader" },
  { label: "Team Lead", value: "team_lead" },
  { label: "Leader", value: "leader" },
];

export const BI_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "At Risk", value: "at-risk" },
];

export const BI_TIME_RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 12 months", value: "12m" },
  { label: "Year to date", value: "ytd" },
];

// Mock Volume Trend Data
export const MOCK_BI_VOLUME_DAILY: VolumeTrendPoint[] = [
  { date: "Jan 24", value: 820000 },
  { date: "Jan 25", value: 932000 },
  { date: "Jan 26", value: 901000 },
  { date: "Jan 27", value: 934000 },
  { date: "Jan 28", value: 1290000 },
  { date: "Jan 29", value: 1330000 },
  { date: "Jan 30", value: 1320000 },
  { date: "Jan 31", value: 1150000 },
  { date: "Feb 1", value: 1420000 },
  { date: "Feb 2", value: 1380000 },
  { date: "Feb 3", value: 1520000 },
];

export const MOCK_BI_VOLUME_WEEKLY: VolumeTrendPoint[] = [
  { date: "W1 Dec", value: 5200000 },
  { date: "W2 Dec", value: 5800000 },
  { date: "W3 Dec", value: 6100000 },
  { date: "W4 Dec", value: 5900000 },
  { date: "W1 Jan", value: 6400000 },
  { date: "W2 Jan", value: 6800000 },
  { date: "W3 Jan", value: 7200000 },
  { date: "W4 Jan", value: 7800000 },
];

export const MOCK_BI_VOLUME_MONTHLY: VolumeTrendPoint[] = [
  { date: "Aug", value: 18500000 },
  { date: "Sep", value: 19200000 },
  { date: "Oct", value: 20100000 },
  { date: "Nov", value: 21800000 },
  { date: "Dec", value: 23400000 },
  { date: "Jan", value: 24500000 },
];

// Mock Top Growth Regions
export const MOCK_TOP_REGIONS: RegionPerformance[] = [
  { id: "r1", name: "São Paulo", country: "Brazil", city: "São Paulo", businessVolume: 4500000, growthPercent: 42.3, leaderCount: 156 },
  { id: "r2", name: "Singapore", country: "Singapore", city: "Singapore", businessVolume: 3800000, growthPercent: 38.1, leaderCount: 89 },
  { id: "r3", name: "Mumbai", country: "India", city: "Mumbai", businessVolume: 3200000, growthPercent: 35.7, leaderCount: 234 },
  { id: "r4", name: "Miami", country: "USA", city: "Miami", businessVolume: 2900000, growthPercent: 28.4, leaderCount: 67 },
  { id: "r5", name: "Mexico City", country: "Mexico", city: "Mexico City", businessVolume: 2600000, growthPercent: 24.2, leaderCount: 112 },
];

// Mock Top Performing Leaders
export const MOCK_TOP_PERFORMERS: BiLeader[] = [
  {
    id: "bl1",
    name: "Maria Santos",
    country: "Brazil",
    city: "São Paulo",
    market: "Brazil - São Paulo",
    role: "Regional Director",
    status: "active",
    businessVolume: 1250000,
    reinvestmentRate: 78.5,
    retentionRate: 96.2,
    growthPercent: 47.2,
    consistencyIndicator: "consistent",
    teamSize: 42,
    lastContactDays: 2,
    volumeTrend: [
      { date: "W1", value: 180000 }, { date: "W2", value: 195000 }, { date: "W3", value: 210000 }, { date: "W4", value: 225000 },
    ],
  },
  {
    id: "bl2",
    name: "James Chen",
    country: "Singapore",
    city: "Singapore",
    market: "Singapore",
    role: "Senior Leader",
    status: "active",
    businessVolume: 980000,
    reinvestmentRate: 82.1,
    retentionRate: 94.8,
    growthPercent: 38.5,
    consistencyIndicator: "improving",
    teamSize: 28,
    lastContactDays: 3,
    volumeTrend: [
      { date: "W1", value: 140000 }, { date: "W2", value: 155000 }, { date: "W3", value: 170000 }, { date: "W4", value: 185000 },
    ],
  },
  {
    id: "bl3",
    name: "Priya Sharma",
    country: "India",
    city: "Mumbai",
    market: "India - Mumbai",
    role: "Team Lead",
    status: "active",
    businessVolume: 875000,
    reinvestmentRate: 71.3,
    retentionRate: 92.1,
    growthPercent: 34.8,
    consistencyIndicator: "consistent",
    teamSize: 35,
    lastContactDays: 1,
    volumeTrend: [
      { date: "W1", value: 125000 }, { date: "W2", value: 138000 }, { date: "W3", value: 145000 }, { date: "W4", value: 158000 },
    ],
  },
  {
    id: "bl4",
    name: "Michael Brown",
    country: "USA",
    city: "Miami",
    market: "USA - Miami",
    role: "Regional Director",
    status: "active",
    businessVolume: 720000,
    reinvestmentRate: 68.9,
    retentionRate: 91.5,
    growthPercent: 29.3,
    consistencyIndicator: "volatile",
    teamSize: 22,
    lastContactDays: 5,
    volumeTrend: [
      { date: "W1", value: 110000 }, { date: "W2", value: 95000 }, { date: "W3", value: 130000 }, { date: "W4", value: 115000 },
    ],
  },
  {
    id: "bl5",
    name: "Ana Rodriguez",
    country: "Mexico",
    city: "Mexico City",
    market: "Mexico - Mexico City",
    role: "Leader",
    status: "active",
    businessVolume: 650000,
    reinvestmentRate: 74.2,
    retentionRate: 93.8,
    growthPercent: 26.7,
    consistencyIndicator: "improving",
    teamSize: 18,
    lastContactDays: 4,
    volumeTrend: [
      { date: "W1", value: 95000 }, { date: "W2", value: 105000 }, { date: "W3", value: 115000 }, { date: "W4", value: 125000 },
    ],
  },
];

// All Leaders for scorecards
export const MOCK_ALL_LEADERS: BiLeader[] = [
  ...MOCK_TOP_PERFORMERS,
  {
    id: "bl6",
    name: "Sarah Johnson",
    country: "UK",
    city: "London",
    market: "UK - London",
    role: "Regional Director",
    status: "active",
    businessVolume: 580000,
    reinvestmentRate: 65.4,
    retentionRate: 88.9,
    growthPercent: 18.2,
    consistencyIndicator: "consistent",
    teamSize: 31,
    lastContactDays: 6,
    volumeTrend: [
      { date: "W1", value: 85000 }, { date: "W2", value: 88000 }, { date: "W3", value: 92000 }, { date: "W4", value: 95000 },
    ],
  },
  {
    id: "bl7",
    name: "Thomas Wright",
    country: "USA",
    city: "Dallas",
    market: "USA - Dallas",
    role: "Team Lead",
    status: "at-risk",
    businessVolume: 320000,
    reinvestmentRate: 42.1,
    retentionRate: 76.5,
    growthPercent: -8.5,
    consistencyIndicator: "declining",
    teamSize: 12,
    lastContactDays: 21,
    volumeTrend: [
      { date: "W1", value: 95000 }, { date: "W2", value: 88000 }, { date: "W3", value: 78000 }, { date: "W4", value: 68000 },
    ],
  },
  {
    id: "bl8",
    name: "Lisa Chen",
    country: "Canada",
    city: "Calgary",
    market: "Canada - Calgary",
    role: "Leader",
    status: "inactive",
    businessVolume: 180000,
    reinvestmentRate: 35.2,
    retentionRate: 68.3,
    growthPercent: -15.2,
    consistencyIndicator: "declining",
    teamSize: 8,
    lastContactDays: 18,
    volumeTrend: [
      { date: "W1", value: 55000 }, { date: "W2", value: 48000 }, { date: "W3", value: 42000 }, { date: "W4", value: 38000 },
    ],
  },
];

// High Growth Leaders
export const MOCK_HIGH_GROWTH_LEADERS: BiLeader[] = MOCK_TOP_PERFORMERS.slice(0, 5).map((leader, index) => ({
  ...leader,
  consistencyIndicator: index % 2 === 0 ? "consistent" as const : "improving" as const,
}));

// Weak Markets
export const MOCK_WEAK_MARKETS: WeakMarket[] = [
  {
    id: "wm1",
    market: "USA - Dallas",
    country: "USA",
    city: "Dallas",
    businessVolume: 420000,
    volumeTrend: "down",
    volumeChange: -28.5,
    retentionRate: 72.3,
    reinvestmentRate: 38.2,
    primaryRiskReason: "Volume Drop",
    severity: "high",
    riskTags: ["Low Volume", "Drop vs Last Period", "Low Reinvestment"],
  },
  {
    id: "wm2",
    market: "Canada - Calgary",
    country: "Canada",
    city: "Calgary",
    businessVolume: 280000,
    volumeTrend: "down",
    volumeChange: -22.1,
    retentionRate: 68.5,
    reinvestmentRate: 41.5,
    primaryRiskReason: "Leader Churn",
    severity: "high",
    riskTags: ["Low Retention", "Drop vs Last Period"],
  },
  {
    id: "wm3",
    market: "UK - Manchester",
    country: "UK",
    city: "Manchester",
    businessVolume: 350000,
    volumeTrend: "flat",
    volumeChange: -5.2,
    retentionRate: 78.9,
    reinvestmentRate: 45.8,
    primaryRiskReason: "Stagnation",
    severity: "medium",
    riskTags: ["Low Volume", "Low Reinvestment"],
  },
  {
    id: "wm4",
    market: "Germany - Berlin",
    country: "Germany",
    city: "Berlin",
    businessVolume: 410000,
    volumeTrend: "down",
    volumeChange: -12.8,
    retentionRate: 82.1,
    reinvestmentRate: 52.3,
    primaryRiskReason: "Growth Stall",
    severity: "medium",
    riskTags: ["Drop vs Last Period"],
  },
  {
    id: "wm5",
    market: "Australia - Perth",
    country: "Australia",
    city: "Perth",
    businessVolume: 195000,
    volumeTrend: "flat",
    volumeChange: -3.1,
    retentionRate: 85.2,
    reinvestmentRate: 48.9,
    primaryRiskReason: "Low Scale",
    severity: "low",
    riskTags: ["Low Volume"],
  },
];

// Communication Health Summary for CEO Dashboard
export const MOCK_BI_COMMUNICATION = {
  contactedLast7Days: 72,
  contactedLast14Days: 84,
  contactedLast30Days: 91,
  overdueFollowups: 23,
};

// Weak Market Alerts for CEO Dashboard
export const MOCK_WEAK_ALERTS = MOCK_WEAK_MARKETS.filter(m => m.severity === "high" || m.severity === "medium").slice(0, 4);
