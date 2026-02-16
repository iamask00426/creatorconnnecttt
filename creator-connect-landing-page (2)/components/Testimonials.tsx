import React from 'react';
import { Testimonial } from '../types';

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

export const Testimonials: React.FC = () => {
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