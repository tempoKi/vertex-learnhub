
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AttendanceRecordsTable from "./AttendanceRecordsTable";
import ClassAttendanceView from "./ClassAttendanceView";
import StudentAttendanceView from "./StudentAttendanceView";
import AttendanceStats from "./AttendanceStats";

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>("student1"); // Default student ID

  // Function to handle Take Attendance button click
  const handleTakeAttendance = () => {
    // Switch to the classes tab
    setActiveTab("classes");
    // Clear any selected class to start fresh
    setSelectedClass(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Manage, track, and analyze attendance records
          </p>
        </div>
        <Button 
          className="flex items-center gap-1"
          onClick={handleTakeAttendance}
        >
          <PlusCircle className="h-4 w-4" />
          Take Attendance
        </Button>
      </div>

      <Tabs
        defaultValue="records"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                View and manage attendance records for all classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceRecordsTable studentId={selectedStudent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Attendance</CardTitle>
              <CardDescription>
                View and manage attendance for specific classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Remove classId prop since it doesn't exist on ClassAttendanceView */}
              <ClassAttendanceView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>
                View and manage attendance for individual students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentAttendanceView studentId={selectedStudent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
              <CardDescription>
                Analyze attendance patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceStats />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceDashboard;
