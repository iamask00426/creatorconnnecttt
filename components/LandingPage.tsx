import React, { useState, useEffect, useRef } from 'react';
import {
    Zap, Menu, X, ArrowRight, PlayCircle, MapPin,
    Sparkles, MessageCircle, TrendingUp, Users, Camera,
    Utensils, MousePointerClick, Globe, Hotel, Scissors, Plus,
    Coffee, BadgeCheck,
    Twitter, Instagram, Linkedin, Shield, Briefcase, FileText, Lock, Check,
    Video
} from 'lucide-react';

// --- COLOR CLASSES (static for Tailwind JIT) ---
const colorClasses: Record<string, { text500: string; text400: string; bg500_10: string; bg500_20: string }> = {
    rose: { text500: 'text-rose-500', text400: 'text-rose-400', bg500_10: 'bg-rose-500/10', bg500_20: 'bg-rose-500/20' },
    amber: { text500: 'text-amber-500', text400: 'text-amber-400', bg500_10: 'bg-amber-500/10', bg500_20: 'bg-amber-500/20' },
    indigo: { text500: 'text-indigo-500', text400: 'text-indigo-400', bg500_10: 'bg-indigo-500/10', bg500_20: 'bg-indigo-500/20' },
    emerald: { text500: 'text-emerald-500', text400: 'text-emerald-400', bg500_10: 'bg-emerald-500/10', bg500_20: 'bg-emerald-500/20' },
};

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

interface LandingPageProps {
    onGetStarted: () => void;
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
const Header: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent pt-4'
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
                            onClick={onGetStarted}
                            className="text-sm font-semibold text-white hover:text-brand-300 transition-colors px-4"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
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
                        <button onClick={onGetStarted} className="block w-full text-left px-3 py-3 text-brand-400 font-bold hover:bg-white/5 rounded-xl">Join Waitlist</button>
                    </div>
                </div>
            )}
        </header>
    );
};

