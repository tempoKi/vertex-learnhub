
import { Note, NoteFilter, NoteFormData, NotesResponse, NoteSummary, NoteCategory, NoteVisibility } from "@/types/notes";
import { toast } from "sonner";

// Base API URL - would come from environment in a real app
const API_URL = "http://localhost:5000/api";

// Fetch notes with filters
export const fetchNotes = async (filters: NoteFilter = {}): Promise<NotesResponse> => {
  // In a real app, this would be an actual API call with error handling
  // For now, simulate an API response with mock data
  console.log("Fetching notes with filters:", filters);
  
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  
  // Mock data
  const mockNotes = generateMockNotes(20, filters);
  
  return {
    notes: mockNotes.slice(0, filters.limit || 10),
    pagination: {
      total: mockNotes.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(mockNotes.length / (filters.limit || 10))
    }
  };
};

// Fetch a single note by ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  console.log("Fetching note with ID:", id);
  
  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay
  
  const mockNote = generateMockNotes(1, {})[0];
  mockNote.id = id;
  
  return mockNote;
};

// Create a new note
export const createNote = async (noteData: NoteFormData): Promise<Note> => {
  console.log("Creating note:", noteData);
  
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  
  // Validate required fields
  if (!noteData.content) {
    throw new Error("Note content is required");
  }
  
  if (!noteData.type) {
    throw new Error("Note type is required");
  }
  
  if (!noteData.visibility) {
    throw new Error("Note visibility is required");
  }
  
  if (!noteData.studentId && !noteData.classId) {
    throw new Error("A note must be associated with either a student or a class");
  }
  
  // In a real app, this would post to the API
  // For now, just return a mock note with the provided data
  const newNote: Note = {
    id: `note-${Date.now()}`,
    type: noteData.type,
    visibility: noteData.visibility,
    content: noteData.content,
    tags: noteData.tags || [],
    createdBy: {
      id: "current-user-id",
      username: "current-user"
    },
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    modificationHistory: []
  };
  
  if (noteData.studentId) {
    newNote.student = {
      id: noteData.studentId,
      firstName: "John",
      lastName: "Doe"
    };
  }
  
  if (noteData.classId) {
    newNote.class = {
      id: noteData.classId,
      name: "English 101"
    };
  }
  
  toast.success("Note created successfully");
  return newNote;
};

// Update an existing note
export const updateNote = async (id: string, noteData: Partial<NoteFormData>): Promise<Note> => {
  console.log("Updating note:", id, noteData);
  
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay
  
  // In a real app, this would update via the API
  // For now, just return a mock updated note
  const mockNote = generateMockNotes(1, {})[0];
  mockNote.id = id;
  mockNote.modifiedAt = new Date().toISOString();
  
  // Apply updates
  if (noteData.content) mockNote.content = noteData.content;
  if (noteData.type) mockNote.type = noteData.type;
  if (noteData.visibility) mockNote.visibility = noteData.visibility;
  if (noteData.tags) mockNote.tags = noteData.tags;
  
  toast.success("Note updated successfully");
  return mockNote;
};

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
  console.log("Deleting note:", id);
  
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  
  // In a real app, this would delete via the API
  toast.success("Note deleted successfully");
};

// Fetch notes for a specific student
export const fetchStudentNotes = async (studentId: string, filters: NoteFilter = {}): Promise<NotesResponse> => {
  console.log("Fetching notes for student:", studentId, filters);
  
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  
  // Mock data with student association
  const mockNotes = generateMockNotes(15, { ...filters, studentId });
  
  return {
    notes: mockNotes.slice(0, filters.limit || 10),
    pagination: {
      total: mockNotes.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(mockNotes.length / (filters.limit || 10))
    }
  };
};

// Fetch notes for a specific class
export const fetchClassNotes = async (classId: string, filters: NoteFilter = {}): Promise<NotesResponse> => {
  console.log("Fetching notes for class:", classId, filters);
  
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  
  // Mock data with class association
  const mockNotes = generateMockNotes(12, { ...filters, classId });
  
  return {
    notes: mockNotes.slice(0, filters.limit || 10),
    pagination: {
      total: mockNotes.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(mockNotes.length / (filters.limit || 10))
    }
  };
};

