// src/pages/achievements/Infrastructure.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initiatives = [
  { year: 2025, title: "10KM ASPHALT ROAD LOBBYING FOR 4TH RIDGE, PEDU AND ANKAFUL", info: "Lobbied for road infrastructure improvements.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2025, title: "350 STREETLIGHTS DONATED TO ASSEMBLY MEMBERS AND INSTITUTIONS", info: "Units distributed across the constituency.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2025, title: "GH₵20,000 DONATED FOR AKOTOKYIR PLAZA CONSTRUCTION", info: "Direct funding for community plaza construction.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2025, title: "CONSTRUCTION MATERIALS DONATED FOR OBIARA KA HO SOCCER CENTRE", info: "Ongoing construction of a sports facility at Pedu.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2025, title: "CEMENT AND ROOFING DONATED FOR BRABEDZE AND APEWOSIKA COMMUNITY CENTRES", info: "Building materials for community centres.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2025, title: "GH₵30,000 DONATED FOR OGUAA FETU AFAHYE AND CULTURAL FESTIVALS", info: "Support for traditional celebrations.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  // 2023
  { year: 2023, title: "RENOVATION MATERIALS DONATED FOR AMAMOMA COMMUNITY CENTRE", info: "Full renovation of the central gathering hub for Amamoma.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2023, title: "200 BAGS CEMENT, STONES AND SAND DONATED FOR ANKAFUL COMMUNITY CENTRE", info: "Construction materials for community centre building.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2023, title: "100 BAGS CEMENT AND STONES DONATED FOR EFUTU COMMUNITY CENTRE", info: "Building materials for community centre construction.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2023, title: "50 BAGS CEMENT AND SAND DONATED FOR AKOTOKYIR COMMUNITY PLAZA", info: "Materials for plaza expansion.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2023, title: "100 BAGS CEMENT DONATED FOR EKOO COMMUNITY PALACE", info: "Building materials to support the palace construction.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2023, title: "FOOTBRIDGE CONSTRUCTION MATERIALS DONATED FOR DUAKOR COMMUNITY", info: "Built a footbridge to enhance connectivity and safety in Duakor.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  // 2022
  { year: 2022, title: "400 STREETLIGHTS DISTRIBUTED TO ALL COMMUNITIES", info: "Extensive provision of streetlights to enhance security and nightlife.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2022, title: "20 STREETLIGHTS AND 50 WELLINGTON BOOTS DONATED FOR ABURA AHOBAA FESTIVAL", info: "Support package for the community's major festival.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2022, title: "70 BOXES TILES DONATED FOR SENANAWIN MOSQUE", info: "Building materials to support the mosque's development project.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2022, title: "ROOFING SHEETS DONATED FOR TRUCK DRIVERS' STATION", info: "Donated materials to provide shelter and improve station facilities.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2022, title: "10 STREETLIGHTS AND 32 WELLINGTON BOOTS DONATED FOR NKANFOA AFAHYE", info: "Support package to facilitate the community festival.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2022, title: "LOGISTICAL AND FINANCIAL SUPPORT FOR OGUAA FETU AFAHYE", info: "Strategic backing for Cape Coast's premier traditional festival.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  // 2021
  { year: 2021, title: "280 STREETLIGHTS DONATED TO ASSEMBLYMEN, SCHOOLS, HOSPITALS AND COMMUNITIES", info: "Distributed lighting units across the constituency.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "WELLINGTON BOOTS AND FUNDS DONATED FOR BEACH CLEAN-UP AND CONSERVATION", info: "Donated to Care for Nature for serene beaches.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "DUMPSITE CONSTRUCTION MATERIALS AND CLEAN-UP FOR ABURA COMMUNITY", info: "Supported construction of dumpsite and coordinated community cleaning.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "20 BAGS CEMENT DONATED FOR REGIONAL FIRE SERVICE", info: "Donated materials for station maintenance and infrastructure.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "22 BAGS CEMENT DONATED FOR ABURA PALACE CONSTRUCTION", info: "Building materials for the palace project.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "REPAIR MATERIALS DONATED FOR 6 BOREHOLES IN 4 COMMUNITIES", info: "Restored water access in Akaikrom, Mempeasem, Efutu Kokwado, and Ansepatu.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "15 BAGS CEMENT AND IRON RODS DONATED FOR BESSAKROM FOOTBRIDGE", info: "Construction materials for community connectivity.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "CONSTRUCTION MATERIALS DONATED FOR ROUND PALACE BRIDGE AND ROAD", info: "Ongoing construction work to improve mobility and infrastructure.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "PPEs, EQUIPMENT AND FUNDS DONATED FOR PEDU, UCC AND ELMINA FIRE STATIONS", info: "Comprehensive support package for fire stations.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "COMMISSIONING SUPPORT FOR ABURA POLICE STATION", info: "Operationalized the station to enhance security in the Abura enclave.", image: "https://i.imgur.com/AZqDymE.jpeg" },
  { year: 2021, title: "SHED CONSTRUCTION MATERIALS DONATED FOR ABURA MARKET", info: "Built a new shed facility for traders and shoppers.", image: "https://i.imgur.com/AZqDymE.jpeg" }
];

export function Infrastructure() {
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const years = [2025, 2023, 2022, 2021];

  const filteredInitiatives = activeYear === 'all' ? initiatives : initiatives.filter(i => i.year === activeYear);

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
