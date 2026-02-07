import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, FolderOpen, X, Loader2,
  Target, Clock, DollarSign, Pause, Play, CheckCircle2, XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
  is_active: boolean;
  is_featured: boolean;
  status: string;
  deadline: string | null;
  funding_goal_ghs: number;
  created_at: string;
}

interface Contribution {
  project_id: string;
  amount_ghs: number;
  status: string;
}

interface AdminProjectsProps {
  projects: Project[];
  contributions: Contribution[];
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: Play },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  paused: { label: 'Paused', color: 'bg-amber-100 text-amber-700', icon: Pause },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const CATEGORIES = ['Education', 'Health', 'Infrastructure', 'Agriculture', 'Community', 'Youth', 'Other'];

const emptyForm = {
  title: '', slug: '', description: '', category: 'Education',
  image_url: '', target_units: 0, unit_label: 'units',
  unit_price_ghs: 1, funding_goal_ghs: 0, deadline: '', status: 'active',
  is_active: true, is_featured: false,
};

export function AdminProjects({ projects, contributions, onRefresh }: AdminProjectsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const raisedByProject = (pid: string) =>
    contributions.filter(c => c.project_id === pid && c.status === 'completed')
      .reduce((s, c) => s + Number(c.amount_ghs), 0);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditId(p.id);
    setForm({
      title: p.title, slug: p.slug, description: p.description,
      category: p.category, image_url: p.image_url || '',
      target_units: p.target_units, unit_label: p.unit_label,
      unit_price_ghs: p.unit_price_ghs, funding_goal_ghs: p.funding_goal_ghs,
      deadline: p.deadline ? new Date(p.deadline).toISOString().slice(0, 16) : '',
      status: p.status || 'active', is_active: p.is_active, is_featured: p.is_featured,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      title: form.title, slug, description: form.description,
      category: form.category, image_url: form.image_url || null,
      target_units: form.target_units, unit_label: form.unit_label,
      unit_price_ghs: form.unit_price_ghs, funding_goal_ghs: form.funding_goal_ghs,
      deadline: form.deadline || null, status: form.status,
      is_active: form.status === 'active', is_featured: form.is_featured,
    };
    if (editId) {
      await supabase.from('projects').update(payload).eq('id', editId);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    onRefresh();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('projects').update({ status, is_active: status === 'active' }).eq('id', id);
    onRefresh();
  };

  const formatGHS = (n: number) => `GHS ${n.toLocaleString()}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Management</h2>
          <p className="text-slate-500 mt-1 font-medium">{projects.length} projects</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg transition-colors">
          <Plus className="w-4 h-4" />New Project
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = projects.filter(p => (p.status || 'active') === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-slate-400" />
              <p className="text-xl font-black text-slate-900">{count}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Project' : 'Create Project'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="E.g., School Renovation Fund" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the project..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 resize-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Funding Goal (GHS)</label>
                  <input type="number" value={form.funding_goal_ghs} onChange={e => setForm(f => ({ ...f, funding_goal_ghs: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deadline</label>
                  <input type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Units</label>
                  <input type="number" value={form.target_units} onChange={e => setForm(f => ({ ...f, target_units: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit Label</label>
                  <input value={form.unit_label} onChange={e => setForm(f => ({ ...f, unit_label: e.target.value }))} placeholder="e.g., books, desks" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit Price (GHS)</label>
                  <input type="number" step="0.01" value={form.unit_price_ghs} onChange={e => setForm(f => ({ ...f, unit_price_ghs: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300">
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-[#CE1126] focus:ring-[#CE1126]" />
                    <span className="text-sm font-medium text-slate-700">Featured project</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title.trim()} className="px-6 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 transition-colors flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editId ? 'Update' : 'Create'} Project
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No projects created yet</p>
          </div>
        ) : projects.map(p => {
          const raised = raisedByProject(p.id);
          const goal = p.funding_goal_ghs || (p.target_units * p.unit_price_ghs);
          const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
          const statusCfg = STATUS_CONFIG[p.status || 'active'] || STATUS_CONFIG.active;
          const StatusIcon = statusCfg.icon;

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {p.image_url && (
                  <div className="sm:w-48 h-32 sm:h-auto shrink-0">
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                        {p.is_featured && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">FEATURED</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{p.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" />{statusCfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{p.description}</p>

                  <div className="flex items-center gap-4 mb-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Goal: {formatGHS(goal)}</span>
                    <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{p.target_units} {p.unit_label}</span>
                    {p.deadline && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(p.deadline)}</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{pct}%</span>
                    <span className="text-xs text-slate-500">{formatGHS(raised)} raised</span>
                  </div>

                  {p.status === 'active' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button onClick={() => updateStatus(p.id, 'paused')} className="text-[10px] font-bold text-amber-600 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"><Pause className="w-3 h-3" />Pause</button>
                      <button onClick={() => updateStatus(p.id, 'completed')} className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Complete</button>
                      <button onClick={() => updateStatus(p.id, 'cancelled')} className="text-[10px] font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"><XCircle className="w-3 h-3" />Cancel</button>
                    </div>
                  )}
                  {p.status === 'paused' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button onClick={() => updateStatus(p.id, 'active')} className="text-[10px] font-bold text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"><Play className="w-3 h-3" />Resume</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
