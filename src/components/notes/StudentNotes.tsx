
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentNotes } from "@/services/notesService";
import { NoteFilter } from "@/types/notes";
import NotesTable from "./NotesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle } from "lucide-react";
import NotesFilterDialog from "./NotesFilterDialog";
import CreateNoteDialog from "./CreateNoteDialog";
import { getCurrentUser, hasNotesPermission } from "@/lib/auth";
import { canCreateNotes, canAccessStudentNotesTab } from "@/lib/noteUtils";

interface StudentNotesProps {
  studentId: string;
}

const StudentNotes = ({ studentId }: StudentNotesProps) => {
  const [filters, setFilters] = useState<NoteFilter>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const currentUser = getCurrentUser();
  
  // Check if the user has permission to view notes
  if (!currentUser || !hasNotesPermission() || !canAccessStudentNotesTab(currentUser.role)) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4 text-muted-foreground">
            You don't have permission to view student notes. Please contact your administrator.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { data, isLoading } = useQuery({
    queryKey: ["studentNotes", studentId, filters],
    queryFn: () => fetchStudentNotes(studentId, filters),
  });
  
  const handleFilterChange = (newFilters: Partial<NoteFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page on filter change
    }));
  };
  
  const handleNoteCreated = () => {
    setIsCreateDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">
            {data?.notes[0]?.student 
              ? `${data.notes[0].student.firstName} ${data.notes[0].student.lastName}'s Notes`
              : "Student Notes"}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            {currentUser && canCreateNotes(currentUser.role) && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <NotesTable 
            initialFilters={{ ...filters, studentId }}
          />
        </CardContent>
      </Card>
      
      <NotesFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {currentUser && canCreateNotes(currentUser.role) && (
        <CreateNoteDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onNoteCreated={handleNoteCreated}
          initialStudentId={studentId}
        />
      )}
    </div>
  );
};

export default StudentNotes;
