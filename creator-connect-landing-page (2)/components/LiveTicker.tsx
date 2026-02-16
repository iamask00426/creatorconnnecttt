import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, Camera, Video, Zap } from 'lucide-react';

const EVENTS = [
  { icon: <Camera size={14} />, text: "Sarah just matched with a Photographer in Bali", color: "text-rose-400" },
  { icon: <MapPin size={14} />, text: "Tom secured a hotel collab in Tokyo", color: "text-amber-400" },
  { icon: <Sparkles size={14} />, text: "New Creator Meetup started in London", color: "text-indigo-400" },
  { icon: <Video size={14} />, text: "Alex matched with a Drone Pilot in NYC", color: "text-emerald-400" },
  { icon: <Zap size={14} />, text: "Jessica unlocked a VIP Club Pass in Miami", color: "text-purple-400" },
];

export const LiveTicker: React.FC = () => {
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