// src/pages/Support.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Heart, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { DonationModal } from '../components/DonationModal';

export function Support() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const RAISED = "0"; // Reset to zero
  const TARGET = "200,000";
  const PERCENT = 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const photos = [
    {
      id: 1,
      title: "obiara ka ho 200,000 book project",
      category: "Education",
      image: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1200",
      desc: "This project aims to raise 200,000 exercise books for OVER 30,000 students in Cape Coast North to support teaching and learning in our schools.",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <AnimatedSection>
            <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent uppercase">THE RAGGA FOUNDATION</h1>
            <p className="mt-2 text-xs md:text-xl font-bold text-green-700/80 tracking-widest uppercase">BUILDING WITH YOU OBIARA KA HO</p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-[2rem] overflow-hidden border border-green-500 ring-4 ring-green-500/10 shadow-sm">
              <div className="relative h-48 md:h-64"><img src={photo.image} className="w-full h-full object-cover" /></div>
              <div className="bg-red-800 p-5 text-white">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col"><span className="text-[10px] font-black uppercase text-white/80">Books Donated</span><span className="text-2xl font-black">{RAISED}</span></div>
                  <span className="text-xl font-black">{PERCENT}%</span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${PERCENT}%` }} /></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black uppercase mb-2">{photo.title}</h3>
                <p className="text-sm text-slate-600 mb-6">{photo.desc}</p>
                <button onClick={() => setShowModal(true)} className="w-full py-3 bg-green-700 text-white rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2"><Heart className="w-4 h-4" /> kindly support, obiara ka ho</button>
              </div>
            </div>
          ))}
        </div>

        <DonationModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  ); 
}