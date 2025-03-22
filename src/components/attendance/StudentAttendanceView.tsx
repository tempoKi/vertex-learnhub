
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStudent } from "@/services/studentService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceRecordsTable from "./AttendanceRecordsTable";
import { Student } from "@/types";

interface StudentAttendanceViewProps {
  studentId?: string;
}

const StudentAttendanceView = ({ studentId }: StudentAttendanceViewProps) => {
  const { id } = useParams<{ id: string }>();
  const currentStudentId = studentId || id || "";
  const [student, setStudent] = useState<Student | null>(null);

  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ["student", currentStudentId],
    queryFn: () => fetchStudent(currentStudentId),
    enabled: !!currentStudentId,
  });

  useEffect(() => {
    if (studentData) {
      setStudent(studentData);
    }
  }, [studentData]);

  if (isLoadingStudent) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-80" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <Card>
        <CardContent>Student not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {student.firstName} {student.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          Email: {student.email}
          <br />
          Class: {student.classes.join(", ")}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="excuses">Excuses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <AttendanceRecordsTable 
            studentId={currentStudentId} 
            editable={false} 
          />
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardContent>
              <p>Attendance statistics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="excuses" className="space-y-4">
          <Card>
            <CardContent>
              <p>Attendance excuses will be managed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAttendanceView;
