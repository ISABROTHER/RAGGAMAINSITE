// src/components/ProjectTrackerDashboard.tsx
import {
  TrendingUp, Coins, HardHat, CheckCircle2,
  PieChart, Activity, Clock, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../components/AnimatedSection';

// Mock Data for Visualization
const overallStats = {
  totalBudgetGHS: "4.5M",
  budgetSpentGHS: "2.1M",
  spendingPercentage: 46,
  totalProjects: 24,
  projectsCompleted: 9,
  projectsOngoing: 15
};

const budgetAllocation = [
  { sector: "Education & Youth", amount: "2.0M", percentage: 45, color: "bg-green-600" },
  { sector: "Health & Sanitation", amount: "1.35M", percentage: 30, color: "bg-blue-600" },
  { sector: "Roads & Infrastructure", amount: "1.15M", percentage: 25, color: "bg-amber-500" },
];

const projectStatusBreakdown = {
  onTrack: 60,
  delayed: 10,
  completed: 30
};

const recentActivity = [
  { id: 1, project: "Pedu Park Astro-Turf", update: "Phase 2 Lighting Installation commenced.", date: "Jan 10, 2026", icon: HardHat },
  { id: 2, project: "Abura Health Center", update: "Foundation laying completed ahead of schedule.", date: "Jan 08, 2026", icon: CheckCircle2 },
  { id: 3, project: "Youth ICT Fund", update: "Q1 disbursement approved for 50 applicants.", date: "Jan 05, 2026", icon: Coins },
];

export function ProjectTrackerDashboard() {
  return (
    <section className="py-16 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SECTION HEADER --- */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-[11px] font-black uppercase tracking-widest mb-6 border border-green-200">
              <Activity className="w-4 h-4" />
              Transparency Initiative
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              Public Project & <br />
              <span className="text-green-700 underline decoration-green-300 underline-offset-4">Budget Tracker</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              A transparent view of how constituency development funds are allocated and the real-time status of ongoing projects.
            </p>
          </div>
        </AnimatedSection>

        {/* --- HIGH-LEVEL STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Budget Card */}
          <AnimatedSection delay={100}>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-slate-400">
                <Coins className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Allocated Budget</span>
              </div>
              <p className="text-3xl md:text-4xl font-black text-slate-900">GHS {overallStats.totalBudgetGHS}</p>
              <p className="text-xs font-bold text-slate-400 mt-2">Fiscal Year 2025-2026</p>
            </div>
          </AnimatedSection>

          {/* Spent Budget Card */}
          <AnimatedSection delay={150}>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute right-4 top-4">
                 <div className="radial-progress text-green-600 text-xs font-black" style={{"--value": overallStats.spendingPercentage, "--size": "3rem", "--thickness": "4px"} as any}>
                   {overallStats.spendingPercentage}%
                 </div>
              </div>
              <div className="flex items-center gap-3 mb-3 text-slate-400 pr-12">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Budget Utilized</span>
              </div>
              <p className="text-3xl md:text-4xl font-black text-slate-900">GHS {overallStats.budgetSpentGHS}</p>
              <p className="text-xs font-bold text-green-700 mt-2">On track with projections</p>
            </div>
          </AnimatedSection>

           {/* Active Projects Card */}
           <AnimatedSection delay={200}>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-3 mb-3 text-slate-300">
                <HardHat className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active Sites</span>
              </div>
              <p className="text-3xl md:text-4xl font-black">{overallStats.projectsOngoing}</p>
              <p className="text-xs font-bold text-slate-300 mt-2">Currently under construction</p>
            </div>
          </AnimatedSection>

          {/* Completed Projects Card */}
          <AnimatedSection delay={250}>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
              </div>
              <p className="text-3xl md:text-4xl font-black text-slate-900">{overallStats.projectsCompleted}</p>
              <p className="text-xs font-bold text-slate-400 mt-2">Delivered to community</p>
            </div>
          </AnimatedSection>
        </div>

        {/* --- MAIN DASHBOARD CONTENT --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Budget Allocation Column (Lighter, Modern Pie Chart alternative) */}
          <AnimatedSection delay={300} className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <PieChart className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Budget Allocation by Sector</h3>
                </div>
              </div>

              {/* Modern Visual Allocation List */}
              <div className="space-y-8">
                {budgetAllocation.map((item) => (
                  <div key={item.sector}>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase">{item.sector}</p>
                        <p className="text-xs font-medium text-slate-400">GHS {item.amount}</p>
                      </div>
                      <span className="text-xl font-black text-slate-900">{item.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${item.color} rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 bg-[length:10px_10px] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Status & Recent Activity Column */}
          <div className="space-y-8">
            {/* Overall Status Snapshot */}
            <AnimatedSection delay={350}>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Portfolio Health</h3>
                <div className="flex h-6 w-full rounded-full overflow-hidden mb-6">
                  <div className="bg-green-500 h-full" style={{width: `${projectStatusBreakdown.onTrack}%`}}></div>
                  <div className="bg-amber-400 h-full" style={{width: `${projectStatusBreakdown.delayed}%`}}></div>
                  <div className="bg-slate-300 h-full" style={{width: `${projectStatusBreakdown.completed}%`}}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-black text-slate-900">{projectStatusBreakdown.onTrack}%</p>
                    <p className="text-[9px] font-bold text-green-600 uppercase">On Track</p>
                  </div>
                   <div>
                    <p className="text-lg font-black text-slate-900">{projectStatusBreakdown.delayed}%</p>
                    <p className="text-[9px] font-bold text-amber-600 uppercase">At Risk</p>
                  </div>
                   <div>
                    <p className="text-lg font-black text-slate-900">{projectStatusBreakdown.completed}%</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Done</p>
                  </div>
                </div>
               </div>
            </AnimatedSection>

            {/* Recent Updates Feed */}
            <AnimatedSection delay={400}>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5 text-slate-700" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Latest Updates</h3>
                </div>
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative pl-6 border-l-2 border-slate-100">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase mb-1">{activity.project}</p>
                        <p className="text-sm font-medium text-slate-600 leading-snug">{activity.update}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-green-50 hover:text-green-700 transition-colors">
                  View Full Activity Log
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>

      </div>
    </section>
  );
}

export { ProjectTrackerDashboard as Appointments };