// =============================================================================
// Alerts & Interventions Mock Data
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AlertType =
  | "Stagnation"
  | "Drop"
  | "Communication Gap"
  | "Attendance"
  | "Retention";

export type AlertSeverity = "Low" | "Medium" | "High";

export type AlertStatus = "Active" | "Under Review" | "Resolved" | "Dismissed";

export type TargetType = "Leader" | "City" | "Country";

export interface Alert {
  id: string;
  type: AlertType;
  targetName: string;
  targetType: TargetType;
  severity: AlertSeverity;
  reason: string;
  triggerRule: string;
  explainableText: string;
  affectedMetrics: string[];
  createdDate: string;
  status: AlertStatus;
  linkedInterventionId?: string;
}

export type InterventionStatus =
  | "Open"
  | "In Progress"
  | "Blocked"
  | "Resolved"
  | "Ignored";

export interface InterventionTimelineEvent {
  date: string;
  action: string;
  user: string;
}

export interface Intervention {
  id: string;
  targetName: string;
  targetType: TargetType;
  alertType: AlertType;
  assignedOwner: string;
  status: InterventionStatus;
  dueDate: string;
  lastUpdated: string;
  summary: string;
  actionPlan: string[];
  timeline: InterventionTimelineEvent[];
  linkedAlertIds: string[];
  resolutionReason?: string;
}

export type AuditAction =
  | "Alert Created"
  | "Alert Status Changed"
  | "Intervention Created"
  | "Intervention Updated"
  | "Intervention Resolved"
  | "Owner Assigned"
  | "Note Added";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  target: string;
  beforeAfter: string;
}

