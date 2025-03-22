import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, FileText, Download } from "lucide-react";
import { LogEntry, LogSeverity, LogStatus, PaginationProps, LogEntryTableProps } from "@/types/activity-log";
import { exportLogs } from "@/services/activityLogService";
import { toast } from "sonner";

const LogEntryTable = ({ logs, isLoading, pagination }: LogEntryTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleExportDetails = async (log: LogEntry, format: 'csv' | 'json') => {
    try {
      const filter = {
        id: log.id,
        severity: log.severity,
        category: log.category,
        action: log.action,
        performedBy: log.performedBy,
        performedByUser: log.performedByUser,
        targetCollection: log.targetCollection,
        targetId: log.targetId,
        details: log.details,
        timestamp: log.timestamp,
        status: log.status
      };
  
      const blob = await exportLogs(format, filter);
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = `log-details-${log.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      toast.success(`Log details exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export log details");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{format(new Date(log.timestamp), "MMM dd, yyyy - HH:mm")}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.category}</TableCell>
                    <TableCell>{log.performedByUser}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Collapsible open={expandedRow === log.id} onOpenChange={() => toggleRow(log.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 pb-4">
                          <Card className="w-full">
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">User ID:</p>
                                  <p className="text-sm">{log.performedBy}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Target Collection:</p>
                                  <p className="text-sm">{log.targetCollection || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Target ID:</p>
                                  <p className="text-sm">{log.targetId || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">IP Address:</p>
                                  <p className="text-sm">{log.details.ip || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Browser:</p>
                                  <p className="text-sm">{log.details.browser || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Location:</p>
                                  <p className="text-sm">{log.details.location || "N/A"}</p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="text-sm font-medium">Full Details:</p>
                                <pre className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleExportDetails(log, 'json')}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Export JSON
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleExportDetails(log, 'csv')}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export CSV
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleContent>
                      </Collapsible>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogEntryTable;
