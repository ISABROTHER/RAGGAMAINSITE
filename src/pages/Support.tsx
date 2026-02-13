// src/pages/Support.tsx
import { useState, useEffect, useMemo } from 'react';
import { Heart, BookOpen, Loader2, Share2, Copy, Check, MessageCircle, Twitter, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../components/AnimatedSection';
import { ContributeModal } from '../components/ContributeModal';
import { supabase } from '../lib/supabase';

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
  is_featured: boolean;
}

interface ProjectWithProgress extends Project {
  raised_units: number;
  donor_count: number;
  percent: number;
}

export function Support() {
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectWithProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchProjects = async () => {
    const { data: projectRows } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });

    if (!projectRows) { setLoading(false); return; }

    const withProgress: ProjectWithProgress[] = await Promise.all(
      projectRows.map(async (p) => {
        const { data: contribs } = await supabase
          .from('contributions')
          .select('units_contributed')
          .eq('project_id', p.id)
          .eq('status', 'completed');

        const raised = contribs?.reduce((sum, c) => sum + (c.units_contributed || 0), 0) || 0;
        const donorCount = contribs?.length || 0;
        const percent = p.target_units > 0 ? Math.min(100, Math.round((raised / p.target_units) * 100)) : 0;
        return { ...p, raised_units: raised, donor_count: donorCount, percent };
      })
    );

    setProjects(withProgress);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map(p => p.category)));
    return ['All', ...cats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    // Reduced pt-16 to pt-14 on mobile to aggressively close the gap to the header
    <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection>
          {/* Reduced pt-1 to pt-0 on mobile */}
          <div className="text-center pt-0 sm:pt-4 pb-12 sm:pb-20">
            
            {/* 1. Animated Title — smooth fade-in + slide up */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2"
            >
              <span className="text-green-700">Ragga </span>
              <span className="text-green-700">Foundation</span>
            </motion.h1>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="mx-auto w-24 sm:w-32 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-600 rounded-full origin-left mb-4"
            />

            
            {/* 3. Description Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className="max-w-4xl mx-auto bg-red-600 rounded-3xl p-6 sm:p-12 shadow-xl shadow-red-600/20 transform rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              <p className="text-sm sm:text-base font-medium text-white leading-relaxed text-center">
                The Ragga Foundation is the social responsibility arm of my office as Member of Parliament for Cape Coast North. Through the Foundation, we work with individuals, businesses, and partners to support our communities, carry out practical projects, and improve lives across the constituency.
              </p>
            </motion.div>

          </div>
        </AnimatedSection>

        {/* Search & Filter Bar — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          {/* Search Input */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-green-300 hover:text-green-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-8 h-8 text-green-700" />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center gap-4 mb-8 mt-10 px-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <ProjectCard project={p} onContribute={() => setSelectedProject(p)} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No projects match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-3 text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProject && (
        <ContributeModal
          project={selectedProject}
          onClose={() => { setSelectedProject(null); fetchProjects(); }}
        />
      )}
    </div>
  );
}

function ShareButtons({ slug, title, variant }: { slug: string; title: string; variant: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/support?project=${slug}`;
  const shareText = `Support "${title}" - Help provide exercise books for students in Cape Coast North!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: shareText, url: shareUrl }); }
      catch { /* user cancelled */ }
    } else { copyLink(); }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2">
      {[
        { action: shareNative, icon: Share2, label: 'Share' },
        { action: shareWhatsApp, icon: MessageCircle, label: 'WhatsApp' },
        { action: shareX, icon: Twitter, label: 'X' },
      ].map(({ action, icon: Icon, label }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className={`flutter-btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isDark 
              ? 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 shadow-sm'
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={copyLink}
        className={`flutter-btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          copied
            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
            : isDark 
              ? 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5' 
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 shadow-sm'
        }`}
        title="Copy link"
      >
        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}

function ProjectCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  return (
    <div className="flutter-card group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
      <div className="relative h-56 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-slate-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/95 text-slate-900 rounded-full shadow-sm backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-green-700 transition-colors">{project.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{project.description}</p>

        <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex justify-between text-xs mb-2.5">
            <span className="font-bold text-slate-700 tabular-nums">
              {project.raised_units.toLocaleString()} <span className="text-slate-400 font-normal">/ {project.target_units.toLocaleString()}</span>
            </span>
            <span className="font-extrabold text-green-600 tabular-nums">{project.percent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${project.percent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContribute}
            className="flutter-btn flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Contribute
          </motion.button>
          <ShareButtons slug={project.slug} title={project.title} variant="light" />
        </div>
      </div>
    </div>
  );
}