export interface AlertSummaryMetrics {
  totalActive: number;
  highSeverity: number;
  createdThisWeek: number;
  resolved: number;
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------

export const MOCK_ALERTS: Alert[] = [
  {
    id: "ALT-001",
    type: "Stagnation",
    targetName: "Rajesh Kumar",
    targetType: "Leader",
    severity: "High",
    reason: "Volume flat for 21 consecutive days",
    triggerRule: "Volume change < 2% over 21 days",
    explainableText:
      "Rajesh Kumar's team has shown no meaningful volume growth in the past 3 weeks. This is unusual given their historical 8% weekly average growth rate.",
    affectedMetrics: ["Daily Volume", "New Enrollments", "Active Distributors"],
    createdDate: "2026-01-28",
    status: "Active",
    linkedInterventionId: "INT-001",
  },
  {
    id: "ALT-002",
    type: "Drop",
    targetName: "Mumbai",
    targetType: "City",
    severity: "High",
    reason: "35% volume drop vs previous week",
    triggerRule: "Week-over-week volume drop > 25%",
    explainableText:
      "Mumbai region experienced a significant decline in volume compared to the previous week. Multiple leaders in this market are underperforming.",
    affectedMetrics: ["Weekly Volume", "Order Count", "Average Order Value"],
    createdDate: "2026-01-30",
    status: "Active",
  },
  {
    id: "ALT-003",
    type: "Communication Gap",
    targetName: "Priya Sharma",
    targetType: "Leader",
    severity: "Medium",
    reason: "Not contacted in 18 days",
    triggerRule: "No contact recorded in 14+ days",
    explainableText:
      "Priya Sharma has not been contacted by their upline or regional manager in over 2 weeks. Historical data shows leaders who go uncontacted for this long have 40% higher churn risk.",
    affectedMetrics: ["Contact Frequency", "Engagement Score"],
    createdDate: "2026-01-25",
    status: "Under Review",
    linkedInterventionId: "INT-002",
  },
  {
    id: "ALT-004",
    type: "Attendance",
    targetName: "Amit Patel",
    targetType: "Leader",
    severity: "Medium",
    reason: "Missed 4 consecutive weekly calls",
    triggerRule: "Missed 3+ consecutive scheduled calls",
    explainableText:
      "Amit Patel has not attended the last 4 weekly leadership calls. Engagement appears to be declining.",
    affectedMetrics: ["Call Attendance Rate", "Engagement Score"],
    createdDate: "2026-01-27",
    status: "Active",
  },
  {
    id: "ALT-005",
    type: "Retention",
    targetName: "Delhi NCR",
    targetType: "City",
    severity: "High",
    reason: "Retention dropped to 62% (threshold: 70%)",
    triggerRule: "30-day retention < 70%",
    explainableText:
      "Delhi NCR region's retention rate has fallen below the acceptable threshold. Early churn indicators suggest new distributor onboarding quality may be an issue.",
    affectedMetrics: ["30-Day Retention", "Churn Rate", "New Distributor Activity"],
    createdDate: "2026-01-29",
    status: "Active",
    linkedInterventionId: "INT-003",
  },
  {
    id: "ALT-006",
    type: "Stagnation",
    targetName: "Indonesia",
    targetType: "Country",
    severity: "Medium",
    reason: "National volume flat for 14 days",
    triggerRule: "Country-level volume change < 5% over 14 days",
    explainableText:
      "Indonesia as a whole has shown minimal growth. Top leaders are maintaining volume but new leader development has stalled.",
    affectedMetrics: ["National Volume", "Leader Count", "New Enrollments"],
    createdDate: "2026-01-31",
    status: "Active",
  },
  {
    id: "ALT-007",
    type: "Drop",
    targetName: "Sanjay Verma",
    targetType: "Leader",
    severity: "Low",
    reason: "18% volume drop vs previous month",
    triggerRule: "Month-over-month volume drop > 15%",
    explainableText:
      "Sanjay Verma's volume has decreased moderately. This may be seasonal or temporary but warrants monitoring.",
    affectedMetrics: ["Monthly Volume", "Team Size"],
    createdDate: "2026-02-01",
    status: "Active",
  },
  {
    id: "ALT-008",
    type: "Communication Gap",
    targetName: "Anita Desai",
    targetType: "Leader",
    severity: "Low",
    reason: "Not contacted in 10 days",
    triggerRule: "No contact recorded in 14+ days",
    explainableText:
      "Anita Desai is approaching the contact threshold. Recommend proactive outreach to maintain engagement.",
    affectedMetrics: ["Contact Frequency"],
    createdDate: "2026-02-02",
    status: "Resolved",
  },
  {
    id: "ALT-009",
    type: "Retention",
    targetName: "Philippines",
    targetType: "Country",
    severity: "Medium",
    reason: "Retention dropped to 68% (threshold: 70%)",
    triggerRule: "30-day retention < 70%",
    explainableText:
      "Philippines retention is slightly below threshold. The trend is concerning but not critical yet.",
    affectedMetrics: ["30-Day Retention", "Churn Rate"],
    createdDate: "2026-01-26",
    status: "Dismissed",
  },
  {
    id: "ALT-010",
    type: "Attendance",
    targetName: "Bangalore",
    targetType: "City",
    severity: "Medium",
    reason: "Regional call attendance dropped to 45%",
    triggerRule: "Regional call attendance < 50%",
    explainableText:
      "Bangalore region's attendance at scheduled calls has dropped significantly. This may indicate disengagement or scheduling conflicts.",
    affectedMetrics: ["Call Attendance Rate", "Active Participation"],
    createdDate: "2026-01-30",
    status: "Under Review",
  },
];

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: "INT-001",
    targetName: "Rajesh Kumar",
    targetType: "Leader",
    alertType: "Stagnation",
    assignedOwner: "Vikram Singh",
    status: "In Progress",
    dueDate: "2026-02-10",
    lastUpdated: "2026-02-02",
    summary:
      "Re-engagement plan for Rajesh Kumar to address 3-week stagnation period",
    actionPlan: [
      "Schedule 1-on-1 call to understand challenges",
      "Review team structure and identify weak links",
      "Provide targeted training resources",
      "Set 7-day and 14-day volume targets",
      "Daily check-in for first week",
    ],
    timeline: [
      {
        date: "2026-01-28",
        action: "Intervention created from stagnation alert",
        user: "System",
      },
      {
        date: "2026-01-29",
        action: "Assigned to Vikram Singh",
        user: "Admin",
      },
      {
        date: "2026-01-30",
        action: "Initial call completed - identified team morale issues",
        user: "Vikram Singh",
      },
      {
        date: "2026-02-02",
        action: "Training session scheduled for Feb 5",
        user: "Vikram Singh",
      },
    ],
    linkedAlertIds: ["ALT-001"],
  },
  {
    id: "INT-002",
    targetName: "Priya Sharma",
    targetType: "Leader",
    alertType: "Communication Gap",
    assignedOwner: "Neha Gupta",
    status: "Open",
    dueDate: "2026-02-05",
    lastUpdated: "2026-01-31",
    summary: "Establish regular contact rhythm with Priya Sharma",
    actionPlan: [
      "Immediate outreach call",
      "Understand reason for gap",
      "Set up weekly check-in schedule",
      "Add to priority contact list",
    ],
    timeline: [
      {
        date: "2026-01-31",
        action: "Intervention created from communication gap alert",
        user: "System",
      },
      {
        date: "2026-01-31",
        action: "Assigned to Neha Gupta",
        user: "Admin",
      },
    ],
    linkedAlertIds: ["ALT-003"],
  },
  {
    id: "INT-003",
    targetName: "Delhi NCR",
    targetType: "City",
    alertType: "Retention",
    assignedOwner: "Regional Team",
    status: "In Progress",
    dueDate: "2026-02-15",
    lastUpdated: "2026-02-01",
    summary: "Delhi NCR retention improvement initiative",
    actionPlan: [
      "Analyze churn data to identify root causes",
      "Review onboarding process for new distributors",
      "Implement 7-day new distributor check-in program",
      "Launch re-engagement campaign for at-risk members",
      "Weekly progress review with regional managers",
    ],
    timeline: [
      {
        date: "2026-01-29",
        action: "Intervention created from retention alert",
        user: "System",
      },
      {
        date: "2026-01-30",
        action: "Assigned to Regional Team",
        user: "Admin",
      },
      {
        date: "2026-02-01",
        action: "Root cause analysis completed - onboarding gaps identified",
        user: "Regional Team",
      },
    ],
    linkedAlertIds: ["ALT-005"],
  },
  {
    id: "INT-004",
    targetName: "Suresh Reddy",
    targetType: "Leader",
    alertType: "Drop",
    assignedOwner: "Kavitha Rao",
    status: "Resolved",
    dueDate: "2026-01-25",
    lastUpdated: "2026-01-28",
    summary: "Address sudden volume drop for Suresh Reddy",
    actionPlan: [
      "Emergency call to understand situation",
      "Provide immediate support",
      "Monitor daily for recovery",
    ],
    timeline: [
      {
        date: "2026-01-20",
        action: "Intervention created from drop alert",
        user: "System",
      },
      {
        date: "2026-01-21",
        action: "Assigned to Kavitha Rao",
        user: "Admin",
      },
      {
        date: "2026-01-22",
        action: "Call completed - personal emergency was cause",
        user: "Kavitha Rao",
      },
      {
        date: "2026-01-28",
        action: "Volume recovered to normal levels",
        user: "Kavitha Rao",
      },
    ],
    linkedAlertIds: [],
    resolutionReason: "Volume recovered after personal situation resolved",
  },
  {
    id: "INT-005",
    targetName: "Chennai",
    targetType: "City",
    alertType: "Attendance",
    assignedOwner: "Mohan Kumar",
    status: "Blocked",
    dueDate: "2026-02-08",
    lastUpdated: "2026-01-31",
    summary: "Improve call attendance in Chennai region",
    actionPlan: [
      "Survey leaders on scheduling preferences",
      "Adjust call timings if needed",
      "Implement reminder system",
      "Create accountability pairs",
    ],
    timeline: [
      {
        date: "2026-01-27",
        action: "Intervention created",
        user: "Admin",
      },
      {
        date: "2026-01-28",
        action: "Survey sent to 45 leaders",
        user: "Mohan Kumar",
      },
      {
        date: "2026-01-31",
        action: "Blocked - waiting for survey responses (only 12% response rate)",
        user: "Mohan Kumar",
      },
    ],
    linkedAlertIds: [],
  },
  {
    id: "INT-006",
    targetName: "Meera Joshi",
    targetType: "Leader",
    alertType: "Stagnation",
    assignedOwner: "Arjun Nair",
    status: "Ignored",
    dueDate: "2026-01-20",
    lastUpdated: "2026-01-22",
    summary: "Stagnation intervention for Meera Joshi",
    actionPlan: [
      "Review performance trends",
      "Identify growth opportunities",
    ],
    timeline: [
      {
        date: "2026-01-15",
        action: "Intervention created",
        user: "System",
      },
      {
        date: "2026-01-22",
        action: "Marked as ignored - leader on planned break",
        user: "Arjun Nair",
      },
    ],
    linkedAlertIds: [],
    resolutionReason: "Leader is on a planned 1-month break, will re-evaluate upon return",
  },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "AUD-001",
    timestamp: "2026-02-02 14:32:00",
    user: "Vikram Singh",
    action: "Intervention Updated",
    target: "INT-001 (Rajesh Kumar)",
    beforeAfter: "Added note: Training session scheduled for Feb 5",
  },
  {
    id: "AUD-002",
    timestamp: "2026-02-02 10:15:00",
    user: "System",
    action: "Alert Created",
    target: "ALT-010 (Bangalore)",
    beforeAfter: "New attendance alert created",
  },
  {
    id: "AUD-003",
    timestamp: "2026-02-01 16:45:00",
    user: "Admin",
    action: "Alert Status Changed",
    target: "ALT-008 (Anita Desai)",
    beforeAfter: "Status: Active → Resolved",
  },
  {
    id: "AUD-004",
    timestamp: "2026-02-01 11:20:00",
    user: "Regional Team",
    action: "Note Added",
    target: "INT-003 (Delhi NCR)",
    beforeAfter: "Added root cause analysis findings",
  },
  {
    id: "AUD-005",
    timestamp: "2026-01-31 09:00:00",
    user: "Admin",
    action: "Owner Assigned",
    target: "INT-002 (Priya Sharma)",
    beforeAfter: "Owner: Unassigned → Neha Gupta",
  },
  {
    id: "AUD-006",
    timestamp: "2026-01-31 08:55:00",
    user: "System",
    action: "Intervention Created",
    target: "INT-002 (Priya Sharma)",
    beforeAfter: "Created from alert ALT-003",
  },
  {
    id: "AUD-007",
    timestamp: "2026-01-30 17:30:00",
    user: "Mohan Kumar",
    action: "Intervention Updated",
    target: "INT-005 (Chennai)",
    beforeAfter: "Status: In Progress → Blocked",
  },
  {
    id: "AUD-008",
    timestamp: "2026-01-30 14:00:00",
    user: "Vikram Singh",
    action: "Note Added",
    target: "INT-001 (Rajesh Kumar)",
    beforeAfter: "Added call notes: identified team morale issues",
  },
  {
    id: "AUD-009",
    timestamp: "2026-01-29 11:30:00",
    user: "Admin",
    action: "Owner Assigned",
    target: "INT-001 (Rajesh Kumar)",
    beforeAfter: "Owner: Unassigned → Vikram Singh",
  },
  {
    id: "AUD-010",
    timestamp: "2026-01-28 16:00:00",
    user: "System",
    action: "Alert Created",
    target: "ALT-001 (Rajesh Kumar)",
    beforeAfter: "New stagnation alert created",
  },
  {
    id: "AUD-011",
    timestamp: "2026-01-28 15:45:00",
    user: "Kavitha Rao",
    action: "Intervention Resolved",
    target: "INT-004 (Suresh Reddy)",
    beforeAfter: "Status: In Progress → Resolved",
  },
  {
    id: "AUD-012",
    timestamp: "2026-01-26 10:00:00",
    user: "Admin",
    action: "Alert Status Changed",
    target: "ALT-009 (Philippines)",
    beforeAfter: "Status: Active → Dismissed",
  },
];

