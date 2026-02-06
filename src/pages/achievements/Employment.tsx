import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initiatives = [
  { year: 2025, title: "CETRA2030 YOUTH EMPLOYMENT HUB LAUNCHED", info: "Opened the Cape Coast North Youth Employment Center providing career counseling, CV writing workshops, and job placement services for 500+ youth.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "200 YOUTH ENROLLED IN DIGITAL SKILLS TRAINING", info: "Partnered with tech companies to provide free coding, graphic design, and digital marketing training.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "GH₵100,000 SME STARTER FUND DISBURSED", info: "Provided seed capital to 50 young entrepreneurs across the constituency to launch small businesses.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "APPRENTICESHIP PLACEMENT FOR 150 YOUTH", info: "Connected youth with master craftsmen in welding, carpentry, auto mechanics, and tailoring trades.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "WOMEN IN BUSINESS EMPOWERMENT PROGRAM", info: "Trained 80 women in financial literacy, business management, and provided microloan access.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  { year: 2023, title: "CONSTITUENCY JOB FAIR ORGANIZED", info: "Brought together 30+ employers and 1,200 job seekers for the first Cape Coast North Job Fair.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "50 NABCO PERSONNEL PLACEMENT SUPPORT", info: "Facilitated permanent employment transitions for NABCO trainees in various government agencies.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "TVET EQUIPMENT DONATED TO 3 VOCATIONAL CENTERS", info: "Provided industrial sewing machines, welding equipment, and carpentry tools to vocational training centers.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "AGRICULTURAL YOUTH COOPERATIVE ESTABLISHED", info: "Supported the formation of a 100-member youth farming cooperative with inputs and technical assistance.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "HAIRDRESSING AND COSMETOLOGY TRAINING FOR 60 YOUTH", info: "Sponsored professional beauty therapy training with certification for young women.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  { year: 2022, title: "FISHERMEN LIVELIHOOD SUPPORT PROGRAM", info: "Distributed outboard motors, nets, and premix fuel to 40 fishing households.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "GH₵50,000 YOUTH ENTERPRISE CHALLENGE FUND", info: "Awarded grants to the top 25 business plans from young entrepreneurs in the constituency.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "ICT TRAINING CENTER EQUIPPED AND OPERATIONAL", info: "Provided 20 computers, printers, and internet connectivity for community digital skills training.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "MARKET WOMEN FINANCIAL LITERACY WORKSHOPS", info: "Conducted mobile money and digital banking training for 200 market women.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  { year: 2021, title: "100 YOUTH ENROLLED IN GOVERNMENT EMPLOYMENT PROGRAMS", info: "Facilitated enrollment in YEA, GYEEDA, and other national employment schemes.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "STARTUP INCUBATOR SUPPORT FOR 20 BUSINESSES", info: "Provided mentorship, workspace, and seed funding for promising local startups.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "DRIVING LICENSE AND TAXI BUSINESS SUPPORT", info: "Sponsored 30 youth to obtain professional driving licenses and facilitated vehicle hire-purchase agreements.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "POULTRY AND LIVESTOCK FARMING INPUTS DISTRIBUTED", info: "Provided day-old chicks, feed, and housing materials to 50 youth interested in poultry farming.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "CONSTITUENCY EMPLOYMENT TASK FORCE INAUGURATED", info: "Established a dedicated committee to identify and create employment opportunities for constituents.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
];

export function Employment() {
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const years = [2025, 2023, 2022, 2021];

  const filteredInitiatives = activeYear === 'all'
    ? initiatives
    : initiatives.filter(i => i.year === activeYear);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        <button onClick={() => setActiveYear('all')} className={`px-6 py-2 rounded-full text-xs font-black uppercase transition-all ${activeYear === 'all' ? 'bg-green-600 text-white' : 'bg-white text-slate-500'}`}>All Years</button>
        {years.map(y => (
          <button key={y} onClick={() => setActiveYear(y)} className={`px-6 py-2 rounded-full text-xs font-black uppercase transition-all ${activeYear === y ? 'bg-green-600 text-white' : 'bg-white text-slate-500'}`}>{y}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredInitiatives.map((item, index) => (
            <motion.div key={item.title + index} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative h-40 overflow-hidden shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">{item.year}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-black text-slate-900 mb-3 leading-tight uppercase">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">{item.info}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
