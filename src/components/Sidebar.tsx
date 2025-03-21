
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Home,
  User,
  FileText,
  BookOpen as Course,
  MessagesSquare,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

type MenuItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
};

const Sidebar = ({ open }: SidebarProps) => {
  const { user } = useAuth();
  const userRole = user?.role || '';

  const menuItems: MenuItemType[] = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Students",
      path: "/students",
      icon: Users,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Courses",
      path: "/courses",
      icon: Course,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Classes",
      path: "/classes",
      icon: BookOpen,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Schedule",
      path: "/schedule",
      icon: Calendar,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Messages",
      path: "/messages",
      icon: MessagesSquare,
      roles: ["superadmin", "manager", "secretary", "teacher"],
    },
    {
      title: "Reports",
      path: "/reports",
      icon: FileText,
      roles: ["superadmin", "manager"],
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      roles: ["superadmin", "manager"],
    },
    {
      title: "Staff",
      path: "/staff",
      icon: User,
      roles: ["superadmin", "manager"],
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: Bell,
      roles: ["superadmin", "manager", "secretary"],
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["superadmin", "manager"],
    },
  ];

  // Filter menu items based on user role
  const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col w-64 h-full pt-16 bg-card border-r border-border shadow-subtle transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {filteredMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    } ${!open && "md:justify-center"}`
                  }
                >
                  <item.icon className={`h-5 w-5 ${open ? "mr-3 md:mr-3" : "mr-0"}`} />
                  {open && <span className="truncate">{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-3 border-t border-border">
        <div className={`flex ${open ? "justify-between" : "justify-center"} items-center`}>
          <div className={`flex items-center gap-2 ${!open && "md:hidden"}`}>
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate capitalize">
                  {user?.role}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
