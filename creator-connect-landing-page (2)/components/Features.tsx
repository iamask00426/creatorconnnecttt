import React, { useRef, useState } from 'react';
import { MapPin, Utensils, MousePointerClick, Globe, Hotel, TrendingUp } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
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

export const Features: React.FC = () => {
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
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};