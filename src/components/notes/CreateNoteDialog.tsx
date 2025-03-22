
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { NoteFormData } from "@/types/notes";
import { Badge } from "@/components/ui/badge";
import { createNote } from "@/services/notesService";
import { toast } from "sonner";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteCreated: () => void;
  initialStudentId?: string;
  initialClassId?: string;
}

const CreateNoteDialog = ({
  open,
  onOpenChange,
  onNoteCreated,
  initialStudentId,
  initialClassId
}: CreateNoteDialogProps) => {
  const [formData, setFormData] = useState<NoteFormData>({
    type: "general",
    visibility: "teacher_only",
    content: "",
    tags: [],
    studentId: initialStudentId,
    classId: initialClassId
  });
  
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<"student" | "class">(
    initialStudentId ? "student" : initialClassId ? "class" : "student"
  );
  
  // Reset form when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form on close if not submitting
      if (!isSubmitting) {
        resetForm();
      }
    }
    onOpenChange(newOpen);
  };
  
  const resetForm = () => {
    setFormData({
      type: "general",
      visibility: "teacher_only",
      content: "",
      tags: [],
      studentId: initialStudentId,
      classId: initialClassId
    });
    setTag("");
    setSelectedTarget(initialStudentId ? "student" : initialClassId ? "class" : "student");
  };
  
  const addTag = () => {
    if (!tag.trim()) return;
    
    const newTags = [...formData.tags];
    if (!newTags.includes(tag.trim())) {
      newTags.push(tag.trim());
      setFormData({ ...formData, tags: newTags });
    }
    
    setTag("");
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (!formData.content.trim()) {
        toast.error("Note content is required");
        return;
      }
      
      // Ensure either studentId or classId is set based on selected target
      const submitData = {
        ...formData,
        studentId: selectedTarget === "student" ? formData.studentId : undefined,
        classId: selectedTarget === "class" ? formData.classId : undefined
      };
      
      if (selectedTarget === "student" && !submitData.studentId) {
        toast.error("Please select a student");
        return;
      }
      
      if (selectedTarget === "class" && !submitData.classId) {
        toast.error("Please select a class");
        return;
      }
      
      setIsSubmitting(true);
      await createNote(submitData);
      onNoteCreated();
      resetForm();
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="note-type">Note Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger id="note-type">
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
              <Label htmlFor="note-visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value as any })}
              >
                <SelectTrigger id="note-visibility">
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
            <Label htmlFor="note-target-type">Note Related To</Label>
            <Select
              value={selectedTarget}
              onValueChange={(value) => setSelectedTarget(value as "student" | "class")}
            >
              <SelectTrigger id="note-target-type">
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedTarget === "student" && (
            <div className="space-y-2">
              <Label htmlFor="student-id">Student</Label>
              <Select
                value={formData.studentId || ""}
                onValueChange={(value) => setFormData({ ...formData, studentId: value })}
              >
                <SelectTrigger id="student-id">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Emma Thompson</SelectItem>
                  <SelectItem value="s2">James Wilson</SelectItem>
                  <SelectItem value="s3">Sophia Martinez</SelectItem>
                  <SelectItem value="s4">Alex Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedTarget === "class" && (
            <div className="space-y-2">
              <Label htmlFor="class-id">Class</Label>
              <Select
                value={formData.classId || ""}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
              >
                <SelectTrigger id="class-id">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">English 101</SelectItem>
                  <SelectItem value="c2">Mathematics</SelectItem>
                  <SelectItem value="c3">Science</SelectItem>
                  <SelectItem value="c4">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              placeholder="Write your note here..."
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note-tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="note-tags"
                placeholder="Add a tag..."
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((t) => (
                  <Badge key={t} className="pr-1.5">
                    {t}
                    <button 
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => removeTag(t)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
