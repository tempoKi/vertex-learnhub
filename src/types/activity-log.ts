
export type LogSeverity = 'info' | 'warning' | 'error';
export type LogStatus = 'success' | 'failed' | 'warning';

export interface LogEntry {
  id: string;
  severity: LogSeverity;
  category: string;
  action: string;
  performedBy: string;
  performedByUser: string;
  targetCollection?: string;
  targetId?: string;
  details: Record<string, any>;
  timestamp: string;
  status: LogStatus;
}

export interface LogFilter {
  page?: number;
  limit?: number;
  severity?: LogSeverity | LogSeverity[];
  categories?: string[];
  status?: LogStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
  userIds?: string[];
  actions?: string[]; // Add actions filter
}

export interface LogResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LogStatusCount {
  status: LogStatus;
  count: number;
}

export interface LogByCategory {
  category: string;
  count: number;
}

export interface LogByUser {
  userId: string;
  username: string;
  count: number;
}

export interface LogSummary {
  statusCounts: LogStatusCount[];
  byCategory: LogByCategory[];
  byUser: LogByUser[];
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LogSummaryCardProps {
  title: string;
  data: LogStatusCount[] | LogByCategory[] | LogByUser[];
  keyField: string;
  valueField: string;
}

export interface FilterPanelProps {
  filter: LogFilter;
  onFilterChange: (filter: Partial<LogFilter>) => void;
  loading?: boolean;
  onRefresh?: () => void;
  activeFilters?: Partial<LogFilter>;
  availableCategories?: string[];
  availableActions?: string[];
}

export interface LogEntryTableProps {
  logs: LogEntry[];
  isLoading: boolean;
  pagination: PaginationProps;
}

export interface AttendanceRecordsTableProps {
  editable?: boolean;
  studentId: string;
}
