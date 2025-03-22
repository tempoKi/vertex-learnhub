
import { User } from ".";

export type NoteCategory = 'academic' | 'behavioral' | 'attendance' | 'general';
export type NoteVisibility = 'teacher_only' | 'all_staff' | 'manager_only';

export interface Note {
  id: string;
  type: NoteCategory;
  visibility: NoteVisibility;
  content: string;
  tags: string[];
  createdBy: {
    id: string;
    username: string;
  };
  createdAt: string;
  modifiedAt: string;
  modifiedBy?: {
    id: string;
    username: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  class?: {
    id: string;
    name: string;
  };
  relatedTo?: {
    type: string;
    id: string;
  };
  modificationHistory?: {
    modifiedAt: string;
    modifiedBy: {
      id: string;
      username: string;
    };
    changes: Record<string, any>;
  }[];
}

export interface NoteFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: NoteCategory;
  visibility?: NoteVisibility;
  studentId?: string;
  classId?: string;
  tags?: string[];
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface NoteFormData {
  type: NoteCategory;
  visibility: NoteVisibility;
  content: string;
  tags: string[];
  studentId?: string;
  classId?: string;
  relatedTo?: {
    type: string;
    id: string;
  };
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NoteSummary {
  total: number;
  byType: Record<NoteCategory, number>;
  recent: Note[];
}