export const MOCK_ALERT_SUMMARY: AlertSummaryMetrics = {
  totalActive: 7,
  highSeverity: 3,
  createdThisWeek: 4,
  resolved: 2,
};

// -----------------------------------------------------------------------------
// Filter Options
// -----------------------------------------------------------------------------

export const ALERT_SEVERITY_OPTIONS = ["All", "Low", "Medium", "High"] as const;

export const ALERT_TYPE_OPTIONS = [
  "All",
  "Stagnation",
  "Drop",
  "Communication Gap",
  "Attendance",
  "Retention",
] as const;

export const ALERT_STATUS_OPTIONS = [
  "All",
  "Active",
  "Under Review",
  "Resolved",
  "Dismissed",
] as const;

export const INTERVENTION_STATUS_OPTIONS = [
  "All",
  "Open",
  "In Progress",
  "Blocked",
  "Resolved",
  "Ignored",
] as const;

export const AUDIT_ACTION_OPTIONS = [
  "All",
  "Alert Created",
  "Alert Status Changed",
  "Intervention Created",
  "Intervention Updated",
  "Intervention Resolved",
  "Owner Assigned",
  "Note Added",
] as const;

export const AUDIT_USER_OPTIONS = [
  "All",
  "System",
  "Admin",
  "Vikram Singh",
  "Neha Gupta",
  "Kavitha Rao",
  "Mohan Kumar",
  "Regional Team",
  "Arjun Nair",
] as const;