// 3. Hero
const Hero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
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
                    <span className="inline-block text-transparent bg-clip-text [-webkit-background-clip:text] bg-gradient-to-r from-[#fb7185] via-[#f43f5e] to-[#f59e0b] animate-shimmer bg-[length:200%_100%]">Do it Together.</span>
                </h1>

                {/* Subheading */}
                <p className="mt-2 max-w-2xl mx-auto text-lg sm:text-2xl text-zinc-400 mb-10 animate-fade-in-up delay-100 font-light leading-relaxed">
                    The social network for the modern nomad. Connect with <span className="text-white font-medium">creators</span> to collab, and partner with <span className="text-white font-medium">lifestyle brands</span> to monetize your journey.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-200 justify-center">
                    <button
                        ref={buttonRef}
                        onClick={onGetStarted}
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

                {/* 3D Interactive Mockup Container */}
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
                        className="relative z-20 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50"
                        style={{ transform: 'translateZ(50px)' }}
                    >
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

                    {/* Floating Card Left - Brand Deal */}
                    <div
                        className="absolute top-10 -left-20 z-30 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl w-64"
                        style={{ transform: 'translateZ(100px) rotate(-6deg)' }}
                    >
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

                    {/* Floating Card Right - Community */}
                    <div
                        className="absolute -bottom-10 -right-12 z-30 bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-5 shadow-xl w-72"
                        style={{ transform: 'translateZ(80px) rotate(3deg)' }}
                    >
                        <div className="flex -space-x-3 mb-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                                    <img src={`https://picsum.photos/100/100?random=${i + 10}`} className="w-full h-full object-cover" />
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

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
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
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${index % 3 === 0 ? 'bg-rose-500/10 text-rose-500' :
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
        <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[color]?.bg500_10 ?? ''} rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700`}></div>

        <div className="relative flex items-center justify-between mb-8 gap-4">
            <div className="flex flex-col items-center flex-1">
                <div className={`w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center ${colorClasses[color]?.text400 ?? ''} group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-xl`}>
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

const HowItWorks: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
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
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 ${colorClasses[step.color]?.text500 ?? ''} mb-6 md:hidden shadow-lg`}>
                                        {step.icon}
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.title}</h4>
                                    <p className="text-zinc-400 leading-relaxed text-lg max-w-md mx-auto md:mx-0">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Icon Center (Desktop Only) */}
                                <div className="hidden md:flex flex-shrink-0 relative z-10 w-16 h-16 rounded-2xl bg-zinc-900 border-4 border-zinc-950 items-center justify-center text-white shadow-xl ring-1 ring-white/10">
                                    <div className={`absolute inset-0 ${colorClasses[step.color]?.bg500_20 ?? ''} rounded-xl blur-lg`}></div>
                                    <div className={`relative z-10 ${colorClasses[step.color]?.text400 ?? ''}`}>{step.icon}</div>
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
                        onClick={onGetStarted}
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
const Testimonials: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            name: "Priya Sharma",
            role: "Travel Creator (180k)",
            content: "I matched with a photographer AND a hotel sponsor in Bali within my first hour. 3 reels, 2M views. This platform is ridiculous.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "James Wilson",
            role: "Adventure Vlogger (500k)",
            content: "My collab partner and I created a series in Tokyo that went mega-viral. We would have never crossed paths without Creator Connect.",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "Tara & Mike",
            role: "Couple Creators (320k)",
            content: "We've done 4 brand-sponsored trips through the platform. The AI matching is scary good — every partner has been a perfect fit for our audience.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        }
    ];

    return (
        <section id="testimonials" className="py-20 md:py-32 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-400 font-bold tracking-wider uppercase text-xs mb-3">Community Love</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white">Trust the Process.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 relative group hover:bg-zinc-900 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={t.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-brand-500" alt={t.name} />
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wide">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-zinc-300 leading-relaxed">
                                {t.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// 8. Waitlist
const Waitlist: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <section id="waitlist" className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-6">
                    <span className="text-transparent bg-clip-text [-webkit-background-clip:text] bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500">Go Global?</span>
                </h2>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                    Join 5,000+ creators and brands building the future of travel content.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative" onSubmit={(e) => { e.preventDefault(); onGetStarted(); }}>
                    {/* Glow behind form */}
                    <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="relative flex-1 px-6 py-4 rounded-full bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    <button
                        type="submit"
                        className="relative px-8 py-4 rounded-full bg-white text-zinc-950 font-bold hover:bg-brand-50 transition-colors shadow-xl shadow-brand-500/10"
                    >
                        Join Now
                    </button>
                </form>

                <p className="mt-6 text-sm text-zinc-500 font-medium">
                    Limited spots available for the beta. No spam, ever.
                </p>

                {/* Decorative words */}
                <div className="flex justify-center gap-8 mt-12 text-zinc-700 text-sm font-bold uppercase tracking-[0.3em]">
                    <span>Travel</span>
                    <span className="text-zinc-800">•</span>
                    <span>Create</span>
                    <span className="text-zinc-800">•</span>
                    <span>Connect</span>
                </div>
            </div>
        </section>
    )
}

