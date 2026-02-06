// src/pages/achievements/Health.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initiatives = [
  { year: 2025, title: "1,500 LITRES COOKING OIL AND 1,500 BAGS RICE DONATED FOR AGED AND PWD", info: "Relief exercise supporting the aged and persons with disabilities.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  // 2023
  { year: 2023, title: "RAMBO 500 POLYTANK DONATED TO NYINASI COMMUNITY", info: "Provided safe water storage for the Nyinasi community.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2023, title: "RICE BAGS AND COOKING OIL DONATED TO MUSLIM COMMUNITY", info: "Donated food items during the fasting season.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2023, title: "REFLECTOR VESTS AND TORCH LIGHTS DONATED TO AMAMOMA VOLUNTEERS", info: "Donated security gear to beef up community security.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2023, title: "RENOVATION MATERIALS DONATED FOR ANKAFUL CHPS COMPOUND", info: "Structural renovation to restore the community health post.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  // 2022
  { year: 2022, title: "450 RAMBO POLYTANKS DONATED TO BRABEDZE, DEHIA AND APEPEWOSIKA", info: "Donated high-capacity water storage tanks to three communities.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2022, title: "RICE BAGS, COOKING OIL AND MACKEREL DONATED TO MUSLIM COMMUNITY", info: "Distributed food items during the festive period.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2022, title: "FINANCIAL AND MATERIAL AID FOR GHANA SOCIETY FOR PHYSICALLY DISABLED", info: "Provided support to the Cape Coast branch of the society.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2022, title: "RACING BICYCLES DONATED TO PHYSICALLY CHALLENGED PERSONS", info: "Provided specialized support to enable individuals to purchase racing bicycles.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2022, title: "400 WELLINGTON BOOTS DISTRIBUTED CONSTITUENCY-WIDE", info: "Massive distribution of protective boots across the constituency to aid community workers.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  // 2021
  { year: 2021, title: "20 MATTRESSES AND FINANCIAL AID FOR SOCIAL WELFARE VOCATIONAL CENTRE", info: "Donated resources following a fire outbreak.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2021, title: "ESSENTIAL ITEMS DONATED FOR MUSLIM CHIEFS DURING RAMADAN", info: "Provided support for the Muslim community during the fasting period.", image: "https://i.imgur.com/XmWnKbH.jpeg" },
  { year: 2021, title: "PHOTOTHERAPY MACHINE FUNDING FOR CCTH", info: "Raised funds and supported the purchase of medical equipment for the Cape Coast Teaching Hospital.", image: "https://i.imgur.com/XmWnKbH.jpeg" }
];

export function Health() {
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
