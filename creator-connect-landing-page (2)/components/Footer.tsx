import React, { useState } from 'react';
import { Zap, Twitter, Instagram, Linkedin, X, Check, Shield, Globe, Briefcase, FileText, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
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