
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, FileDown, RefreshCw, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CustomCard from "@/components/ui/CustomCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUserActivity } from "@/services/activityLogService";
import { LogFilter } from "@/types/activity-log";
import { toast } from "sonner";

// Mock activity types for filtering
const activityTypes = [
  "login",
  "logout",
  "view_student",
  "edit_student",
  "view_class",
  "edit_class",
  "create_payment",
  "system_config",
  "user_management",
];

interface UserActivityLogProps {
  userId: string;
}

const UserActivityLog = ({ userId }: UserActivityLogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState("");
  const [dateRange, setDateRange] = useState("last7days");

  // Get date range for filter
  const getDateRange = (): { fromDate?: string; toDate?: string } => {
    const today = new Date();
    let fromDate: Date | undefined;
    
    switch (dateRange) {
      case "today":
        fromDate = new Date(today);
        fromDate.setHours(0, 0, 0, 0);
        break;
      case "last7days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;
      case "last30days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        break;
      case "last90days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 90);
        break;
      case "all":
        fromDate = undefined;
        break;
    }
    
    return {
      fromDate: fromDate?.toISOString(),
      toDate: today.toISOString()
    };
  };

  // Create filter for API
  const filter: LogFilter = {
    page: 1,
    limit: 50,
    search: searchQuery,
    actions: activityType ? [activityType] : undefined,
    ...getDateRange()
  };

  // Log the userId to verify it's correctly passed
  console.log("Rendering UserActivityLog with userId:", userId);

  // Fetch user activity logs from the service
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userActivities", userId, filter],
    queryFn: () => fetchUserActivity(userId, filter),
  });

  // Handle any errors from the query
  if (data === undefined && !isLoading) {
    console.error("Error fetching activity logs");
    toast.error("Failed to load activity logs");
  }

  const activities = data?.logs || [];

  const handleExport = () => {
    // In a real application, this would generate a CSV file of filtered activities
    console.log("Exporting activities:", activities);
    toast.success("Activity log export started");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActivityType("");
    setDateRange("last7days");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Activity Log for User ID: {userId}</h3>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <CustomCard className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Activities</SelectItem>
              {activityTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CustomCard>

      <CustomCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[30%]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading activity logs...
                </TableCell>
              </TableRow>
            ) : activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No activities found
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    {format(new Date(activity.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{activity.action.replace("_", " ")}</span>
                  </TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.severity === "error" 
                        ? "bg-red-100 text-red-800" 
                        : activity.severity === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}>
                      {activity.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === "success" 
                        ? "bg-green-100 text-green-800" 
                        : activity.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {activity.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {activity.details && typeof activity.details === 'object' 
                      ? JSON.stringify(activity.details, null, 2) 
                      : String(activity.details)}
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

export default UserActivityLog;
