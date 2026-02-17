// src/pages/home/BottomCTASection.tsx
import { Share, Heart, ShieldCheck, Star, TrendingUp } from "lucide-react";

interface BottomCTASectionProps {
  onNavigate: (page: string) => void;
}

export function BottomCTASection({ onNavigate }: BottomCTASectionProps) {
  return (
    <section className="py-12 md:py-20 bg-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title */}
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
          Operation 500,000 Exercise Books
          <span className="block text-lg md:text-xl font-normal text-slate-500 mt-2">
            Supporting basic education in Cape Coast North
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Media & Story */} 
          <div className="lg:w-[65%]">
            
            {/* Featured Image */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm">
              <img 
                src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="Students with books" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Carousel dots overlay simulation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
              </div>
            </div>

            {/* Organizer Row */}
            <div className="flex items-center gap-3 py-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                 {/* Placeholder for Ragga's avatar */}
                 <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white font-bold text-xs">R</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Hon. Dr. Kwamena Minta Nyarku</p>
                <p className="text-xs text-slate-500">Organizer</p>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="my-6 inline-flex items-center gap-2 px-3 py-2 rounded bg-emerald-50 text-emerald-700 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Project Verified by CETRA2030 Team</span>
            </div>

            {/* Story Text */}
            <div className="prose prose-slate max-w-none text-sm md:text-base text-slate-700 leading-relaxed">
              <p className="mb-4">
                <strong>Education is the foundation of our future.</strong> In Cape Coast North, too many brilliant students struggle simply because they lack basic learning materials.
              </p>
              <p className="mb-4">
                I, Hon. Dr. Kwamena Minta Nyarku (Ragga), have launched <strong>Operation 500,000</strong> to ensure that every child in our constituency has the exercise books they need to succeed in class. This isn't just about paper and pens; it's about dignity, preparedness, and removing the barriers to learning.
              </p>
              <p className="mb-4">
                We have already raised enough for 325,000 books, but we need your help to reach the finish line. Every contribution goes directly to procuring and distributing these materials to schools across the constituency.
              </p>
              <p className="italic text-slate-500">
                "Together, we can write a better future for our children."
              </p>
              
              <button onClick={() => onNavigate('policies')} className="font-semibold underline mt-2">Read more</button>
            </div>

          </div>

          {/* RIGHT COLUMN: Donation Card (Sticky on Desktop) */}
          <div className="lg:w-[35%]">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6">
              
              {/* Header: Progress & Amounts */}
              <div className="flex items-start gap-4 mb-6">
                {/* Circular Progress (SVG Simulation) */}
                <div className="relative w-14 h-14 flex-shrink-0">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                     <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                     <path className="text-green-600" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900">65%</span>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-slate-900">325,000 <span className="text-base font-normal text-slate-600">books</span></div>
                  <div className="text-xs text-slate-500">raised of 500,000 goal • 1.9K donations</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => onNavigate('volunteer')}
                  className="w-full py-3 px-4 bg-[#025a2d] hover:bg-[#024a25] text-white font-bold rounded-xl shadow-md transition-transform active:scale-[0.98] flex items-center justify-center"
                >
                  Donate now
                </button>
                
                <button 
                  className="w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Recent Donations Stats */}
              <div className="flex items-center gap-2 mb-6 text-purple-700 bg-purple-50 p-2 rounded-lg text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>219 people just donated</span>
              </div>

              {/* Donor List */}
              <div className="space-y-4">
                
                {/* Donor Item */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Anonymous</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>20 books</span>
                      <span>•</span>
                      <span>Recent donation</span>
                    </div>
                  </div>
                </div>

                {/* Donor Item */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Grace Keeling</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>500 books</span>
                      <span>•</span>
                      <span className="text-slate-400">Top donation</span>
                    </div>
                  </div>
                </div>

                {/* Donor Item */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Peter Castro</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>76 books</span>
                      <span>•</span>
                      <span>1 hr</span>
                    </div>
                  </div>
                </div>

                 {/* Donor Item */}
                 <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Kelsada Taylor</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>10 books</span>
                      <span>•</span>
                      <span>31 mins</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-2 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  See all
                </button>
                <button className="flex-1 py-2 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5" /> See top
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}