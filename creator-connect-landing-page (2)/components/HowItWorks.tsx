import React from 'react';
import { MapPin, Sparkles, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';

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