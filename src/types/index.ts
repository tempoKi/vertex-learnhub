
export type UserRole = 'SuperAdmin' | 'Manager' | 'Secretary' | 'Teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  enrollmentDate: string;
  classes: string[];
}

export interface Class {
  id: string;
  name: string;
  schedule: string;
  teacher: string;
  level: string;
  students: string[];
  startDate: string;
  endDate: string;
}

export interface Attendance {
  id: string;
  classId: string;
  date: string;
  records: {
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }[];
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'transfer';
  description: string;
  receiptNumber?: string;
}

export interface Note {
  id: string;
  targetType: 'student' | 'class';
  targetId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  activeClasses: number;
  attendanceRate: number;
  recentPayments: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
