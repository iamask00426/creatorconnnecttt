import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, PlayCircle, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
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
                Claim Founding Badge
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
                className="absolute top-10 -left-12 z-30 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl w-64"
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
                className="absolute -bottom-10 -right-4 z-30 bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-5 shadow-xl w-72"
                style={{ transform: 'translateZ(80px) rotate(3deg)' }}
            >
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
    </section>
  );
};