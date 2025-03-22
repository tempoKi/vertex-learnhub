
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomCard from "@/components/ui/CustomCard";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Search,
  AlertCircle,
  Info,
  AlertTriangle,
  Download
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock system logs data
const mockSystemLogs = [
  {
    id: "1",
    timestamp: "2023-06-15T10:30:00Z",
    severity: "error",
    category: "authentication",
    action: "login_failed",
    performedBy: "unknown",
    details: "Multiple failed login attempts from IP 192.168.1.105",
    status: "unresolved",
  },
  {
    id: "2",
    timestamp: "2023-06-14T08:45:00Z",
    severity: "warning",
    category: "database",
    action: "query_timeout",
    performedBy: "system",
    details: "Query exceeded timeout threshold: SELECT * FROM students WHERE...",
    status: "resolved",
  },
  {
    id: "3",
    timestamp: "2023-06-13T14:20:00Z",
    severity: "info",
    category: "system",
    action: "backup_completed",
    performedBy: "system",
    details: "Daily backup completed successfully. Size: 250MB",
    status: "resolved",
  },
  {
    id: "4",
    timestamp: "2023-06-13T12:10:00Z",
    severity: "warning",
    category: "security",
    action: "permission_denied",
    performedBy: "teacher1",
    details: "Attempted to access unauthorized resource: /api/admin/users",
    status: "resolved",
  },
  {
    id: "5",
    timestamp: "2023-06-12T09:15:00Z",
    severity: "info",
    category: "user",
    action: "user_created",
    performedBy: "admin",
    details: "New user created: john.doe@vertex.edu",
    status: "resolved",
  },
  {
    id: "6",
    timestamp: "2023-06-10T16:40:00Z",
    severity: "error",
    category: "payment",
    action: "payment_failed",
    performedBy: "system",
    details: "Payment gateway error: Transaction declined for student ID 2045",
    status: "unresolved",
  },
];

const fetchSystemLogs = async () => {
  // Mock API call - would be replaced with actual fetch
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSystemLogs;
};

interface SystemLogsProps {}

const SystemLogs = ({}: SystemLogsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: fetchSystemLogs,
  });

  const filteredLogs = logs.filter((log) => {
    // Apply search query filter
    const matchesSearch = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply date filter
    const matchesDate = selectedDate 
      ? new Date(log.timestamp).toDateString() === selectedDate.toDateString() 
      : true;
    
    // Apply severity filter
    const matchesSeverity = severityFilter 
      ? log.severity === severityFilter 
      : true;
    
    // Apply category filter
    const matchesCategory = categoryFilter 
      ? log.category === categoryFilter 
      : true;
    
    return matchesSearch && matchesDate && matchesSeverity && matchesCategory;
  });

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const availableCategories = Array.from(new Set(logs.map(log => log.category)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={severityFilter || ""}
            onChange={(e) => setSeverityFilter(e.target.value || null)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All Severities</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          
          <select
            value={categoryFilter || ""}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <CustomCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Level</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {severityIcon(log.severity)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{log.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>{log.performedBy}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {log.details}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === "resolved" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {log.status}
                    </span>
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

export default SystemLogs;
