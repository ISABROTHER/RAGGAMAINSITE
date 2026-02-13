// src/pages/Support.tsx
import { useState, useEffect } from 'react';
import { Heart, BookOpen, Target, Users, ArrowRight, Loader2, Share2, Copy, Check, MessageCircle, Twitter } from 'lucide-react';
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

  const featured = projects.find(p => p.is_featured);
  const others = projects.filter(p => !p.is_featured);

  // Animation variants for the title letters
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const titleLetter = {
    hidden: { y: 50, opacity: 0, rotateX: -90 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    // Reduced pt-16 to pt-14 on mobile to aggressively close the gap to the header
    <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection>
          {/* Reduced pt-1 to pt-0 on mobile */}
          <div className="text-center pt-0 sm:pt-4 pb-12 sm:pb-20">
            
            {/* 1. Innovative Animated Title */}
            <style>{`
              @keyframes hueShift {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(45deg); }
                50% { filter: hue-rotate(90deg); }
                75% { filter: hue-rotate(45deg); }
                100% { filter: hue-rotate(0deg); }
              }
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .ragga-title {
                background: linear-gradient(270deg, #dc2626, #16a34a, #eab308, #dc2626, #16a34a);
                background-size: 300% 300%;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientMove 6s ease infinite, hueShift 8s ease-in-out infinite;
              }
            `}</style>
            <motion.div 
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              className="mb-1"
            >
              <h1 className="ragga-title text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase perspective-1000">
                {Array.from("Ragga Foundation").map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={titleLetter}
                    className="inline-block origin-bottom"
                    whileHover={{ scale: 1.2, rotate: [-5, 5, 0], transition: { duration: 0.3 } }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* 2. Slogan */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-8 sm:w-12 bg-slate-200" />
              <p className="text-base sm:text-lg font-bold uppercase tracking-[0.35em] text-green-700">
                Obiara Ka Ho
              </p>
              <div className="h-px w-8 sm:w-12 bg-slate-200" />
            </div>
            
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

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-8 h-8 text-green-700" />
            </motion.div>
          </div>
        ) : (
          <>
            {featured && (
              <AnimatedSection>
                <FeaturedCard project={featured} onContribute={() => setSelectedProject(featured)} />
              </AnimatedSection>
            )}

            {others.length > 0 && (
              <AnimatedSection>
                <div className="mt-16 sm:mt-24">
                  <div className="flex items-center gap-4 mb-8 px-1">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">More Projects</h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {others.map((p, i) => (
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
                </div>
              </AnimatedSection>
            )}

            {projects.length === 0 && (
              <div className="text-center py-32 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm mx-4">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">No active projects at the moment.</p>
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

function FeaturedCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-900/20 group">
      <div className="absolute inset-0">
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt="" 
            className="w-full h-full object-cover opacity-30 scale-100 group-hover:scale-105 transition-transform duration-[2s]" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/40" />
      </div>

      <div className="relative z-10 p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-400 rounded-full mb-6 backdrop-blur-md">
            {project.category}
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
            {project.title}
          </h2>

          <p className="text-white/60 text-sm sm:text-lg leading-relaxed mb-10 max-w-xl font-medium">
            {project.description}
          </p>

          <div className="mb-10 bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5 backdrop-blur-sm">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                    {project.raised_units.toLocaleString()}
                  </p>
                  <p className="text-sm text-white/40 font-bold uppercase tracking-wider mb-1.5">
                    / {project.target_units.toLocaleString()} {project.unit_label}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-green-400 tabular-nums">{project.percent}%</p>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.percent}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(74,222,128,0.5)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-10">
            <Stat icon={Users} label="Contributors" value={project.donor_count.toLocaleString()} />
            <Stat icon={Target} label="Goal" value={`${project.target_units.toLocaleString()} ${project.unit_label}`} />
            <Stat icon={BookOpen} label="Per Unit" value={`GH\u20B5${project.unit_price_ghs.toFixed(2)}`} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContribute}
              className="flutter-btn group inline-flex items-center gap-3 px-8 sm:px-10 py-5 bg-green-600 text-white rounded-2xl font-bold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-green-600/25 hover:bg-green-500 transition-colors"
            >
              <Heart className="w-5 h-5 fill-current" />
              Contribute Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <ShareButtons slug={project.slug} title={project.title} variant="dark" />
          </div>
        </div>
      </div>
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

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
        <Icon className="w-5 h-5 text-white/40" />
      </div>
      <div>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-lg font-bold text-white leading-none">{value}</p>
      </div>
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