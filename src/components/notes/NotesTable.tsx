
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/services/notesService";
import { NoteFilter, Note } from "@/types/notes";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  formatDistanceToNow, 
  format 
} from "date-fns";
import { 
  getNoteTypeIcon, 
  getNoteTypeColor, 
  getNoteTypeName,
  getVisibilityName,
  canViewNotes
} from "@/lib/noteUtils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import NotesFilterDialog from "./NotesFilterDialog";
import NoteDetailDialog from "./NoteDetailDialog";
import { getCurrentUser, hasNotesPermission } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NotesTableProps {
  onStudentSelect?: (studentId: string) => void;
  onClassSelect?: (classId: string) => void;
  initialFilters?: Partial<NoteFilter>;
}

const NotesTable = ({
  onStudentSelect,
  onClassSelect,
  initialFilters = {}
}: NotesTableProps) => {
  const [filters, setFilters] = useState<NoteFilter>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters
  });
  
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  // Check if the user has permission to view notes
  if (!currentUser || !hasNotesPermission()) {
    // Redirect to dashboard or show a permission denied message
    toast.error("You don't have permission to view notes");
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notes</h2>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4 text-muted-foreground">
              You don't have permission to view notes. Please contact your administrator.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", filters],
    queryFn: () => fetchNotes(filters),
  });
  
  const handleFilterChange = (newFilters: Partial<NoteFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Error loading notes. Please try again.
                  </TableCell>
                </TableRow>
              ) : data?.notes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No notes found with the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                data?.notes.map(note => {
                  const Icon = getNoteTypeIcon(note.type);
                  const colorClass = getNoteTypeColor(note.type);
                  
                  return (
                    <TableRow key={note.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${colorClass} bg-opacity-15`}>
                            <Icon className={`h-4 w-4 ${colorClass}`} />
                          </div>
                          <span className="text-xs font-medium">
                            {getNoteTypeName(note.type)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-2 text-sm">
                          {note.content}
                        </p>
                      </TableCell>
                      <TableCell>
                        {note.student ? (
                          <button 
                            className="text-sm hover:underline"
                            onClick={() => onStudentSelect?.(note.student?.id || "")}
                          >
                            {note.student.firstName} {note.student.lastName}
                          </button>
                        ) : note.class ? (
                          <button 
                            className="text-sm hover:underline"
                            onClick={() => onClassSelect?.(note.class?.id || "")}
                          >
                            {note.class.name}
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span title={format(new Date(note.createdAt), 'PPP p')}>
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {getVisibilityName(note.visibility)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setSelectedNote(note)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {data && data.pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {filters.page && filters.page > 1 ? (
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, filters.page ? filters.page - 1 : 1))}
                />
              ) : (
                <PaginationPrevious 
                  className="pointer-events-none opacity-50"
                />
              )}
            </PaginationItem>
            
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                const currentPage = filters.page || 1;
                return page === 1 || 
                       page === data.pagination.totalPages || 
                       Math.abs(page - currentPage) <= 1;
              })
              .reduce((items, page, i, filteredPages) => {
                if (i > 0 && filteredPages[i - 1] !== page - 1) {
                  items.push(
                    <PaginationItem key={`ellipsis-${page}`}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  );
                }
                
                items.push(
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === filters.page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
                
                return items;
              }, [] as React.ReactNode[])
            }
            
            <PaginationItem>
              {filters.page && filters.page < data.pagination.totalPages ? (
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(
                    data.pagination.totalPages, 
                    filters.page ? filters.page + 1 : 2
                  ))}
                />
              ) : (
                <PaginationNext 
                  className="pointer-events-none opacity-50"
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <NotesFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <NoteDetailDialog
        note={selectedNote}
        open={!!selectedNote}
        onOpenChange={(open) => !open && setSelectedNote(null)}
        onStudentSelect={onStudentSelect}
        onClassSelect={onClassSelect}
      />
    </div>
  );
};

export default NotesTable;
