// Import needed types
import { 
  LogEntry, 
  LogFilter, 
  LogResponse, 
  LogSummary,
  LogStatusCount,
  LogByCategory,
  LogByUser
} from '@/types/activity-log';

// Mock data for development
const mockLogs: LogEntry[] = [
  {
    id: '1',
    severity: 'info',
    category: 'Authentication',
    action: 'Login',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Users',
    targetId: 'user123',
    details: { ipAddress: '192.168.1.1' },
    timestamp: '2024-07-08T14:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    severity: 'warning',
    category: 'User Management',
    action: 'Update Profile',
    performedBy: 'user2',
    performedByUser: 'john.doe',
    targetCollection: 'Users',
    targetId: 'user456',
    details: { fieldChanged: 'email', oldValue: 'old@example.com', newValue: 'new@example.com' },
    timestamp: '2024-07-08T15:45:00Z',
    status: 'success'
  },
  {
    id: '3',
    severity: 'error',
    category: 'Content',
    action: 'Delete Post',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Posts',
    targetId: 'post789',
    details: { postId: 'post789' },
    timestamp: '2024-07-08T16:20:00Z',
    status: 'failed'
  },
  {
    id: '4',
    severity: 'info',
    category: 'Settings',
    action: 'Change Password',
    performedBy: 'user3',
    performedByUser: 'jane.smith',
    targetCollection: 'Users',
    targetId: 'user101',
    details: { userId: 'user101' },
    timestamp: '2024-07-08T17:00:00Z',
    status: 'success'
  },
  {
    id: '5',
    severity: 'warning',
    category: 'Authentication',
    action: 'Failed Login',
    performedBy: 'user4',
    performedByUser: 'guest',
    targetCollection: 'Users',
    targetId: null,
    details: { ipAddress: '10.0.0.5' },
    timestamp: '2024-07-08T18:10:00Z',
    status: 'failed'
  },
  {
    id: '6',
    severity: 'info',
    category: 'User Management',
    action: 'Create User',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Users',
    targetId: 'user112',
    details: { userId: 'user112' },
    timestamp: '2024-07-08T19:25:00Z',
    status: 'success'
  },
  {
    id: '7',
    severity: 'error',
    category: 'Content',
    action: 'Edit Comment',
    performedBy: 'user2',
    performedByUser: 'john.doe',
    targetCollection: 'Comments',
    targetId: 'comment345',
    details: { commentId: 'comment345' },
    timestamp: '2024-07-08T20:40:00Z',
    status: 'warning'
  },
  {
    id: '8',
    severity: 'info',
    category: 'Settings',
    action: 'Update Settings',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Settings',
    targetId: 'settings001',
    details: { settingId: 'settings001' },
    timestamp: '2024-07-08T21:55:00Z',
    status: 'success'
  },
  {
    id: '9',
    severity: 'warning',
    category: 'Authentication',
    action: 'Logout',
    performedBy: 'user2',
    performedByUser: 'john.doe',
    targetCollection: 'Users',
    targetId: 'user456',
    details: { userId: 'user456' },
    timestamp: '2024-07-08T22:30:00Z',
    status: 'success'
  },
  {
    id: '10',
    severity: 'info',
    category: 'User Management',
    action: 'Delete User',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Users',
    targetId: 'user789',
    details: { userId: 'user789' },
    timestamp: '2024-07-08T23:45:00Z',
    status: 'success'
  },
  {
    id: '11',
    severity: 'info',
    category: 'Content',
    action: 'Create Post',
    performedBy: 'user3',
    performedByUser: 'jane.smith',
    targetCollection: 'Posts',
    targetId: 'post112',
    details: { postId: 'post112' },
    timestamp: '2024-07-09T00:15:00Z',
    status: 'success'
  },
  {
    id: '12',
    severity: 'error',
    category: 'Settings',
    action: 'Restore Defaults',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Settings',
    targetId: 'settings001',
    details: { settingId: 'settings001' },
    timestamp: '2024-07-09T01:30:00Z',
    status: 'failed'
  },
  {
    id: '13',
    severity: 'warning',
    category: 'Authentication',
    action: 'Password Reset',
    performedBy: 'user2',
    performedByUser: 'john.doe',
    targetCollection: 'Users',
    targetId: 'user456',
    details: { userId: 'user456' },
    timestamp: '2024-07-09T02:45:00Z',
    status: 'success'
  },
  {
    id: '14',
    severity: 'info',
    category: 'User Management',
    action: 'Update Role',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Users',
    targetId: 'user112',
    details: { userId: 'user112', oldRole: 'user', newRole: 'admin' },
    timestamp: '2024-07-09T04:00:00Z',
    status: 'success'
  },
  {
    id: '15',
    severity: 'error',
    category: 'Content',
    action: 'Report Comment',
    performedBy: 'user3',
    performedByUser: 'jane.smith',
    targetCollection: 'Comments',
    targetId: 'comment345',
    details: { commentId: 'comment345' },
    timestamp: '2024-07-09T05:15:00Z',
    status: 'warning'
  },
  {
    id: '16',
    severity: 'info',
    category: 'Settings',
    action: 'Backup Settings',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Settings',
    targetId: 'settings001',
    details: { settingId: 'settings001' },
    timestamp: '2024-07-09T06:30:00Z',
    status: 'success'
  },
  {
    id: '17',
    severity: 'warning',
    category: 'Authentication',
    action: 'Account Lockout',
    performedBy: 'system',
    performedByUser: 'system',
    targetCollection: 'Users',
    targetId: 'user456',
    details: { userId: 'user456' },
    timestamp: '2024-07-09T07:45:00Z',
    status: 'failed'
  },
  {
    id: '18',
    severity: 'info',
    category: 'User Management',
    action: 'Invite User',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Users',
    targetId: 'user555',
    details: { userId: 'user555' },
    timestamp: '2024-07-09T09:00:00Z',
    status: 'success'
  },
  {
    id: '19',
    severity: 'error',
    category: 'Content',
    action: 'Flag Post',
    performedBy: 'user2',
    performedByUser: 'john.doe',
    targetCollection: 'Posts',
    targetId: 'post112',
    details: { postId: 'post112' },
    timestamp: '2024-07-09T10:15:00Z',
    status: 'warning'
  },
  {
    id: '20',
    severity: 'info',
    category: 'Settings',
    action: 'Export Data',
    performedBy: 'user1',
    performedByUser: 'admin',
    targetCollection: 'Settings',
    targetId: 'settings001',
    details: { settingId: 'settings001' },
    timestamp: '2024-07-09T11:30:00Z',
    status: 'success'
  }
];

