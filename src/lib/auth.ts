import { toast } from "sonner";
import { User, UserRole } from "@/types";

// Mock authentication for frontend development
// This will be replaced with actual API calls to your backend

const API_URL = "http://localhost:5000/api"; // Replace with your actual API URL

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    email: "admin@vertex.edu",
    role: "SuperAdmin" as UserRole,
    avatar: "",
    status: "active",
    lastLogin: "2023-06-15T10:30:00Z",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "manager1",
    name: "Manager User",
    email: "manager@vertex.edu",
    role: "Manager" as UserRole,
    avatar: "",
    status: "active",
    lastLogin: "2023-06-14T08:45:00Z",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "3",
    username: "secretary1",
    name: "Secretary User",
    email: "secretary@vertex.edu",
    role: "Secretary" as UserRole,
    avatar: "",
    status: "active",
    lastLogin: "2023-06-13T14:20:00Z",
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "4",
    username: "teacher1",
    name: "Teacher User",
    email: "teacher@vertex.edu",
    role: "Teacher" as UserRole,
    avatar: "",
    status: "inactive",
    lastLogin: "2023-05-20T09:10:00Z",
    createdAt: "2023-02-15T00:00:00Z",
  },
];

// In a real application, this would be an API call
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find user with matching email
  const user = mockUsers.find((u) => u.email === email);

  if (!user) {
    toast.error("Invalid email or password");
    throw new Error("Invalid email or password");
  }

  // In development, any password works
  // In production, this would verify against the backend
  localStorage.setItem("vertexUser", JSON.stringify(user));
  
  // In a real app, we would store the JWT token and handle session timeout
  // const expiresAt = Date.now() + 3600 * 1000; // 1 hour from now
  // localStorage.setItem("tokenExpires", expiresAt.toString());
  
  return user;
};

export const logoutUser = (): void => {
  localStorage.removeItem("vertexUser");
  // Also remove token and expiration in real app
  // localStorage.removeItem("jwtToken");
  // localStorage.removeItem("tokenExpires");
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem("vertexUser");
  if (!userString) return null;
  
  try {
    // In a real app, we would check token expiration here
    // const expiresAt = localStorage.getItem("tokenExpires");
    // if (expiresAt && Number(expiresAt) < Date.now()) {
    //   logoutUser();
    //   toast.error("Your session has expired. Please log in again.");
    //   return null;
    // }
    
    return JSON.parse(userString) as User;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

export const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Role hierarchy
  const roleHierarchy: Record<UserRole, number> = {
    SuperAdmin: 4,
    Manager: 3,
    Secretary: 2,
    Teacher: 1
  };
  
  const userRoleLevel = roleHierarchy[user.role];
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => roleHierarchy[role] <= userRoleLevel);
  } else {
    return roleHierarchy[requiredRole] <= userRoleLevel;
  }
};

export const hasNotesPermission = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Only SuperAdmin, Manager, and Teacher can access notes
  return ["SuperAdmin", "Manager", "Teacher"].includes(user.role);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Check if email exists
  const userExists = mockUsers.some((u) => u.email === email);
  
  if (!userExists) {
    toast.error("User with this email does not exist");
    throw new Error("User with this email does not exist");
  }
  
  toast.success("Password reset instructions sent to your email");
};

// SuperAdmin functionality

