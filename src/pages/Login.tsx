
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden animate-fade-in">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-xl w-12 h-12 text-xl font-bold mb-4">V</div>
              <h1 className="text-2xl font-semibold">Welcome to Vertex</h1>
              <p className="text-muted-foreground mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/reset-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="input-field"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 text-base btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Demo accounts: <br />
                  <span className="font-mono">superadmin@vertex.com</span>,{" "}
                  <span className="font-mono">manager@vertex.com</span>,{" "}
                  <span className="font-mono">secretary@vertex.com</span>,{" "}
                  <span className="font-mono">teacher@vertex.com</span>
                  <br />
                  Password: <span className="font-mono">password</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © {new Date().getFullYear()} Vertex Education Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
