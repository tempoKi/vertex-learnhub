import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, RefreshCw, Filter, MoreHorizontal, AlertTriangle, CheckCircle2, XCircle, FileText, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CustomCard from "@/components/ui/CustomCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserRole } from "@/types";
import { getCurrentUser, updateUserStatus, updateUserRole, bulkUpdateUserStatus, bulkUpdateUserRole } from "@/lib/auth";
import CreateUserForm from "./CreateUserForm";

const mockUsers = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    email: "admin@vertex.edu",
    role: "SuperAdmin",
    status: "active",
    lastLogin: "2023-06-15T10:30:00Z",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "manager1",
    name: "Manager User",
    email: "manager@vertex.edu",
    role: "Manager",
    status: "active",
    lastLogin: "2023-06-14T08:45:00Z",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "3",
    username: "secretary1",
    name: "Secretary User",
    email: "secretary@vertex.edu",
    role: "Secretary",
    status: "active",
    lastLogin: "2023-06-13T14:20:00Z",
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "4",
    username: "teacher1",
    name: "Teacher User",
    email: "teacher@vertex.edu",
    role: "Teacher",
    status: "inactive",
    lastLogin: "2023-05-20T09:10:00Z",
    createdAt: "2023-02-15T00:00:00Z",
  },
];

const fetchUsers = async ({ page = 1, pageSize = 10, role = "", status = "", search = "" }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredUsers = [...mockUsers];
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role.toLowerCase() === role.toLowerCase());
  }
  
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status.toLowerCase() === status.toLowerCase());
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.username.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedUsers = filteredUsers.slice(start, end);
  
  return {
    users: paginatedUsers,
    pagination: {
      page,
      pageSize,
      totalUsers,
      totalPages
    }
  };
};

interface UserManagementTableProps {
  onUserSelect: (userId: string) => void;
}

const UserManagementTable = ({ onUserSelect }: UserManagementTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null);
  const [statusReason, setStatusReason] = useState("");
  const [roleReason, setRoleReason] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Teacher");
  const [newStatus, setNewStatus] = useState<"active" | "inactive">("active");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const currentLoggedInUser = getCurrentUser();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", page, roleFilter, statusFilter, searchQuery],
    queryFn: () => fetchUsers({ 
      page, 
      pageSize: 10, 
      role: roleFilter, 
      status: statusFilter, 
      search: searchQuery 
    }),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const handleStatusChange = async () => {
    try {
      if (currentUser) {
        await updateUserStatus(currentUser.id, newStatus, statusReason);
        setShowStatusDialog(false);
        setStatusReason("");
        refetch();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleRoleChange = async () => {
    try {
      if (currentUser) {
        await updateUserRole(currentUser.id, newRole, roleReason);
        setShowRoleDialog(false);
        setRoleReason("");
        refetch();
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    try {
      await bulkUpdateUserStatus(selectedUsers, status, "Bulk update by admin");
      toast.success(`Updated ${selectedUsers.length} users to ${status}`);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Error in bulk status update:", error);
      toast.error("Failed to update users");
    }
  };

  const handleBulkRoleChange = async (role: UserRole) => {
    try {
      await bulkUpdateUserRole(selectedUsers, role, "Bulk update by admin");
      toast.success(`Updated ${selectedUsers.length} users to role ${role}`);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Error in bulk role update:", error);
      toast.error("Failed to update users");
    }
  };

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Secretary">Secretary</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. They will receive an email with login instructions.
                </DialogDescription>
              </DialogHeader>
              <CreateUserForm onSuccess={() => {
                setShowCreateDialog(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <CustomCard className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserCog className="mr-1 h-4 w-4" />
                    Change Role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkRoleChange("SuperAdmin" as UserRole)}>
                    To SuperAdmin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkRoleChange("Manager" as UserRole)}>
                    To Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkRoleChange("Secretary" as UserRole)}>
                    To Secretary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkRoleChange("Teacher" as UserRole)}>
                    To Teacher
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <XCircle className="mr-1 h-4 w-4" />
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate {selectedUsers.length} user accounts. They will not be able to log in until reactivated.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleBulkStatusChange("inactive")}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange("active")}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Activate
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                Clear
              </Button>
            </div>
          </div>
        </CustomCard>
      )}

      <CustomCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  onChange={handleSelectAll}
                  checked={selectedUsers.length === users.length && users.length > 0}
                />
              </TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={
                      user.role === "SuperAdmin" 
                        ? "text-purple-600 font-semibold" 
                        : user.role === "Manager" 
                          ? "text-blue-600" 
                          : ""
                    }>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status === "active" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUserSelect(user.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => {
                            if (user.id === currentLoggedInUser?.id) {
                              toast.error("You cannot change your own status");
                              return;
                            }
                            setCurrentUser(user);
                            setNewStatus(user.status === "active" ? "inactive" : "active");
                            setShowStatusDialog(true);
                          }}
                          disabled={user.id === currentLoggedInUser?.id}
                        >
                          {user.status === "active" ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            if (user.id === currentLoggedInUser?.id) {
                              toast.error("You cannot change your own role");
                              return;
                            }
                            setCurrentUser(user);
                            setNewRole("SuperAdmin" as UserRole);
                            setShowRoleDialog(true);
                          }}
                          disabled={user.role === "SuperAdmin" || user.id === currentLoggedInUser?.id}
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    className={page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CustomCard>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "active" ? "Activate User" : "Deactivate User"}
            </DialogTitle>
            <DialogDescription>
              {newStatus === "active" 
                ? "This will allow the user to log in and access the system." 
                : "This will prevent the user from logging in to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Reason for {newStatus === "active" ? "activation" : "deactivation"}</FormLabel>
              <Input
                placeholder="Enter reason"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
              />
              <FormDescription>
                This will be recorded in the audit log.
              </FormDescription>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={newStatus === "active" ? "default" : "destructive"} 
              onClick={handleStatusChange}
              disabled={!statusReason}
            >
              {newStatus === "active" ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              This will change the user's permissions in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>New Role</FormLabel>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel>Reason for role change</FormLabel>
              <Input
                placeholder="Enter reason"
                value={roleReason}
                onChange={(e) => setRoleReason(e.target.value)}
              />
              <FormDescription>
                This will be recorded in the role history.
              </FormDescription>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRoleChange}
              disabled={!roleReason}
            >
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementTable;
