import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Building2, Heart } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.imgur.com/5H0XBuV.jpeg"
          alt="Cape Coast North"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-green-900/90 to-slate-900/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 md:pb-20 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-full mb-6 md:mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-200 text-xs md:text-sm font-bold uppercase tracking-wider">
              Member of Parliament - Cape Coast North
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-tight tracking-tight">
            WORKING FOR
            <br />
            <span className="bg-gradient-to-r from-green-300 via-emerald-200 to-green-300 bg-clip-text text-transparent">
              CAPE COAST NORTH
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-green-50/90 font-medium mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Building a stronger constituency through education, healthcare, infrastructure, and opportunities for all.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20">
            <Link
              to="/register"
              className="group w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm md:text-base uppercase tracking-wider rounded-xl shadow-2xl shadow-green-600/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-sm md:text-base uppercase tracking-wider rounded-xl border-2 border-white/30 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl md:text-4xl font-black text-white mb-1">50K+</div>
              <div className="text-xs md:text-sm text-green-200/80 font-bold uppercase tracking-wide">Constituents</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl md:text-4xl font-black text-white mb-1">100+</div>
              <div className="text-xs md:text-sm text-green-200/80 font-bold uppercase tracking-wide">Projects</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl md:text-4xl font-black text-white mb-1">15</div>
              <div className="text-xs md:text-sm text-green-200/80 font-bold uppercase tracking-wide">Communities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
}
