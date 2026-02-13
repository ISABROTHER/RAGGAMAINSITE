// src/pages/about/AboutFullProfile.tsx
import React from 'react';
import { 
  User, Smile, Flag, Briefcase as DesignationIcon, MapPin, Megaphone, 
  CheckSquare, Landmark, GraduationCap, Briefcase
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
      { institution: "University of Cape Coast", qualification: "B.Ed", completed: "06-2000" },
      { institution: "Worker College", qualification: "A Level", completed: "09-1996" },
      { institution: "Komenda Training College", qualification: "Cert A", completed: "06-1995" },
      { institution: "Adisadel College", qualification: "GCE O Level", completed: "09-1992" },
  ];

   const employmentData = [
       { institution: "University of Cape Coast", position: "Senior Lecturer" },
       { institution: "GOIL PLC", position: "Board Member" }
   ];

  const getYear = (dateStr: string) => {
      if (!dateStr) return 'N/A';
      const parts = dateStr.split('-');
      return parts.length > 1 ? parts[1] : dateStr; 
  }

  // Profile details configured for the new narrower column width
  const profileDetails = [
      { icon: User, label: "Full Name", value: "Hon. Dr. Kwamena Minta Nyarku", colSpan: "col-span-2" },
      { icon: Smile, label: "Nickname", value: "Ragga", colSpan: "col-span-1" },
      { icon: Flag, label: "Nationality", value: "Ghanaian", colSpan: "col-span-1" },
      { icon: DesignationIcon, label: "Designation", value: "MP Cape Coast North", colSpan: "col-span-2" }, // Shortened for fit
      { icon: MapPin, label: "Birthplace", value: "Apewosika, C. Coast", colSpan: "col-span-2" }, // Shortened for fit
      { icon: Megaphone, label: "Slogan", value: "Obiara Ka Ho", colSpan: "col-span-2" },
  ];

  return (
    <div className="bg-slate-50 relative overflow-hidden font-sans min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-slate-50 to-slate-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* BENTO GRID LAYOUT - ROW 1: PROFILE | VIDEO | AFFILIATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* 1. PERSONAL PROFILE (Left - 4 Columns) */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-4 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full"
            >
                <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-green-400" />
                        Personal Profile
                    </h2>
                </div>
                
                <div className="p-3 grid grid-cols-2 gap-2 flex-1 bg-slate-50/50 content-start">
                    {profileDetails.map((item, index) => (
                        <div 
                            key={index} 
                            className={`${item.colSpan} flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-green-200 transition-colors`}
                        >
                            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                <item.icon className="w-3.5 h-3.5 text-green-700" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</div>
                                <div className="text-xs font-bold text-slate-900 truncate">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 2. VIDEO REEL (Middle - 4 Columns) - INNOVATION: AUTOMATIC PLAYBACK CONTAINER */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-4 bg-black rounded-3xl shadow-2xl overflow-hidden relative group h-[400px] lg:h-auto border-4 border-slate-900"
            >
                 <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-0">
                    <span className="text-white/20 font-black animate-pulse">LOADING REEL...</span>
                 </div>
                 
                 {/* Instagram Embed Iframe */}
                 <iframe 
                    src="https://www.instagram.com/reel/DFfroZCOCf4/embed/captioned/?autoplay=1" 
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    frameBorder="0" 
                    scrolling="no" 
                    allowTransparency={true}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title="Ragga Instagram Reel"
                 ></iframe>

                 {/* Decorative Frame Overlay */}
                 <div className="absolute inset-0 border-[6px] border-slate-900/10 pointer-events-none z-20 rounded-[20px]" />
            </motion.div>

            {/* 3. POLITICAL AFFILIATION (Right - 4 Columns) */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-xl group h-full min-h-[300px]"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQrt2ai-mHcOLVubiDpeAdczMymeOsMdg8DA&s')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/80" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                    <div className="flex items-center gap-2 mb-4 bg-green-600/20 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">
                        <Flag className="w-3 h-3 text-green-400" />
                        <span className="text-green-100 font-bold text-[10px] uppercase tracking-widest">Affiliation</span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white leading-[0.9] mb-4">
                        NATIONAL <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">DEMOCRATIC</span> <br/>
                        <span className="text-green-500">CONGRESS</span>
                    </h2>
                    
                    <div className="mt-auto w-full space-y-2">
                        <span className="block w-full py-2 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-900/50">NDC</span>
                        <div className="w-full py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white/90 text-[10px] font-bold uppercase tracking-wide">
                            Cape Coast North
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* BENTO GRID LAYOUT - ROW 2: PROFESSIONAL DUAL TRACK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* 4. ACADEMIC QUALIFICATIONS */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col h-full"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-green-700" />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Education</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                    {educationData.map((edu, i) => (
                        <div key={i} className="px-6 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                            <div className="min-w-0 pr-4">
                                <div className="font-bold text-slate-800 text-sm truncate group-hover:text-green-700 transition-colors">{edu.institution}</div>
                                <div className="text-xs font-medium text-slate-500">{edu.qualification}</div>
                            </div>
                            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                                {getYear(edu.completed)}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 5. EMPLOYMENT & COMMITTEES */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-6"
            >
                {/* Employment */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                            <Briefcase className="w-5 h-5 text-green-700" />
                        </div>
                        <h3 className="font-black text-slate-900 text-lg">Experience</h3>
                    </div>
                    <div>
                        {employmentData.map((job, i) => (
                            <div key={i} className="px-6 py-4 border-b border-slate-50 last:border-b-0 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{job.institution}</div>
                                </div>
                                <div className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-full">
                                    {job.position}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Committees */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5 flex-1">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-green-600" /> Parliamentary Committees
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            "Defence & Interior",
                            "Environment, Science & Tech",
                            "Ways & Means",
                            "Petitions (Vice-Chairman)"
                        ].map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* BENTO GRID LAYOUT - ROW 3: SERVICE & MANDATE */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-green-600" />
                    Electoral Mandate
                </h2>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Voice of the People</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {electionResults.map((result, idx) => (
                    <div key={idx} className="relative group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-black text-slate-900">{result.year}</span>
                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                +{result.margin} Margin
                            </span>
                        </div>
                        
                        {/* Compact Visualizer */}
                        <div className="h-12 bg-slate-100 rounded-xl overflow-hidden flex relative">
                            {/* Winner */}
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${result.nyarkuPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                                className="bg-green-600 h-full flex items-center pl-3 relative"
                            >
                                <span className="text-white font-bold text-xs z-10 whitespace-nowrap">
                                    {result.nyarkuPercent}% (Won)
                                </span>
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent" />
                            </motion.div>
                            
                            {/* Opponent */}
                            <div className="flex-1 flex items-center justify-end pr-3">
                                <span className="text-slate-400 font-bold text-xs">
                                    {result.opponentPercent}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

      </div>
    </div>
  );
}