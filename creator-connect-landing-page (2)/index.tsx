import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, Menu, X, ArrowRight, PlayCircle, MapPin, 
  Sparkles, MessageCircle, TrendingUp, Users, Heart, Camera, 
  Utensils, MousePointerClick, Globe, Hotel, Scissors, Plus, 
  Coffee, Loader2, CheckCircle2, Plane, BadgeCheck, 
  Twitter, Instagram, Linkedin, Shield, Briefcase, FileText, Lock, Check,
  Video
} from 'lucide-react';

// --- TYPES ---

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

// --- COMPONENTS ---

// 1. LiveTicker
const EVENTS = [
  { icon: <Camera size={14} />, text: "Sarah just matched with a Photographer in Bali", color: "text-rose-400" },
  { icon: <MapPin size={14} />, text: "Tom secured a hotel collab in Tokyo", color: "text-amber-400" },
  { icon: <Sparkles size={14} />, text: "New Creator Meetup started in London", color: "text-indigo-400" },
  { icon: <Video size={14} />, text: "Alex matched with a Drone Pilot in NYC", color: "text-emerald-400" },
  { icon: <Zap size={14} />, text: "Jessica unlocked a VIP Club Pass in Miami", color: "text-purple-400" },
];

const LiveTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % EVENTS.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const event = EVENTS[index];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden md:block">
       <div className={`
         flex items-center gap-3 px-4 py-2.5 rounded-full 
         bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-brand-500/5
         transition-all duration-500 transform
         ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
       `}>
          <div className="relative flex items-center justify-center">
             <div className={`absolute inset-0 bg-current opacity-30 blur-md rounded-full animate-pulse ${event.color}`}></div>
             <div className={`relative ${event.color}`}>{event.icon}</div>
          </div>
          <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap tracking-wide">
            {event.text}
          </span>
       </div>
    </div>
  );
};

// 2. Header
const Header: React.FC = () => {
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

// 3. Hero
const Hero: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // 3D Tilt Logic
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rotateX = ((mouseY - centerY) / height) * -10; // Max -5 to 5 degrees
    const rotateY = ((mouseX - centerX) / width) * 10;

    setRotation({ x: rotateX, y: rotateY });

    // Magnetic Button Logic
    if (buttonRef.current) {
        const btnRect = buttonRef.current.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const dist = Math.sqrt(Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2));
        
        if (dist < 100) {
             setBtnPos({ x: (mouseX - btnCenterX) * 0.3, y: (mouseY - btnCenterY) * 0.3 });
        } else {
             setBtnPos({ x: 0, y: 0 });
        }
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setBtnPos({ x: 0, y: 0 });
  };

  return (
    <section 
        id="hero" 
        className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-zinc-950 perspective-[1000px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Human-Centric Background - Warm Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-blob"></div>
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[30%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-pointer shadow-xl shadow-brand-500/5 group">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          <span className="text-sm font-medium text-zinc-200 group-hover:text-brand-300 transition-colors">Join 5,000+ Founding Creators 🚀</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up">
          Travel. Create. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500 animate-shimmer bg-[length:200%_100%]">Do it Together.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-2 max-w-2xl mx-auto text-lg sm:text-2xl text-zinc-400 mb-10 animate-fade-in-up delay-100 font-light leading-relaxed">
          The social network for the modern nomad. Connect with <span className="text-white font-medium">creators</span> to collab, and partner with <span className="text-white font-medium">lifestyle brands</span> to monetize your journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-200 justify-center">
          <button 
            ref={buttonRef}
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ transform: `translate(${btnPos.x}px, ${btnPos.y}px)` }}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_80px_rgba(244,63,94,0.6)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-white/5 text-white font-semibold text-lg hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <PlayCircle className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            Watch Film
          </button>
        </div>

        {/* 3D Interactive Mockup Container with Antigravity Effect */}
        <div 
            ref={containerRef}
            className="mt-20 relative w-full max-w-4xl mx-auto animate-fade-in-up delay-300 hidden md:block transition-transform ease-out duration-200"
            style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Main Center Card - The "Match" */}
            <div 
                className="relative z-20"
                style={{ transform: 'translateZ(50px)' }}
            >
                <div className="animate-float bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 p-0.5">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full rounded-full object-cover border-2 border-zinc-900" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold text-lg">Sarah Jenkins</h3>
                                <p className="text-zinc-400 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> Arriving in Bali tomorrow</p>
                            </div>
                        </div>
                        <div className="bg-brand-500/10 text-brand-400 px-4 py-2 rounded-full text-sm font-bold border border-brand-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                            98% Match
                        </div>
                    </div>
                    
                    <div className="bg-zinc-950/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                         <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl animate-bounce">🤝</div>
                         <div className="text-left">
                            <p className="text-zinc-300 text-sm">You both want to shoot <span className="text-white font-bold">Drone Content</span> at <span className="text-white font-bold">Kelingking Beach</span>.</p>
                         </div>
                         <button className="ml-auto bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:bg-zinc-200 transition-colors">Let's Connect</button>
                    </div>
                </div>
            </div>

            {/* Floating Card Left - Brand Deal */}
            <div 
                className="absolute top-10 -left-12 z-30 w-64"
                style={{ transform: 'translateZ(100px) rotate(-6deg)' }}
            >
                <div className="animate-float-delayed bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-xl">🏨</span>
                        </div>
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">Luxury Villa</p>
                            <p className="text-accent-400 text-xs font-medium">Barter Opportunity</p>
                        </div>
                    </div>
                    <div className="text-left text-zinc-400 text-xs">
                        Get 2 nights free stay in exchange for 3 Reels.
                    </div>
                </div>
            </div>

            {/* Floating Card Right - Community */}
            <div 
                className="absolute -bottom-10 -right-4 z-30 w-72"
                style={{ transform: 'translateZ(80px) rotate(3deg)' }}
            >
                 <div className="animate-float bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-5 shadow-xl" style={{ animationDelay: '1.5s' }}>
                     <div className="flex -space-x-3 mb-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                                 <img src={`https://picsum.photos/100/100?random=${i+10}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">+42</div>
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-sm">Bali Creator Meetup 🌴</p>
                        <p className="text-zinc-500 text-xs">Tomorrow at 5:00 PM • Canggu</p>
                     </div>
                 </div>
            </div>
        </div>

      </div>
    </section>
  );
};

