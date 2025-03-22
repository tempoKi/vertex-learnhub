
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Clock, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CustomCard from "@/components/ui/CustomCard";

// Mock data - would be fetched from API
const fetchRoleHistory = async (userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return [
    {
      id: "1",
      userId,
      oldRole: "Teacher",
      newRole: "Secretary",
      reason: "Promotion based on performance review",
      changedBy: "admin",
      changedAt: "2023-04-15T09:30:00Z",
    },
    {
      id: "2",
      userId,
      oldRole: "Secretary",
      newRole: "Manager",
      reason: "Taking on additional administrative responsibilities",
      changedBy: "admin",
      changedAt: "2023-09-10T14:45:00Z",
    },
    {
      id: "3",
      userId,
      oldRole: "Manager",
      newRole: "SuperAdmin",
      reason: "Selected as new system administrator",
      changedBy: "admin",
      changedAt: "2024-01-05T11:20:00Z",
    },
  ];
};

interface UserRoleHistoryProps {
  userId: string;
}

const UserRoleHistory = ({ userId }: UserRoleHistoryProps) => {
  const { data: roleHistory = [], isLoading } = useQuery({
    queryKey: ["userRoleHistory", userId],
    queryFn: () => fetchRoleHistory(userId),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role History</h3>
      </div>

      <CustomCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Old Role</TableHead>
              <TableHead>New Role</TableHead>
              <TableHead className="w-[40%]">Reason</TableHead>
              <TableHead>Changed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading role history...
                </TableCell>
              </TableRow>
            ) : roleHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No role changes found
                </TableCell>
              </TableRow>
            ) : (
              roleHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(new Date(record.changedAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      getRoleColor(record.oldRole, "bg")
                    }`}>
                      {record.oldRole}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      getRoleColor(record.newRole, "bg")
                    }`}>
                      {record.newRole}
                    </span>
                  </TableCell>
                  <TableCell>{record.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {record.changedBy}
                    </div>
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

// Helper function to get role-specific colors
const getRoleColor = (role: string, type: "text" | "bg") => {
  const colors = {
    SuperAdmin: type === "bg" ? "bg-purple-100 text-purple-800" : "text-purple-600",
    Manager: type === "bg" ? "bg-blue-100 text-blue-800" : "text-blue-600", 
    Secretary: type === "bg" ? "bg-green-100 text-green-800" : "text-green-600",
    Teacher: type === "bg" ? "bg-gray-100 text-gray-800" : "text-gray-600",
  };
  
  return colors[role as keyof typeof colors] || colors.Teacher;
};

export default UserRoleHistory;
