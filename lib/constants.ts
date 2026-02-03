// Navigation routes for the sidebar
export const NAV_ROUTES = [
  {
    label: "Command Center",
    href: "/",
    icon: "LayoutDashboard",
  },
  {
    label: "Leadership Network",
    href: "/leadership",
    icon: "Users",
  },
  {
    label: "Communication & Calls",
    href: "/communication",
    icon: "Phone",
  },
  {
    label: "Business Intelligence",
    href: "/bi",
    icon: "BarChart3",
  },
  {
    label: "Growth & Expansion",
    href: "/growth",
    icon: "TrendingUp",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: "Megaphone",
  },
  {
    label: "Alerts & Interventions",
    href: "/alerts",
    icon: "Bell",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "Settings",
  },
] as const;

// KPI definitions for the sticky strip
export const KPI_DEFINITIONS = [
  {
    id: "global-business-volume",
    label: "Global Business Volume",
    format: "currency",
  },
  {
    id: "active-leader-count",
    label: "Active Leader Count",
    format: "number",
  },
  {
    id: "reinvestment-ratio",
    label: "Reinvestment Ratio",
    format: "percentage",
  },
  {
    id: "leader-retention",
    label: "Leader Retention",
    format: "percentage",
  },
  {
    id: "cities-added",
    label: "Cities Added",
    format: "number",
  },
  {
    id: "countries-added",
    label: "Countries Added",
    format: "number",
  },
  {
    id: "revenue-per-leader",
    label: "Revenue per Leader",
    format: "currency",
  },
] as const;

// Mock KPI data
export const MOCK_KPI_DATA = [
  {
    id: "global-business-volume",
    value: 24500000,
    trend: 12.5,
    trendDirection: "up" as const,
  },
  {
    id: "active-leader-count",
    value: 8432,
    trend: 8.3,
    trendDirection: "up" as const,
  },
  {
    id: "reinvestment-ratio",
    value: 67.2,
    trend: 2.1,
    trendDirection: "up" as const,
  },
  {
    id: "leader-retention",
    value: 94.8,
    trend: 1.2,
    trendDirection: "up" as const,
  },
  {
    id: "cities-added",
    value: 47,
    trend: 15.0,
    trendDirection: "up" as const,
  },
  {
    id: "countries-added",
    value: 3,
    trend: 0,
    trendDirection: "neutral" as const,
  },
  {
    id: "revenue-per-leader",
    value: 2908,
    trend: -2.3,
    trendDirection: "down" as const,
  },
];

// Time range filter options
export const TIME_RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 12 months", value: "12m" },
  { label: "Year to date", value: "ytd" },
  { label: "All time", value: "all" },
] as const;

// Geography filter options
export const GEOGRAPHY_OPTIONS = [
  { label: "Global", value: "global" },
  { label: "North America", value: "na" },
  { label: "Europe", value: "eu" },
  { label: "Asia Pacific", value: "apac" },
  { label: "Latin America", value: "latam" },
  { label: "Middle East & Africa", value: "mea" },
] as const;

// User roles
export const USER_ROLES = [
  "ceo",
  "executive",
  "regional_director",
  "manager",
  "analyst",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type NavRoute = (typeof NAV_ROUTES)[number];
export type KpiDefinition = (typeof KPI_DEFINITIONS)[number];
export type TimeRangeOption = (typeof TIME_RANGE_OPTIONS)[number];
export type GeographyOption = (typeof GEOGRAPHY_OPTIONS)[number];