// 4. Features
const featuresData: Feature[] = [
  {
    title: "Creator Discovery",
    description: "Land in a new city? Instantly filter and find local creators by niche (e.g., Food, Fashion) to co-create content with.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    title: "Lifestyle Brand Deals",
    description: "Direct access to offline brands—Nightclubs, Restaurants, Malls, & Hotels—looking to sponsor creators.",
    icon: <Hotel className="w-6 h-6" />,
  },
  {
    title: "Instant 'Open to Collab'",
    description: "No more cold DMs. See who is actively looking for collaborations (Creator or Brand) and connect with a click.",
    icon: <MousePointerClick className="w-6 h-6" />,
  },
  {
    title: "Audience Exchange",
    description: "Tap into a local influencer's audience to explode your reach and gain followers in a new geography.",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: "Smart Itineraries",
    description: "Plan your content trip. Secure creator meetups and brand sponsorships before you even book your flight.",
    icon: <Utensils className="w-6 h-6" />,
  },
  {
    title: "Viral Together",
    description: "Create magic that breaks the internet by collaborating with the best talent and brands in any city.",
    icon: <TrendingUp className="w-6 h-6" />,
  }
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div 
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-[2rem] bg-zinc-900/50 border border-white/5 overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
        >
            {/* Spotlight Border */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 spotlight-border"
                style={{ 
                    opacity,
                    '--mouse-x': `${position.x}px`,
                    '--mouse-y': `${position.y}px`
                } as React.CSSProperties}
            />

            {/* Spotlight Background */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 spotlight-card"
                style={{ 
                    opacity,
                    '--mouse-x': `${position.x}px`,
                    '--mouse-y': `${position.y}px`
                } as React.CSSProperties}
            />

            <div className="relative p-8 h-full flex flex-col z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                    index % 3 === 0 ? 'bg-rose-500/10 text-rose-500' : 
                    index % 3 === 1 ? 'bg-orange-500/10 text-orange-500' : 
                    'bg-indigo-500/10 text-indigo-500'
                }`}>
                    {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                    {feature.description}
                </p>
            </div>
        </div>
    )
}

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-brand-400 font-bold tracking-wider uppercase text-xs mb-3">Why Creator Connect?</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6">The Toolkit for the Modern Nomad</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Stop creating alone. We are building the operating system for creators who want to travel, collab with peers, and partner with lifestyle brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. CollabExamples
interface CollabCardProps {
  icon1: React.ReactNode;
  label1: string;
  icon2: React.ReactNode;
  label2: string;
  result: string;
  delayClass: string;
  color: string;
}

const CollabCard: React.FC<CollabCardProps> = ({ icon1, label1, icon2, label2, result, delayClass, color }) => (
  <div className={`relative group p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2 duration-500 ${delayClass} overflow-hidden`}>
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700`}></div>
    
    <div className="relative flex items-center justify-between mb-8 gap-4">
      <div className="flex flex-col items-center flex-1">
        <div className={`w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-xl`}>
          {icon1}
        </div>
        <span className="mt-3 text-sm font-bold text-white text-center bg-zinc-800/50 px-3 py-1 rounded-full">{label1}</span>
      </div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg transform group-hover:rotate-180 transition-transform duration-500">
           <Plus className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col items-center flex-1">
        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-xl">
          {icon2}
        </div>
        <span className="mt-3 text-sm font-bold text-white text-center bg-zinc-800/50 px-3 py-1 rounded-full">{label2}</span>
      </div>
    </div>

    <div className="pt-6 border-t border-white/5 text-center">
      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-2">Outcome</p>
      <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">{result}</span>
      </div>
    </div>
  </div>
);

