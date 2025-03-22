
export interface Teacher {
  id: string;
  name: string;
  schedule: any[]; // We'll define this more specifically when needed
}

export interface ClassCapacity {
  total: number;
  current: number;
  available: number;
}

export interface ClassSchedule {
  startDate: string;
  endDate: string;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  teachers: Teacher[];
  room: string;
  capacity: ClassCapacity;
  schedule: ClassSchedule;
  status: 'active' | 'inactive' | 'merged';
}

export interface ClassesApiResponse {
  success: boolean;
  data: Class[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ClassFilter {
  page: number;
  limit: number;
  sortBy?: 'name' | 'level' | 'startDate' | 'endDate' | 'currentStudentCount' | 'status';
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'merged' | '';
  level?: string;
  teacherId?: string;
  search?: string;
  room?: string;
}
