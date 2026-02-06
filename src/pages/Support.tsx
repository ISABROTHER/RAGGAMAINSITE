import { useState, useEffect } from 'react';
import { Heart, BookOpen, Target, Users, ArrowRight, Loader2 } from 'lucide-react';
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

    if (!projectRows) {
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection>
          <div className="text-center pt-8 pb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-700 mb-3">The Ragga Foundation</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Obiara Ka Ho
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Everyone has a role to play. Support our projects and make a lasting impact in Cape Coast North.
            </p>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
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
                <div className="mt-16">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">More Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {others.map(p => (
                      <ProjectCard key={p.id} project={p} onContribute={() => setSelectedProject(p)} />
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
          onClose={() => {
            setSelectedProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}

function FeaturedCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900">
      <div className="absolute inset-0">
        {project.image_url && (
          <img src={project.image_url} alt="" className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
      </div>

      <div className="relative z-10 p-8 sm:p-12 lg:p-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white rounded-full mb-6">
            {project.category}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {project.title}
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
            {project.description}
          </p>

          <div className="mb-8">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">
                  {project.raised_units.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider mt-1">
                  of {project.target_units.toLocaleString()} {project.unit_label}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-green-400">{project.percent}%</p>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${project.percent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <Stat icon={Users} label="Contributors" value={project.donor_count.toLocaleString()} />
            <Stat icon={Target} label="Target" value={`${(project.target_units).toLocaleString()} ${project.unit_label}`} />
            <Stat icon={BookOpen} label="Per Unit" value={`GH\u20B5${project.unit_price_ghs.toFixed(2)}`} />
          </div>

          <button
            onClick={onContribute}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 active:scale-[0.97]"
          >
            <Heart className="w-4 h-4" />
            Contribute Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-white/30" />
      <div>
        <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project, onContribute }: { project: ProjectWithProgress; onContribute: () => void }) {
  return (
    <div className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-white/90 text-slate-900 rounded-full backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{project.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-900">{project.raised_units.toLocaleString()} {project.unit_label}</span>
            <span className="font-bold text-green-700">{project.percent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-700"
              style={{ width: `${project.percent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Target: {project.target_units.toLocaleString()} {project.unit_label}
          </p>
        </div>

        <button
          onClick={onContribute}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <Heart className="w-3.5 h-3.5" />
          Contribute
        </button>
      </div>
    </div>
  );
}
