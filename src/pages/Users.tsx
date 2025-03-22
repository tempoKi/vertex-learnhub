
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import UserManagementTable from "@/components/users/UserManagementTable";
import UserActivityLog from "@/components/users/UserActivityLog";
import UserRoleHistory from "@/components/users/UserRoleHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, hasPermission } from "@/lib/auth";

const Users = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user has permission to access this page
    if (!hasPermission(["SuperAdmin", "Manager"])) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleUserSelect = (userId: string) => {
    console.log("User selected:", userId);
    setSelectedUser(userId);
    // Automatically switch to activity tab when a user is selected
    setActiveTab("activity");
  };

  // Debug logs to track state changes
  useEffect(() => {
    console.log("Selected user:", selectedUser);
    console.log("Active tab:", activeTab);
  }, [selectedUser, activeTab]);

  // For Activity Log and Role History tabs, show a message if no user is selected
  const renderTabContent = (component: React.ReactNode) => {
    if (selectedUser) {
      return component;
    }
    return (
      <div className="text-center py-10">
        <p>Select a user from the Users tab to view details</p>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and view activity logs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="roleHistory">Role History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4 mt-6">
            <UserManagementTable onUserSelect={handleUserSelect} />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4 mt-6">
            {selectedUser ? (
              <UserActivityLog userId={selectedUser} />
            ) : (
              <div className="text-center py-10">
                <p>Select a user from the Users tab to view activity logs</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="roleHistory" className="space-y-4 mt-6">
            {selectedUser ? (
              <UserRoleHistory userId={selectedUser} />
            ) : (
              <div className="text-center py-10">
                <p>Select a user from the Users tab to view role history</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Users;
