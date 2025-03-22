import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { 
  Save, 
  Database, 
  Download, 
  Upload, 
  Server, 
  RefreshCw,
  HardDrive,
  MemoryStick,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import CustomCard from "@/components/ui/CustomCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock system stats
const mockSystemStats = {
  version: "1.2.3",
  uptime: "15 days, 7 hours, 23 minutes",
  lastBackup: "2023-06-14 03:00:00",
  nextScheduledBackup: "2023-06-15 03:00:00",
  databaseSize: "1.2 GB",
  totalUsers: 156,
  activeUsers: 143,
  systemLoad: {
    cpu: 12.5,
    memory: 35.8,
    disk: 42.3
  },
  emailQueue: 3,
  pendingTasks: 8
};

const fetchSystemStats = async () => {
  // Mock API call - would be replaced with actual fetch
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSystemStats;
};

interface SystemConfigProps {}

const SystemConfig = ({}: SystemConfigProps) => {
  const [smtpSettings, setSmtpSettings] = useState({
    server: "smtp.vertex.edu",
    port: "587",
    username: "notifications@vertex.edu",
    password: "••••••••••••",
    sslEnabled: true
  });
  
  const [backupSettings, setBackupSettings] = useState({
    scheduledBackups: true,
    backupTime: "03:00",
    backupFrequency: "daily",
    retentionPeriod: "30",
    includeMediaFiles: true
  });

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["systemStats"],
    queryFn: fetchSystemStats,
  });

  const handleSaveSmtpSettings = () => {
    // Would call API to save settings
    toast.success("SMTP settings saved successfully");
  };

  const handleSaveBackupSettings = () => {
    // Would call API to save backup settings
    toast.success("Backup settings saved successfully");
  };

  const handleManualBackup = () => {
    // Would call API to trigger manual backup
    toast.success("Manual backup initiated");
  };

  const handleRestoreBackup = () => {
    // Would handle backup restore
    toast.success("System restore initiated");
  };

  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomCard className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">System Status</h3>
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">{stats?.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">{stats?.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Users:</span>
              <span className="font-medium">{stats?.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users:</span>
              <span className="font-medium">{stats?.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Size:</span>
              <span className="font-medium">{stats?.databaseSize}</span>
            </div>
          </div>
        </CustomCard>

        <CustomCard className="p-4">
          <h3 className="text-lg font-medium">System Load</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  <span>CPU</span>
                </div>
                <span className="text-sm">{stats?.systemLoad.cpu}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats?.systemLoad.cpu}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <MemoryStick className="h-4 w-4 mr-2" />
                  <span>Memory</span>
                </div>
                <span className="text-sm">{stats?.systemLoad.memory}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats?.systemLoad.memory}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 mr-2" />
                  <span>Disk</span>
                </div>
                <span className="text-sm">{stats?.systemLoad.disk}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${stats?.systemLoad.disk}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CustomCard>

        <CustomCard className="p-4">
          <h3 className="text-lg font-medium">Backup Status</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup:</span>
              <span className="font-medium">{stats?.lastBackup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Backup:</span>
              <span className="font-medium">{stats?.nextScheduledBackup}</span>
            </div>
            <div className="mt-4">
              <Button 
                className="w-full mb-2" 
                onClick={handleManualBackup}
              >
                <Download className="h-4 w-4 mr-2" />
                Run Backup Now
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>System Restore</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace all current data with the selected backup.
                      All users will be disconnected during this process.
                      This operation cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestoreBackup}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CustomCard>
      </div>

      {/* SMTP Configuration */}
      <CustomCard className="p-6">
        <h3 className="text-xl font-medium mb-4">Email Configuration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input 
                id="smtp-server" 
                value={smtpSettings.server}
                onChange={(e) => setSmtpSettings({...smtpSettings, server: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input 
                id="smtp-port" 
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Username</Label>
              <Input 
                id="smtp-username" 
                value={smtpSettings.username}
                onChange={(e) => setSmtpSettings({...smtpSettings, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Password</Label>
              <Input 
                id="smtp-password" 
                type="password" 
                value={smtpSettings.password}
                onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="ssl-enabled" 
              checked={smtpSettings.sslEnabled}
              onCheckedChange={(checked) => setSmtpSettings({...smtpSettings, sslEnabled: checked})}
            />
            <Label htmlFor="ssl-enabled">Enable SSL/TLS</Label>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveSmtpSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Email Settings
            </Button>
          </div>
        </div>
      </CustomCard>

      {/* Backup Configuration */}
      <CustomCard className="p-6">
        <h3 className="text-xl font-medium mb-4">Backup Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="scheduled-backups" 
              checked={backupSettings.scheduledBackups}
              onCheckedChange={(checked) => setBackupSettings({...backupSettings, scheduledBackups: checked})}
            />
            <Label htmlFor="scheduled-backups">Enable Scheduled Backups</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backup-time">Backup Time</Label>
              <Input 
                id="backup-time" 
                type="time" 
                value={backupSettings.backupTime}
                onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                disabled={!backupSettings.scheduledBackups}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Frequency</Label>
              <select
                id="backup-frequency"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                disabled={!backupSettings.scheduledBackups}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention (days)</Label>
              <Input 
                id="retention-period" 
                type="number" 
                value={backupSettings.retentionPeriod}
                onChange={(e) => setBackupSettings({...backupSettings, retentionPeriod: e.target.value})}
                disabled={!backupSettings.scheduledBackups}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="include-media" 
              checked={backupSettings.includeMediaFiles}
              onCheckedChange={(checked) => setBackupSettings({...backupSettings, includeMediaFiles: checked})}
              disabled={!backupSettings.scheduledBackups}
            />
            <Label htmlFor="include-media">Include Media Files (images, documents)</Label>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveBackupSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Backup Settings
            </Button>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};

export default SystemConfig;
