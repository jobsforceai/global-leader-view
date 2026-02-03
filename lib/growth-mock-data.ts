// =============================================================================
// Growth & Expansion Mock Data
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type GrowthEventType =
  | "City Launch"
  | "Country Expansion"
  | "Leadership Promotion"
  | "Special Growth Campaign";

export type GrowthEventStatus =
  | "Planned"
  | "In Progress"
  | "Completed"
  | "On Hold";

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
  endDate?: string;
  status: GrowthEventStatus;
  objective: string;
  targetKpis: string[];
  kpiSnapshot: GrowthEventKpiSnapshot;
  notes: string;
}

export type CampaignStatus = "Planned" | "Active" | "Completed" | "Cancelled";

export interface CampaignKpiPeriod {
  period: string;
  volume: number;
  activations: number;
  retention: number;
}

export interface CampaignCheckpoint {
  label: string;
  volume: number;
  volumeVsPreCampaign: number;
  activations: number;
  retention: number;
}

export interface Campaign {
  id: string;
  name: string;
  market: string;
  startDate: string;
  endDate: string;
  duration: string;
  primaryObjective: string;
  status: CampaignStatus;
  beforeKpis: {
    volume: number;
    activations: number;
    retention: number;
  };
  afterKpis: {
    volume: number;
    activations: number;
    retention: number;
  };
  trendData: CampaignKpiPeriod[];
  checkpoints: CampaignCheckpoint[];
}

// -----------------------------------------------------------------------------
// Mock Data - Growth Events
// -----------------------------------------------------------------------------

