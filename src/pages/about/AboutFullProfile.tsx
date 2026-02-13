// src/pages/about/AboutFullProfile.tsx
import React from 'react';
import { 
  User, Smile, Flag, Briefcase as DesignationIcon, MapPin, Megaphone, 
  CheckSquare, Landmark, Quote, Star, GraduationCap, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  const profileDetails = [
      { icon: User, label: "Full Name", value: "Hon. Dr. Kwamena Minta Nyarku" },
      { icon: Smile, label: "Nickname", value: "Ragga" },
      { icon: Flag, label: "Nationality", value: "Ghanaian" },
      { icon: DesignationIcon, label: "Designation", value: "MP for Cape Coast North" },
      { icon: MapPin, label: "Place of Birth", value: "Apewosika, Cape Coast" },
      { icon: Megaphone, label: "Slogan", value: "Obiara Ka Ho" },
  ];

  return (
    <div className="bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-slate-50 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="space-y-20">
            
            {/* 1. PERSONAL PROFILE (Holographic Dossier) */}
            <section>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 flex items-center gap-4"
                >
                  <div className="w-1.5 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded-full" />
                  <div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Personal Profile</h2>
                      <p className="text-slate-500 font-medium">Identity & Roots</p>
                  </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative"
                >
                    <div className="h-2 w-full bg-gradient-to-r from-green-600 via-green-400 to-green-600" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {profileDetails.map((item, index) => (
                            <div key={index} className="p-6 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                                    <item.icon className="w-6 h-6 text-slate-400 group-hover:text-green-700 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</h4>
                                    <p className="text-base font-bold text-slate-900 leading-tight">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* 2. AFFILIATION / PARTY (Now After Personal Profile) */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full"
            >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] group">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{ 
                            backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQrt2ai-mHcOLVubiDpeAdczMymeOsMdg8DA&s')` 
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                             <div className="flex items-center gap-3 mb-4">
                                <Flag className="w-6 h-6 text-green-500" />
                                <span className="text-white/80 font-bold tracking-widest uppercase text-sm">Political Affiliation</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-2">
                                NATIONAL <br/>DEMOCRATIC <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white">CONGRESS</span>
                            </h2>
                            <div className="mt-6 flex items-center gap-4">
                                <span className="px-6 py-2 bg-green-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(22,163,74,0.4)]">NDC</span>
                                <span className="text-white/60 font-medium">Cape Coast North Constituency</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 3. ACADEMIC JOURNEY (Compact Single-Line) */}
            <section>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic Qualifications</h3>
                </motion.div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    {educationData.map((edu) => (
                        <div 
                            key={edu.institution}
                            className="px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-green-50/30 transition-colors flex items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-2">
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">
                                        {edu.institution}
                                    </h4>
                                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-xs md:text-sm font-medium text-green-700">{edu.qualification}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="font-bold text-slate-500 text-sm tabular-nums bg-slate-100 px-2 py-1 rounded">
                                    {getYear(edu.completed)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. EMPLOYMENT HISTORY (Compact Layout) */}
            <section>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DesignationIcon className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Employment History</h3>
                </motion.div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    {employmentData.map((job) => (
                        <div 
                            key={job.institution}
                            className="px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-green-50/30 transition-colors flex items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">
                                    {job.institution}
                                </h4>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <span className="text-xs md:text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                                    {job.position}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. SERVICE IN PARLIAMENT */}
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
                  </div>
                </motion.div>

                <div className="space-y-8">
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
                                    <div className="h-14 w-full bg-slate-100 rounded-xl overflow-hidden relative flex">
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
                                        </motion.div>
                                        <div className="flex-1 bg-slate-200 h-full relative flex items-center justify-end pr-4 text-slate-500 font-bold text-xs">
                                            {result.opponentVotes.toLocaleString()} ({result.opponentPercent}%)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
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
            </section>

            {/* 6. MY VISION */}
            <section className="relative pt-12">
              <div className="absolute inset-0 bg-green-900 rounded-[3rem] transform -skew-y-1 opacity-5 translate-y-20 z-0" />
              <div className="relative z-10 text-center mb-12">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4 fill-current animate-pulse" />
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4">My Vision</h2>
                <div className="h-1.5 w-24 bg-green-600 mx-auto rounded-full" />
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white shadow-2xl relative overflow-hidden">
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
                    <div className="text-xl font-black text-slate-900 uppercase tracking-wide">Hon. Dr. Kwamena Minta Nyarku (Ragga)</div>
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