
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";
import WelcomeBar from "@/components/dashboard/WelcomeBar";
import StatCard from "@/components/dashboard/StatCard";
import CustomCard from "@/components/ui/CustomCard";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Clock, 
  CreditCard, 
  UserCheck, 
  Users 
} from "lucide-react";

// Mock data
const mockStats = {
  totalStudents: 248,
  activeStudents: 216,
  totalClasses: 28,
  activeClasses: 19,
  attendanceRate: 92,
  recentPayments: 34,
  upcomingClasses: [
    { id: "1", name: "Advanced English", time: "10:00 AM", teacher: "John Smith" },
    { id: "2", name: "Beginner Spanish", time: "11:30 AM", teacher: "Maria Lopez" },
    { id: "3", name: "Intermediate French", time: "2:00 PM", teacher: "Claire Dubois" },
  ],
  recentActivities: [
    { id: "1", action: "New student registered", time: "10 minutes ago" },
    { id: "2", action: "Payment received", time: "1 hour ago" },
    { id: "3", action: "Attendance marked", time: "2 hours ago" },
    { id: "4", action: "New class scheduled", time: "3 hours ago" },
    { id: "5", action: "Student note added", time: "5 hours ago" },
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <WelcomeBar stats={{ totalStudents: mockStats.totalStudents, activeClasses: mockStats.activeClasses }} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={mockStats.totalStudents}
          icon={Users}
          description={`${mockStats.activeStudents} active students`}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatCard
          title="Classes"
          value={mockStats.totalClasses}
          icon={BookOpen}
          description={`${mockStats.activeClasses} active classes`}
          trend={{ value: 1.8, isPositive: true }}
        />
        <StatCard
          title="Attendance Rate"
          value={`${mockStats.attendanceRate}%`}
          icon={UserCheck}
          description="Last 30 days average"
          trend={{ value: 0.5, isPositive: true }}
        />
        <StatCard
          title="Recent Payments"
          value={mockStats.recentPayments}
          icon={CreditCard}
          description="Payments this month"
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomCard isGlass className="overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Upcoming Classes</h3>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className="space-y-3">
            {mockStats.upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center p-3 rounded-lg bg-background border hover:border-blue-200 transition-colors">
                <div className="mr-4 p-2 rounded-full bg-blue-50 text-blue-600">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{cls.name}</h4>
                  <p className="text-xs text-muted-foreground">Teacher: {cls.teacher}</p>
                </div>
                <div className="flex items-center text-sm text-blue-700">
                  <Clock size={14} className="mr-1" />
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        </CustomCard>
        
        <CustomCard isGlass className="overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <span className="text-sm text-muted-foreground">Last 24 hours</span>
          </div>
          <div className="space-y-3">
            {mockStats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 rounded-lg bg-background border">
                <div className="mr-4 p-2 rounded-full bg-vertex-50 text-vertex-600">
                  <BarChart3 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.action}</h4>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CustomCard>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
