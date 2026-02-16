import React, { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent pt-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="bg-gradient-to-tr from-brand-500 to-accent-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-brand-500/20">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-brand-200 transition-colors">
              Creator<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Connect</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
            {['Features', 'How it Works', 'Stories'].map((item) => (
               <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-').replace('stories', 'testimonials'))} 
                  className="px-5 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
               >
                 {item}
               </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
             <button 
              onClick={() => scrollToSection('waitlist')}
              className="text-sm font-semibold text-white hover:text-brand-300 transition-colors px-4"
            >
              Sign In
            </button>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-bold hover:bg-brand-50 transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl">How it Works</button>
            <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left px-3 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl">Stories</button>
            <button onClick={() => scrollToSection('waitlist')} className="block w-full text-left px-3 py-3 text-brand-400 font-bold hover:bg-white/5 rounded-xl">Join Waitlist</button>
          </div>
        </div>
      )}
    </header>
  );
};