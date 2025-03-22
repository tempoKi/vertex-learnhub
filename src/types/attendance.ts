
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type ExcuseStatus = 'pending' | 'approved' | 'rejected';

export interface Excuse {
  reason: string;
  documentUrl?: string;
  status: ExcuseStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string; // Full name for display
  status: AttendanceStatus;
  arrivalTime?: string;
  excuse?: Excuse;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  date: string;
  teacherId: string;
  teacherName: string;
  students: StudentAttendance[];
  isMakeupClass: boolean;
  makeupClassId?: string;
  createdAt: string;
  modifiedAt?: string;
  modifiedBy?: string;
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
}

export interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  overall: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  };
  byClass: {
    classId: string;
    className: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  }[];
  byWeekday: {
    weekday: string;
    total: number;
    present: number;
    absent: number;
    rate: number;
  }[];
  trends: {
    date: string;
    status: AttendanceStatus;
  }[];
}

export interface ClassAttendanceStats {
  classId: string;
  className: string;
  overall: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  };
  byStudent: {
    studentId: string;
    studentName: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  }[];
  byDate: {
    date: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  }[];
  byWeekday: {
    weekday: string;
    rate: number;
  }[];
}

export interface AttendanceFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  classId?: string;
  teacherId?: string;
  studentId?: string;
  status?: AttendanceStatus;
  isMakeupClass?: boolean;
}

export interface AttendanceResponse {
  records: AttendanceRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
