// src/pages/achievements/Employment.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initiatives = [
  // 2025
  { year: 2025, title: "GH₵20,000 DONATED FOR CASFORD SPORTS COMPLEX", info: "Direct financial support for the construction of the Casford Hall Sports facility.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "ROOFING, DOORS, WINDOWS AND PAINTING FOR DUAKOR BASIC SCHOOL", info: "Fixed leaking roofs, partitions, broken doors, windows, and full painting.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "100 BAGS CEMENT, SAND AND STONES DONATED FOR OLA TRAINING COLLEGE INFIRMARY", info: "Donated construction materials for the new infirmary construction.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "GH₵50,000 FINANCIAL SUPPORT FOR SCHOOLS", info: "Provided monetary aid to various educational institutions across the constituency.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "500 LED BULBS DONATED TO ADISADEL COLLEGE", info: "Addressed chronic lighting issues to improve student safety.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "5 COMPUTERS, 1500 LED BULBS AND 1000 MOSQUITO REPELLENTS FOR 5 SHS", info: "Comprehensive resource donation to five senior high schools.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "180 CHOPBOXES DONATED TO FIRST-YEAR SHS STUDENTS", info: "Welfare support for newly admitted SHS students.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "CANTEEN BUILDING MATERIALS DONATED FOR ABAKAM BASIC SCHOOL", info: "Built a dedicated canteen facility for students and the community.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "JERSEYS AND FOOTBALLS DONATED TO ASENADZE YOUTH", info: "Donated sports equipment to the local youth team.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2025, title: "MATERIALS AND FINANCIAL SUPPORT FOR TERTIARY PROJECTS", info: "Backed student-led developmental projects in higher institutions.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  // 2023
  { year: 2023, title: "EDUCATIONAL MATERIALS AND ENROLLMENT SUPPORT FOR 100 BECE STUDENTS", info: "Beneficiaries received strategic educational materials and enrollment support.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "100 DUAL DESKS DONATED TO 10 BASIC SCHOOLS", info: "Addressed furniture deficits in critical basic educational facilities.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "JERSEY SET AND FOOTBALL DONATED TO NYINASI COMMUNITY", info: "Provided sports equipment to encourage community youth sports.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "JERSEY AND FOOTBALL DONATED FOR UCC STAFF GAMES", info: "Supported staff recreation and health at the University of Cape Coast.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "JERSEY SET AND FOOTBALL DONATED TO AKOTOKYIR YOUTH TEAM", info: "Donated sports equipment to the community youth football team.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "FINANCIAL SUPPORT FOR CENTRAL AND WESTERN REGIONAL RUGBY TEAMS", info: "Financial support for the Central and Western regional rugby teams.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "2 JERSEY SETS, 2 FOOTBALLS, 3 TROPHIES AND CASH FOR ABURA AHOBAA FESTIVAL", info: "Comprehensive support package for the community football gala.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "FOOTBALLS AND JERSEYS DONATED TO NKANFOA COMMUNITY TEAM", info: "Supported the local team with quality sports equipment.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "FOOTBALLS, HOSES AND JERSEYS DONATED TO ANKAFUL COMMUNITY", info: "Provided essential football gear to the youth.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "LOGISTICAL AND FINANCIAL SUPPORT FOR AFRICAN SOFTBALL CONFEDERATION", info: "Provided backing for the confederation's initiatives.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "JERSEYS, FOOTBALL HOSES AND FOOTBALLS DONATED TO BRIMSU COMMUNITY", info: "Donated complete sports equipment package to the community.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2023, title: "FULL FOOTBALL KITS DONATED TO ESSUERKYIR YOUTH", info: "Donated complete football kits to empower local youth athletes.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  // 2022
  { year: 2022, title: "50 BAGS CEMENT, SAND, STONES AND STREETLIGHTS DONATED FOR APEWOSIKA BASIC SCHOOL", info: "Comprehensive infrastructure support package for the school.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "100 DUAL DESKS DONATED TO 10 SELECTED SCHOOLS", info: "Donated desks to improve the learning environment for students across the constituency.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "GHC 25,000 BECE SUPPORT FUND", info: "Payment for the first batch of the fund to assist candidates with educational needs.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "PLYWOOD DONATED FOR STAFF ROOM AT PEDUDU PRIMARY 'A'", info: "Donated materials to facilitate the creation of a dedicated staff room for teachers.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "BASKETBALL SNEAKERS DONATED TO CAPE COAST YOUTH", info: "Donated high-quality sneakers to foster a love for basketball among young talents.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "GHC 10,000 DONATED TO METRO EDUCATION DIRECTORATE", info: "Financial donation to support the administrative and developmental activities of the directorate.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "RENOVATION MATERIALS DONATED FOR ENGLISH-ARABIC BASIC SCHOOL", info: "Undertook structural renovations to provide a brighter and safer learning space.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "LOGISTICAL AND FINANCIAL SUPPORT FOR CENTRAL REGION MARATHON TEAM", info: "Provided backing to encourage athletics in the region.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "ROOFING SHEETS, WOOD AND NAILS DONATED FOR EFUTU KOKWADO PRIMARY", info: "Supplied complete roofing materials to repair school buildings.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2022, title: "GHS 8,000 AND BUS HIRE FOR DWARF SUPPORTERS PETITION", info: "Donated funds and transportation to assist supporters in presenting a petition to Parliament.", image: "https://i.imgur.com/Ozjnrli.jpeg" },

  // 2021
  { year: 2021, title: "70 BAGS CEMENT DONATED FOR ICT CENTRE AT ESSUEKYIR M/A BASIC", info: "Supported the construction of the school and library block.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "2 BUNDLES ROOFING SHEETS DONATED FOR KUROWFOFORDO SCHOOL", info: "Donated roofing materials to support the ongoing school project.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "285 DUAL AND MONO DESKS DONATED TO 18 BASIC SCHOOLS", info: "Donated desks to address furniture deficits across the constituency.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "GHS 25,000 DONATED FOR 50 TOP BECE STUDENTS", info: "Supported top-performing BECE students with individual funds for SHS admission.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "FINANCIAL SUPPORT FOR EBUSUSUA DWARFS AND VENOMOUS VIPERS", info: "Provided strategic financial support to Cape Coast's premier football clubs.", image: "https://i.imgur.com/Ozjnrli.jpeg" },
  { year: 2021, title: "CASH AND FOOTBALLS DONATED FOR NKANFOA, DUAKOR AND EBUBUBONKO FESTIVALS", info: "Donated resources for community sports festivals.", image: "https://i.imgur.com/Ozjnrli.jpeg" }
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
