
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Vertex</h1>
          <p className="mt-2 text-sm text-blue-700">Educational Management System</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