export const createUser = async (userData: { 
  username: string, 
  email: string,
  name: string, 
  password: string, 
  role: UserRole 
}): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/auth/users`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   },
  //   body: JSON.stringify(userData)
  // });
  // 
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to create user');
  // }
  // 
  // return response.json();
  
  // Check if username or email already exists
  const userExists = mockUsers.some(
    (u) => u.email === userData.email || u.username === userData.username
  );
  
  if (userExists) {
    toast.error("User with this username or email already exists");
    throw new Error("User with this username or email already exists");
  }
  
  // Password validation - simulating backend validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(userData.password)) {
    toast.error("Password does not meet the requirements");
    throw new Error("Password does not meet the requirements");
  }
  
  const newUser = {
    id: String(mockUsers.length + 1),
    username: userData.username,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  // In a real app, we would add the user to the database
  // For now, just simulate success
  
  return newUser;
};

export const updateUserRole = async (
  userId: string, 
  newRole: UserRole, 
  reason: string
): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/users/${userId}/role`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   },
  //   body: JSON.stringify({ role: newRole, reason })
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to update user role');
  // }
  
  const currentUser = getCurrentUser();
  
  // Prevent changing own role
  if (currentUser?.id === userId) {
    toast.error("You cannot change your own role");
    throw new Error("Self-role change not allowed");
  }
  
  // Check for last SuperAdmin
  if (mockUsers.filter(u => u.role === "SuperAdmin").length <= 1) {
    const user = mockUsers.find(u => u.id === userId);
    if (user?.role === "SuperAdmin" && newRole !== "SuperAdmin") {
      toast.error("Cannot demote the last SuperAdmin");
      throw new Error("Cannot demote the last SuperAdmin");
    }
  }
  
  toast.success(`User role updated to ${newRole}`);
};

export const updateUserStatus = async (
  userId: string, 
  newStatus: 'active' | 'inactive', 
  reason: string
): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/users/${userId}/status`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   },
  //   body: JSON.stringify({ status: newStatus, reason })
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to update user status');
  // }
  
  const currentUser = getCurrentUser();
  
  // Prevent self-deactivation
  if (currentUser?.id === userId && newStatus === 'inactive') {
    toast.error("You cannot deactivate your own account");
    throw new Error("Self-deactivation not allowed");
  }
  
  // Check for last SuperAdmin
  const user = mockUsers.find(u => u.id === userId);
  if (user?.role === "SuperAdmin" && newStatus === "inactive") {
    const superAdmins = mockUsers.filter(u => u.role === "SuperAdmin" && u.status === "active");
    if (superAdmins.length <= 1) {
      toast.error("Cannot deactivate the last active SuperAdmin");
      throw new Error("Cannot deactivate the last active SuperAdmin");
    }
  }
  
  toast.success(`User status updated to ${newStatus}`);
};

export const bulkUpdateUserStatus = async (
  userIds: string[],
  newStatus: 'active' | 'inactive',
  reason: string
): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/users/bulk/status`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   },
  //   body: JSON.stringify({ userIds, status: newStatus, reason })
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to update users');
  // }
  
  const currentUser = getCurrentUser();
  
  // Check if trying to deactivate self
  if (currentUser && userIds.includes(currentUser.id) && newStatus === 'inactive') {
    toast.error("You cannot deactivate your own account");
    throw new Error("Self-deactivation not allowed");
  }
  
  // Check if trying to deactivate the last SuperAdmin
  if (newStatus === 'inactive') {
    const superAdminUsers = mockUsers.filter(u => u.role === "SuperAdmin" && u.status === "active");
    const superAdminIdsToDeactivate = userIds.filter(id => {
      const user = mockUsers.find(u => u.id === id);
      return user?.role === "SuperAdmin";
    });
    
    if (superAdminUsers.length <= superAdminIdsToDeactivate.length) {
      toast.error("Cannot deactivate all SuperAdmin accounts");
      throw new Error("Cannot deactivate all SuperAdmin accounts");
    }
  }
  
  toast.success(`Updated ${userIds.length} users to ${newStatus}`);
};

