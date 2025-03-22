
import { 
  AttendanceRecord, 
  AttendanceFilter, 
  AttendanceResponse,
  StudentAttendanceStats,
  ClassAttendanceStats,
  AttendanceStatus,
  ExcuseStatus,
  StudentAttendance
} from "@/types/attendance";

// Mock data for development
const MOCK_CLASSES = [
  { id: "class1", name: "Mathematics 101" },
  { id: "class2", name: "Physics Fundamentals" },
  { id: "class3", name: "English Literature" },
];

const MOCK_STUDENTS = [
  { id: "student1", firstName: "John", lastName: "Doe" },
  { id: "student2", firstName: "Jane", lastName: "Smith" },
  { id: "student3", firstName: "Bob", lastName: "Johnson" },
  { id: "student4", firstName: "Alice", lastName: "Williams" },
  { id: "student5", firstName: "Charlie", lastName: "Brown" },
];

const MOCK_TEACHERS = [
  { id: "teacher1", firstName: "David", lastName: "Miller" },
  { id: "teacher2", firstName: "Sarah", lastName: "Wilson" },
];

// Generate mock attendance records
const generateMockAttendanceRecords = (count: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const classIndex = Math.floor(Math.random() * MOCK_CLASSES.length);
    const teacherIndex = Math.floor(Math.random() * MOCK_TEACHERS.length);
    
    const students: StudentAttendance[] = MOCK_STUDENTS.map(student => {
      const status: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];
      const randomStatus = status[Math.floor(Math.random() * status.length)];
      
      let excuse;
      if (randomStatus === 'absent' || randomStatus === 'excused') {
        const excuseStatus: ExcuseStatus[] = ['pending', 'approved', 'rejected'];
        excuse = {
          reason: "Family emergency",
          documentUrl: Math.random() > 0.5 ? "https://example.com/doc.pdf" : undefined,
          status: excuseStatus[Math.floor(Math.random() * excuseStatus.length)],
        };
        
        if (excuse.status !== 'pending') {
          excuse.verifiedBy = "teacher1";
          excuse.verifiedAt = new Date().toISOString();
        }
      }
      
      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        status: randomStatus,
        arrivalTime: randomStatus === 'late' ? `${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
        excuse,
        notes: Math.random() > 0.7 ? "Some notes about attendance" : undefined,
      };
    });
    
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const excusedCount = students.filter(s => s.status === 'excused').length;
    
    records.push({
      id: `attendance${i}`,
      classId: MOCK_CLASSES[classIndex].id,
      className: MOCK_CLASSES[classIndex].name,
      date: date.toISOString().split('T')[0],
      teacherId: MOCK_TEACHERS[teacherIndex].id,
      teacherName: `${MOCK_TEACHERS[teacherIndex].firstName} ${MOCK_TEACHERS[teacherIndex].lastName}`,
      students,
      isMakeupClass: Math.random() > 0.9,
      makeupClassId: Math.random() > 0.9 ? `originalClass${i}` : undefined,
      createdAt: new Date(date).toISOString(),
      modifiedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
      modifiedBy: Math.random() > 0.5 ? MOCK_TEACHERS[teacherIndex].id : undefined,
      summary: {
        total: students.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount
      }
    });
  }
  
  return records;
};

// In-memory mock attendance records
const MOCK_ATTENDANCE_RECORDS = generateMockAttendanceRecords(50);

// Fetch attendance records with filtering
export const fetchAttendanceRecords = async (filter: AttendanceFilter): Promise<AttendanceResponse> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredRecords = [...MOCK_ATTENDANCE_RECORDS];
  
  // Apply filters
  if (filter.classId) {
    filteredRecords = filteredRecords.filter(record => record.classId === filter.classId);
  }
  
  if (filter.teacherId) {
    filteredRecords = filteredRecords.filter(record => record.teacherId === filter.teacherId);
  }
  
  if (filter.studentId) {
    filteredRecords = filteredRecords.filter(record => 
      record.students.some(student => student.studentId === filter.studentId)
    );
  }
  
  if (filter.status) {
    filteredRecords = filteredRecords.filter(record =>
      record.students.some(student => student.status === filter.status)
    );
  }
  
  if (filter.startDate) {
    filteredRecords = filteredRecords.filter(record => record.date >= filter.startDate!);
  }
  
  if (filter.endDate) {
    filteredRecords = filteredRecords.filter(record => record.date <= filter.endDate!);
  }
  
  if (filter.isMakeupClass !== undefined) {
    filteredRecords = filteredRecords.filter(record => record.isMakeupClass === filter.isMakeupClass);
  }
  
  // Sort records
  if (filter.sortBy) {
    filteredRecords.sort((a, b) => {
      const aValue = a[filter.sortBy as keyof AttendanceRecord];
      const bValue = b[filter.sortBy as keyof AttendanceRecord];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filter.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      }
      
      return 0;
    });
  }
  
  // Pagination
  const page = filter.page || 1;
  const limit = filter.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  
  return {
    records: paginatedRecords,
    pagination: {
      total: filteredRecords.length,
      page,
      limit,
      totalPages: Math.ceil(filteredRecords.length / limit)
    }
  };
};

// Get student attendance statistics
export const fetchStudentAttendanceStats = async (studentId: string): Promise<StudentAttendanceStats> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) throw new Error("Student not found");
  
  const studentRecords = MOCK_ATTENDANCE_RECORDS.filter(record => 
    record.students.some(s => s.studentId === studentId)
  );
  
  const totalAttendance = studentRecords.length;
  const presentCount = studentRecords.filter(record => 
    record.students.find(s => s.studentId === studentId)?.status === 'present'
  ).length;
  
  const absentCount = studentRecords.filter(record => 
    record.students.find(s => s.studentId === studentId)?.status === 'absent'
  ).length;
  
  const lateCount = studentRecords.filter(record => 
    record.students.find(s => s.studentId === studentId)?.status === 'late'
  ).length;
  
  const excusedCount = studentRecords.filter(record => 
    record.students.find(s => s.studentId === studentId)?.status === 'excused'
  ).length;
  
  // Generate class-specific statistics
  const classesTaken = [...new Set(studentRecords.map(record => record.classId))];
  const byClass = classesTaken.map(classId => {
    const className = MOCK_CLASSES.find(c => c.id === classId)?.name || "Unknown Class";
    const classRecords = studentRecords.filter(record => record.classId === classId);
    
    const total = classRecords.length;
    const present = classRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'present'
    ).length;
    
    const absent = classRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'absent'
    ).length;
    
    const late = classRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'late'
    ).length;
    
    const excused = classRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'excused'
    ).length;
    
    return {
      classId,
      className,
      total,
      present,
      absent,
      late,
      excused,
      rate: total > 0 ? (present / total) * 100 : 0
    };
  });
  
  // Generate weekday statistics
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byWeekday = weekdays.map(weekday => {
    const weekdayIndex = weekdays.indexOf(weekday);
    const weekdayRecords = studentRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDay() === weekdayIndex;
    });
    
    const total = weekdayRecords.length;
    const present = weekdayRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'present'
    ).length;
    
    const absent = weekdayRecords.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'absent'
    ).length;
    
    return {
      weekday,
      total,
      present,
      absent,
      rate: total > 0 ? (present / total) * 100 : 0
    };
  }).filter(day => day.total > 0);
  
  // Generate attendance trends
  const trends = studentRecords.map(record => {
    const student = record.students.find(s => s.studentId === studentId);
    return {
      date: record.date,
      status: student?.status || 'absent'
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    studentId,
    studentName: `${student.firstName} ${student.lastName}`,
    overall: {
      total: totalAttendance,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      rate: totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0
    },
    byClass,
    byWeekday,
    trends
  };
};

// Get class attendance statistics
export const fetchClassAttendanceStats = async (classId: string): Promise<ClassAttendanceStats> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const classInfo = MOCK_CLASSES.find(c => c.id === classId);
  if (!classInfo) throw new Error("Class not found");
  
  const classRecords = MOCK_ATTENDANCE_RECORDS.filter(record => record.classId === classId);
  
  // Overall stats
  const totalSessions = classRecords.length;
  const totalStudentAttendances = classRecords.reduce((sum, record) => sum + record.students.length, 0);
  const presentCount = classRecords.reduce((sum, record) => 
    sum + record.students.filter(s => s.status === 'present').length, 0
  );
  const absentCount = classRecords.reduce((sum, record) => 
    sum + record.students.filter(s => s.status === 'absent').length, 0
  );
  const lateCount = classRecords.reduce((sum, record) => 
    sum + record.students.filter(s => s.status === 'late').length, 0
  );
  const excusedCount = classRecords.reduce((sum, record) => 
    sum + record.students.filter(s => s.status === 'excused').length, 0
  );
  
  // By student stats
  const studentsInClass = [...new Set(classRecords.flatMap(record => 
    record.students.map(s => s.studentId)
  ))];
  
  const byStudent = studentsInClass.map(studentId => {
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
    
    const sessionsWithStudent = classRecords.filter(record => 
      record.students.some(s => s.studentId === studentId)
    );
    
    const total = sessionsWithStudent.length;
    const present = sessionsWithStudent.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'present'
    ).length;
    
    const absent = sessionsWithStudent.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'absent'
    ).length;
    
    const late = sessionsWithStudent.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'late'
    ).length;
    
    const excused = sessionsWithStudent.filter(record => 
      record.students.find(s => s.studentId === studentId)?.status === 'excused'
    ).length;
    
    return {
      studentId,
      studentName,
      total,
      present,
      absent,
      late,
      excused,
      rate: total > 0 ? (present / total) * 100 : 0
    };
  });
  
  // By date stats
  const byDate = classRecords.map(record => {
    const total = record.students.length;
    const present = record.students.filter(s => s.status === 'present').length;
    const absent = record.students.filter(s => s.status === 'absent').length;
    const late = record.students.filter(s => s.status === 'late').length;
    const excused = record.students.filter(s => s.status === 'excused').length;
    
    return {
      date: record.date,
      total,
      present,
      absent,
      late,
      excused,
      rate: total > 0 ? (present / total) * 100 : 0
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
  
  // By weekday stats
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byWeekday = weekdays.map(weekday => {
    const weekdayIndex = weekdays.indexOf(weekday);
    const weekdayRecords = classRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDay() === weekdayIndex;
    });
    
    if (weekdayRecords.length === 0) return null;
    
    const totalAttendances = weekdayRecords.reduce((sum, record) => sum + record.students.length, 0);
    const presentAttendances = weekdayRecords.reduce(
      (sum, record) => sum + record.students.filter(s => s.status === 'present').length, 0
    );
    
    return {
      weekday,
      rate: totalAttendances > 0 ? (presentAttendances / totalAttendances) * 100 : 0
    };
  }).filter(Boolean) as { weekday: string; rate: number; }[];
  
  return {
    classId,
    className: classInfo.name,
    overall: {
      total: totalStudentAttendances,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      rate: totalStudentAttendances > 0 ? (presentCount / totalStudentAttendances) * 100 : 0
    },
    byStudent,
    byDate,
    byWeekday
  };
};

// Mark attendance for a single student
export const markAttendance = async (
  classId: string,
  date: string,
  studentId: string,
  status: AttendanceStatus,
  arrivalTime?: string,
  excuse?: { reason: string, documentUrl?: string },
  notes?: string
): Promise<{ success: boolean }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Marking attendance:', {
    classId,
    date,
    studentId,
    status,
    arrivalTime,
    excuse,
    notes
  });
  
  // Simulate successful API call
  return { success: true };
};

// Bulk mark attendance
export const bulkMarkAttendance = async (
  classId: string,
  date: string,
  records: { studentId: string, status: AttendanceStatus }[]
): Promise<{ success: boolean }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Bulk marking attendance:', {
    classId,
    date,
    records
  });
  
  // Simulate successful API call
  return { success: true };
};

// Add an excuse
export const addExcuse = async (
  classId: string,
  date: string,
  studentId: string,
  reason: string,
  documentUrl?: string,
  notes?: string
): Promise<{ success: boolean }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Adding excuse:', {
    classId,
    date,
    studentId,
    reason,
    documentUrl,
    notes
  });
  
  // Simulate successful API call
  return { success: true };
};

// Verify excuse
export const verifyExcuse = async (
  classId: string,
  date: string,
  studentId: string,
  status: 'approved' | 'rejected'
): Promise<{ success: boolean }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Verifying excuse:', {
    classId,
    date,
    studentId,
    status
  });
  
  // Simulate successful API call
  return { success: true };
};

// Get available classes
export const fetchClasses = async () => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_CLASSES;
};

// Get available students
export const fetchStudents = async () => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_STUDENTS;
};

// Export attendance data
export const exportAttendance = async (
  format: 'csv' | 'json',
  filter: AttendanceFilter
): Promise<Blob> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { records } = await fetchAttendanceRecords(filter);
  
  if (format === 'json') {
    return new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  } else {
    // Create CSV content
    const headers = ['Class', 'Date', 'Student', 'Status', 'Arrival Time', 'Notes'];
    const rows = records.flatMap(record => 
      record.students.map(student => [
        record.className,
        record.date,
        student.studentName,
        student.status,
        student.arrivalTime || '',
        student.notes || ''
      ])
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
};
