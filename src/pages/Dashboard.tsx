
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  MessagesSquare
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  change: number;
  icon: React.ReactNode;
};

const StatsCard = ({ title, value, description, change, icon }: StatsCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-subtle">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center pt-1">
        {change > 0 ? (
          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
        )}
        <p className={`text-xs ${change > 0 ? "text-green-500" : "text-red-500"}`}>
          {Math.abs(change)}% from last month
        </p>
      </div>
      <CardDescription className="pt-4 text-xs">{description}</CardDescription>
    </CardContent>
  </Card>
);

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar?: string;
};

type UpcomingClass = {
  id: string;
  title: string;
  time: string;
  duration: string;
  students: number;
  progress: number;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActivities([
        {
          id: "1",
          user: "John Doe",
          action: "enrolled in Advanced English course",
          time: "10 minutes ago",
          avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0077C8&color=fff",
        },
        {
          id: "2",
          user: "Sarah Miller",
          action: "submitted an assignment",
          time: "25 minutes ago",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Miller&background=0077C8&color=fff",
        },
        {
          id: "3",
          user: "Alex Johnson",
          action: "registered for summer classes",
          time: "1 hour ago",
          avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0077C8&color=fff",
        },
        {
          id: "4",
          user: "Maria Garcia",
          action: "requested a meeting with a teacher",
          time: "2 hours ago",
          avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=0077C8&color=fff",
        },
      ]);
      
      setUpcomingClasses([
        {
          id: "1",
          title: "Beginner Spanish",
          time: "10:00 AM",
          duration: "1 hour",
          students: 12,
          progress: 35,
        },
        {
          id: "2",
          title: "Intermediate English",
          time: "1:30 PM",
          duration: "1.5 hours",
          students: 8,
          progress: 68,
        },
        {
          id: "3",
          title: "Advanced French",
          time: "3:45 PM",
          duration: "2 hours",
          students: 6,
          progress: 92,
        },
      ]);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Role-specific dashboard content
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case "superadmin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Students"
              value="1,248"
              description="Active students across all programs"
              change={12}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Courses"
              value="32"
              description="Courses in current semester"
              change={8}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Classes Today"
              value="24"
              description="Scheduled across all programs"
              change={-4}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatsCard
              title="Revenue"
              value="$48.9k"
              description="Monthly revenue from all programs"
              change={16}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        );
      case "manager":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Students"
              value="428"
              description="Active students in your programs"
              change={5}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Courses"
              value="12"
              description="Courses in current semester"
              change={0}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Attendance Rate"
              value="92%"
              description="Average attendance this month"
              change={3}
              icon={<Layers className="h-4 w-4" />}
            />
            <StatsCard
              title="Upcoming Events"
              value="8"
              description="Events in the next 2 weeks"
              change={-2}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
        );
      case "secretary":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Today's Classes"
              value="16"
              description="Classes scheduled for today"
              change={0}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatsCard
              title="New Applications"
              value="24"
              description="Pending student applications"
              change={15}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Overdue Payments"
              value="8"
              description="Students with payment issues"
              change={-10}
              icon={<Bell className="h-4 w-4" />}
            />
            <StatsCard
              title="Messages"
              value="12"
              description="Unread messages from students"
              change={5}
              icon={<MessagesSquare className="h-4 w-4" />}
            />
          </div>
        );
      case "teacher":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="My Classes"
              value="5"
              description="Total active classes"
              change={0}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Today's Schedule"
              value="3"
              description="Classes scheduled for today"
              change={0}
              icon={<Clock className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Students"
              value="48"
              description="Students in your classes"
              change={4}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-md mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 h-40"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl h-96"></div>
          <div className="bg-card border border-border rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold mb-1">Welcome back, {user?.name}</h1>
      <p className="text-muted-foreground mb-6">Here's what's happening in your account today.</p>
      
      {renderRoleDashboard()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>
                Your schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{cls.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {cls.time}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {cls.duration}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {cls.students} students
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Course progress</span>
                            <span>{cls.progress}%</span>
                          </div>
                          <Progress value={cls.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No classes scheduled for today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your institute</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 last:pb-0 last:mb-0 last:border-0 border-b border-border"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        {activity.avatar ? (
                          <img
                            src={activity.avatar}
                            alt={activity.user}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                            {activity.user.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
