import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { NoteFilter } from "@/types/notes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotesFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: NoteFilter;
  onFilterChange: (filters: Partial<NoteFilter>) => void;
}

const NotesFilterDialog = ({
  open,
  onOpenChange,
  currentFilters,
  onFilterChange
}: NotesFilterDialogProps) => {
  const [filter, setFilter] = useState<NoteFilter>({ ...currentFilters });
  const [tag, setTag] = useState("");
  
  useEffect(() => {
    if (open) {
      setFilter({ ...currentFilters });
    }
  }, [open, currentFilters]);
  
  const handleSubmit = () => {
    onFilterChange(filter);
    onOpenChange(false);
  };
  
  const handleReset = () => {
    const resetFilter: NoteFilter = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc"
    };
    
    setFilter(resetFilter);
    onFilterChange(resetFilter);
    onOpenChange(false);
  };
  
  const addTag = () => {
    if (!tag.trim()) return;
    
    const newTags = [...(filter.tags || [])];
    if (!newTags.includes(tag.trim())) {
      newTags.push(tag.trim());
      setFilter({ ...filter, tags: newTags });
    }
    
    setTag("");
  };
  
  const removeTag = (tagToRemove: string) => {
    setFilter({
      ...filter,
      tags: (filter.tags || []).filter(t => t !== tagToRemove)
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Notes</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="note-type">Note Type</Label>
              <Select
                value={filter.type || "all"}
                onValueChange={(value) => setFilter({ ...filter, type: value === "all" ? undefined : value as any })}
              >
                <SelectTrigger id="note-type">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Type</SelectItem>
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
                value={filter.visibility || "all"}
                onValueChange={(value) => setFilter({ ...filter, visibility: value === "all" ? undefined : value as any })}
              >
                <SelectTrigger id="note-visibility">
                  <SelectValue placeholder="Any Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Visibility</SelectItem>
                  <SelectItem value="teacher_only">Teacher Only</SelectItem>
                  <SelectItem value="all_staff">All Staff</SelectItem>
                  <SelectItem value="manager_only">Manager Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note-search">Search</Label>
            <Input
              id="note-search"
              placeholder="Search in content..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value || undefined })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filter.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.fromDate ? format(new Date(filter.fromDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filter.fromDate ? new Date(filter.fromDate) : undefined}
                    onSelect={(date) => setFilter({ 
                      ...filter, 
                      fromDate: date ? format(date, "yyyy-MM-dd") : undefined 
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filter.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.toDate ? format(new Date(filter.toDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filter.toDate ? new Date(filter.toDate) : undefined}
                    onSelect={(date) => setFilter({ 
                      ...filter, 
                      toDate: date ? format(date, "yyyy-MM-dd") : undefined 
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
            
            {filter.tags && filter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filter.tags.map((t) => (
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select
                value={filter.sortBy || "createdAt"}
                onValueChange={(value) => setFilter({ ...filter, sortBy: value })}
              >
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="modifiedAt">Date Modified</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select
                value={filter.sortOrder || "desc"}
                onValueChange={(value) => setFilter({ ...filter, sortOrder: value as "asc" | "desc" })}
              >
                <SelectTrigger id="sort-order">
                  <SelectValue placeholder="Order..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset} className="mr-auto">
            Reset
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesFilterDialog;
