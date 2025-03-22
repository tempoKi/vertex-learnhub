
import { Class, ClassesApiResponse, ClassFilter } from "@/types/class";

// Mock data for development purposes
const mockClasses: Class[] = [
  {
    id: "class1",
    name: "Mathematics 101",
    level: "Beginner",
    teachers: [
      {
        id: "teacher1",
        name: "John Smith",
        schedule: []
      }
    ],
    room: "Room A101",
    capacity: {
      total: 30,
      current: 22,
      available: 8
    },
    schedule: {
      startDate: "2023-09-01",
      endDate: "2023-12-15"
    },
    status: "active"
  },
  {
    id: "class2",
    name: "Advanced Physics",
    level: "Advanced",
    teachers: [
      {
        id: "teacher2",
        name: "Jane Doe",
        schedule: []
      }
    ],
    room: "Lab B202",
    capacity: {
      total: 25,
      current: 25,
      available: 0
    },
    schedule: {
      startDate: "2023-09-01",
      endDate: "2024-01-30"
    },
    status: "active"
  },
  {
    id: "class3",
    name: "Literature Studies",
    level: "Intermediate",
    teachers: [
      {
        id: "teacher3",
        name: "Robert Johnson",
        schedule: []
      }
    ],
    room: "Room C103",
    capacity: {
      total: 35,
      current: 18,
      available: 17
    },
    schedule: {
      startDate: "2023-09-15",
      endDate: "2023-12-20"
    },
    status: "inactive"
  },
  {
    id: "class4",
    name: "Computer Science",
    level: "Advanced",
    teachers: [
      {
        id: "teacher4",
        name: "Alice Brown",
        schedule: []
      }
    ],
    room: "Lab A105",
    capacity: {
      total: 20,
      current: 20,
      available: 0
    },
    schedule: {
      startDate: "2023-08-15",
      endDate: "2023-12-01"
    },
    status: "active"
  },
  {
    id: "class5",
    name: "History 101",
    level: "Beginner",
    teachers: [
      {
        id: "teacher5",
        name: "Michael Lee",
        schedule: []
      }
    ],
    room: "Room D104",
    capacity: {
      total: 40,
      current: 12,
      available: 28
    },
    schedule: {
      startDate: "2023-09-01",
      endDate: "2023-12-15"
    },
    status: "merged"
  },
  {
    id: "class6",
    name: "Chemistry Lab",
    level: "Intermediate",
    teachers: [
      {
        id: "teacher6",
        name: "Sarah White",
        schedule: []
      }
    ],
    room: "Lab C205",
    capacity: {
      total: 25,
      current: 20,
      available: 5
    },
    schedule: {
      startDate: "2023-09-01",
      endDate: "2023-12-15"
    },
    status: "active"
  }
];

// Function to fetch classes with filtering, sorting, and pagination
export const fetchClasses = async (filters: ClassFilter): Promise<ClassesApiResponse> => {
  // In a real application, this would be an API call
  try {
    console.log("Fetching classes with filters:", filters);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock data based on the provided filters
    let filteredClasses = [...mockClasses];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredClasses = filteredClasses.filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        c.level.toLowerCase().includes(searchLower) ||
        c.room.toLowerCase().includes(searchLower) ||
        c.teachers.some(t => t.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filteredClasses = filteredClasses.filter(c => c.status === filters.status);
    }
    
    // Apply level filter
    if (filters.level) {
      filteredClasses = filteredClasses.filter(c => c.level === filters.level);
    }
    
    // Apply room filter
    if (filters.room) {
      filteredClasses = filteredClasses.filter(c => 
        c.room.toLowerCase().includes(filters.room!.toLowerCase())
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredClasses.sort((a, b) => {
        let valA: any;
        let valB: any;
        
        switch (filters.sortBy) {
          case 'name':
            valA = a.name;
            valB = b.name;
            break;
          case 'level':
            valA = a.level;
            valB = b.level;
            break;
          case 'startDate':
            valA = new Date(a.schedule.startDate);
            valB = new Date(b.schedule.startDate);
            break;
          case 'endDate':
            valA = new Date(a.schedule.endDate);
            valB = new Date(b.schedule.endDate);
            break;
          case 'currentStudentCount':
            valA = a.capacity.current;
            valB = b.capacity.current;
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
          default:
            valA = a.name;
            valB = b.name;
        }
        
        if (valA < valB) return filters.sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    // Calculate pagination
    const total = filteredClasses.length;
    const pages = Math.ceil(total / filters.limit);
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedClasses = filteredClasses.slice(startIndex, startIndex + filters.limit);
    
    return {
      success: true,
      data: paginatedClasses,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        pages
      }
    };
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

// Function to get available levels for filtering
export const getAvailableLevels = async (): Promise<string[]> => {
  try {
    // In a real application, this could be a separate API call
    // Here we'll extract unique levels from our mock data
    const levels = Array.from(new Set(mockClasses.map(c => c.level)));
    return levels;
  } catch (error) {
    console.error("Error fetching levels:", error);
    throw error;
  }
};

// Function to get available rooms for filtering
export const getAvailableRooms = async (): Promise<string[]> => {
  try {
    // In a real application, this could be a separate API call
    // Here we'll extract unique rooms from our mock data
    const rooms = Array.from(new Set(mockClasses.map(c => c.room)));
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