// Fetch activity logs with filtering and pagination
export const fetchActivityLogs = (filter: LogFilter = {}): Promise<LogResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredLogs = [...mockLogs];
      
      // Apply filters
      if (filter.severity) {
        const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
        filteredLogs = filteredLogs.filter(log => severities.includes(log.severity));
      }
      
      if (filter.categories && filter.categories.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.categories?.includes(log.category));
      }
      
      if (filter.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filter.status);
      }
      
      if (filter.fromDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filter.fromDate!));
      }
      
      if (filter.toDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filter.toDate!));
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.action.toLowerCase().includes(searchLower) || 
          log.category.toLowerCase().includes(searchLower) ||
          log.performedByUser.toLowerCase().includes(searchLower)
        );
      }

      if (filter.userIds && filter.userIds.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.userIds?.includes(log.performedBy));
      }
      
      if (filter.actions && filter.actions.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.actions?.includes(log.action));
      }
      
      // Sort by timestamp (most recent first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Apply pagination
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const total = filteredLogs.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedLogs = filteredLogs.slice(start, end);
      
      resolve({
        logs: paginatedLogs,
        total,
        page,
        limit,
        totalPages
      });
    }, 500);
  });
};

// Fetch activity log summary
export const fetchActivityLogSummary = (): Promise<LogSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert the readonly arrays to mutable arrays by creating new arrays
      const statusCounts: LogStatusCount[] = [
        { status: 'success', count: 42 },
        { status: 'failed', count: 12 },
        { status: 'warning', count: 8 }
      ];
      
      const byCategory: LogByCategory[] = [
        { category: 'Authentication', count: 25 },
        { category: 'User Management', count: 18 },
        { category: 'Content', count: 14 },
        { category: 'Settings', count: 5 }
      ];
      
      const byUser: LogByUser[] = [
        { userId: 'user1', username: 'admin', count: 30 },
        { userId: 'user2', username: 'john.doe', count: 22 },
        { userId: 'user3', username: 'jane.smith', count: 10 }
      ];
      
      resolve({
        statusCounts,
        byCategory,
        byUser
      });
    }, 500);
  });
};

// Fetch user activity logs
export const fetchUserActivity = (userId: string, filter: LogFilter = {}): Promise<LogResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter logs by userId
      let filteredLogs = mockLogs.filter(log => log.performedBy === userId);
      
      // Apply additional filters if provided
      if (filter.severity) {
        const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
        filteredLogs = filteredLogs.filter(log => severities.includes(log.severity));
      }
      
      if (filter.categories && filter.categories.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.categories?.includes(log.category));
      }
      
      if (filter.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filter.status);
      }
      
      if (filter.fromDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filter.fromDate!));
      }
      
      if (filter.toDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filter.toDate!));
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.action.toLowerCase().includes(searchLower) || 
          log.category.toLowerCase().includes(searchLower) ||
          log.performedByUser.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by timestamp (most recent first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Apply pagination
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const total = filteredLogs.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedLogs = filteredLogs.slice(start, end);
      
      resolve({
        logs: paginatedLogs,
        total,
        page,
        limit,
        totalPages
      });
    }, 500);
  });
};

// Export logs as CSV or JSON
export const exportLogs = (format: 'csv' | 'json', filter: LogFilter = {}): Promise<Blob> => {
  return new Promise(async (resolve) => {
    // Get filtered logs
    const { logs } = await fetchActivityLogs(filter);
    
    if (format === 'json') {
      // Export as JSON
      const jsonString = JSON.stringify(logs, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      resolve(blob);
    } else {
      // Export as CSV
      const headers = ['ID', 'Timestamp', 'User', 'Action', 'Category', 'Status', 'Severity'];
      
      const rows = logs.map(log => [
        log.id,
        log.timestamp,
        log.performedByUser,
        log.action,
        log.category,
        log.status,
        log.severity
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      resolve(blob);
    }
  });
};
