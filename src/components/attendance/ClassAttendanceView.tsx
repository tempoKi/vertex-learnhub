
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClasses, fetchAttendanceRecords, bulkMarkAttendance } from "@/services/attendanceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Clock, Save, UserCheck, UserX, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AttendanceFilter, AttendanceStatus } from "@/types/attendance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const ClassAttendanceView = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studentRecords, setStudentRecords] = useState<Array<{
    studentId: string;
    studentName: string;
    status: AttendanceStatus;
    arrivalTime?: string;
    notes?: string;
  }>>([]);
  const [isMakeupClass, setIsMakeupClass] = useState(false);
  const [makeupClassId, setMakeupClassId] = useState<string>("");
  const [autoSave, setAutoSave] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch classes for dropdown
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses
  });
  
  // Fetch existing attendance record for the selected class and date
  const { data: existingAttendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["attendance", "class", selectedClass, format(selectedDate, "yyyy-MM-dd")],
    queryFn: () => {
      if (!selectedClass) return { records: [] };
      
      const filter: AttendanceFilter = {
        classId: selectedClass,
        startDate: format(selectedDate, "yyyy-MM-dd"),
        endDate: format(selectedDate, "yyyy-MM-dd")
      };
      
      return fetchAttendanceRecords(filter);
    },
    enabled: !!selectedClass
  });
  
  // Update student records when existing attendance changes
  useEffect(() => {
    if (existingAttendance?.records?.length > 0) {
      // Populate form with existing records
      setStudentRecords(
        existingAttendance.records[0].students.map(student => ({
          studentId: student.studentId,
          studentName: student.studentName,
          status: student.status,
          arrivalTime: student.arrivalTime,
          notes: student.notes
        }))
      );
      
      setIsMakeupClass(existingAttendance.records[0].isMakeupClass);
      setMakeupClassId(existingAttendance.records[0].makeupClassId || "");
      
      toast.info("Loaded existing attendance record for this class and date");
    } else if (selectedClass) {
      // Create new records for all students in the class
      // In a real app, you would fetch students for the class
      setStudentRecords([
        { studentId: "student1", studentName: "John Doe", status: "present" },
        { studentId: "student2", studentName: "Jane Smith", status: "present" },
        { studentId: "student3", studentName: "Bob Johnson", status: "present" },
        { studentId: "student4", studentName: "Alice Williams", status: "present" },
        { studentId: "student5", studentName: "Charlie Brown", status: "present" }
      ]);
      
      setIsMakeupClass(false);
      setMakeupClassId("");
    }
  }, [existingAttendance, selectedClass]);
  
  // Save attendance mutation
  const saveMutation = useMutation({
    mutationFn: () => {
      return bulkMarkAttendance(
        selectedClass,
        format(selectedDate, "yyyy-MM-dd"),
        studentRecords.map(record => ({
          studentId: record.studentId,
          status: record.status
        }))
      );
    },
    onSuccess: () => {
      toast.success("Attendance records saved successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => {
      toast.error("Failed to save attendance records");
    }
  });
  
  // Check if selected date is in the future
  const isDateInFuture = selectedDate > new Date();
  
  // Update a single student's attendance
  const updateStudentAttendance = (
    studentId: string,
    status: AttendanceStatus,
    arrivalTime?: string,
    notes?: string
  ) => {
    setStudentRecords(prev => 
      prev.map(record => 
        record.studentId === studentId
          ? { ...record, status, arrivalTime, notes }
          : record
      )
    );
    
    if (autoSave) {
      // In a real implementation, you'd debounce this to avoid too many API calls
      setTimeout(() => {
        saveMutation.mutate();
      }, 1000);
    }
  };
  
  // Mark all students with the same status
  const markAllStudents = (status: AttendanceStatus) => {
    setStudentRecords(prev => 
      prev.map(record => ({ ...record, status }))
    );
    
    toast.success(`Marked all students as ${status}`);
    
    if (autoSave) {
      // In a real implementation, you'd debounce this to avoid too many API calls
      setTimeout(() => {
        saveMutation.mutate();
      }, 1000);
    }
  };
  
  // Save attendance
  const handleSaveAttendance = () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }
    
    if (isDateInFuture) {
      toast.error("Cannot mark attendance for future dates");
      return;
    }
    
    saveMutation.mutate();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance</CardTitle>
        <CardDescription>
          Mark attendance for a class on a specific date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="class-select">Select Class</Label>
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
              disabled={isLoadingClasses}
            >
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-select">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-select"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    isDateInFuture && "border-red-300 text-red-900"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM dd, yyyy")}
                  {isDateInFuture && " (Future date)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {isDateInFuture && (
              <p className="text-xs text-red-500">
                Warning: You are attempting to mark attendance for a future date
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="makeup-class"
            checked={isMakeupClass}
            onCheckedChange={(checked) => setIsMakeupClass(checked as boolean)}
          />
          <Label htmlFor="makeup-class">This is a makeup class</Label>
        </div>
        
        {isMakeupClass && (
          <div className="space-y-2">
            <Label htmlFor="makeup-for">Makeup for Original Class</Label>
            <Select
              value={makeupClassId}
              onValueChange={setMakeupClassId}
            >
              <SelectTrigger id="makeup-for">
                <SelectValue placeholder="Select original class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the original class that this makeup session is for
            </p>
          </div>
        )}
        
        {selectedClass && !isLoadingAttendance && (
          <>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllStudents("present")}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllStudents("absent")}
              >
                <UserX className="h-4 w-4 mr-1" />
                Mark All Absent
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentRecords.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentName}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => updateStudentAttendance(student.studentId, 'present')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'absent' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => updateStudentAttendance(student.studentId, 'absent')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'late' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => updateStudentAttendance(student.studentId, 'late')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.status === 'late' && (
                          <Input
                            type="time"
                            value={student.arrivalTime || ""}
                            onChange={(e) => 
                              updateStudentAttendance(
                                student.studentId, 
                                student.status, 
                                e.target.value, 
                                student.notes
                              )
                            }
                            className="w-32"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={student.notes || ""}
                          onChange={(e) => 
                            updateStudentAttendance(
                              student.studentId, 
                              student.status, 
                              student.arrivalTime, 
                              e.target.value
                            )
                          }
                          placeholder="Optional notes"
                          className="min-h-0 h-8"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        
        {isLoadingAttendance && selectedClass && (
          <div className="py-8 text-center">
            <p>Loading attendance records...</p>
          </div>
        )}
        
        {!selectedClass && (
          <div className="py-8 text-center border rounded-md bg-muted/50">
            <p>Please select a class to mark attendance</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="auto-save" 
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
          <Label htmlFor="auto-save">Auto-save changes</Label>
        </div>
        <Button 
          onClick={handleSaveAttendance}
          disabled={!selectedClass || isDateInFuture || saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-1" />
          Save Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassAttendanceView;
