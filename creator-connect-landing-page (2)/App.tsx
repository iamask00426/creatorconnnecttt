import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CollabExamples } from './components/CollabExamples';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { AIWaitlist } from './components/AIWaitlist';
import { Footer } from './components/Footer';
import { LiveTicker } from './components/LiveTicker';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-brand-500/30 selection:text-brand-200">
      <Header />
      <main>
        <Hero />
        <CollabExamples />
        <HowItWorks />
        <Features />
        <AIWaitlist />
        <Testimonials />
      </main>
      <Footer />
      <LiveTicker />
    </div>
  );
};

export default App;