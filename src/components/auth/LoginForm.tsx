
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomCard from "@/components/ui/CustomCard";
import { LockKeyhole, Mail } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Error toast is handled in loginUser function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomCard className="w-full max-w-md mx-auto" isGlass>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                size={18}
              />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="h-auto p-0 text-xs" onClick={() => navigate("/reset-password")}>
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <LockKeyhole 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                size={18}
              />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Demo accounts info */}
        <div className="text-sm text-vertex-500 bg-vertex-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Demo Accounts:</p>
          <p>SuperAdmin: admin@vertex.edu</p>
          <p>Manager: manager@vertex.edu</p>
          <p>Secretary: secretary@vertex.edu</p>
          <p>Teacher: teacher@vertex.edu</p>
          <p className="text-xs mt-1 text-vertex-400">Any password will work in this demo</p>
        </div>
      </div>
    </CustomCard>
  );
};

export default LoginForm;
