
import { useState, useEffect } from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceRecords, fetchClasses, fetchClassAttendanceStats } from "@/services/attendanceService";
import { AttendanceFilter } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportAttendance } from "@/services/attendanceService";
import { toast } from "sonner";

const AttendanceStats = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses
  });

  // Fetch attendance records
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance", "stats", selectedClass, dateRange],
    queryFn: async () => {
      const filter: AttendanceFilter = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };
      
      if (selectedClass) {
        filter.classId = selectedClass;
        return fetchClassAttendanceStats(selectedClass);
      }
      
      return fetchAttendanceRecords(filter);
    }
  });

  // Handle export
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const filter: AttendanceFilter = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        classId: selectedClass || undefined
      };
      
      const blob = await exportAttendance(format, filter);
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Attendance data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export attendance data");
      console.error(error);
    }
  };

  // Extract attendance data for charts
  const getAttendanceRateByDate = () => {
    if (!attendanceData) return [];
    
    if ('className' in attendanceData) {
      // This is class attendance stats
      return attendanceData.byDate.map(item => ({
        date: item.date,
        rate: Math.round(item.rate),
        present: item.present,
        absent: item.absent,
        late: item.late
      }));
    } else if ('records' in attendanceData) {
      // This is attendance records
      return attendanceData.records.map(record => ({
        date: record.date,
        rate: Math.round((record.summary.present / record.summary.total) * 100),
        present: record.summary.present,
        absent: record.summary.absent,
        late: record.summary.late
      }));
    }
    
    return [];
  };

  const getAttendanceByWeekday = () => {
    if (!attendanceData) return [];
    
    if ('className' in attendanceData && attendanceData.byWeekday) {
      const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      return weekdayOrder
        .filter(day => attendanceData.byWeekday.some(item => item.weekday === day))
        .map(day => {
          const weekdayData = attendanceData.byWeekday.find(item => item.weekday === day);
          return {
            weekday: day,
            rate: Math.round(weekdayData?.rate || 0)
          };
        });
    }
    
    return [];
  };

  // Get summary stats
  const getSummaryStats = () => {
    if (!attendanceData) {
      return { present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
    }
    
    if ('className' in attendanceData && attendanceData.overall) {
      return {
        present: attendanceData.overall.present,
        absent: attendanceData.overall.absent,
        late: attendanceData.overall.late,
        excused: attendanceData.overall.excused,
        rate: Math.round(attendanceData.overall.rate)
      };
    } else if ('records' in attendanceData) {
      const total = attendanceData.records.reduce((sum, record) => sum + record.summary.total, 0);
      const present = attendanceData.records.reduce((sum, record) => sum + record.summary.present, 0);
      const absent = attendanceData.records.reduce((sum, record) => sum + record.summary.absent, 0);
      const late = attendanceData.records.reduce((sum, record) => sum + record.summary.late, 0);
      const excused = attendanceData.records.reduce((sum, record) => sum + record.summary.excused, 0);
      
      return {
        present,
        absent,
        late,
        excused,
        rate: total > 0 ? Math.round((present / total) * 100) : 0
      };
    }
    
    return { present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
  };

  const chartConfig = {
    present: {
      label: "Present",
      color: "#4ade80" // green
    },
    absent: {
      label: "Absent",
      color: "#f87171" // red
    },
    late: {
      label: "Late",
      color: "#fbbf24" // amber
    },
    excused: {
      label: "Excused",
      color: "#60a5fa" // blue
    },
    rate: {
      label: "Attendance Rate",
      color: "#8b5cf6" // purple
    }
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedClass || "all"}
            onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes?.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-[250px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.startDate} to {dateRange.endDate}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('json')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall attendance rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground">
              Total present records
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Total absences
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.late}</div>
            <p className="text-xs text-muted-foreground">
              Total late arrivals
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate Trend</CardTitle>
            <CardDescription>
              Daily attendance rate over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer 
              config={chartConfig}
              className="h-full"
            >
              <LineChart data={getAttendanceRateByDate()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit="%" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{payload[0].payload.date}</div>
                          <div className="flex flex-col gap-1 pt-1">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded bg-[var(--color-rate)]" />
                              <span className="text-xs text-muted-foreground">
                                Rate: {payload[0].value}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded bg-[var(--color-present)]" />
                              <span className="text-xs text-muted-foreground">
                                Present: {payload[0].payload.present}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded bg-[var(--color-absent)]" />
                              <span className="text-xs text-muted-foreground">
                                Absent: {payload[0].payload.absent}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance by Weekday</CardTitle>
            <CardDescription>
              Attendance rate by day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer 
              config={chartConfig}
              className="h-full"
            >
              <BarChart data={getAttendanceByWeekday()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekday" />
                <YAxis unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{payload[0].payload.weekday}</div>
                          <div className="flex items-center gap-1 pt-1">
                            <div className="h-2 w-2 rounded bg-[var(--color-rate)]" />
                            <span className="text-xs text-muted-foreground">
                              Attendance Rate: {payload[0].value}%
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceStats;
