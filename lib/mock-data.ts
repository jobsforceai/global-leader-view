// Types for Command Center page

export interface VolumeDataPoint {
  date: string;
  value: number;
}

export interface LeaderSnapshot {
  id: string;
  name: string;
  country: string;
  city: string;
  growthPercent?: number;
  daysStagnant?: number;
  reasonTag?: string;
}

export interface MarketAlert {
  id: string;
  market: string;
  country: string;
  city: string;
  alertType: string;
  severity: "low" | "medium" | "high";
  reason: string;
  assignedOwner: string;
  status: "open" | "in-progress" | "resolved";
}

export interface CommunicationMetrics {
  contactedLast7Days: number;
  contactedLast14Days: number;
  contactedLast30Days: number;
  overdueFollowups: number;
  totalLeaders: number;
}

export interface WeeklyCallsMetrics {
  attendancePercent: number;
  lastWeekAttendancePercent: number;
  noShowCount: number;
  missedConsecutiveCount: number;
}

// Mock Volume Data - Daily
export const MOCK_VOLUME_DAILY: VolumeDataPoint[] = [
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

// Mock Volume Data - Weekly
export const MOCK_VOLUME_WEEKLY: VolumeDataPoint[] = [
  { date: "W1 Dec", value: 5200000 },
  { date: "W2 Dec", value: 5800000 },
  { date: "W3 Dec", value: 6100000 },
  { date: "W4 Dec", value: 5900000 },
  { date: "W1 Jan", value: 6400000 },
  { date: "W2 Jan", value: 6800000 },
  { date: "W3 Jan", value: 7200000 },
  { date: "W4 Jan", value: 7800000 },
];

// Mock Volume Data - Monthly
export const MOCK_VOLUME_MONTHLY: VolumeDataPoint[] = [
  { date: "Aug", value: 18500000 },
  { date: "Sep", value: 19200000 },
  { date: "Oct", value: 20100000 },
  { date: "Nov", value: 21800000 },
  { date: "Dec", value: 23400000 },
  { date: "Jan", value: 24500000 },
];

// Mock Top Growing Leaders
export const MOCK_TOP_LEADERS: LeaderSnapshot[] = [
  { id: "1", name: "Maria Santos", country: "Brazil", city: "São Paulo", growthPercent: 47.2 },
  { id: "2", name: "James Chen", country: "Singapore", city: "Singapore", growthPercent: 38.5 },
  { id: "3", name: "Priya Sharma", country: "India", city: "Mumbai", growthPercent: 34.8 },
  { id: "4", name: "Michael Brown", country: "USA", city: "Miami", growthPercent: 29.3 },
  { id: "5", name: "Ana Rodriguez", country: "Mexico", city: "Mexico City", growthPercent: 26.7 },
];

// Mock Stagnating Leaders
export const MOCK_STAGNATING_LEADERS: LeaderSnapshot[] = [
  { id: "6", name: "John Smith", country: "USA", city: "Chicago", daysStagnant: 45, reasonTag: "Low Volume" },
  { id: "7", name: "Sarah Johnson", country: "UK", city: "London", daysStagnant: 38, reasonTag: "No Reinvestment" },
  { id: "8", name: "David Lee", country: "Canada", city: "Toronto", daysStagnant: 32, reasonTag: "Team Attrition" },
  { id: "9", name: "Emma Wilson", country: "Australia", city: "Sydney", daysStagnant: 28, reasonTag: "Low Volume" },
  { id: "10", name: "Robert Taylor", country: "Germany", city: "Berlin", daysStagnant: 24, reasonTag: "No Reinvestment" },
];

// Mock Market Alerts
export const MOCK_MARKET_ALERTS: MarketAlert[] = [
  {
    id: "1",
    market: "Brazil - São Paulo",
    country: "Brazil",
    city: "São Paulo",
    alertType: "Volume Drop",
    severity: "high",
    reason: "30% decline in weekly volume",
    assignedOwner: "Carlos Mendez",
    status: "open",
  },
  {
    id: "2",
    market: "India - Delhi",
    country: "India",
    city: "Delhi",
    alertType: "Leader Churn",
    severity: "high",
    reason: "5 leaders inactive this month",
    assignedOwner: "Raj Patel",
    status: "in-progress",
  },
  {
    id: "3",
    market: "USA - Houston",
    country: "USA",
    city: "Houston",
    alertType: "Reinvestment Low",
    severity: "medium",
    reason: "Reinvestment ratio below 50%",
    assignedOwner: "Mike Thompson",
    status: "open",
  },
  {
    id: "4",
    market: "UK - Manchester",
    country: "UK",
    city: "Manchester",
    alertType: "Communication Gap",
    severity: "medium",
    reason: "No calls in 3 weeks",
    assignedOwner: "Sarah Mitchell",
    status: "in-progress",
  },
  {
    id: "5",
    market: "Mexico - Guadalajara",
    country: "Mexico",
    city: "Guadalajara",
    alertType: "Growth Stall",
    severity: "low",
    reason: "Flat growth for 2 weeks",
    assignedOwner: "Ana Ruiz",
    status: "open",
  },
  {
    id: "6",
    market: "Canada - Vancouver",
    country: "Canada",
    city: "Vancouver",
    alertType: "Volume Drop",
    severity: "low",
    reason: "10% decline in monthly volume",
    assignedOwner: "David Wong",
    status: "resolved",
  },
];

// Mock Communication Metrics
export const MOCK_COMMUNICATION_METRICS: CommunicationMetrics = {
  contactedLast7Days: 72,
  contactedLast14Days: 84,
  contactedLast30Days: 91,
  overdueFollowups: 23,
  totalLeaders: 8432,
};

// Mock Weekly Calls Metrics
export const MOCK_WEEKLY_CALLS: WeeklyCallsMetrics = {
  attendancePercent: 87,
  lastWeekAttendancePercent: 82,
  noShowCount: 14,
  missedConsecutiveCount: 6,
};

// ============================================
// Communication & Calls Page Types & Mock Data
// ============================================

export interface LeaderContact {
  id: string;
  name: string;
  role: string;
  market: string;
  country: string;
  city: string;
  daysSinceLastContact: number;
  preferredChannel: "WhatsApp" | "Telegram" | "Phone" | "Email" | "Zoom";
  businessVolume?: number;
  lastContactDate: string;
}

export interface WeeklyCall {
  id: string;
  dateTime: string;
  callName: string;
  requiredRoles: string[];
  attendancePercent: number;
  meetingLink: string;
  attendees: CallAttendee[];
  actionItems: ActionItem[];
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

// Mock Leaders Not Contacted
export const MOCK_LEADERS_NOT_CONTACTED: LeaderContact[] = [
  { id: "nc1", name: "Thomas Wright", role: "Regional Director", market: "USA - Dallas", country: "USA", city: "Dallas", daysSinceLastContact: 21, preferredChannel: "Phone", lastContactDate: "2026-01-13" },
  { id: "nc2", name: "Lisa Chen", role: "Team Lead", market: "Canada - Calgary", country: "Canada", city: "Calgary", daysSinceLastContact: 18, preferredChannel: "WhatsApp", lastContactDate: "2026-01-16" },
  { id: "nc3", name: "Marco Rossi", role: "Senior Leader", market: "Italy - Rome", country: "Italy", city: "Rome", daysSinceLastContact: 16, preferredChannel: "Telegram", lastContactDate: "2026-01-18" },
  { id: "nc4", name: "Yuki Tanaka", role: "Team Lead", market: "Japan - Osaka", country: "Japan", city: "Osaka", daysSinceLastContact: 15, preferredChannel: "Email", lastContactDate: "2026-01-19" },
  { id: "nc5", name: "Ahmed Hassan", role: "Regional Director", market: "UAE - Dubai", country: "UAE", city: "Dubai", daysSinceLastContact: 14, preferredChannel: "WhatsApp", lastContactDate: "2026-01-20" },
  { id: "nc6", name: "Sophie Martin", role: "Leader", market: "France - Lyon", country: "France", city: "Lyon", daysSinceLastContact: 12, preferredChannel: "Phone", lastContactDate: "2026-01-22" },
  { id: "nc7", name: "Carlos Mendez", role: "Senior Leader", market: "Spain - Barcelona", country: "Spain", city: "Barcelona", daysSinceLastContact: 11, preferredChannel: "Telegram", lastContactDate: "2026-01-23" },
];

// Mock High Volume Low Contact Leaders
export const MOCK_HIGH_VOLUME_LOW_CONTACT: LeaderContact[] = [
  { id: "hv1", name: "Maria Santos", role: "Regional Director", market: "Brazil - São Paulo", country: "Brazil", city: "São Paulo", daysSinceLastContact: 12, preferredChannel: "WhatsApp", businessVolume: 1250000, lastContactDate: "2026-01-22" },
  { id: "hv2", name: "James Chen", role: "Senior Leader", market: "Singapore", country: "Singapore", city: "Singapore", daysSinceLastContact: 10, preferredChannel: "Telegram", businessVolume: 980000, lastContactDate: "2026-01-24" },
  { id: "hv3", name: "Priya Sharma", role: "Team Lead", market: "India - Mumbai", country: "India", city: "Mumbai", daysSinceLastContact: 9, preferredChannel: "WhatsApp", businessVolume: 875000, lastContactDate: "2026-01-25" },
  { id: "hv4", name: "Michael Brown", role: "Regional Director", market: "USA - Miami", country: "USA", city: "Miami", daysSinceLastContact: 8, preferredChannel: "Phone", businessVolume: 720000, lastContactDate: "2026-01-26" },
  { id: "hv5", name: "Ana Rodriguez", role: "Leader", market: "Mexico - Mexico City", country: "Mexico", city: "Mexico City", daysSinceLastContact: 7, preferredChannel: "WhatsApp", businessVolume: 650000, lastContactDate: "2026-01-27" },
];

// Mock Weekly Calls List
export const MOCK_WEEKLY_CALLS_LIST: WeeklyCall[] = [
  {
    id: "wc1",
    dateTime: "2026-02-03T09:00:00",
    callName: "Global Leadership Sync",
    requiredRoles: ["CEO", "Regional Directors"],
    attendancePercent: 92,
    meetingLink: "https://zoom.us/j/xxx",
    attendees: [
      { id: "a1", name: "Sarah Johnson", present: true, participationScore: 3 },
      { id: "a2", name: "Michael Brown", present: true, participationScore: 2 },
      { id: "a3", name: "Maria Santos", present: true, participationScore: 3 },
      { id: "a4", name: "James Chen", present: false, participationScore: 0 },
      { id: "a5", name: "Priya Sharma", present: true, participationScore: 2 },
    ],
    actionItems: [
      { id: "ai1", description: "Review Q1 targets for APAC region", owner: "James Chen", status: "pending" },
      { id: "ai2", description: "Prepare retention report", owner: "Sarah Johnson", status: "completed" },
    ],
  },
  {
    id: "wc2",
    dateTime: "2026-01-27T09:00:00",
    callName: "Global Leadership Sync",
    requiredRoles: ["CEO", "Regional Directors"],
    attendancePercent: 85,
    meetingLink: "https://zoom.us/j/xxx",
    attendees: [
      { id: "a1", name: "Sarah Johnson", present: true, participationScore: 3 },
      { id: "a2", name: "Michael Brown", present: false, participationScore: 0 },
      { id: "a3", name: "Maria Santos", present: true, participationScore: 2 },
      { id: "a4", name: "James Chen", present: true, participationScore: 2 },
      { id: "a5", name: "Priya Sharma", present: true, participationScore: 1 },
    ],
    actionItems: [
      { id: "ai3", description: "Follow up with Brazil market", owner: "Maria Santos", status: "completed" },
    ],
  },
  {
    id: "wc3",
    dateTime: "2026-02-02T14:00:00",
    callName: "LATAM Regional Review",
    requiredRoles: ["Regional Directors", "Team Leads"],
    attendancePercent: 78,
    meetingLink: "https://zoom.us/j/yyy",
    attendees: [
      { id: "a6", name: "Maria Santos", present: true, participationScore: 3 },
      { id: "a7", name: "Ana Rodriguez", present: true, participationScore: 2 },
      { id: "a8", name: "Carlos Mendez", present: false, participationScore: 0 },
    ],
    actionItems: [
      { id: "ai4", description: "Expand to new cities in Colombia", owner: "Ana Rodriguez", status: "pending" },
    ],
  },
  {
    id: "wc4",
    dateTime: "2026-02-01T10:00:00",
    callName: "APAC Growth Strategy",
    requiredRoles: ["Regional Directors", "Team Leads"],
    attendancePercent: 95,
    meetingLink: "https://zoom.us/j/zzz",
    attendees: [
      { id: "a9", name: "James Chen", present: true, participationScore: 3 },
      { id: "a10", name: "Priya Sharma", present: true, participationScore: 3 },
      { id: "a11", name: "Yuki Tanaka", present: true, participationScore: 2 },
    ],
    actionItems: [
      { id: "ai5", description: "Launch India tier-2 cities pilot", owner: "Priya Sharma", status: "pending" },
    ],
  },
];

// Mock Follow-ups
export const MOCK_FOLLOWUPS: FollowUp[] = [
  { id: "f1", leaderId: "1", leaderName: "Maria Santos", taskDescription: "Review reinvestment plan for Q1", owner: "Carlos Mendez", dueDate: "2026-02-05", status: "open", source: "call" },
  { id: "f2", leaderId: "2", leaderName: "James Chen", taskDescription: "Schedule one-on-one for performance review", owner: "Sarah Johnson", dueDate: "2026-02-04", status: "open", source: "manual" },
  { id: "f3", leaderId: "3", leaderName: "Priya Sharma", taskDescription: "Confirm new team lead candidates", owner: "Raj Patel", dueDate: "2026-02-03", status: "open", source: "call" },
  { id: "f4", leaderId: "4", leaderName: "Michael Brown", taskDescription: "Address volume drop concerns", owner: "Mike Thompson", dueDate: "2026-02-01", status: "overdue", source: "alert" },
  { id: "f5", leaderId: "5", leaderName: "Ana Rodriguez", taskDescription: "Discuss expansion into Guatemala", owner: "Ana Ruiz", dueDate: "2026-01-30", status: "overdue", source: "call" },
  { id: "f6", leaderId: "6", leaderName: "Thomas Wright", taskDescription: "Re-engage after 3 week gap", owner: "Mike Thompson", dueDate: "2026-01-28", status: "overdue", source: "alert" },
  { id: "f7", leaderId: "7", leaderName: "Sarah Johnson", taskDescription: "Finalize EMEA strategy document", owner: "Sarah Mitchell", dueDate: "2026-01-25", status: "completed", source: "call" },
  { id: "f8", leaderId: "8", leaderName: "David Wong", taskDescription: "Onboard new Vancouver leaders", owner: "David Wong", dueDate: "2026-01-22", status: "completed", source: "manual" },
];

// Communication summary metrics (extended)
export const MOCK_COMMUNICATION_SUMMARY = {
  contactedLast7Days: 72,
  contactedLast14Days: 84,
  contactedLast30Days: 91,
  avgDaysSinceContact: 8.3,
  totalLeaders: 8432,
};
