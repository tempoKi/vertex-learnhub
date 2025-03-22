import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchAttendanceRecords, 
  fetchClasses, 
  fetchStudents, 
  exportAttendance 
} from "@/services/attendanceService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameDay } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AttendanceFilter, AttendanceRecord } from "@/types/attendance";
import { AttendanceRecordDetails } from "./AttendanceRecordDetails";
import { 
  CalendarIcon, 
  Download, 
  Filter, 
  Search, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { AttendanceRecordsTableProps } from "@/types/activity-log";

const AttendanceRecordsTable = ({ editable = false, studentId }: AttendanceRecordsTableProps) => {
  const [filter, setFilter] = useState<AttendanceFilter>({
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "desc",
    studentId: studentId // Set studentId filter if provided
  });
  
  // Update filter when studentId prop changes
  useEffect(() => {
    if (studentId) {
      setFilter(prev => ({ ...prev, studentId }));
    }
  }, [studentId]);
  
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { data: attendanceData, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["attendance", "records", filter],
    queryFn: () => fetchAttendanceRecords(filter)
  });
  
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses
  });
  
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents
  });
  
  // Update filter when dates change
  useEffect(() => {
    if (startDate) {
      setFilter(prev => ({
        ...prev,
        startDate: format(startDate, "yyyy-MM-dd")
      }));
    }
    
    if (endDate) {
      setFilter(prev => ({
        ...prev,
        endDate: format(endDate, "yyyy-MM-dd")
      }));
    }
  }, [startDate, endDate]);
  
  // Parse ISO date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof AttendanceFilter, value: any) => {
    setFilter(prev => {
      // If value is empty string, remove the filter
      if (value === "" || value === "all") {
        const newFilter = { ...prev };
        delete newFilter[key];
        return newFilter;
      }
      
      return { ...prev, [key]: value };
    });
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilter({
      page: 1,
      limit: 10,
      sortBy: "date",
      sortOrder: "desc"
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
  };
  
  // Export attendance data
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const blob = await exportAttendance(format, filter);
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Attendance data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export attendance data");
      console.error(error);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: { present: number; absent: number; late: number; excused: number; total: number }) => {
    const rate = status.total > 0 ? (status.present / status.total) * 100 : 0;
    
    let color: string;
    if (rate >= 90) color = "bg-green-100 text-green-800";
    else if (rate >= 75) color = "bg-yellow-100 text-yellow-800";
    else color = "bg-red-100 text-red-800";
    
    return (
      <Badge className={cn("font-normal", color)}>
        {status.present}/{status.total} ({Math.round(rate)}%)
      </Badge>
    );
  };
  
  // Apply quick date filter
  const applyQuickDateFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    
    setStartDate(start);
    setEndDate(end);
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({ ...prev, page: newPage }));
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              View and filter attendance records for all classes
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters {showFilters ? 'ᐯ' : 'ᐱ'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              <Download className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-md bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-from"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-to"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-1 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => applyQuickDateFilter(7)}
                  className="text-xs px-2 h-7"
                >
                  Last 7 days
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickDateFilter(30)}
                  className="text-xs px-2 h-7"
                >
                  Last 30 days
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickDateFilter(90)}
                  className="text-xs px-2 h-7"
                >
                  Last 90 days
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class-filter">Class</Label>
              <Select
                value={filter.classId || "all"}
                onValueChange={(value) => handleFilterChange("classId", value === "all" ? "" : value)}
              >
                <SelectTrigger id="class-filter">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes?.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Label htmlFor="student-filter" className="mt-2 block">Student</Label>
              <Select
                value={filter.studentId || "all"}
                onValueChange={(value) => handleFilterChange("studentId", value === "all" ? "" : value)}
              >
                <SelectTrigger id="student-filter">
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students?.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filter.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2 flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="makeup-filter" className="block">Makeup Class</Label>
                  <Select
                    value={filter.isMakeupClass !== undefined ? filter.isMakeupClass.toString() : "all"}
                    onValueChange={(value) => handleFilterChange("isMakeupClass", value === "all" ? undefined : value === "true")}
                  >
                    <SelectTrigger id="makeup-filter">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="true">Makeup Only</SelectItem>
                      <SelectItem value="false">Regular Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 flex items-end">
                  <Button
                    variant="ghost"
                    className="mb-[2px]"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-center">Attendance Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAttendance ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading attendance records...
                  </TableCell>
                </TableRow>
              ) : attendanceData?.records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData?.records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{record.className}</div>
                      {record.isMakeupClass && (
                        <Badge variant="outline" className="mt-1">
                          Makeup Class
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{record.teacherName}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(record.summary)}
                        <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                          <span className="flex items-center">
                            <Check className="h-3 w-3 text-green-500 mr-1" /> 
                            {record.summary.present}
                          </span>
                          <span className="flex items-center">
                            <X className="h-3 w-3 text-red-500 mr-1" /> 
                            {record.summary.absent}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 text-amber-500 mr-1" /> 
                            {record.summary.late}
                          </span>
                          <span className="flex items-center">
                            <AlertCircle className="h-3 w-3 text-blue-500 mr-1" /> 
                            {record.summary.excused}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedRecord(record)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Attendance Record Details</DialogTitle>
                          </DialogHeader>
                          {selectedRecord && (
                            <AttendanceRecordDetails 
                              record={selectedRecord} 
                              editable={editable}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {attendanceData?.pagination && 
            `Showing ${(attendanceData.pagination.page - 1) * attendanceData.pagination.limit + 1} to 
             ${Math.min(attendanceData.pagination.page * attendanceData.pagination.limit, attendanceData.pagination.total)} 
             of ${attendanceData.pagination.total} records`
          }
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, (attendanceData?.pagination.page || 1) - 1))}
            disabled={!attendanceData || attendanceData.pagination.page <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {attendanceData?.pagination.page || 1} of{" "}
            {attendanceData?.pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((attendanceData?.pagination.page || 1) + 1)}
            disabled={!attendanceData || attendanceData.pagination.page >= attendanceData.pagination.totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceRecordsTable;

