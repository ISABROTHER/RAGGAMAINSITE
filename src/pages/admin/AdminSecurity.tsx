import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, User, Filter, Loader2, Activity, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuditEntry {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
  actor_name?: string;
}

export function AdminSecurity() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data && data.length > 0) {
        const actorIds = [...new Set(data.filter(d => d.actor_id).map(d => d.actor_id))];
        if (actorIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', actorIds as string[]);
          const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
          setLogs(data.map(d => ({ ...d, actor_name: d.actor_id ? nameMap.get(d.actor_id) || 'Unknown' : 'System' })));
        } else {
          setLogs(data.map(d => ({ ...d, actor_name: 'System' })));
        }
      } else {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.action.includes(filter));

  const actionColor = (action: string) => {
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-100 text-red-700';
    if (action.includes('create') || action.includes('insert')) return 'bg-green-100 text-green-700';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-700';
  };

  const actions = [...new Set(logs.map(l => l.action))];

  const formatTime = (d: string) => {
    const date = new Date(d);
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security & Audit Logs</h2>
        <p className="text-slate-500 mt-1 font-medium">System activity tracking and access controls</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Logs', value: logs.length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Create Actions', value: logs.filter(l => l.action.includes('create') || l.action.includes('insert')).length, icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Update Actions', value: logs.filter(l => l.action.includes('update')).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Delete Actions', value: logs.filter(l => l.action.includes('delete')).length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-2`}><s.icon className="w-4 h-4" /></div>
            <p className="text-xl font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>All</button>
          {actions.slice(0, 6).map(a => (
            <button key={a} onClick={() => setFilter(a)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === a ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{a}</button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-slate-300 animate-spin" /></div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No audit logs recorded</p>
            <p className="text-xs mt-1">System activity will appear here as actions are performed</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{log.actor_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${actionColor(log.action)}`}>{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{log.target_type}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px] text-slate-500">{formatTime(log.created_at)}</span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">ID: {log.target_id.slice(0, 12)}...</span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-500 font-mono overflow-x-auto">
                        {JSON.stringify(log.details, null, 0).slice(0, 200)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
