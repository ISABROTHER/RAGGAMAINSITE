// This update assumes the bar was inside your main Header/Navbar component
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      {/* THE SUPPORT BAR SPAN HAS BEEN REMOVED FROM THIS SECTION */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-lg leading-none tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                RAGGA
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isScrolled ? 'text-green-600' : 'text-green-400'}`}>
                Cape Coast North
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {['Vision', 'Achievements', 'Projects', 'Connect'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className={`text-xs font-black uppercase tracking-widest hover:text-green-500 transition-colors ${
                  isScrolled ? 'text-slate-700' : 'text-white/90'
                }`}
              >
                {item}
              </Link>
            ))}
            <Link 
              to="/register"
              className="px-5 py-2.5 bg-green-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
            >
              Portal
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-slate-900' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}