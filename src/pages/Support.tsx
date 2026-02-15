// src/pages/Support.tsx
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Loader2, Search, SlidersHorizontal, X, Share2, Copy, Check, MessageCircle, Twitter, Send, Users, ChevronDown, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface Donor {
  display_name: string;
  units: number;
  time_ago: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
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
        const rawPercent = p.target_units > 0 ? (raised / p.target_units) * 100 : 0;
        const percent = raised > 0 ? Math.min(100, Math.max(1, Math.round(rawPercent))) : 0;
        return { ...p, raised_units: raised, donor_count: donorCount, percent };
      })
    );

    setProjects(withProgress);
    setLoading(false);
  };

  useEffect(() => {
    const verifyPending = async () => {
      const pendingRef = localStorage.getItem('pending_payment_ref');
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get('trxref') || urlParams.get('reference');
      const ref = pendingRef || urlRef;

      if (ref) {
        try {
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`;
          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference: ref }),
          });
        } catch { /* silent */ }
        localStorage.removeItem('pending_payment_ref');
        if (urlRef) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    };

    verifyPending().then(() => fetchProjects());
  }, []);

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
    <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection>
          <div className="text-center pt-0 sm:pt-4 pb-12 sm:pb-20">
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-2"
            >
              <span className="text-green-700">Ragga </span>
              <span className="text-green-700">Foundation</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="mx-auto w-24 sm:w-32 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-600 rounded-full origin-left mb-4"
            />

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

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
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

const BOOK_PROJECT_IMAGE = 'https://i.imgur.com/4yctvPb.jpg';

function ProjectCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  const isBookProject = project.title.toLowerCase().includes('book') || project.title.toLowerCase().includes('obiara');
  const displayImage = isBookProject ? BOOK_PROJECT_IMAGE : project.image_url;
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [donateTextIndex, setDonateTextIndex] = useState(0);
  const donateTexts = ['Please Donate', 'Make a Difference', 'Change a Life', 'Give Hope'];

  // Donor book state
  const [showDonorBook, setShowDonorBook] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [donorPage, setDonorPage] = useState(1);
  const DONORS_PER_PAGE = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setDonateTextIndex((prev) => (prev + 1) % donateTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const shareUrl = `${window.location.origin}/support?project=${project.slug}`;
  const shareText = `Support "${project.title}" on Ragga Foundation!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const fetchDonors = async () => {
    if (donors.length > 0) {
      setShowDonorBook(true);
      return;
    }
    setLoadingDonors(true);
    setShowDonorBook(true);

    const { data } = await supabase
      .from('contributions')
      .select('donor_first_name, donor_last_name, units_contributed, created_at')
      .eq('project_id', project.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (data) {
      const mapped: Donor[] = data.map((d) => {
        const firstName = d.donor_first_name || 'Anonymous';
        const lastInitial = d.donor_last_name ? d.donor_last_name.charAt(0).toUpperCase() + '.' : '';
        return {
          display_name: lastInitial ? `${firstName} ${lastInitial}` : firstName,
          units: d.units_contributed || 0,
          time_ago: timeAgo(d.created_at),
        };
      });
      setDonors(mapped);
    }
    setLoadingDonors(false);
  };

  const paginatedDonors = donors.slice(0, donorPage * DONORS_PER_PAGE);
  const hasMore = paginatedDonors.length < donors.length;

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
        {/* Image */}
        <div className="relative h-44 sm:h-52 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/90 text-slate-800 rounded-full backdrop-blur-sm">
            {project.category}
          </span>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[10px] font-extrabold tabular-nums bg-green-600 text-white rounded-full">
            {project.percent}%
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-green-700 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-slate-600 tabular-nums">
                {project.raised_units.toLocaleString()} / {project.target_units.toLocaleString()}
              </span>
              {/* Donation Board Button — text + number */}
              {project.donor_count > 0 && (
                <button
                  onClick={fetchDonors}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/60 text-amber-700 transition-all active:scale-95"
                  title="View donation board"
                >
                  <ClipboardList className="w-3 h-3" />
                  <span className="text-[10px] font-bold">Donation Board</span>
                  <span className="text-[10px] font-extrabold tabular-nums">{project.donor_count}</span>
                </button>
              )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${project.percent}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContribute}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center relative overflow-hidden"
            >
              <motion.span
                key={donateTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10"
              >
                {donateTexts[donateTextIndex]}
              </motion.span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const url = `${window.location.origin}/support?project=${project.slug}`;
                const text = `Hi! I'd love for you to support "${project.title}" on Ragga Foundation. Every contribution counts! 🙏`;
                if (navigator.share) {
                  navigator.share({ title: `Invite: ${project.title}`, text, url }).catch(() => {});
                } else {
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                }
              }}
              className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Invite
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShare(true)}
              className="w-10 h-10 flex-shrink-0 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Donation Board — Centered Modal (never touches screen edges) */}
      <AnimatePresence>
        {showDonorBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-5"
            onClick={() => { setShowDonorBook(false); setDonorPage(1); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Donation Board</p>
                    <p className="text-[11px] text-slate-400">{project.donor_count} supporter{project.donor_count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowDonorBook(false); setDonorPage(1); }}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Donor List */}
              <div className="overflow-y-auto flex-1 px-4 py-3 scrollbar-hide">
                {loadingDonors ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  </div>
                ) : donors.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No donations yet</p>
                    <p className="text-[11px] text-slate-300 mt-1">Be the first to donate!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      {paginatedDonors.map((donor, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.2 }}
                          className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-[11px] font-bold text-white">
                                {donor.display_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {donor.display_name}
                              </p>
                              <p className="text-[10px] text-slate-400">{donor.time_ago}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full tabular-nums flex-shrink-0">
                            {donor.units.toLocaleString()} {project.unit_label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Load More */}
                    {hasMore && (
                      <button
                        onClick={() => setDonorPage((p) => p + 1)}
                        className="w-full mt-3 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-600 uppercase tracking-wider hover:bg-amber-50 rounded-xl transition-colors active:scale-95"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        Show more
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Footer close button */}
              <div className="px-4 pb-4 pt-2 flex-shrink-0">
                <button
                  onClick={() => { setShowDonorBook(false); setDonorPage(1); }}
                  className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-200 transition-colors active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Bottom Sheet */}
      {showShare && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowShare(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-t-2xl px-5 pt-4 pb-6"
          >
            <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            <p className="text-xs font-bold text-slate-900 text-center mb-4 uppercase tracking-wider">Share</p>

            <div className="flex justify-center gap-5 mb-5">
              <button
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
                  setShowShare(false);
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-slate-500">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                  setShowShare(false);
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-slate-500">X</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                  setShowShare(false);
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <span className="text-[9px] font-semibold text-slate-500">Facebook</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${copied ? 'bg-green-500' : 'bg-slate-200'} transition-colors`}>
                  {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-slate-600" />}
                </div>
                <span className="text-[9px] font-semibold text-slate-500">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}