
import { 
  BookOpen, 
  AlertCircle, 
  Clock, 
  FileText, 
  User, 
  Users, 
  Eye, 
  EyeOff, 
  Shield 
} from "lucide-react";
import { Note } from "@/types/notes";

// Get the appropriate icon for each note type
export const getNoteTypeIcon = (type: string) => {
  switch (type) {
    case "academic":
      return BookOpen;
    case "behavioral":
      return AlertCircle;
    case "attendance":
      return Clock;
    default:
      return FileText;
  }
};

// Get the color class for each note type
export const getNoteTypeColor = (type: string) => {
  switch (type) {
    case "academic":
      return "text-blue-500";
    case "behavioral":
      return "text-amber-500";
    case "attendance":
      return "text-purple-500";
    default:
      return "text-green-500";
  }
};

// Get the display name for each note type
export const getNoteTypeName = (type: string) => {
  switch (type) {
    case "academic":
      return "Academic";
    case "behavioral":
      return "Behavioral";
    case "attendance":
      return "Attendance";
    default:
      return "General";
  }
};

// Get the visibility icon
export const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case "teacher_only":
      return User;
    case "all_staff":
      return Users;
    case "manager_only":
      return Shield;
    default:
      return EyeOff;
  }
};

// Get the visibility display name
export const getVisibilityName = (visibility: string) => {
  switch (visibility) {
    case "teacher_only":
      return "Teacher Only";
    case "all_staff":
      return "All Staff";
    case "manager_only":
      return "Manager Only";
    default:
      return "Private";
  }
};

// Check if a user can edit a note (only the creator or admins/managers)
export const canEditNote = (note: Note, currentUserId: string) => {
  return note.createdBy.id === currentUserId || note.modifiedBy?.id === currentUserId;
};

// Check if a user has permission to view notes based on their role
export const canViewNotes = (role: string) => {
  // Only SuperAdmin, Manager, and Teacher can view notes
  return ["SuperAdmin", "Manager", "Teacher"].includes(role);
};

// Check if a user has permission to create notes based on their role
export const canCreateNotes = (role: string) => {
  // Only Teachers can create notes
  return role === "Teacher";
};

// Permission functions for specific tabs/features
export const canAccessAllNotesTab = (role: string) => {
  return ["SuperAdmin", "Manager"].includes(role);
};

export const canAccessStudentNotesTab = (role: string) => {
  return ["SuperAdmin", "Manager", "Teacher"].includes(role);
};

export const canAccessClassNotesTab = (role: string) => {
  return ["SuperAdmin", "Manager", "Teacher"].includes(role);
};
