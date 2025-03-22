
import MainLayout from "@/components/layout/MainLayout";
import AttendanceDashboard from "@/components/attendance/AttendanceDashboard";
import { hasPermission } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Attendance = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has permission to access this page
    if (!hasPermission(["SuperAdmin", "Manager", "Teacher"])) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <AttendanceDashboard />
    </MainLayout>
  );
};

export default Attendance;
