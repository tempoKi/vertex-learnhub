
import { Student } from "@/types/index";

/**
 * Fetch a student by ID
 */
export const fetchStudent = async (studentId: string): Promise<Student> => {
  // In a real app, this would be an API call
  // For this example, we'll return mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock student data
  return {
    id: studentId,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    status: "active",
    enrollmentDate: "2023-09-01",
    classes: ["Class 10A"]
  };
};

/**
 * Fetch all students
 */
export const fetchStudents = async (): Promise<Student[]> => {
  // In a real app, this would be an API call
  // For this example, we'll return mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock students data
  return [
    {
      id: "student1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      status: "active",
      enrollmentDate: "2023-09-01",
      classes: ["Class 10A"]
    },
    {
      id: "student2",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      phone: "+1234567891",
      status: "active",
      enrollmentDate: "2023-09-01",
      classes: ["Class 10B"]
    },
  ];
};
