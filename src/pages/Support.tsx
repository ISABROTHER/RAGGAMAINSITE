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

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection>
          <div className="text-center pt-8 pb-10 sm:pb-12">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6">
              Ragga Foundation
            </h1>
            
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                The Ragga Foundation is the social responsibility arm of my office as Member of Parliament for Cape Coast North. Through the Foundation, we work with individuals, businesses, and partners to support our communities, carry out practical projects, and improve lives across the constituency.
              </p>
            </div>

            <p className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-green-700">
              Obiara Ka Ho
            </p>
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
                <div className="mt-12 sm:mt-16">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-5 px-1">More Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
              <div className="text-center py-32 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
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
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-900/20">
      <div className="absolute inset-0">
        {project.image_url && (
          <img src={project.image_url} alt="" className="w-full h-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/85 to-slate-900/50" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white rounded-full mb-5">
            {project.category}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {project.title}
          </h2>

          <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
            {project.description}
          </p>

          <div className="mb-8">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {project.raised_units.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mt-1">
                  of {project.target_units.toLocaleString()} {project.unit_label}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-green-400 tabular-nums">{project.percent}%</p>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.percent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 mb-8">
            <Stat icon={Users} label="Contributors" value={project.donor_count.toLocaleString()} />
            <Stat icon={Target} label="Target" value={`${project.target_units.toLocaleString()} ${project.unit_label}`} />
            <Stat icon={BookOpen} label="Per Unit" value={`GH\u20B5${project.unit_price_ghs.toFixed(2)}`} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onContribute}
              className="flutter-btn group inline-flex items-center gap-3 px-7 sm:px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-green-600/20"
            >
              <Heart className="w-4 h-4" />
              Contribute Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    <div className="flex items-center gap-1.5">
      {[
        { action: shareNative, icon: Share2, label: 'Share' },
        { action: shareWhatsApp, icon: MessageCircle, label: 'WhatsApp' },
        { action: shareX, icon: Twitter, label: 'X' },
      ].map(({ action, icon: Icon, label }) => (
        <motion.button
          key={label}
          whileTap={{ scale: 0.85 }}
          onClick={action}
          className={`flutter-btn w-11 h-11 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-white/10 text-white/60' : 'bg-white border border-slate-100 text-slate-400 shadow-sm'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </motion.button>
      ))}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={copyLink}
        className={`flutter-btn w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          copied
            ? 'bg-green-500/20 text-green-400'
            : isDark ? 'bg-white/10 text-white/60' : 'bg-white border border-slate-100 text-slate-400 shadow-sm'
        }`}
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-white/25" />
      <div>
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  return (
    <div className="flutter-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-44 sm:h-48 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-white/90 text-slate-900 rounded-full backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 leading-snug">{project.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-slate-900 tabular-nums">{project.raised_units.toLocaleString()} {project.unit_label}</span>
            <span className="font-bold text-green-700 tabular-nums">{project.percent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-700"
              style={{ width: `${project.percent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Target: {project.target_units.toLocaleString()} {project.unit_label}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onContribute}
            className="flutter-btn flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Heart className="w-3.5 h-3.5" />
            Contribute
          </motion.button>
          <ShareButtons slug={project.slug} title={project.title} variant="light" />
        </div>
      </div>
    </div>
  );
}