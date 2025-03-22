
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, RefreshCw, Filter, MoreHorizontal, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { UserRole } from "@/types";
import { getCurrentUser } from "@/lib/auth";

// Mock data - will be replaced with API calls
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

const fetchUsers = async () => {
  // Mock API call - would be replaced with actual fetch
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers;
};

interface UserManagementProps {}

const UserManagement = ({}: UserManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null);
  const currentLoggedInUser = getCurrentUser();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    // Would call API to update status
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toast.success(`User status updated to ${newStatus}`);
    refetch();
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Would call API to update role
    toast.success(`User role updated to ${newRole}`);
    refetch();
  };

  const handleUserActivity = (userId: string) => {
    // Would navigate to activity log for this user
    toast.info("Viewing user activity log");
  };

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    // Would call API to update status in bulk
    toast.success(`Updated ${selectedUsers.length} users to ${status}`);
    setSelectedUsers([]);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. They will receive an email with login instructions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="email@example.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right">
                    Role
                  </label>
                  <select
                    id="role"
                    className="col-span-3 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Manager">Manager</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("User created successfully");
                  setShowCreateDialog(false);
                  refetch();
                }}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <CustomCard className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
            </div>
            <div className="space-x-2">
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
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(user => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                  checked={selectedUsers.length === users.length && users.length > 0}
                />
              </TableHead>
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
                <TableCell colSpan={7} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleUserActivity(user.id)}>
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          disabled={user.id === currentLoggedInUser?.id}
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "Manager" as UserRole)}
                          disabled={user.role === "Manager" || user.id === currentLoggedInUser?.id}
                        >
                          Change to Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "Secretary" as UserRole)}
                          disabled={user.role === "Secretary" || user.id === currentLoggedInUser?.id}
                        >
                          Change to Secretary
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "Teacher" as UserRole)}
                          disabled={user.role === "Teacher" || user.id === currentLoggedInUser?.id}
                        >
                          Change to Teacher
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CustomCard>
    </div>
  );
};

export default UserManagement;
