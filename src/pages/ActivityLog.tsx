
import MainLayout from "@/components/layout/MainLayout";
import ActivityLogSection from "@/components/activity-log/ActivityLogSection";

const ActivityLog = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-muted-foreground mt-1">
              View and analyze system-wide activity logs and user actions
            </p>
          </div>
        </div>
        
        <ActivityLogSection />
      </div>
    </MainLayout>
  );
};

export default ActivityLog;
