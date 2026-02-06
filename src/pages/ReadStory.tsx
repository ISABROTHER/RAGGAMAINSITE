// src/pages/ReadStory.tsx
import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, Share2, Clock, Tag, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { UPDATES, UpdateItem } from './home/LatestUpdatesSection';

interface ReadStoryProps {
  storyId: string | null;
  onBack: () => void;
}

export function ReadStory({ storyId, onBack }: ReadStoryProps) {
  // Find the story
  const story = UPDATES.find((u) => String(u.id) === storyId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [storyId]);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Story Not Found</h2>
          <p className="text-slate-600 mb-6">The article you are looking for does not exist or has been removed.</p>
          <button onClick={onBack} className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <img 
          src={story.image} 
          alt={story.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Bar inside Hero (Back Button) */}
        <div className="absolute top-6 left-0 w-full px-4 sm:px-6 lg:px-8 z-20">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-bold w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Updates
            </button>
          </div>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded uppercase tracking-widest shadow-sm">
                {story.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/90 text-xs font-bold uppercase tracking-wide bg-black/40 px-3 py-1 rounded backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5" /> {story.date}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight shadow-sm max-w-3xl">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Text Column */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-t-3xl p-6 md:p-10 shadow-sm border border-slate-100 min-h-[500px]">
              {/* Author/Meta Line */}
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Office of the MP</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Press Release</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 min read</span>
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-700 hover:prose-a:text-blue-800 prose-img:rounded-xl">
                {story.content}
              </div>

              {/* Tags Footer */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {['Development', 'Cape Coast North', story.category, 'NDC'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Share & Related) */}
          <div className="lg:w-1/4 space-y-6">
            {/* Share Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-28">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share this
              </h3>
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold hover:bg-[#1877F2] hover:text-white transition-all">
                  <Facebook className="w-5 h-5" /> Facebook
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-black/5 text-black font-bold hover:bg-black hover:text-white transition-all">
                  <Twitter className="w-5 h-5" /> X (Twitter)
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
                  <LinkIcon className="w-5 h-5" /> Copy Link
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}