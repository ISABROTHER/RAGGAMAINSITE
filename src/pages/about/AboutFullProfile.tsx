// src/pages/about/AboutFullProfile.tsx
import React from 'react';
import { 
  User, Smile, Flag, Briefcase as DesignationIcon, MapPin, Megaphone, 
  CheckSquare, Users, Landmark, Quote 
} from 'lucide-react';
import { AnimatedSection } from '../../components/AnimatedSection';

// Helper component for Profile items
const ProfileItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-3 font-sans">
        <Icon className="w-5 h-5 text-green-700 mt-1 flex-shrink-0"/>
        <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
    </div>
);

export function AboutFullProfile() {
  const electionResults = [
    { year: 2020, nyarkuVotes: "22,972", nyarkuPercent: "51.48%", opponentVotes: "21,643", opponentPercent: "48.51%", margin: "1,329" },
    { year: 2024, nyarkuVotes: "23,521", nyarkuPercent: "57.6%", opponentVotes: "17,045", opponentPercent: "41.7%", margin: "6,476" }
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
    <div className="bg-gray-50 py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="space-y-20">
            {/* PERSONAL PROFILE SECTION */}
            <AnimatedSection>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-l-4 border-green-600 pl-4">
                      Personal Profile
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <ProfileItem icon={User} label="Full Name" value="Hon. Dr. Kwamena Minta Nyarku, PhD" />
                    <ProfileItem icon={Smile} label="Nickname" value="Ragga" />
                    <ProfileItem icon={Flag} label="Nationality" value="Ghanaian" />
                    <ProfileItem icon={DesignationIcon} label="Designation" value="MP for Cape Coast North" />
                    <ProfileItem icon={MapPin} label="Place of Birth" value="Apewosika, Cape Coast" />
                    <ProfileItem icon={Megaphone} label="Slogan" value="Obiara Ka Ho (Everyone is involved)" />
                </div>
            </AnimatedSection>

            {/* EDUCATIONAL QUALIFICATIONS */}
            <AnimatedSection delay={220}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Landmark className="w-4 h-4 text-green-700" />
                  </div>
                  Educational Qualifications
                </h3>
                <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-500 uppercase bg-slate-50 border-b border-gray-100">
                        <tr>
                        <th scope="col" className="px-6 py-4">Institution & Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {educationData.map((edu, index) => (
                        <tr
                            key={edu.institution}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-b border-gray-100 last:border-b-0 hover:bg-green-50/30 transition-colors`}
                        >
                            <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 block text-base">{edu.institution}</span>
                            <div className="mt-1 text-slate-500 font-medium">
                                <span className="mr-4">
                                Qualification: <span className="text-slate-700">{edu.qualification}</span>
                                </span>
                                <span>
                                Year: <span className="text-slate-700">{getYear(edu.completed)}</span>
                                </span>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </AnimatedSection>

            {/* EMPLOYMENT HISTORY */}
            <AnimatedSection delay={260}>
                 <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <DesignationIcon className="w-4 h-4 text-green-700" />
                  </div>
                  Employment History
                </h3>
                <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-500 uppercase bg-slate-50 border-b border-gray-100">
                        <tr>
                        <th scope="col" className="px-6 py-4">Institution</th>
                        <th scope="col" className="px-6 py-4">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employmentData.map((job, index) => (
                        <tr
                            key={job.institution}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-b border-gray-100 last:border-b-0 hover:bg-green-50/30 transition-colors`}
                        >
                            <td className="px-6 py-4 font-bold text-slate-900">
                            {job.institution}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">{job.position}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </AnimatedSection>

            {/* SERVICE IN PARLIAMENT */}
            <AnimatedSection delay={300}>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-l-4 border-green-600 pl-4">
                      Service in Parliament
                  </h2>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start shadow-sm">
                        <CheckSquare className="w-6 h-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                        <div>
                        <h4 className="font-bold text-slate-900 mb-2 text-lg">
                            Elected MP (Cape Coast North)
                        </h4>
                        <ul className="space-y-2">
                            {electionResults.map((result) => (
                            <li
                                key={result.year}
                                className="text-sm font-medium text-slate-600 flex items-center"
                            >
                                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded mr-2 font-bold text-xs">
                                {result.year}
                                </span>
                                <span className="text-green-700 font-bold mr-2">
                                {result.nyarkuVotes} votes
                                </span>
                                <span className="text-slate-400">
                                (Margin: {result.margin})
                                </span>
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start shadow-sm">
                        <Users className="w-6 h-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                        <div>
                        <h4 className="font-bold text-slate-900 mb-1 text-lg">Party Affiliation</h4>
                        <p className="text-sm font-bold text-green-800 uppercase tracking-wide">
                            National Democratic Congress (NDC)
                        </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start shadow-sm md:col-span-2">
                        <Landmark className="w-6 h-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                        <div className="w-full">
                        <h4 className="font-bold text-slate-900 mb-4 text-lg">
                            Parliamentary Committees
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                            {[
                              "Committee on Defence & Interior",
                              "Committee on Environment, Science & Technology",
                              "Committee on Ways & Means",
                              "Vice-Chairman, Committee of Petitions"
                            ].map((committee, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium group">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                                {committee}
                              </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* MY VISION - STANDARD CLEAN DESIGN */}
            <AnimatedSection delay={340}>
              <div className="text-center mb-12">
                <div className="flex flex-col items-center justify-center group">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent uppercase">
                    My Vision
                  </h2>
                  <p className="mt-2 text-sm md:text-xl font-bold text-green-700/80 tracking-[0.2em] uppercase">
                    Leadership for the Future
                  </p>
                  <span className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all group-hover:w-32" />
                </div>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative">
                  <div className="relative z-10 space-y-8">
                    <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed italic border-l-4 border-green-600 pl-6">
                      "For me, leadership is not about titles or recognition. It is about what endures 
                      after one’s service, the systems, opportunities and hope that remain."
                    </p>
                    
                    <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed italic border-l-4 border-green-600 pl-6">
                      "My vision is to help build a Cape Coast North where fairness, opportunity and 
                      respect are shared by all, where everyone feels they belong and every young person 
                      knows their dream matters."
                    </p>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <footer className="text-lg font-bold text-slate-900">
                      Hon. Dr. Kwamena Minta Nyarku (Ragga)
                    </footer>
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-widest mt-1">
                      Member of Parliament, Cape Coast North
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
        </div>
      </div>
    </div>
  );
}