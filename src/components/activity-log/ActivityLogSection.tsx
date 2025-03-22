
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActivityLogs, fetchActivityLogSummary } from "@/services/activityLogService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogFilter } from "@/types/activity-log";
import LogEntryTable from "./LogEntryTable";
import FilterPanel from "./FilterPanel";
import LogSummaryCard from "./LogSummaryCard";
import Pagination from "../common/Pagination";

const ActivityLogSection = () => {
  const [filter, setFilter] = useState<LogFilter>({
    page: 1,
    limit: 10,
  });

  // Fetch logs based on current filter
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["logs", filter],
    queryFn: () => fetchActivityLogs(filter),
  });

  // Fetch summary data
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["logs-summary"],
    queryFn: fetchActivityLogSummary,
  });

  // Handle filter changes
  const handleFilterChange = (newFilter: Partial<LogFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">
          Monitor system activity and user actions
        </p>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                View and filter system activity logs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterPanel
                filter={filter}
                onFilterChange={handleFilterChange}
                loading={isLoadingLogs}
                onRefresh={() => refetchLogs()}
              />

              <LogEntryTable
                logs={logsData?.logs || []}
                isLoading={isLoadingLogs}
                pagination={{
                  page: logsData?.page || 1,
                  totalPages: logsData?.totalPages || 1,
                  onPageChange: handlePageChange,
                }}
              />

              {logsData && logsData.totalPages > 1 && (
                <Pagination
                  page={logsData.page}
                  totalPages={logsData.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <LogSummaryCard
              title="Status Distribution"
              data={summaryData?.statusCounts || []}
              keyField="status"
              valueField="count"
            />
            <LogSummaryCard
              title="Activity by Category"
              data={summaryData?.byCategory || []}
              keyField="category"
              valueField="count"
            />
            <LogSummaryCard
              title="Most Active Users"
              data={summaryData?.byUser || []}
              keyField="username"
              valueField="count"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityLogSection;
