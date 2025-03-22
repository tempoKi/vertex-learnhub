
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import StudentTable from "@/components/students/StudentTable";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Download, 
  Filter, 
  ListFilter, 
  Upload 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data
const mockStudents: Student[] = Array.from({ length: 30 }).map((_, index) => ({
  id: `std-${index + 1}`,
  firstName: ['Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'William', 'Sophia', 'Mason', 'Isabella', 'James'][index % 10],
  lastName: ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][index % 10],
  email: `student${index + 1}@example.com`,
  phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
  enrollmentDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  classes: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(() => `class-${Math.floor(Math.random() * 10) + 1}`),
}));

const Students = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [statusFilter, setStatusFilter] = useState<('active' | 'inactive' | 'pending')[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Filter students by status
  const filteredStudents = statusFilter.length > 0
    ? students.filter(student => statusFilter.includes(student.status))
    : students;

  const toggleStatusFilter = (status: 'active' | 'inactive' | 'pending') => {
    setStatusFilter(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleExport = () => {
    toast.success("Student data exported successfully");
  };

  const handleImport = () => {
    toast.success("Student data imported successfully");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-muted-foreground">
          Manage all students and their information
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filter
                {statusFilter.length > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {statusFilter.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('active')}
                  onCheckedChange={() => toggleStatusFilter('active')}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('inactive')}
                  onCheckedChange={() => toggleStatusFilter('inactive')}
                >
                  Inactive
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('pending')}
                  onCheckedChange={() => toggleStatusFilter('pending')}
                >
                  Pending
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start font-normal text-xs"
                onClick={() => setStatusFilter([])}
              >
                <ListFilter size={14} className="mr-2" />
                Clear Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {statusFilter.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {statusFilter.map(status => (
                <div 
                  key={status} 
                  className="h-8 px-3 inline-flex items-center rounded-md text-xs border bg-muted/50"
                >
                  <CheckCircle size={12} className="mr-1.5" />
                  <span className="capitalize">{status}</span>
                  <button 
                    className="ml-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleStatusFilter(status)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <StudentTable students={filteredStudents} />
    </MainLayout>
  );
};

export default Students;
