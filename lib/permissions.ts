import { UserRole } from "./constants";

// Permission definitions for role-based access control
export type Permission =
  | "view:dashboard"
  | "view:leadership"
  | "view:communication"
  | "view:bi"
  | "view:growth"
  | "view:campaigns"
  | "view:alerts"
  | "view:settings"
  | "manage:campaigns"
  | "manage:alerts"
  | "manage:settings"
  | "export:data"
  | "admin:all";

// Role-based permission matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ceo: [
    "view:dashboard",
    "view:leadership",
    "view:communication",
    "view:bi",
    "view:growth",
    "view:campaigns",
    "view:alerts",
    "view:settings",
    "manage:campaigns",
    "manage:alerts",
    "manage:settings",
    "export:data",
    "admin:all",
  ],
  executive: [
    "view:dashboard",
    "view:leadership",
    "view:communication",
    "view:bi",
    "view:growth",
    "view:campaigns",
    "view:alerts",
    "view:settings",
    "manage:campaigns",
    "manage:alerts",
    "export:data",
  ],
  regional_director: [
    "view:dashboard",
    "view:leadership",
    "view:communication",
    "view:bi",
    "view:growth",
    "view:campaigns",
    "view:alerts",
    "manage:campaigns",
    "export:data",
  ],
  manager: [
    "view:dashboard",
    "view:leadership",
    "view:communication",
    "view:bi",
    "view:campaigns",
    "view:alerts",
  ],
  analyst: [
    "view:dashboard",
    "view:bi",
    "export:data",
  ],
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a given role
 */
export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check if a user role can access a specific route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  const routePermissionMap: Record<string, Permission> = {
    "/": "view:dashboard",
    "/leadership": "view:leadership",
    "/communication": "view:communication",
    "/bi": "view:bi",
    "/growth": "view:growth",
    "/campaigns": "view:campaigns",
    "/alerts": "view:alerts",
    "/settings": "view:settings",
  };

  const permission = routePermissionMap[route];
  if (!permission) return true; // Allow access to unknown routes by default
  
  return hasPermission(role, permission);
}

/**
 * Filter navigation routes based on user role
 */
export function filterRoutesForRole<T extends { href: string }>(
  routes: readonly T[],
  role: UserRole
): T[] {
  return routes.filter((route) => canAccessRoute(role, route.href));
}
