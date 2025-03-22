
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CustomCard from "@/components/ui/CustomCard";
import UserManagement from "@/components/settings/UserManagement";
import SystemLogs from "@/components/settings/SystemLogs";
import SystemConfig from "@/components/settings/SystemConfig";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user has permission to access this page
    if (!hasPermission(["SuperAdmin", "Manager"])) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Manage system settings, users, and view system logs
          </p>
        </div>

        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4 mt-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4 mt-6">
            <SystemLogs />
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4 mt-6">
            <SystemConfig />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
