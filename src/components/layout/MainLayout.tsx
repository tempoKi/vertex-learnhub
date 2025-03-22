
import { cn } from "@/lib/utils";
import { getCurrentUser, hasPermission, logoutUser } from "@/lib/auth";
import { UserRole } from "@/types";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  ClipboardList, 
  Cog, 
  LogOut, 
  Menu, 
  MessageSquare, 
  User, 
  Users, 
  X 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: BarChart3,
    path: "/dashboard",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Students",
    icon: Users,
    path: "/students",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Classes",
    icon: BookOpen,
    path: "/classes",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Attendance",
    icon: ClipboardList,
    path: "/attendance",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Schedule",
    icon: Calendar,
    path: "/schedule",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Payments",
    icon: BarChart3,
    path: "/payments",
    roles: ["SuperAdmin", "Manager", "Secretary"],
  },
  {
    name: "Notes",
    icon: MessageSquare,
    path: "/notes",
    roles: ["SuperAdmin", "Manager", "Secretary", "Teacher"],
  },
  {
    name: "Users",
    icon: User,
    path: "/users",
    roles: ["SuperAdmin", "Manager"],
  },
  {
    name: "Settings",
    icon: Cog,
    path: "/settings",
    roles: ["SuperAdmin", "Manager"],
  },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("sidebar-toggle");
        
        if (sidebar && 
            toggleButton && 
            !sidebar.contains(e.target as Node) && 
            !toggleButton.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border shadow-soft transition-all duration-300 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="text-xl font-semibold">Vertex</span>
          </Link>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-1.5">
          {sidebarItems
            .filter((item) => hasPermission(item.roles))
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-vertex-600 hover:bg-secondary hover:text-vertex-900"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-white z-10 flex items-center px-4 sm:px-6">
          <Button
            id="sidebar-toggle"
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>

          <h1 className="text-lg font-semibold ml-4 lg:ml-0">
            {sidebarItems.find((item) => item.path === location.pathname)?.name || "Vertex"}
          </h1>

          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Cog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