export const MOCK_GROWTH_EVENTS: GrowthEvent[] = [
  {
    id: "GE-001",
    name: "Jakarta Metro Expansion",
    type: "City Launch",
    market: "Jakarta",
    marketType: "City",
    owner: "Ahmad Rizki",
    startDate: "2026-01-15",
    status: "In Progress",
    objective:
      "Establish presence in 5 key Jakarta districts with minimum 50 active leaders",
    targetKpis: [
      "50+ active leaders",
      "$100K monthly volume",
      "75% 30-day retention",
    ],
    kpiSnapshot: {
      volume: 67500,
      volumeChange: 12.5,
      leaderActivations: 34,
      activationsChange: 8,
      retention: 72,
      retentionChange: -3,
    },
    notes:
      "Strong initial traction in Central Jakarta. South Jakarta launch scheduled for Feb 10. Need to address retention challenges in East Jakarta.",
  },
  {
    id: "GE-002",
    name: "Vietnam Market Entry",
    type: "Country Expansion",
    market: "Vietnam",
    marketType: "Country",
    owner: "Regional Team",
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    status: "In Progress",
    objective:
      "Launch in Ho Chi Minh City and Hanoi with regulatory compliance and local leadership team",
    targetKpis: [
      "100+ leaders in 90 days",
      "$200K quarterly volume",
      "Local management team hired",
    ],
    kpiSnapshot: {
      volume: 145000,
      volumeChange: 22.3,
      leaderActivations: 78,
      activationsChange: 15,
      retention: 68,
      retentionChange: 2,
    },
    notes:
      "Regulatory approval obtained. Ho Chi Minh City performing above expectations. Hanoi launch delayed by 2 weeks due to logistics.",
  },
  {
    id: "GE-003",
    name: "Diamond Leader Program - India",
    type: "Leadership Promotion",
    market: "India",
    marketType: "Country",
    owner: "Vikram Singh",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    status: "In Progress",
    objective:
      "Promote 25 leaders to Diamond rank through accelerated development program",
    targetKpis: [
      "25 new Diamond leaders",
      "40% team growth for participants",
      "90% program completion rate",
    ],
    kpiSnapshot: {
      volume: 890000,
      volumeChange: 8.5,
      leaderActivations: 12,
      activationsChange: 4,
      retention: 85,
      retentionChange: 5,
    },
    notes:
      "12 of 25 target promotions achieved. Program participants showing 35% higher engagement than control group.",
  },
  {
    id: "GE-004",
    name: "Chinese New Year Mega Campaign",
    type: "Special Growth Campaign",
    market: "Southeast Asia",
    marketType: "Country",
    owner: "Marketing Team",
    startDate: "2026-01-20",
    endDate: "2026-02-15",
    status: "In Progress",
    objective:
      "Drive 30% volume increase during CNY period with special incentives",
    targetKpis: [
      "30% volume lift",
      "500 new enrollments",
      "10K social media engagements",
    ],
    kpiSnapshot: {
      volume: 1250000,
      volumeChange: 28.5,
      leaderActivations: 342,
      activationsChange: 89,
      retention: 71,
      retentionChange: -2,
    },
    notes:
      "Campaign exceeding volume targets. Social engagement at 8.2K, need push for final week.",
  },
  {
    id: "GE-005",
    name: "Bangalore Tech Hub Initiative",
    type: "City Launch",
    market: "Bangalore",
    marketType: "City",
    owner: "Priya Sharma",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    status: "Completed",
    objective:
      "Target tech professionals in Bangalore with digital-first approach",
    targetKpis: [
      "100 tech-industry leaders",
      "$150K quarterly volume",
      "80% digital enrollment",
    ],
    kpiSnapshot: {
      volume: 178000,
      volumeChange: 45.2,
      leaderActivations: 124,
      activationsChange: 24,
      retention: 82,
      retentionChange: 7,
    },
    notes:
      "Highly successful launch. Exceeded all targets. Learnings being applied to Hyderabad initiative.",
  },
  {
    id: "GE-006",
    name: "Thailand Rural Expansion",
    type: "Country Expansion",
    market: "Thailand",
    marketType: "Country",
    owner: "Somchai Phan",
    startDate: "2026-03-01",
    status: "Planned",
    objective:
      "Extend reach beyond Bangkok to Chiang Mai, Phuket, and Pattaya",
    targetKpis: [
      "3 new city launches",
      "200 rural leaders",
      "$100K combined volume",
    ],
    kpiSnapshot: {
      volume: 0,
      volumeChange: 0,
      leaderActivations: 0,
      activationsChange: 0,
      retention: 0,
      retentionChange: 0,
    },
    notes:
      "Planning phase. Local partnerships being finalized. Training materials being translated.",
  },
  {
    id: "GE-007",
    name: "Elite Mentorship Program",
    type: "Leadership Promotion",
    market: "Philippines",
    marketType: "Country",
    owner: "Maria Santos",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    status: "Completed",
    objective: "Pair emerging leaders with top performers for accelerated growth",
    targetKpis: [
      "50 mentor-mentee pairs",
      "60% mentee rank advancement",
      "95% program satisfaction",
    ],
    kpiSnapshot: {
      volume: 425000,
      volumeChange: 32.1,
      leaderActivations: 47,
      activationsChange: 32,
      retention: 88,
      retentionChange: 12,
    },
    notes:
      "Program exceeded expectations. 68% mentee advancement rate. Scaling to Malaysia in Q2.",
  },
  {
    id: "GE-008",
    name: "Mumbai West Expansion",
    type: "City Launch",
    market: "Mumbai",
    marketType: "City",
    owner: "Amit Patel",
    startDate: "2026-02-15",
    status: "Planned",
    objective:
      "Expand into Andheri, Bandra, and Juhu areas with premium positioning",
    targetKpis: [
      "75 leaders in 60 days",
      "$80K monthly volume",
      "High-income demographic",
    ],
    kpiSnapshot: {
      volume: 0,
      volumeChange: 0,
      leaderActivations: 0,
      activationsChange: 0,
      retention: 0,
      retentionChange: 0,
    },
    notes:
      "Venue partnerships confirmed. Launch event scheduled for Feb 15. Pre-registration at 45 leaders.",
  },
  {
    id: "GE-009",
    name: "Q4 Retention Blitz",
    type: "Special Growth Campaign",
    market: "India",
    marketType: "Country",
    owner: "Retention Team",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    status: "Completed",
    objective:
      "Improve 30-day retention from 65% to 75% through enhanced onboarding",
    targetKpis: [
      "75% 30-day retention",
      "Reduce first-week churn by 50%",
      "100% onboarding call completion",
    ],
    kpiSnapshot: {
      volume: 2100000,
      volumeChange: 15.8,
      leaderActivations: 890,
      activationsChange: -12,
      retention: 76,
      retentionChange: 11,
    },
    notes:
      "Retention target achieved and exceeded. New onboarding process now standard. Activation dip being addressed.",
  },
  {
    id: "GE-010",
    name: "Singapore Premium Launch",
    type: "Country Expansion",
    market: "Singapore",
    marketType: "Country",
    owner: "Wei Lin",
    startDate: "2025-12-01",
    status: "On Hold",
    objective:
      "Enter Singapore market with premium product line and high-net-worth targeting",
    targetKpis: [
      "50 premium leaders",
      "$250K quarterly volume",
      "Corporate partnerships",
    ],
    kpiSnapshot: {
      volume: 35000,
      volumeChange: -15.2,
      leaderActivations: 18,
      activationsChange: -5,
      retention: 62,
      retentionChange: -8,
    },
    notes:
      "On hold due to regulatory review. Expected restart in Q2 2026. Existing leaders being supported.",
  },
];

