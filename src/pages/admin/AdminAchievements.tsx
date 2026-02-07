import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Edit, Trash2, Star, Calendar, Loader2, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';

interface Achievement {
  id: string;
  title: string;
  category: string;
  description: string;
  impact: string;
  image_url: string | null;
  date_achieved: string;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

const CATEGORIES = ['Education', 'Health', 'Infrastructure', 'Agriculture', 'Employment', 'Environment', 'Youth', 'Women', 'Other'];

export function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Education',
    description: '',
    impact: '',
    image_url: '',
    date_achieved: new Date().toISOString().split('T')[0],
    is_featured: false,
    order_index: 0,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('order_index', { ascending: true });
    if (data) setAchievements(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      date_achieved: new Date(formData.date_achieved).toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('achievements').update(payload).eq('id', editingId);
    } else {
      await supabase.from('achievements').insert(payload);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Education',
      description: '',
      impact: '',
      image_url: '',
      date_achieved: new Date().toISOString().split('T')[0],
      is_featured: false,
      order_index: 0,
    });
    fetchAchievements();
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setFormData({
      title: achievement.title,
      category: achievement.category,
      description: achievement.description,
      impact: achievement.impact,
      image_url: achievement.image_url || '',
      date_achieved: achievement.date_achieved.split('T')[0],
      is_featured: achievement.is_featured,
      order_index: achievement.order_index,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement? This action cannot be undone.')) return;
    await supabase.from('achievements').delete().eq('id', id);
    fetchAchievements();
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await supabase.from('achievements').update({ is_featured: !currentStatus }).eq('id', id);
    fetchAchievements();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const featuredCount = achievements.filter(a => a.is_featured).length;
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = achievements.filter(a => a.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Achievements Management</h2>
          <p className="text-slate-500 mt-1 font-medium">{achievements.length} total achievements</p>
        </div>
        <Button
          size="md"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              category: 'Education',
              description: '',
              impact: '',
              image_url: '',
              date_achieved: new Date().toISOString().split('T')[0],
              is_featured: false,
              order_index: achievements.length,
            });
          }}
          className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: achievements.length, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Featured', value: featuredCount, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Education', value: categoryCounts.Education || 0, icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Infrastructure', value: categoryCounts.Infrastructure || 0, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-black text-slate-900 mb-4">
            {editingId ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                  placeholder="Achievement title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Date Achieved</label>
                <input
                  type="date"
                  required
                  value={formData.date_achieved}
                  onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                  placeholder="https://images.pexels.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent resize-none"
                  placeholder="Detailed description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Impact</label>
                <textarea
                  rows={2}
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent resize-none"
                  placeholder="Impact statement or metrics"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 pt-7">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#CE1126] border-slate-300 rounded focus:ring-[#CE1126]"
                />
                <label htmlFor="featured" className="text-sm font-bold text-slate-700">Featured on homepage</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" size="md" className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl">
                {editingId ? 'Update' : 'Create'} Achievement
              </Button>
              <Button
                type="button"
                size="md"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
        ) : achievements.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No achievements added</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-40 bg-slate-200">
                  {achievement.image_url ? (
                    <img src={achievement.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Image className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  {achievement.is_featured && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#CE1126] uppercase tracking-wider">{achievement.category}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(achievement.date_achieved)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2">{achievement.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{achievement.description}</p>
                  {achievement.impact && (
                    <p className="text-xs text-blue-600 font-medium mb-3 line-clamp-1">{achievement.impact}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <button
                      onClick={() => toggleFeatured(achievement.id, achievement.is_featured)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${achievement.is_featured ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                      <Star className="w-3 h-3 inline mr-1" />
                      {achievement.is_featured ? 'Featured' : 'Feature'}
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