const CollabExamples: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
      {/* Soft Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-brand-400 font-bold tracking-wider uppercase text-xs mb-3">Possibilities are Endless</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Who will you Create & Partner with?</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            From sponsored stays to content swaps, Creator Connect makes the impossible collaborations happen instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CollabCard 
            icon1={<MapPin className="w-8 h-8" />}
            label1="Travel Vlogger"
            icon2={<Coffee className="w-8 h-8" />}
            label2="Luxury Resort"
            result="VIP Access + Free Stay"
            delayClass="animate-fade-in-up"
            color="rose"
          />
          
          <CollabCard 
            icon1={<Camera className="w-8 h-8" />}
            label1="Photographer"
            icon2={<Scissors className="w-8 h-8" />}
            label2="Fashion Model"
            result="Stunning Portfolio"
            delayClass="animate-fade-in-up delay-100"
            color="accent"
          />

          <CollabCard 
            icon1={<Video className="w-8 h-8" />}
            label1="YouTuber"
            icon2={<MapPin className="w-8 h-8" />}
            label2="Local Guide"
            result="Insider Video Guide"
            delayClass="animate-fade-in-up delay-200"
            color="indigo"
          />
        </div>
      </div>
    </section>
  );
};

// 6. HowItWorks
const steps = [
  {
    id: 1,
    title: "Tell AI Where You're Going",
    description: "Simply enter your destination and travel dates. Our Creator Connect AI analyzes your niche and style.",
    icon: <MapPin className="w-5 h-5" />,
    color: "rose",
    mockup: (
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 w-full max-w-xs shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 group">
        <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">✈️</div>
             <div>
                <div className="text-white font-bold text-sm">Trip to Tokyo</div>
                <div className="text-zinc-500 text-xs">Oct 12 - 20</div>
             </div>
        </div>
        <div className="space-y-2">
            <div className="bg-zinc-800/50 p-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-zinc-300 text-xs">Food Vlogging</span>
            </div>
            <div className="bg-zinc-800/50 p-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-zinc-300 text-xs">Street Photography</span>
            </div>
        </div>
        <div className="mt-4 bg-white text-black py-2 rounded-lg text-center text-xs font-bold shadow-lg">
            Generating Matches...
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Get Instant Matches",
    description: "We filter thousands of profiles to find your perfect Creator Matches (for content) and Lifestyle Brand Partners (for sponsorships).",
    icon: <Sparkles className="w-5 h-5" />,
    color: "amber",
    mockup: (
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 w-full max-w-xs shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-500 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-rose-500"></div>
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Top Match</span>
            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold border border-green-500/20">98% Compatible</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-zinc-800"></div>
            <div>
                <div className="h-2.5 w-24 bg-zinc-700 rounded mb-1.5"></div>
                <div className="h-2 w-16 bg-zinc-800 rounded"></div>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="flex-1 bg-zinc-800 py-2 rounded-lg text-xs font-medium text-zinc-400">Skip</button>
            <button className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-xs font-bold shadow-lg shadow-amber-500/20">Connect</button>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Connect & Secure Deals",
    description: "Send a 'Collab Request'. Chat directly to plan your shoot with a creator or confirm your sponsored experience with a brand.",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "indigo",
    mockup: (
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 w-full max-w-xs shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
        <div className="space-y-3">
            <div className="flex justify-end">
                <div className="bg-indigo-600 text-white text-xs py-2.5 px-4 rounded-2xl rounded-tr-sm shadow-md">
                    Hey! Love your vibe. Let's shoot? 📸
                </div>
            </div>
            <div className="flex justify-start">
                 <div className="bg-zinc-800 text-zinc-300 text-xs py-2.5 px-4 rounded-2xl rounded-tl-sm">
                    For sure! I know a hidden rooftop.
                </div>
            </div>
             <div className="flex justify-center mt-4">
                 <div className="bg-zinc-950 border border-white/10 text-white text-[10px] font-bold py-1.5 px-4 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Collab Scheduled: Oct 14, 5PM
                </div>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Create & Grow",
    description: "Meet up, create amazing content, tag each other, and watch your engagement soar globally.",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "emerald",
    mockup: (
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 w-full max-w-xs shadow-2xl transform -rotate-1 hover:rotate-0 transition-all duration-500 flex items-center gap-4">
        <div className="w-16 h-20 bg-zinc-100 rounded-xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-2xl">🔥</div>
        </div>
        <div className="flex-1">
            <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-black text-zinc-900">15.2k</span>
                <span className="text-xs font-bold text-green-600 mb-1.5">▲ 24%</span>
            </div>
            <div className="text-xs text-zinc-500 font-medium">New Followers this week</div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mt-2">
                <div className="h-full w-3/4 bg-emerald-500"></div>
            </div>
        </div>
      </div>
    )
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-brand-400 font-bold tracking-wider uppercase text-xs mb-3">The Process</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white">From Flight Ticket to Viral Hit</h3>
        </div>

        <div className="relative mb-12 md:mb-20">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-zinc-800 hidden md:block"></div>

          <div className="space-y-20 md:space-y-32">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Text Side */}
                <div className={`flex-1 text-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-${step.color}-500 mb-6 md:hidden shadow-lg`}>
                    {step.icon}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.title}</h4>
                  <p className="text-zinc-400 leading-relaxed text-lg max-w-md mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Icon Center (Desktop Only) */}
                <div className="hidden md:flex flex-shrink-0 relative z-10 w-16 h-16 rounded-2xl bg-zinc-900 border-4 border-zinc-950 items-center justify-center text-white shadow-xl ring-1 ring-white/10">
                    <div className={`absolute inset-0 bg-${step.color}-500/20 rounded-xl blur-lg`}></div>
                    <div className={`relative z-10 text-${step.color}-400`}>{step.icon}</div>
                </div>

                {/* Mockup Side */}
                <div className="flex-1 flex justify-center md:justify-center">
                    {step.mockup}
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-20">
             <button 
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-5 rounded-full bg-white text-zinc-950 font-bold text-xl hover:bg-zinc-100 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Start Your Journey
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
        </div>
      </div>
    </section>
  );
};

