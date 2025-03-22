
import { Note } from "@/types/notes";
import { formatDistanceToNow } from "date-fns";
import { getNoteTypeIcon, getNoteTypeColor, canViewNotes } from "@/lib/noteUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import NoteDetailDialog from "./NoteDetailDialog";
import { getCurrentUser } from "@/lib/auth";

interface RecentNotesListProps {
  notes: Note[];
  onStudentSelect?: (studentId: string) => void;
  onClassSelect?: (classId: string) => void;
}

const RecentNotesList = ({ 
  notes,
  onStudentSelect,
  onClassSelect 
}: RecentNotesListProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const currentUser = getCurrentUser();
  
  // Check if the user has permission to view notes
  if (!currentUser || !canViewNotes(currentUser.role)) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        You don't have permission to view notes.
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No recent notes found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {notes.map((note) => {
          const Icon = getNoteTypeIcon(note.type);
          const colorClass = getNoteTypeColor(note.type);
          
          return (
            <div key={note.id} className="flex gap-4 p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${colorClass} bg-opacity-15`}>
                <Icon className={`h-5 w-5 ${colorClass}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium truncate">
                      {note.student ? (
                        <button 
                          className="hover:underline"
                          onClick={() => onStudentSelect?.(note.student?.id || "")}
                        >
                          {note.student.firstName} {note.student.lastName}
                        </button>
                      ) : note.class ? (
                        <button 
                          className="hover:underline"
                          onClick={() => onClassSelect?.(note.class?.id || "")}
                        >
                          {note.class.name}
                        </button>
                      ) : "Untitled"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setSelectedNote(note)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="mt-1 text-sm line-clamp-2">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <NoteDetailDialog
        note={selectedNote}
        open={!!selectedNote}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      />
    </>
  );
};

export default RecentNotesList;
