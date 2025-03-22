
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AttendanceRecord, AttendanceStatus, StudentAttendance } from "@/types/attendance";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { markAttendance } from "@/services/attendanceService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, Clock, X, AlertCircle, FileText, Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AttendanceRecordDetailsProps {
  record: AttendanceRecord;
  editable?: boolean;
}

export const AttendanceRecordDetails = ({ record, editable = false }: AttendanceRecordDetailsProps) => {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [editStatus, setEditStatus] = useState<AttendanceStatus | null>(null);
  
  const queryClient = useQueryClient();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-green-500" />;
      case "absent":
        return <X className="h-4 w-4 text-red-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: AttendanceStatus) => {
    const colors: Record<AttendanceStatus, string> = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-amber-100 text-amber-800",
      excused: "bg-blue-100 text-blue-800",
    };
    
    return (
      <Badge className={cn("font-normal", colors[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Start editing a student's attendance
  const handleEditStart = (student: StudentAttendance) => {
    setEditingStudentId(student.studentId);
    setNotes(student.notes || "");
    setArrivalTime(student.arrivalTime || "");
    setEditStatus(student.status);
  };
  
  // Cancel editing
  const handleEditCancel = () => {
    setEditingStudentId(null);
    setNotes("");
    setArrivalTime("");
    setEditStatus(null);
  };
  
  // Save attendance changes
  const handleSaveAttendance = async (studentId: string) => {
    if (!editStatus) return;
    
    try {
      await markAttendance(
        record.classId,
        record.date,
        studentId,
        editStatus,
        editStatus === "late" ? arrivalTime : undefined,
        undefined,
        notes || undefined
      );
      
      toast.success("Attendance updated successfully");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      
      // Reset editing state
      setEditingStudentId(null);
      setNotes("");
      setArrivalTime("");
      setEditStatus(null);
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance");
    }
  };
  
  // Change attendance status
  const handleStatusChange = (status: AttendanceStatus) => {
    setEditStatus(status);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium">Class Information</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-medium">{record.className}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatDate(record.date)}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-muted-foreground">Teacher:</span>
              <span className="font-medium">{record.teacherName}</span>
            </div>
            {record.isMakeupClass && (
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline">Makeup Class</Badge>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Attendance Summary</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 rounded flex flex-col items-center">
              <span className="text-lg font-semibold text-green-700">{record.summary.present}</span>
              <span className="text-xs text-green-600">Present</span>
            </div>
            <div className="p-2 bg-red-50 rounded flex flex-col items-center">
              <span className="text-lg font-semibold text-red-700">{record.summary.absent}</span>
              <span className="text-xs text-red-600">Absent</span>
            </div>
            <div className="p-2 bg-amber-50 rounded flex flex-col items-center">
              <span className="text-lg font-semibold text-amber-700">{record.summary.late}</span>
              <span className="text-xs text-amber-600">Late</span>
            </div>
            <div className="p-2 bg-blue-50 rounded flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-700">{record.summary.excused}</span>
              <span className="text-xs text-blue-600">Excused</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Student Attendance</h3>
        <div className="mt-2">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Notes</TableHead>
                  {editable && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>
                      {editingStudentId === student.studentId ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={editStatus === 'present' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => handleStatusChange('present')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={editStatus === 'absent' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => handleStatusChange('absent')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={editStatus === 'late' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => handleStatusChange('late')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={editStatus === 'excused' ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => handleStatusChange('excused')}
                          >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Excused
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {getStatusIcon(student.status)}
                          <span className="ml-1">{getStatusBadge(student.status)}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudentId === student.studentId && editStatus === 'late' ? (
                        <Input
                          type="time"
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          className="w-32"
                        />
                      ) : (
                        student.arrivalTime || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudentId === student.studentId ? (
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[80px]"
                          placeholder="Add notes about attendance"
                        />
                      ) : (
                        student.notes || "-"
                      )}
                    </TableCell>
                    {editable && (
                      <TableCell>
                        {editingStudentId === student.studentId ? (
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveAttendance(student.studentId)}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditStart(student)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {record.modifiedAt && (
        <div className="text-xs text-muted-foreground">
          Last modified on {formatDate(record.modifiedAt)}
          {record.modifiedBy && " by " + record.modifiedBy}
        </div>
      )}
    </div>
  );
};
