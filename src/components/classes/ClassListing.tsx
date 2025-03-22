
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClasses, getAvailableLevels, getAvailableRooms } from "@/services/classService";
import { Class, ClassFilter } from "@/types/class";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { hasRole } from "@/lib/auth";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/common/Pagination";
import { Eye, Pencil, MoreHorizontal, PlusCircle, X } from "lucide-react";

const ClassListing = () => {
  const navigate = useNavigate();
  const canManageClasses = hasRole(["SuperAdmin", "Manager"]);
  
  const [filter, setFilter] = useState<ClassFilter>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });
  
  // Reset search input state
  const [searchInput, setSearchInput] = useState(filter.search || "");
  const [roomInput, setRoomInput] = useState(filter.room || "");
  
  // Fetch classes based on current filter
  const { 
    data: classesData, 
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: ["classes", filter],
    queryFn: () => fetchClasses(filter),
  });
  
  // Fetch available levels for filter dropdown
  const { 
    data: availableLevels = [],
    isLoading: isLoadingLevels 
  } = useQuery({
    queryKey: ["class-levels"],
    queryFn: getAvailableLevels,
  });
  
  // Fetch available rooms for autocomplete
  const { 
    data: availableRooms = [],
    isLoading: isLoadingRooms 
  } = useQuery({
    queryKey: ["class-rooms"],
    queryFn: getAvailableRooms,
  });
  
  // Apply filters with debounce for search and room inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter(prev => ({
        ...prev,
        search: searchInput,
        room: roomInput,
        page: 1, // Reset to first page when filters change
      }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput, roomInput]);
  
  // Handle select filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilter(prev => ({
      ...prev,
      page,
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchInput("");
    setRoomInput("");
    setFilter({
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc",
    });
  };
  
  // Handle row actions
  const handleViewClass = (classId: string) => {
    navigate(`/classes/${classId}`);
  };
  
  const handleEditClass = (classId: string) => {
    navigate(`/classes/${classId}/edit`);
  };
  
  const handleCreateClass = () => {
    navigate("/classes/create");
  };
  
  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'inactive':
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case 'merged':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage your educational classes and courses
          </p>
        </div>
        {canManageClasses && (
          <Button onClick={handleCreateClass} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Create Class
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>
            View and manage all classes in your educational system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, level..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filter.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={filter.level || ""}
                onValueChange={(value) => handleFilterChange("level", value)}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  {availableLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="Filter by room"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                list="room-options"
              />
              <datalist id="room-options">
                {availableRooms.map((room) => (
                  <option key={room} value={room} />
                ))}
              </datalist>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters} className="w-full">
                <X className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Classes Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading state
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 float-right" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  // Error state
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Failed to load classes. Please try again.
                    </TableCell>
                  </TableRow>
                ) : classesData?.data.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No classes found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data state
                  classesData?.data.map((classItem: Class) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.level}</TableCell>
                      <TableCell>{classItem.room}</TableCell>
                      <TableCell>
                        {classItem.capacity.current}/{classItem.capacity.total}
                      </TableCell>
                      <TableCell>
                        {format(new Date(classItem.schedule.startDate), "MMM d, yyyy")} - 
                        {format(new Date(classItem.schedule.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(classItem.status)}
                        >
                          {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewClass(classItem.id)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {canManageClasses && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClass(classItem.id)}
                              title="Edit class"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" title="More options">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewClass(classItem.id)}>
                                View details
                              </DropdownMenuItem>
                              {canManageClasses && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEditClass(classItem.id)}>
                                    Edit class
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem disabled>
                                    Manage students
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled>
                                    Assign teachers
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled>
                                    View attendance
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {classesData && classesData.pagination && (
            <Pagination
              page={classesData.pagination.page}
              totalPages={classesData.pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassListing;