export const bulkUpdateUserRole = async (
  userIds: string[],
  newRole: UserRole,
  reason: string
): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/users/bulk/role`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   },
  //   body: JSON.stringify({ userIds, role: newRole, reason })
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to update users');
  // }
  
  const currentUser = getCurrentUser();
  
  // Prevent changing own role
  if (currentUser && userIds.includes(currentUser.id)) {
    toast.error("You cannot change your own role");
    throw new Error("Self-role change not allowed");
  }
  
  // Check if changing all SuperAdmins to another role
  if (newRole !== "SuperAdmin") {
    const superAdminIds = mockUsers
      .filter(u => u.role === "SuperAdmin")
      .map(u => u.id);
    
    const allSuperAdminsAffected = superAdminIds.every(id => userIds.includes(id));
    
    if (allSuperAdminsAffected && superAdminIds.length > 0) {
      toast.error("Cannot demote all SuperAdmin accounts");
      throw new Error("Cannot demote all SuperAdmin accounts");
    }
  }
  
  toast.success(`Updated ${userIds.length} users to role ${newRole}`);
};

export const getUserActivity = async (userId: string): Promise<any[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/users/${userId}/activities`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  //   }
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to fetch user activities');
  // }
  //
  // return response.json();
  
  // For now, return mock data
  return [
    {
      id: "1",
      userId,
      action: "login",
      timestamp: new Date().toISOString(),
      details: "User logged in from 192.168.1.105",
    },
    {
      id: "2",
      userId,
      action: "view_student",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      details: "Viewed student profile: John Doe",
    },
    {
      id: "3",
      userId,
      action: "edit_class",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      details: "Modified class: Advanced English - Monday 18:00",
    },
    {
      id: "4",
      userId,
      action: "create_payment",
      timestamp: new Date(Date.now() - 240000).toISOString(),
      details: "Created payment of $150 for student: Sarah Johnson",
    },
    {
      id: "5",
      userId,
      action: "system_config",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: "Changed system email settings",
    },
    {
      id: "6",
      userId,
      action: "user_management",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: "Created new user account: teacher2",
    },
    {
      id: "7",
      userId,
      action: "logout",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: "User logged out",
    },
  ];
};

// System management functions
export const getSystemLogs = async (params: {
  severity?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be an API call
  // For now, return mock data
  const mockLogs = [];
  
  const categories = ["auth", "student", "class", "payment", "system", "user"];
  const severities = ["info", "warning", "error"];
  const actions = ["create", "update", "delete", "view", "login", "error"];
  
  for (let i = 0; i < 50; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const performedBy = i % 3 === 0 ? "system" : mockUsers[Math.floor(Math.random() * mockUsers.length)].username;
    
    // Generate a random date in the last 30 days
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000));
    
    mockLogs.push({
      id: String(i + 1),
      severity,
      category,
      action,
      performedBy,
      details: `${severity === "error" ? "Failed" : "Successful"} ${action} in ${category} module`,
      timestamp: timestamp.toISOString(),
      resolved: severity !== "error" || Math.random() > 0.6,
    });
  }
  
  // Sort by timestamp, newest first
  mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply filters
  let filteredLogs = [...mockLogs];
  
  if (params.severity) {
    filteredLogs = filteredLogs.filter(log => log.severity === params.severity);
  }
  
  if (params.category) {
    filteredLogs = filteredLogs.filter(log => log.category === params.category);
  }
  
  if (params.startDate) {
    const startDate = new Date(params.startDate);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
  }
  
  if (params.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
  }
  
  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / pageSize);
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);
  
  return {
    logs: paginatedLogs,
    pagination: {
      page,
      pageSize,
      totalLogs,
      totalPages
    }
  };
};

export const getSystemStats = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call
  // For now, return mock data
  return {
    systemHealth: "healthy", // or "warning", "critical"
    uptime: "15 days, 7 hours, 23 minutes",
    lastBackup: "2023-06-14T02:30:00Z",
    errorRate: 0.05, // 5%
    averageResponseTime: 240, // ms
    systemLoad: {
      cpu: 32, // percent
      memory: 48, // percent
      disk: 63, // percent
      network: 27 // percent
    },
    activeUsers: 18,
    recentErrors: 3,
    pendingUpdates: 2,
  };
};

export const triggerSystemBackup = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // In a real app, this would be an API call
  // For now, just simulate success
  return {
    success: true,
    backupId: "backup-" + new Date().toISOString().replace(/[:.]/g, "-"),
    timestamp: new Date().toISOString(),
    size: "42.7 MB",
  };
};

export const updateSystemSettings = async (settings: any) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be an API call
  // For now, just simulate success
  return {
    success: true,
    message: "System settings updated successfully",
    timestamp: new Date().toISOString(),
  };
};

export const restoreSystemBackup = async (backupId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // In a real app, this would be an API call
  // For now, just simulate success
  return {
    success: true,
    message: "System restored successfully from backup",
    timestamp: new Date().toISOString(),
  };
};

export const hasRole = (allowedRoles: string[]): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  return allowedRoles.includes(currentUser.role);
};
