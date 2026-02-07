import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export function ProtectedRoute({ children, onNavigate }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#CE1126] animate-spin" />
      </div>
    );
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  return <>{children}</>;
}
