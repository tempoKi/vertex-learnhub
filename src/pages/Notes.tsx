
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotesDashboard from "@/components/notes/NotesDashboard";
import NotesTable from "@/components/notes/NotesTable";
import StudentNotes from "@/components/notes/StudentNotes";
import ClassNotes from "@/components/notes/ClassNotes";
import CreateNoteDialog from "@/components/notes/CreateNoteDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { fetchNotesSummary } from "@/services/notesService";
import { 
  canCreateNotes,
  canAccessAllNotesTab,
  canAccessStudentNotesTab,
  canAccessClassNotesTab 
} from "@/lib/noteUtils";

const Notes = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Fetch notes summary for the dashboard
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["notesSummary"],
    queryFn: fetchNotesSummary,
  });

  useEffect(() => {
    // Check if user has permission to access this page - Removed Secretary
    if (!hasPermission(["SuperAdmin", "Manager", "Teacher"])) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [navigate]);

  // Clear selections when changing tabs
  useEffect(() => {
    if (activeTab !== "studentNotes") {
      setSelectedStudentId(null);
    }
    if (activeTab !== "classNotes") {
      setSelectedClassId(null);
    }
  }, [activeTab]);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab("studentNotes");
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab("classNotes");
  };

  const handleNoteCreated = () => {
    setIsCreateDialogOpen(false);
    toast.success("Note created successfully");
    
    // Refresh the data based on the active tab
    // In a real app, this would be handled with react-query's invalidation
  };

  // Check user's role for tab access permissions
  const canAccessAllNotes = user ? canAccessAllNotesTab(user.role) : false;
  const canAccessStudentNotes = user ? canAccessStudentNotesTab(user.role) : false;
  const canAccessClassNotes = user ? canAccessClassNotesTab(user.role) : false;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Notes Management</h1>
            <p className="text-muted-foreground">
              Create, view, and manage notes for students and classes
            </p>
          </div>
          {user && canCreateNotes(user.role) && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 max-w-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger 
              value="allNotes" 
              disabled={!canAccessAllNotes}
              className={!canAccessAllNotes ? "opacity-50 cursor-not-allowed" : ""}
            >
              All Notes
            </TabsTrigger>
            <TabsTrigger 
              value="studentNotes" 
              disabled={!selectedStudentId || !canAccessStudentNotes}
              className={!canAccessStudentNotes ? "opacity-50 cursor-not-allowed" : ""}
            >
              Student Notes
            </TabsTrigger>
            <TabsTrigger 
              value="classNotes" 
              disabled={!selectedClassId || !canAccessClassNotes}
              className={!canAccessClassNotes ? "opacity-50 cursor-not-allowed" : ""}
            >
              Class Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 mt-6">
            <NotesDashboard 
              summary={summaryData}
              isLoading={isSummaryLoading}
              onStudentSelect={handleStudentSelect}
              onClassSelect={handleClassSelect}
            />
          </TabsContent>
          
          <TabsContent value="allNotes" className="space-y-4 mt-6">
            {canAccessAllNotes ? (
              <NotesTable 
                onStudentSelect={handleStudentSelect}
                onClassSelect={handleClassSelect}
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>You don't have permission to view all notes.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="studentNotes" className="space-y-4 mt-6">
            {selectedStudentId && canAccessStudentNotes ? (
              <StudentNotes 
                studentId={selectedStudentId} 
              />
            ) : (
              <div className="text-center py-10">
                <p>Select a student to view notes</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="classNotes" className="space-y-4 mt-6">
            {selectedClassId && canAccessClassNotes ? (
              <ClassNotes 
                classId={selectedClassId} 
              />
            ) : (
              <div className="text-center py-10">
                <p>Select a class to view notes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {user && canCreateNotes(user.role) && (
        <CreateNoteDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onNoteCreated={handleNoteCreated}
          initialStudentId={selectedStudentId || undefined}
          initialClassId={selectedClassId || undefined}
        />
      )}
    </MainLayout>
  );
};

export default Notes;
