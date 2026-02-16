import React, { useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, Plane, BadgeCheck } from 'lucide-react';
import { generateCollabStrategy } from '../services/geminiService';
import { CollabStrategy, WaitlistForm } from '../types';

export const AIWaitlist: React.FC = () => {
  const [form, setForm] = useState<WaitlistForm>({
    name: '',
    email: '',
    niche: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<CollabStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await generateCollabStrategy(form.name, form.niche, form.city);
      setStrategy(result);
    } catch (err) {
      setError("Something went wrong with the AI analysis. But you're on the list!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStrategy(null);
    setForm({ name: '', email: '', niche: '', city: '' });
  };

  return (
    <section id="waitlist" className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
        {/* Soft Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Left Column: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Creator Connect AI</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Plan your next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Viral Trip</span>.
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Where are you traveling next? Join the waitlist and our AI will generate a custom <strong>Collab Strategy</strong> for your trip—finding you the perfect partners and sponsorship opportunities instantly.
            </p>
            
            <div className="space-y-4">
              {[
                "Exclusive 'Founding Creator' Badge 🎖️",
                "Priority Access to Beta",
                "Unlock Paid Gigs in 50+ Cities"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-zinc-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form or Result */}
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            {!strategy ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium"
                    placeholder="e.g. Alex Creator"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium"
                    placeholder="creator@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-400 ml-1">Your Niche</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium"
                            placeholder="Travel"
                            value={form.niche}
                            onChange={e => setForm({...form, niche: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-400 ml-1">Destination</label>
                         <div className="relative">
                            <Plane className="absolute right-4 top-4 h-5 w-5 text-zinc-600 pointer-events-none" />
                            <input 
                                required
                                type="text" 
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium"
                                placeholder="Bali"
                                value={form.city}
                                onChange={e => setForm({...form, city: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-5 rounded-xl transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-brand-500/20 text-lg transform active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing Trip...
                    </>
                  ) : (
                    <>
                      Join & Get Strategy
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </form>
            ) : (
              <div className="animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/10 to-orange-500/10 text-amber-400 px-5 py-2 rounded-full border border-amber-400/20 mb-4">
                        <BadgeCheck className="w-5 h-5" />
                        <span className="font-bold">Founding Creator Badge Unlocked!</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Your Trip Strategy: {form.city}</h3>
                </div>

                <div className="space-y-6">
                    <div className="p-5 bg-brand-500/5 border border-brand-500/20 rounded-2xl">
                        <p className="text-brand-300 italic text-center font-medium text-lg">"{strategy.welcome_message}"</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">People to Meet</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategy.match_suggestions.map((s, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 text-sm border border-zinc-700 font-medium">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Content Idea</h4>
                            <p className="text-white text-sm leading-relaxed p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                            💡 {strategy.viral_concept}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Sponsorships</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategy.barter_opportunities.map((s, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 text-sm border border-indigo-500/20 font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={handleReset}
                    className="w-full mt-8 text-zinc-500 hover:text-white text-sm underline decoration-zinc-700 underline-offset-4"
                >
                    Plan another trip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};