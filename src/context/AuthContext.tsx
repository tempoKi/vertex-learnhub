
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

type Role = 'superadmin' | 'manager' | 'secretary' | 'teacher';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('vertex_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('vertex_user');
      }
    }
    setLoading(false);
  }, []);

  // In a real app, this would be an API call
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (email === 'admin@vertex.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@vertex.com',
          role: 'superadmin',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0077C8&color=fff'
        };
        setUser(userData);
        localStorage.setItem('vertex_user', JSON.stringify(userData));
        toast.success('Successfully logged in');
        return;
      } else if (email === 'manager@vertex.com' && password === 'password') {
        const userData: User = {
          id: '2',
          name: 'Manager User',
          email: 'manager@vertex.com',
          role: 'manager',
          avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=0077C8&color=fff'
        };
        setUser(userData);
        localStorage.setItem('vertex_user', JSON.stringify(userData));
        toast.success('Successfully logged in');
        return;
      } else if (email === 'secretary@vertex.com' && password === 'password') {
        const userData: User = {
          id: '3',
          name: 'Secretary User',
          email: 'secretary@vertex.com',
          role: 'secretary',
          avatar: 'https://ui-avatars.com/api/?name=Secretary+User&background=0077C8&color=fff'
        };
        setUser(userData);
        localStorage.setItem('vertex_user', JSON.stringify(userData));
        toast.success('Successfully logged in');
        return;
      } else if (email === 'teacher@vertex.com' && password === 'password') {
        const userData: User = {
          id: '4',
          name: 'Teacher User',
          email: 'teacher@vertex.com',
          role: 'teacher',
          avatar: 'https://ui-avatars.com/api/?name=Teacher+User&background=0077C8&color=fff'
        };
        setUser(userData);
        localStorage.setItem('vertex_user', JSON.stringify(userData));
        toast.success('Successfully logged in');
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast.error(e.message);
      } else {
        setError('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vertex_user');
    toast.info('You have been logged out');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password reset
      if (email) {
        toast.success('Password reset instructions sent to your email');
        return;
      }
      
      throw new Error('Please enter a valid email');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast.error(e.message);
      } else {
        setError('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
