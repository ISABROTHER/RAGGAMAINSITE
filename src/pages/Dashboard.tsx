import { useAuth } from '../contexts/AuthContext';
import { Admin } from './Admin';
import { ConstituentDashboard } from './ConstituentDashboard';
import { AssemblymanDashboard } from './AssemblymanDashboard';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#CE1126] animate-spin" />
      </div>
    );
  }

  const role = profile?.role || 'constituent';

  switch (role) {
    case 'admin':
    case 'viewer':
      return <Admin />;
    case 'assemblyman':
      return <AssemblymanDashboard />;
    default:
      return <ConstituentDashboard />;
  }
}