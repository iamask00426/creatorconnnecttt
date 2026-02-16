import React from 'react';
import { Camera, MapPin, Coffee, Video, Scissors, Plus, ArrowRight, Heart } from 'lucide-react';

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

export const CollabExamples: React.FC = () => {
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