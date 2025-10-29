// Role-based access control utilities

// Define role permissions for dashboard routes
const rolePermissions = {
  admin: ['*'], // Admin has access to all routes
  founder: ['', 'ideas', 'blueprints', 'profile'],
  developer: ['', 'blueprints', 'deployments', 'profile'],
  marketer: ['', 'analytics', 'settings', 'profile']
};

// Extract user role from user object or metadata
export function getUserRole(user) {
  if (!user) return null;
  
  // Check multiple places where role might be stored
  // 1. Direct role property
  if (user.role) return user.role;
  
  // 2. User metadata (from Supabase auth)
  if (user.user_metadata?.role) return user.user_metadata.role;
  
  // 3. App metadata (from Supabase auth)  
  if (user.app_metadata?.role) return user.app_metadata.role;
  
  // 4. Default role if none found
  return 'founder'; // Default role for new users
}

// Check if a role has permission to access a specific path
export function hasPermission(role, path) {
  if (!role || !rolePermissions[role]) {
    return false;
  }
  
  // Admin can access everything
  if (rolePermissions[role].includes('*')) {
    return true;
  }
  
  // Extract the dashboard section from the path
  // e.g., /dashboard/settings -> settings
  const dashboardPath = path.replace(/^\/dashboard\/?/, '').split('/')[0] || '';
  
  // Check if the role has access to this section
  return rolePermissions[role].includes(dashboardPath);
}

// Get color scheme for role badges
export function getRoleColor(role) {
  const colors = {
    admin: { 
      bg: "#fee2e2", 
      color: "#991b1b",
      label: "Admin"
    },
    founder: { 
      bg: "#dbeafe", 
      color: "#1e40af",
      label: "Founder"
    },
    developer: { 
      bg: "#dcfce7", 
      color: "#166534",
      label: "Developer"
    },
    marketer: { 
      bg: "#fef3c7", 
      color: "#92400e",
      label: "Marketer"
    },
    default: {
      bg: "#f3f4f6",
      color: "#6b7280",
      label: "User"
    }
  };
  
  return colors[role] || colors.default;
}

// Get accessible routes for a given role
export function getAccessibleRoutes(role) {
  if (!role || !rolePermissions[role]) {
    return [];
  }
  
  if (rolePermissions[role].includes('*')) {
    // Admin has access to all routes
    return ['dashboard', 'ideas', 'blueprints', 'deployments', 'analytics', 'settings', 'profile'];
  }
  
  return rolePermissions[role].map(route => route || 'dashboard');
}

// Check if user can access a specific feature
export function canAccessFeature(role, feature) {
  const featurePermissions = {
    ideas: ['admin', 'founder'],
    blueprints: ['admin', 'founder', 'developer'],
    deployments: ['admin', 'developer'],
    analytics: ['admin', 'marketer'],
    settings: ['admin', 'marketer'],
    profile: ['admin', 'founder', 'developer', 'marketer'], // Everyone can access profile
  };
  
  if (!featurePermissions[feature]) {
    return false;
  }
  
  return featurePermissions[feature].includes(role);
}

// Format role for display
export function formatRoleDisplay(role) {
  const roleInfo = getRoleColor(role);
  return roleInfo.label;
}

// Check if user is admin
export function isAdmin(user) {
  const role = getUserRole(user);
  return role === 'admin';
}

// Check if user is authorized for route (used in middleware)
export function isAuthorizedForRoute(user, pathname) {
  const role = getUserRole(user);
  
  // If no role, deny access
  if (!role) return false;
  
  // Extract the dashboard section from pathname
  if (!pathname.startsWith('/dashboard')) {
    return true; // Non-dashboard routes are not role-restricted
  }
  
  // Dashboard root is accessible to all authenticated users
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return true;
  }
  
  // Check permission for the specific dashboard section
  return hasPermission(role, pathname);
}