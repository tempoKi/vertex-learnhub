import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/notes";
import { 
  getNoteTypeIcon, 
  getNoteTypeColor, 
  getNoteTypeName,
  getVisibilityIcon,
  getVisibilityName,
  canEditNote,
  canViewNotes
} from "@/lib/noteUtils";
import { 
  Pencil, 
  Trash2, 
  User, 
  Users 
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { deleteNote, updateNote } from "@/services/notesService";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, hasNotesPermission } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteDetailDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteUpdated?: () => void;
  onStudentSelect?: (studentId: string) => void;
  onClassSelect?: (classId: string) => void;
}

const NoteDetailDialog = ({
  note,
  open,
  onOpenChange,
  onNoteUpdated,
  onStudentSelect,
  onClassSelect
}: NoteDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedType, setEditedType] = useState<string>("");
  const [editedVisibility, setEditedVisibility] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  if (!currentUser || !hasNotesPermission()) {
    if (open) {
      onOpenChange(false);
      toast({
        title: "Access Denied",
        description: "You don't have permission to view notes.",
        variant: "destructive",
      });
    }
    return null;
  }
  
  const handleEditStart = () => {
    if (!note) return;
    
    setEditedContent(note.content);
    setEditedType(note.type);
    setEditedVisibility(note.visibility);
    setIsEditing(true);
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (!note) return;
    
    try {
      setIsSaving(true);
      
      await updateNote(note.id, {
        content: editedContent,
        type: editedType as any,
        visibility: editedVisibility as any
      });
      
      setIsEditing(false);
      onNoteUpdated?.();
      
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!note) return;
    
    try {
      await deleteNote(note.id);
      setIsDeleting(false);
      onOpenChange(false);
      onNoteUpdated?.();
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!note) return null;
  
  const TypeIcon = getNoteTypeIcon(note.type);
  const typeColor = getNoteTypeColor(note.type);
  const VisibilityIcon = getVisibilityIcon(note.visibility);
  const canEdit = currentUser ? canEditNote(note, currentUser.id) : false;
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TypeIcon className={`h-5 w-5 ${typeColor}`} />
              <span>{getNoteTypeName(note.type)} Note</span>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <span>Created by {note.createdBy.username}</span>
              <span>•</span>
              <span title={format(new Date(note.createdAt), 'PPP p')}>
                {format(new Date(note.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <VisibilityIcon className="h-4 w-4" />
              <span>{getVisibilityName(note.visibility)}</span>
            </div>
          </div>
          
          {!isEditing ? (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap">{note.content}</div>
              
              {(note.student || note.class) && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Related to:</h3>
                  
                  {note.student && (
                    <div 
                      className="flex items-center gap-2 text-sm hover:underline cursor-pointer"
                      onClick={() => onStudentSelect?.(note.student?.id || "")}
                    >
                      <User className="h-4 w-4" />
                      <span>Student: {note.student.firstName} {note.student.lastName}</span>
                    </div>
                  )}
                  
                  {note.class && (
                    <div 
                      className="flex items-center gap-2 text-sm hover:underline cursor-pointer mt-1"
                      onClick={() => onClassSelect?.(note.class?.id || "")}
                    >
                      <Users className="h-4 w-4" />
                      <span>Class: {note.class.name}</span>
                    </div>
                  )}
                </div>
              )}
              
              {note.modificationHistory && note.modificationHistory.length > 0 && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Modification History</h3>
                    <div className="space-y-2">
                      {note.modificationHistory.map((mod, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          <div>
                            {mod.modifiedBy.username} - {format(new Date(mod.modifiedAt), 'MMM d, yyyy h:mm a')}
                          </div>
                          <div className="mt-1">
                            {Object.entries(mod.changes).map(([field, value]) => (
                              <div key={field} className="ml-2">
                                <span className="font-medium">{field}:</span> {
                                  typeof value === 'string' ? value : JSON.stringify(value)
                                }
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={editedType}
                    onValueChange={setEditedType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visibility</label>
                  <Select
                    value={editedVisibility}
                    onValueChange={setEditedVisibility}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher_only">Teacher Only</SelectItem>
                      <SelectItem value="all_staff">All Staff</SelectItem>
                      <SelectItem value="manager_only">Manager Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Note content..."
                  rows={8}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            {canEdit && !isEditing && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsDeleting(true)}
                  className="mr-auto"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleEditStart}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
            
            {isEditing && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleEditCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteDetailDialog;