// 9. Footer
const FOOTER_MODALS: Record<string, { title: string; content: React.ReactNode }> = {
    pricing: {
        title: 'Pricing',
        content: (
            <div className="space-y-4">
                <p className="text-zinc-300">Creator Connect is <strong className="text-white">free for creators</strong> during our founding member period.</p>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                    <h4 className="font-bold text-white mb-1">Creator (Free)</h4>
                    <p className="text-zinc-400 text-sm">Unlimited matches, messaging, and collab tools.</p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                    <h4 className="font-bold text-white mb-1">Brand Partner</h4>
                    <p className="text-zinc-400 text-sm">Custom pricing based on campaign scope. Contact us for details.</p>
                </div>
            </div>
        ),
    },
    safety: {
        title: 'Safety',
        content: (
            <div className="space-y-3 text-zinc-300">
                <p>Your safety is our top priority. Every profile is verified and every interaction is monitored.</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-400">
                    <li>ID & social verification for all users</li>
                    <li>In-app reporting and moderation</li>
                    <li>Encrypted messaging</li>
                    <li>Public meetup location suggestions</li>
                </ul>
            </div>
        ),
    },
    about: {
        title: 'About Us',
        content: (
            <p className="text-zinc-300">Creator Connect was built by digital nomads, for digital nomads. We believe the best content comes from real human connection — and we're on a mission to make that happen, anywhere in the world.</p>
        ),
    },
    blog: {
        title: 'Blog',
        content: (
            <div className="space-y-3">
                <p className="text-zinc-400 text-sm">Coming soon — stories from our creator community.</p>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                    <p className="text-white font-medium text-sm">🚀 "How I Grew 50k Followers in 30 Days Using Collabs"</p>
                    <p className="text-zinc-500 text-xs mt-1">Launching March 2026</p>
                </div>
            </div>
        ),
    },
    careers: {
        title: 'Careers',
        content: (
            <div className="space-y-3 text-zinc-300">
                <p>We're a small, remote-first team looking for passionate builders.</p>
                <p className="text-zinc-400 text-sm">No open positions right now, but drop us a line at <span className="text-brand-400">careers@creatorconnect.app</span></p>
            </div>
        ),
    },
    privacy: {
        title: 'Privacy Policy',
        content: (
            <div className="space-y-3 text-zinc-400 text-sm">
                <p>We collect only the data necessary to provide our service. Your data is never sold to third parties.</p>
                <p>For the full policy, contact <span className="text-brand-400">privacy@creatorconnect.app</span>.</p>
            </div>
        ),
    },
    terms: {
        title: 'Terms of Service',
        content: (
            <div className="space-y-3 text-zinc-400 text-sm">
                <p>By using Creator Connect, you agree to our community guidelines and terms of use.</p>
                <p>For the full terms, contact <span className="text-brand-400">legal@creatorconnect.app</span>.</p>
            </div>
        ),
    },
};

const Footer: React.FC = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    return (
        <>
            <footer className="bg-zinc-950 border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Logo & Tagline */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-gradient-to-tr from-brand-500 to-accent-500 p-1.5 rounded-lg">
                                    <Zap className="h-4 w-4 text-white fill-white" />
                                </div>
                                <span className="font-bold text-lg text-white">
                                    Creator<span className="text-zinc-500">Connect</span>
                                </span>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed">The social network for the modern nomad.</p>
                        </div>

                        {/* Platform */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-2">
                                {[
                                    { label: 'How It Works', href: '#how-it-works' },
                                    { label: 'Features', href: '#features' },
                                    { label: 'Pricing', action: 'pricing' },
                                    { label: 'Safety', action: 'safety' },
                                ].map(item => (
                                    <li key={item.label}>
                                        {item.action ? (
                                            <button onClick={() => setActiveModal(item.action)} className="text-zinc-500 hover:text-white transition-colors text-sm">{item.label}</button>
                                        ) : (
                                            <a href={item.href} className="text-zinc-500 hover:text-white transition-colors text-sm">{item.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Company</h4>
                            <ul className="space-y-2">
                                {['about', 'blog', 'careers', 'privacy', 'terms'].map(key => (
                                    <li key={key}>
                                        {key === 'blog' ? (
                                            <a href="#/blog" className="text-zinc-500 hover:text-white transition-colors text-sm capitalize">{FOOTER_MODALS[key].title}</a>
                                        ) : (
                                            <button onClick={() => setActiveModal(key)} className="text-zinc-500 hover:text-white transition-colors text-sm capitalize">{FOOTER_MODALS[key].title}</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Connect</h4>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/creatorconnect.io" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/5 pt-8 text-center">
                        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Creator Connect. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Modal */}
            {activeModal && FOOTER_MODALS[activeModal] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-4">{FOOTER_MODALS[activeModal].title}</h3>
                        {FOOTER_MODALS[activeModal].content}
                    </div>
                </div>
            )}
        </>
    )
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-brand-500/30 selection:text-brand-200">
            <Header onGetStarted={onGetStarted} />
            <main>
                <Hero onGetStarted={onGetStarted} />
                <CollabExamples />
                <HowItWorks onGetStarted={onGetStarted} />
                <Features />
                <Waitlist onGetStarted={onGetStarted} />
                <Testimonials />
            </main>
            <Footer />
            <LiveTicker />
        </div>
    );
};