// Search notes with more advanced filtering
export const searchNotes = async (filters: NoteFilter = {}): Promise<NotesResponse> => {
  console.log("Searching notes with filters:", filters);
  
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  
  // Mock search results
  const mockNotes = generateMockNotes(filters.search ? 5 : 20, filters);
  
  return {
    notes: mockNotes.slice(0, filters.limit || 10),
    pagination: {
      total: mockNotes.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(mockNotes.length / (filters.limit || 10))
    }
  };
};

// Get notes summary (counts, recent notes)
export const fetchNotesSummary = async (): Promise<NoteSummary> => {
  console.log("Fetching notes summary");
  
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  
  // Mock summary data
  const recentNotes = generateMockNotes(5, {});
  
  return {
    total: 42,
    byType: {
      academic: 15,
      behavioral: 12,
      attendance: 8,
      general: 7
    },
    recent: recentNotes
  };
};

// Helper function to generate mock notes data for development
function generateMockNotes(count: number, filters: Partial<NoteFilter>): Note[] {
  const notes: Note[] = [];
  const types: NoteCategory[] = ['academic', 'behavioral', 'attendance', 'general'];
  const visibilities: NoteVisibility[] = ['teacher_only', 'all_staff', 'manager_only'];
  
  // Sample student names
  const students = [
    { id: "s1", firstName: "Emma", lastName: "Thompson" },
    { id: "s2", firstName: "James", lastName: "Wilson" },
    { id: "s3", firstName: "Sophia", lastName: "Martinez" },
    { id: "s4", firstName: "Alex", lastName: "Johnson" },
  ];
  
  // Sample class names
  const classes = [
    { id: "c1", name: "English 101" },
    { id: "c2", name: "Mathematics" },
    { id: "c3", name: "Science" },
    { id: "c4", name: "History" },
  ];
  
  // Sample tags
  const allTags = ["important", "follow-up", "parent-contact", "assessment", "discussion", "homework", "quiz", "exam", "project", "meeting"];
  
  for (let i = 0; i < count; i++) {
    // Generate random content based on type
    const type = filters.type || types[Math.floor(Math.random() * types.length)];
    let content = "";
    
    switch (type) {
      case 'academic':
        content = "Student demonstrated strong critical thinking skills during today's discussion. Participation was active and responses were well thought out.";
        break;
      case 'behavioral':
        content = "Student was disruptive during group work. Had a conversation about respectful behavior. Will follow up next week.";
        break;
      case 'attendance':
        content = "Student was 15 minutes late to class. This is the third occurrence this month.";
        break;
      case 'general':
        content = "Parent requested additional study materials for upcoming exam. Provided resources via email.";
        break;
    }
    
    // If search filter is applied, make sure some notes contain the search term
    if (filters.search && i < 3) {
      content = `${filters.search} ${content}`;
    }
    
    // Select random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags: string[] = [];
    for (let j = 0; j < numTags; j++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    // If tag filter is applied, include those tags
    if (filters.tags && filters.tags.length > 0) {
      tags.push(...filters.tags);
    }
    
    // Create the note
    const note: Note = {
      id: `note-${i + 1}`,
      type,
      visibility: filters.visibility || visibilities[Math.floor(Math.random() * visibilities.length)],
      content,
      tags,
      createdBy: {
        id: "teacher-1",
        username: "jdoe_teacher"
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
      modifiedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)).toISOString(),
    };
    
    // Add a student if no specific filter, or if it matches the filter
    if (!filters.classId && (!filters.studentId || Math.random() > 0.5)) {
      const studentIndex = filters.studentId 
        ? students.findIndex(s => s.id === filters.studentId)
        : Math.floor(Math.random() * students.length);
        
      note.student = students[studentIndex >= 0 ? studentIndex : 0];
    }
    
    // Add a class if no specific student filter, or if it matches the filter
    if (!filters.studentId && (!filters.classId || Math.random() > 0.5)) {
      const classIndex = filters.classId 
        ? classes.findIndex(c => c.id === filters.classId)
        : Math.floor(Math.random() * classes.length);
        
      note.class = classes[classIndex >= 0 ? classIndex : 0];
    }
    
    // Add modification history for some notes
    if (Math.random() > 0.7) {
      note.modificationHistory = [
        {
          modifiedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 86400000)).toISOString(),
          modifiedBy: {
            id: "teacher-1",
            username: "jdoe_teacher"
          },
          changes: {
            content: "Updated content",
            tags: ["previous", "tags"]
          }
        }
      ];
      
      note.modifiedBy = {
        id: "teacher-1",
        username: "jdoe_teacher"
      };
    }
    
    notes.push(note);
  }
  
  return notes;
}