// 7. Testimonials
const testimonials: Testimonial[] = [
  {
    name: "Priya Sharma",
    role: "Travel Vlogger • Goa",
    content: "I landed in Manali and instantly found a local food blogger. We gained 10k followers combined from one reel! 🚀",
    avatar: "https://picsum.photos/100/100?random=4"
  },
  {
    name: "James Wilson",
    role: "Photographer • London",
    content: "Creator Connect found me a boutique hotel in Mumbai that gave me a 3-night stay for free in exchange for photos. Insane value.",
    avatar: "https://picsum.photos/100/100?random=5"
  },
  {
    name: "Tara & Mike",
    role: "Van Life • Europe",
    content: "We use the app in every city. It's not just about content; it's about meeting local creative friends wherever we park.",
    avatar: "https://picsum.photos/100/100?random=6"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-16">
          Loved by <span className="text-brand-400">Traveling Creators</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-zinc-900 p-8 rounded-3xl border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-800"
                />
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-zinc-500 text-xs font-medium">{t.role}</p>
                </div>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm">
                "{t.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8. Waitlist
const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <section id="waitlist" className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
        {/* Simple background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Go Global?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 5,000+ creators waiting for the ultimate travel collab platform. 
                Secure your handle today.
            </p>

            {!joined ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <input 
                        type="email" 
                        required
                        placeholder="creator@example.com" 
                        className="relative flex-1 bg-zinc-900 border border-white/10 rounded-full px-8 py-5 text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg placeholder:text-zinc-600 shadow-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="relative bg-white text-zinc-950 font-bold rounded-full px-10 py-5 hover:bg-zinc-100 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Join Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            ) : (
                 <div className="animate-fade-in-up bg-zinc-900/50 border border-green-500/20 rounded-2xl p-8 inline-flex items-center gap-4 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-white font-bold text-lg">You're on the list!</h4>
                        <p className="text-zinc-400">Keep an eye on your inbox.</p>
                    </div>
                 </div>
            )}

            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['Travel', 'Create', 'Connect'].map((word, i) => (
                    <span key={i} className="text-zinc-500 font-bold tracking-widest uppercase text-sm">{word}</span>
                ))}
            </div>
        </div>
    </section>
  )
}

// 9. Footer
const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'pricing':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Choose Your Plan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                <h4 className="text-lg font-bold text-white mb-2">Starter</h4>
                <p className="text-3xl font-bold text-white mb-4">$0 <span className="text-sm font-normal text-slate-400">/mo</span></p>
                <ul className="space-y-3 mb-6">
                  {['Basic Profile', '3 Collab Requests/mo', 'Community Access', 'Standard Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-slate-500" /> {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">Current Plan</button>
              </div>
              <div className="p-6 rounded-xl bg-slate-800 border border-brand-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                <h4 className="text-lg font-bold text-white mb-2">Creator Pro</h4>
                <p className="text-3xl font-bold text-white mb-4">$12 <span className="text-sm font-normal text-slate-400">/mo</span></p>
                <ul className="space-y-3 mb-6">
                  {['Unlimited Requests', 'Verified Badge 🎖️', 'Priority Sponsorship Access', 'Advanced Analytics'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-brand-400" /> {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">Upgrade Now</button>
              </div>
            </div>
          </div>
        );
      case 'safety':
        return (
          <div className="space-y-6">
             <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                    <Shield className="w-8 h-8" />
                </div>
             </div>
             <h3 className="text-2xl font-bold text-white text-center">Your Safety is Priority</h3>
             <div className="grid gap-4">
                {[
                    { title: "ID Verification", desc: "Every user must verify their government ID before hosting or staying." },
                    { title: "Escrow Payments", desc: "Funds are held safely until the collaboration is successfully completed." },
                    { title: "Community Reviews", desc: "Honest, transparent reviews after every interaction keep the community safe." }
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6 text-center">
            <div className="inline-block p-3 bg-brand-500/10 rounded-full text-brand-400 mb-2">
                <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Born in a Hostel in Bali 🌴</h3>
            <p className="text-slate-300 leading-relaxed">
                In 2023, our founders met in a co-working hostel in Canggu. They realized they were all creating content alone, despite being surrounded by talent.
            </p>
            <p className="text-slate-300 leading-relaxed">
                Creator Connect was built to solve this. To turn solo travel into a collaborative movement. We believe the future of the creator economy is borderless and shared.
            </p>
          </div>
        );
      case 'blog':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Latest from the Blog</h3>
            <div className="space-y-4">
                {[
                    { title: "Pitching Clubs & Hotels for Sponsorships", date: "Oct 12, 2023", read: "5 min read" },
                    { title: "Top 10 Cities for Street Photographers", date: "Sep 28, 2023", read: "8 min read" },
                    { title: "The Ultimate Guide to Collab Contracts", date: "Sep 15, 2023", read: "12 min read" }
                ].map((post, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-brand-500/50 cursor-pointer transition-colors group">
                        <h4 className="font-bold text-white group-hover:text-brand-400 transition-colors">{post.title}</h4>
                        <div className="flex gap-3 mt-2 text-xs text-slate-500">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.read}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full text-center text-brand-400 text-sm hover:underline mt-2">View all articles</button>
          </div>
        );
       case 'careers':
        return (
          <div className="space-y-6">
             <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                    <Briefcase className="w-8 h-8" />
                </div>
             </div>
            <h3 className="text-2xl font-bold text-white text-center">Join the Mission</h3>
            <p className="text-slate-400 text-center mb-6">We are a 100% remote team building the operating system for traveling creators.</p>
            <div className="space-y-3">
                 {[
                    { role: "Senior Full Stack Engineer", loc: "Remote (Worldwide)" },
                    { role: "Growth Marketing Manager", loc: "Remote (US/EU)" },
                    { role: "Community Lead", loc: "Remote (APAC)" }
                ].map((job, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700">
                        <div>
                            <h4 className="font-bold text-white text-sm">{job.role}</h4>
                            <p className="text-slate-500 text-xs">{job.loc}</p>
                        </div>
                        <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded">Apply</button>
                    </div>
                ))}
            </div>
          </div>
        );
       case 'privacy':
        return (
            <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2 text-brand-400">
                    <Lock className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Legal</span>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Privacy Policy</h3>
                 <div className="h-64 overflow-y-auto pr-2 text-sm text-slate-400 space-y-4 custom-scrollbar">
                    <p>Last updated: October 2023</p>
                    <p>At Creator Connect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our mobile application.</p>
                    <h4 className="text-white font-bold">1. Collection of Data</h4>
                    <p>We collect information that you voluntarily provide to us when registering at the application, expressing an interest in obtaining information about us or our products and services, when participating in activities on the application or otherwise contacting us.</p>
                    <h4 className="text-white font-bold">2. Use of Your Information</h4>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to: Create and manage your account, Compile anonymous statistical data and analysis for use internally or with third parties.</p>
                 </div>
            </div>
        );
       case 'terms':
        return (
            <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2 text-brand-400">
                    <FileText className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Legal</span>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Terms of Service</h3>
                 <div className="h-64 overflow-y-auto pr-2 text-sm text-slate-400 space-y-4 custom-scrollbar">
                    <p>Last updated: October 2023</p>
                    <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Creator Connect mobile application (the "Service") operated by Creator Connect Inc ("us", "we", or "our").</p>
                    <h4 className="text-white font-bold">1. Conditions of Use</h4>
                    <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Creator Connect if you do not agree to take all of the terms and conditions stated on this page.</p>
                    <h4 className="text-white font-bold">2. License</h4>
                    <p>Unless otherwise stated, Creator Connect and/or its licensors own the intellectual property rights for all material on Creator Connect. All intellectual property rights are reserved.</p>
                 </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-slate-950 border-t border-slate-900 pt-10 pb-8 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-brand-400" />
                <span className="font-bold text-xl text-white">CreatorConnect</span>
              </div>
              <p className="text-slate-500 text-sm">
                Connect. Create. Grow. The ultimate platform for creators to build their brand globally.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-brand-400 transition-colors text-left">Features</button></li>
                <li><button onClick={() => setActiveModal('pricing')} className="hover:text-brand-400 transition-colors text-left">Pricing</button></li>
                <li><button onClick={() => setActiveModal('safety')} className="hover:text-brand-400 transition-colors text-left">Safety</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-brand-400 transition-colors text-left">About</button></li>
                <li><button onClick={() => setActiveModal('blog')} className="hover:text-brand-400 transition-colors text-left">Blog</button></li>
                <li><button onClick={() => setActiveModal('careers')} className="hover:text-brand-400 transition-colors text-left">Careers</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 gap-4 md:gap-0">
            <p>&copy; {new Date().getFullYear()} CreatorConnect Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-400">Privacy Policy</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-slate-400">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={closeModal}
          ></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};

// --- APP ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-brand-500/30 selection:text-brand-200">
      <Header />
      <main>
        <Hero />
        <CollabExamples />
        <HowItWorks />
        <Features />
        <Waitlist />
        <Testimonials />
      </main>
      <Footer />
      <LiveTicker />
    </div>
  );
};

// --- ROOT ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