// -----------------------------------------------------------------------------
// Mock Data - Campaigns
// -----------------------------------------------------------------------------

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "CMP-001",
    name: "Chinese New Year Mega Drive",
    market: "Southeast Asia",
    startDate: "2026-01-20",
    endDate: "2026-02-15",
    duration: "27 days",
    primaryObjective: "30% volume increase during festive period",
    status: "Active",
    beforeKpis: {
      volume: 980000,
      activations: 245,
      retention: 73,
    },
    afterKpis: {
      volume: 1250000,
      activations: 342,
      retention: 71,
    },
    trendData: [
      { period: "Pre-1", volume: 920000, activations: 230, retention: 72 },
      { period: "Pre-2", volume: 980000, activations: 245, retention: 73 },
      { period: "Week 1", volume: 1050000, activations: 290, retention: 74 },
      { period: "Week 2", volume: 1180000, activations: 320, retention: 72 },
      { period: "Week 3", volume: 1250000, activations: 342, retention: 71 },
      { period: "Week 4", volume: 1280000, activations: 355, retention: 72 },
    ],
    checkpoints: [
      {
        label: "7 Days",
        volume: 1050000,
        volumeVsPreCampaign: 7.1,
        activations: 290,
        retention: 74,
      },
      {
        label: "30 Days",
        volume: 1280000,
        volumeVsPreCampaign: 30.6,
        activations: 355,
        retention: 72,
      },
      {
        label: "60 Days",
        volume: 0,
        volumeVsPreCampaign: 0,
        activations: 0,
        retention: 0,
      },
    ],
  },
  {
    id: "CMP-002",
    name: "India Diwali Super Sale",
    market: "India",
    startDate: "2025-10-15",
    endDate: "2025-11-15",
    duration: "31 days",
    primaryObjective: "Drive new enrollments with festive bonuses",
    status: "Completed",
    beforeKpis: {
      volume: 1850000,
      activations: 420,
      retention: 68,
    },
    afterKpis: {
      volume: 2450000,
      activations: 680,
      retention: 72,
    },
    trendData: [
      { period: "Pre-1", volume: 1780000, activations: 400, retention: 67 },
      { period: "Pre-2", volume: 1850000, activations: 420, retention: 68 },
      { period: "Week 1", volume: 2100000, activations: 520, retention: 70 },
      { period: "Week 2", volume: 2350000, activations: 620, retention: 71 },
      { period: "Week 3", volume: 2450000, activations: 680, retention: 72 },
      { period: "Week 4", volume: 2380000, activations: 650, retention: 73 },
      { period: "Post-1", volume: 2200000, activations: 480, retention: 74 },
      { period: "Post-2", volume: 2050000, activations: 440, retention: 73 },
    ],
    checkpoints: [
      {
        label: "7 Days",
        volume: 2100000,
        volumeVsPreCampaign: 13.5,
        activations: 520,
        retention: 70,
      },
      {
        label: "30 Days",
        volume: 2380000,
        volumeVsPreCampaign: 28.6,
        activations: 650,
        retention: 73,
      },
      {
        label: "60 Days",
        volume: 2050000,
        volumeVsPreCampaign: 10.8,
        activations: 440,
        retention: 73,
      },
    ],
  },
  {
    id: "CMP-003",
    name: "New Year Kickstart",
    market: "Philippines",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    duration: "31 days",
    primaryObjective: "Re-engage inactive leaders",
    status: "Completed",
    beforeKpis: {
      volume: 320000,
      activations: 85,
      retention: 64,
    },
    afterKpis: {
      volume: 410000,
      activations: 120,
      retention: 71,
    },
    trendData: [
      { period: "Pre-1", volume: 310000, activations: 80, retention: 63 },
      { period: "Pre-2", volume: 320000, activations: 85, retention: 64 },
      { period: "Week 1", volume: 350000, activations: 95, retention: 66 },
      { period: "Week 2", volume: 380000, activations: 108, retention: 68 },
      { period: "Week 3", volume: 400000, activations: 115, retention: 70 },
      { period: "Week 4", volume: 410000, activations: 120, retention: 71 },
      { period: "Post-1", volume: 395000, activations: 105, retention: 72 },
    ],
    checkpoints: [
      {
        label: "7 Days",
        volume: 350000,
        volumeVsPreCampaign: 9.4,
        activations: 95,
        retention: 66,
      },
      {
        label: "30 Days",
        volume: 410000,
        volumeVsPreCampaign: 28.1,
        activations: 120,
        retention: 71,
      },
      {
        label: "60 Days",
        volume: 395000,
        volumeVsPreCampaign: 23.4,
        activations: 105,
        retention: 72,
      },
    ],
  },
  {
    id: "CMP-004",
    name: "Summer Wellness Push",
    market: "Indonesia",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    duration: "31 days",
    primaryObjective: "Launch new wellness product line",
    status: "Planned",
    beforeKpis: {
      volume: 580000,
      activations: 145,
      retention: 69,
    },
    afterKpis: {
      volume: 0,
      activations: 0,
      retention: 0,
    },
    trendData: [],
    checkpoints: [],
  },
  {
    id: "CMP-005",
    name: "Retention Rescue Program",
    market: "India",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    duration: "30 days",
    primaryObjective: "Reduce first-month churn by 40%",
    status: "Completed",
    beforeKpis: {
      volume: 1650000,
      activations: 380,
      retention: 58,
    },
    afterKpis: {
      volume: 1720000,
      activations: 365,
      retention: 72,
    },
    trendData: [
      { period: "Pre-1", volume: 1600000, activations: 370, retention: 56 },
      { period: "Pre-2", volume: 1650000, activations: 380, retention: 58 },
      { period: "Week 1", volume: 1680000, activations: 375, retention: 62 },
      { period: "Week 2", volume: 1700000, activations: 370, retention: 66 },
      { period: "Week 3", volume: 1710000, activations: 368, retention: 69 },
      { period: "Week 4", volume: 1720000, activations: 365, retention: 72 },
      { period: "Post-1", volume: 1750000, activations: 390, retention: 74 },
      { period: "Post-2", volume: 1800000, activations: 420, retention: 75 },
    ],
    checkpoints: [
      {
        label: "7 Days",
        volume: 1680000,
        volumeVsPreCampaign: 1.8,
        activations: 375,
        retention: 62,
      },
      {
        label: "30 Days",
        volume: 1720000,
        volumeVsPreCampaign: 4.2,
        activations: 365,
        retention: 72,
      },
      {
        label: "60 Days",
        volume: 1800000,
        volumeVsPreCampaign: 9.1,
        activations: 420,
        retention: 75,
      },
    ],
  },
  {
    id: "CMP-006",
    name: "Leadership Fast Track",
    market: "Malaysia",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    duration: "45 days",
    primaryObjective: "Accelerate 50 leaders to next rank",
    status: "Completed",
    beforeKpis: {
      volume: 420000,
      activations: 95,
      retention: 70,
    },
    afterKpis: {
      volume: 580000,
      activations: 142,
      retention: 78,
    },
    trendData: [
      { period: "Pre-1", volume: 400000, activations: 90, retention: 69 },
      { period: "Pre-2", volume: 420000, activations: 95, retention: 70 },
      { period: "Week 1", volume: 450000, activations: 105, retention: 72 },
      { period: "Week 2", volume: 490000, activations: 118, retention: 74 },
      { period: "Week 3", volume: 530000, activations: 128, retention: 75 },
      { period: "Week 4", volume: 560000, activations: 135, retention: 76 },
      { period: "Week 5", volume: 575000, activations: 140, retention: 77 },
      { period: "Week 6", volume: 580000, activations: 142, retention: 78 },
      { period: "Post-1", volume: 560000, activations: 130, retention: 79 },
    ],
    checkpoints: [
      {
        label: "7 Days",
        volume: 450000,
        volumeVsPreCampaign: 7.1,
        activations: 105,
        retention: 72,
      },
      {
        label: "30 Days",
        volume: 560000,
        volumeVsPreCampaign: 33.3,
        activations: 135,
        retention: 76,
      },
      {
        label: "60 Days",
        volume: 560000,
        volumeVsPreCampaign: 33.3,
        activations: 130,
        retention: 79,
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Filter Options
// -----------------------------------------------------------------------------

export const GROWTH_EVENT_TYPE_OPTIONS = [
  "All",
  "City Launch",
  "Country Expansion",
  "Leadership Promotion",
  "Special Growth Campaign",
] as const;

export const GROWTH_EVENT_STATUS_OPTIONS = [
  "All",
  "Planned",
  "In Progress",
  "Completed",
  "On Hold",
] as const;

export const CAMPAIGN_STATUS_OPTIONS = [
  "All",
  "Planned",
  "Active",
  "Completed",
  "Cancelled",
] as const;
