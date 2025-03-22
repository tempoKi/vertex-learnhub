
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import ActivityLog from "./pages/ActivityLog";
import Notes from "./pages/Notes";
import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:id" element={<NotFound />} /> {/* Placeholder for future class details page */}
          <Route path="/classes/:id/edit" element={<NotFound />} /> {/* Placeholder for future class edit page */}
          <Route path="/classes/create" element={<NotFound />} /> {/* Placeholder for future class creation page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
