// src/pages/about/AboutFullProfile.tsx
import React from 'react';
import { 
  User, Smile, Flag, Briefcase as DesignationIcon, MapPin, Megaphone, 
  CheckSquare, Users, Landmark, Quote, Star, GraduationCap, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

// Helper component for Profile items with 500x Innovation (Glass + Hover Glow)
const ProfileItem = ({ icon: Icon, label, value, delay }: { icon: React.ElementType, label: string, value: string, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 128, 0, 0.2)" }}
      className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-sm hover:border-green-500/30 transition-all duration-300 flex items-start space-x-4 group"
    >
        <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-600 transition-colors duration-300 shadow-inner">
            <Icon className="w-5 h-5 text-green-700 group-hover:text-white transition-colors duration-300"/>
        </div>
        <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</h4>
            <p className="text-sm font-bold text-slate-900 leading-snug">{value}</p>
        </div>
    </motion.div>
);

export function AboutFullProfile() {
  const electionResults = [
    { year: 2020, nyarkuVotes: 22972, nyarkuPercent: 51.48, opponentVotes: 21643, opponentPercent: 48.51, margin: "1,329" },
    { year: 2024, nyarkuVotes: 23521, nyarkuPercent: 57.6, opponentVotes: 17045, opponentPercent: 41.7, margin: "6,476" }
  ];

  const educationData = [
      { institution: "University of Ghana Business School", qualification: "PhD", completed: "07-2019" },
      { institution: "University of Leicester, UK", qualification: "MBA", completed: "09-2003" },
      { institution: "University of Cape Coast", qualification: "Bachelor of Education", completed: "06-2000" },
      { institution: "Worker College", qualification: "A Level", completed: "09-1996" },
      { institution: "Komenda Training College", qualification: "Teacher Certificate A", completed: "06-1995" },
      { institution: "Adisadel College", qualification: "GCE O Level", completed: "09-1992" },
  ];

   const employmentData = [
       { institution: "University of Cape Coast", position: "Senior Lecturer" },
       { institution: "GOIL PLC (Ghana Oil Company)", position: "Board Member" }
   ];

  const getYear = (dateStr: string) => {
      if (!dateStr) return 'N/A';
      const parts = dateStr.split('-');
      return parts.length > 1 ? parts[1] : dateStr; 
  }

  return (
    <div className="bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-slate-50 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        <div className="space-y-24">
            
            {/* PERSONAL PROFILE SECTION */}
            <section>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 flex items-center gap-4"
                >
                  <div className="w-1.5 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded-full" />
                  <div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Personal Profile</h2>
                      <p className="text-slate-500 font-medium">The man behind the vision</p>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ProfileItem icon={User} label="Full Name" value="Hon. Dr. Kwamena Minta Nyarku, PhD" delay={1} />
                    <ProfileItem icon={Smile} label="Nickname" value="Ragga" delay={2} />
                    <ProfileItem icon={Flag} label="Nationality" value="Ghanaian" delay={3} />
                    <ProfileItem icon={DesignationIcon} label="Designation" value="MP for Cape Coast North" delay={4} />
                    <ProfileItem icon={MapPin} label="Place of Birth" value="Apewosika, Cape Coast" delay={5} />
                    <ProfileItem icon={Megaphone} label="Slogan" value="Obiara Ka Ho (Everyone is involved)" delay={6} />
                </div>
            </section>

            {/* EDUCATIONAL QUALIFICATIONS - TIMELINE STYLE */}
            <section>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic Journey</h3>
                </motion.div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {educationData.map((edu, index) => (
                        <motion.div 
                            key={edu.institution}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative p-6 sm:px-8 border-b border-slate-100 last:border-b-0 hover:bg-green-50/50 transition-colors duration-300`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-green-800 transition-colors">
                                        {edu.institution}
                                    </h4>
                                    <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                                        <Award className="w-3.5 h-3.5 text-green-600" />
                                        <span className="text-slate-700">{edu.qualification}</span>
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                                        {getYear(edu.completed)}
                                    </span>
                                </div>
                            </div>
                            {/* Decorative left accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* EMPLOYMENT HISTORY */}
            <section>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DesignationIcon className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Professional Leadership</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {employmentData.map((job, index) => (
                        <motion.div
                            key={job.institution}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <BriefcaseIcon className="w-24 h-24 rotate-12" />
                            </div>
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Institution</h4>
                            <p className="font-black text-slate-900 text-lg mb-4">{job.institution}</p>
                            
                            <div className="h-px w-full bg-slate-100 mb-4" />
                            
                            <h4 className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1">Position Held</h4>
                            <p className="font-bold text-slate-700">{job.position}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SERVICE IN PARLIAMENT - INNOVATIVE VISUALIZERS */}
            <section>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 flex items-center gap-4"
                >
                  <div className="w-1.5 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded-full" />
                  <div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Service in Parliament</h2>
                      <p className="text-slate-500 font-medium">The People's Mandate</p>
                  </div>
                </motion.div>

                <div className="space-y-8">
                    {/* ELECTION RESULTS VISUALIZER */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <CheckSquare className="w-6 h-6 text-green-600" />
                            <h4 className="font-black text-slate-900 text-xl">Electoral Mandate</h4>
                        </div>

                        <div className="space-y-8">
                            {electionResults.map((result) => (
                                <div key={result.year} className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-black text-2xl text-slate-900">{result.year}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margin: <span className="text-green-600 text-sm">{result.margin} Votes</span></span>
                                    </div>
                                    
                                    {/* Visual Bar */}
                                    <div className="h-14 w-full bg-slate-100 rounded-xl overflow-hidden relative flex">
                                        {/* Winner (Nyarku) */}
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${result.nyarkuPercent}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-green-700 to-green-500 relative group"
                                        >
                                            <div className="absolute inset-0 flex items-center pl-4 text-white font-bold text-sm whitespace-nowrap z-10">
                                                {result.nyarkuVotes.toLocaleString()} Votes ({result.nyarkuPercent}%)
                                            </div>
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>

                                        {/* Opponent */}
                                        <div className="flex-1 bg-slate-200 h-full relative flex items-center justify-end pr-4 text-slate-500 font-bold text-xs">
                                            {result.opponentVotes.toLocaleString()} ({result.opponentPercent}%)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COMMITTEES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Party Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Flag className="w-32 h-32" />
                            </div>
                            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Affiliation</h4>
                            <div className="text-3xl font-black leading-tight">
                                National<br/>Democratic<br/><span className="text-green-500">Congress</span>
                            </div>
                            <div className="mt-4 px-3 py-1 bg-white/10 w-fit rounded text-xs font-bold border border-white/20">NDC</div>
                        </motion.div>

                        {/* Committees List */}
                        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Landmark className="w-5 h-5 text-green-600" />
                                Parliamentary Committees
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                  "Committee on Defence & Interior",
                                  "Committee on Environment, Science & Technology",
                                  "Committee on Ways & Means",
                                  "Vice-Chairman, Committee of Petitions"
                                ].map((committee, i) => (
                                  <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 font-bold flex items-center gap-3 hover:bg-green-50 hover:border-green-100 hover:text-green-800 transition-colors cursor-default"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                    {committee}
                                  </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MY VISION - 500x PRESIDENTIAL MANIFESTO STYLE */}
            <section className="relative pt-12">
              <div className="absolute inset-0 bg-green-900 rounded-[3rem] transform -skew-y-1 opacity-5 translate-y-20 z-0" />
              
              <div className="relative z-10 text-center mb-12">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4 fill-current animate-pulse" />
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4">
                  My Vision
                </h2>
                <div className="h-1.5 w-24 bg-green-600 mx-auto rounded-full" />
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white shadow-2xl relative overflow-hidden">
                  
                  {/* Big Quote Icon Background */}
                  <Quote className="absolute top-8 left-8 w-32 h-32 text-green-500/10 rotate-180" />
                  
                  <div className="relative z-10 space-y-10 text-center">
                    <p className="text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed">
                      "For me, leadership is not about titles or recognition. It is about what endures 
                      after one’s service—the systems, opportunities, and hope that remain."
                    </p>
                    
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                    <p className="text-lg md:text-xl font-medium text-slate-600 leading-relaxed">
                      "My vision is to help build a <span className="text-green-700 font-bold">Cape Coast North</span> where fairness, opportunity, and 
                      respect are shared by all, where everyone feels they belong, and every young person 
                      knows their dream matters."
                    </p>
                  </div>
                  
                  <div className="mt-12 pt-8 flex flex-col items-center">
                    <div className="text-xl font-black text-slate-900 uppercase tracking-wide">
                      Hon. Dr. Kwamena Minta Nyarku (Ragga)
                    </div>
                    <div className="text-xs font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full mt-3 uppercase tracking-widest border border-green-100">
                      Member of Parliament, Cape Coast North
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}

// Icon wrapper for local usage to prevent import errors if lucide version mismatch
const BriefcaseIcon = (props: any) => (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);