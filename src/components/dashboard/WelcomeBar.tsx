
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/types";
import { Calendar } from "lucide-react";

interface WelcomeBarProps {
  stats: {
    totalStudents: number;
    activeClasses: number;
  };
}

const WelcomeBar = ({ stats }: WelcomeBarProps) => {
  const user = getCurrentUser();
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get role-specific welcome message
  const getWelcomeMessage = (role: UserRole) => {
    switch (role) {
      case 'SuperAdmin':
        return `You have ${stats.totalStudents} students and ${stats.activeClasses} active classes`;
      case 'Manager':
        return `Manage ${stats.activeClasses} active classes with ${stats.totalStudents} students`;
      case 'Secretary':
        return `Assist with ${stats.totalStudents} students across ${stats.activeClasses} classes`;
      case 'Teacher':
        return `You're teaching classes with a total of ${stats.totalStudents} students`;
      default:
        return `Welcome to Vertex Education`;
    }
  };

  if (!user) return null;

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6 animate-slide-down">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-blue-900">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-blue-700 text-sm">
            {getWelcomeMessage(user.role)}
          </p>
        </div>
        <div className="flex items-center mt-3 md:mt-0 space-x-1.5 text-blue-700 text-sm">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBar;
