
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAttendanceRecords, verifyExcuse, addExcuse } from "@/services/attendanceService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AttendanceFilter, AttendanceRecord, ExcuseStatus, StudentAttendance } from "@/types/attendance";
import { AlertCircle, CheckCircle, Clock, Download, FileText, ThumbsDown, ThumbsUp, Upload, X } from "lucide-react";

interface ExcuseManagementProps {
  canApprove?: boolean;
}

const ExcuseManagement = ({ canApprove = false }: ExcuseManagementProps) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedExcuse, setSelectedExcuse] = useState<{
    record: AttendanceRecord;
    student: StudentAttendance;
  } | null>(null);
  const [newExcuse, setNewExcuse] = useState({
    classId: "",
    date: "",
    studentId: "",
    reason: "",
    documentUrl: "",
    notes: ""
  });
  
  const queryClient = useQueryClient();
  
  // Fetch excuses with different status
  const fetchExcusesByStatus = (status: ExcuseStatus) => {
    const filter: AttendanceFilter = {
      // In a real app, you would have a dedicated API endpoint for excuses
      page: 1,
      limit: 50
    };
    
    return fetchAttendanceRecords(filter);
  };
  
  // Queries for different excuse statuses
  const { data: pendingExcuses, isLoading: isLoadingPending } = useQuery({
    queryKey: ["excuses", "pending"],
    queryFn: () => fetchExcusesByStatus("pending")
  });
  
  const { data: approvedExcuses, isLoading: isLoadingApproved } = useQuery({
    queryKey: ["excuses", "approved"],
    queryFn: () => fetchExcusesByStatus("approved"),
    enabled: activeTab === "approved"
  });
  
  const { data: rejectedExcuses, isLoading: isLoadingRejected } = useQuery({
    queryKey: ["excuses", "rejected"],
    queryFn: () => fetchExcusesByStatus("rejected"),
    enabled: activeTab === "rejected"
  });
  
  // Verify excuse mutation
  const verifyExcuseMutation = useMutation({
    mutationFn: (params: { 
      classId: string; 
      date: string; 
      studentId: string; 
      status: 'approved' | 'rejected';
    }) => {
      return verifyExcuse(
        params.classId,
        params.date,
        params.studentId,
        params.status
      );
    },
    onSuccess: () => {
      toast.success("Excuse status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["excuses"] });
      setSelectedExcuse(null);
    },
    onError: () => {
      toast.error("Failed to update excuse status");
    }
  });
  
  // Add excuse mutation
  const addExcuseMutation = useMutation({
    mutationFn: (params: typeof newExcuse) => {
      return addExcuse(
        params.classId,
        params.date,
        params.studentId,
        params.reason,
        params.documentUrl,
        params.notes
      );
    },
    onSuccess: () => {
      toast.success("Excuse added successfully");
      queryClient.invalidateQueries({ queryKey: ["excuses"] });
      setNewExcuse({
        classId: "",
        date: "",
        studentId: "",
        reason: "",
        documentUrl: "",
        notes: ""
      });
    },
    onError: () => {
      toast.error("Failed to add excuse");
    }
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: ExcuseStatus) => {
    const colors: Record<ExcuseStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={cn("font-normal", colors[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Get status icon
  const getStatusIcon = (status: ExcuseStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Handle excuse verification
  const handleVerifyExcuse = (status: 'approved' | 'rejected') => {
    if (!selectedExcuse) return;
    
    verifyExcuseMutation.mutate({
      classId: selectedExcuse.record.classId,
      date: selectedExcuse.record.date,
      studentId: selectedExcuse.student.studentId,
      status
    });
  };
  
  // Handle new excuse submission
  const handleAddExcuse = () => {
    // Validate form
    if (!newExcuse.classId || !newExcuse.date || !newExcuse.studentId || !newExcuse.reason) {
      toast.error("Please fill all required fields");
      return;
    }
    
    addExcuseMutation.mutate(newExcuse);
  };
  
  // Filter excuses with the given status from attendance records
  const filterExcusesWithStatus = (
    records: AttendanceRecord[] | undefined, 
    status: ExcuseStatus
  ) => {
    if (!records) return [];
    
    return records.flatMap(record => {
      const studentsWithExcuses = record.students.filter(
        student => student.excuse && student.excuse.status === status
      );
      
      return studentsWithExcuses.map(student => ({ record, student }));
    });
  };
  
  // Get excuses for the active tab
  const getActiveExcuses = () => {
    switch (activeTab) {
      case "pending":
        return filterExcusesWithStatus(pendingExcuses?.records, "pending");
      case "approved":
        return filterExcusesWithStatus(approvedExcuses?.records, "approved");
      case "rejected":
        return filterExcusesWithStatus(rejectedExcuses?.records, "rejected");
      default:
        return [];
    }
  };
  
  // Display loading state based on active tab
  const isLoadingActive = () => {
    switch (activeTab) {
      case "pending":
        return isLoadingPending;
      case "approved":
        return isLoadingApproved;
      case "rejected":
        return isLoadingRejected;
      default:
        return false;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Excuse Management</CardTitle>
        <CardDescription>
          Review and manage absence excuses submitted by students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Submit New Excuse
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Absence Excuse</DialogTitle>
                    <DialogDescription>
                      Provide details about the absence and supporting documentation if available.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select
                          value={newExcuse.classId}
                          onValueChange={(value) => setNewExcuse({...newExcuse, classId: value})}
                        >
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class1">Mathematics 101</SelectItem>
                            <SelectItem value="class2">Physics Fundamentals</SelectItem>
                            <SelectItem value="class3">English Literature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Absence Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newExcuse.date}
                          onChange={(e) => setNewExcuse({...newExcuse, date: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="student">Student</Label>
                      <Select
                        value={newExcuse.studentId}
                        onValueChange={(value) => setNewExcuse({...newExcuse, studentId: value})}
                      >
                        <SelectTrigger id="student">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student1">John Doe</SelectItem>
                          <SelectItem value="student2">Jane Smith</SelectItem>
                          <SelectItem value="student3">Bob Johnson</SelectItem>
                          <SelectItem value="student4">Alice Williams</SelectItem>
                          <SelectItem value="student5">Charlie Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Absence</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain the reason for absence"
                        value={newExcuse.reason}
                        onChange={(e) => setNewExcuse({...newExcuse, reason: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document">Supporting Document (optional)</Label>
                      <Input
                        id="document"
                        type="text"
                        placeholder="URL to supporting document"
                        value={newExcuse.documentUrl}
                        onChange={(e) => setNewExcuse({...newExcuse, documentUrl: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information"
                        value={newExcuse.notes}
                        onChange={(e) => setNewExcuse({...newExcuse, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddExcuse} disabled={addExcuseMutation.isPending}>
                      Submit Excuse
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <ExcuseList 
              excuses={getActiveExcuses()} 
              isLoading={isLoadingActive()} 
              onSelect={setSelectedExcuse}
              canApprove={canApprove}
            />
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4 mt-4">
            <ExcuseList 
              excuses={getActiveExcuses()} 
              isLoading={isLoadingActive()} 
              onSelect={setSelectedExcuse}
              canApprove={false}
            />
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4 mt-4">
            <ExcuseList 
              excuses={getActiveExcuses()} 
              isLoading={isLoadingActive()} 
              onSelect={setSelectedExcuse}
              canApprove={false}
            />
          </TabsContent>
        </Tabs>
        
        {selectedExcuse && (
          <Dialog open={!!selectedExcuse} onOpenChange={(open) => !open && setSelectedExcuse(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excuse Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Student</h3>
                    <p>{selectedExcuse.student.studentName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Class</h3>
                    <p>{selectedExcuse.record.className}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Date</h3>
                    <p>{formatDate(selectedExcuse.record.date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedExcuse.student.excuse?.status || "pending")}
                      <span className="ml-1">
                        {getStatusBadge(selectedExcuse.student.excuse?.status || "pending")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Reason</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedExcuse.student.excuse?.reason || "No reason provided"}
                  </p>
                </div>
                
                {selectedExcuse.student.excuse?.documentUrl && (
                  <div>
                    <h3 className="text-sm font-medium">Supporting Document</h3>
                    <div className="mt-1">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={selectedExcuse.student.excuse.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Document
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedExcuse.student.excuse?.notes && (
                  <div>
                    <h3 className="text-sm font-medium">Additional Notes</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedExcuse.student.excuse.notes}
                    </p>
                  </div>
                )}
                
                {selectedExcuse.student.excuse?.verifiedBy && (
                  <div>
                    <h3 className="text-sm font-medium">Verified By</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedExcuse.student.excuse.verifiedBy}
                      {selectedExcuse.student.excuse.verifiedAt && 
                        ` on ${formatDate(selectedExcuse.student.excuse.verifiedAt)}`}
                    </p>
                  </div>
                )}
              </div>
              
              {canApprove && selectedExcuse.student.excuse?.status === "pending" && (
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVerifyExcuse("rejected")}
                    disabled={verifyExcuseMutation.isPending}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleVerifyExcuse("approved")}
                    disabled={verifyExcuseMutation.isPending}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

// Excuse list component
interface ExcuseListProps {
  excuses: Array<{
    record: AttendanceRecord;
    student: StudentAttendance;
  }>;
  isLoading: boolean;
  onSelect: (excuse: { record: AttendanceRecord; student: StudentAttendance }) => void;
  canApprove?: boolean;
}

const ExcuseList = ({ excuses, isLoading, onSelect, canApprove }: ExcuseListProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: ExcuseStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p>Loading excuses...</p>
      </div>
    );
  }
  
  if (excuses.length === 0) {
    return (
      <div className="py-8 text-center border rounded-md bg-muted/50">
        <p>No excuses found</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {excuses.map((excuse, index) => (
            <TableRow key={`${excuse.record.id}-${excuse.student.studentId}-${index}`}>
              <TableCell>{formatDate(excuse.record.date)}</TableCell>
              <TableCell className="font-medium">{excuse.student.studentName}</TableCell>
              <TableCell>{excuse.record.className}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {excuse.student.excuse?.reason || "No reason provided"}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(excuse.student.excuse?.status || "pending")}
                </div>
              </TableCell>
              <TableCell>
                {excuse.student.excuse?.documentUrl ? (
                  <Button variant="ghost" size="sm" asChild>
                    <a 
                      href={excuse.student.excuse.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSelect(excuse)}
                >
                  View
                </Button>
                {canApprove && excuse.student.excuse?.status === "pending" && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-green-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExcuseManagement;
