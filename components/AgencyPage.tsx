import React, { useState } from 'react';
import {
    Zap, ArrowRight, ShieldCheck, Eye, DollarSign, TrendingUp, Sparkles,
    Users, Briefcase, FileText, Check, X, ChevronDown, ChevronUp,
    Send, Building, Award, Percent, AlertCircle, ArrowUpRight, Scale,
    CheckCircle2, MessageSquare, BadgeCheck, Globe, Star, Clock, Lock
} from 'lucide-react';

interface AgencyPageProps {
    onNavigateHome: () => void;
    onGetStarted?: () => void;
}

export const AgencyPage: React.FC<AgencyPageProps> = ({ onNavigateHome, onGetStarted }) => {
    // Calculator State
    const [dealAmount, setDealAmount] = useState<number>(10000);

    // Form State
    const [formType, setFormType] = useState<'creator' | 'brand'>('creator');
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        handleOrCompany: '',
        nicheOrBudget: '',
        message: ''
    });

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    // Traditional agency vs Creator Connect calculations
    const traditionalCutPercent = 45; // average traditional hidden cut
    const ccCutPercent = 15; // transparent creator connect fee

    const traditionalCut = (dealAmount * traditionalCutPercent) / 100;
    const traditionalTakeHome = dealAmount - traditionalCut;

    const ccCut = (dealAmount * ccCutPercent) / 100;
    const ccTakeHome = dealAmount - ccCut;
    const extraMoneyInPocket = ccTakeHome - traditionalTakeHome;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    const faqs = [
        {
            q: "How exactly do you prove you don't take hidden cuts from deals?",
            a: "We practice 100% Open-Book Invoicing. Whenever a brand partnership is locked, you receive a direct copy of the brand's original purchase order, master contract, and wire transfer receipt. If the brand pays $10,000, you see the official $10,000 invoice. Our flat 15% agency fee is deducted in plain daylight, and the remaining 85% goes directly to you. No hidden markups, ever."
        },
        {
            q: "What does Creator Connect Agency do for creators?",
            a: "We provide full-spectrum talent management: inbound inquiry negotiation (increasing rates by 2x-5x), contract review and IP protection (whitelisting terms, exclusivity redlining), media kit optimization, proactive brand pitches, and pairing you with other top creators in our 10,000+ creator network for viral collaborations."
        },
        {
            q: "What does Creator Connect Agency offer to brands?",
            a: "For brands and marketing teams, we run end-to-end influencer marketing campaigns. We handpick and vet authentic creators across Travel, Tech, Lifestyle, SaaS, Finance, and D2C who have real engagement. We handle everything from creative briefing and script approvals to usage rights, performance whitelisting (Meta/TikTok ads), and live conversion analytics."
        },
        {
            q: "Do I have to sign an exclusive multi-year 'hostage' contract?",
            a: "Absolutely not. Traditional agencies lock creators into 2-to-3 year exclusive predatory agreements with steep penalty exit clauses. At Creator Connect Agency, we believe representation is earned through performance and trust. We offer flexible, creator-friendly partnerships where you can leave with 30 days notice if we are not delivering 10x value."
        },
        {
            q: "How fast do creators get paid?",
            a: "Traditional agencies often hold creator money for 60 to 90+ days while they float funds in their corporate bank accounts. We enforce Net-14 or immediate milestone release. Once the brand signs off on the deliverables, your payment is processed without delay."
        },
        {
            q: "What are the eligibility criteria for creators to join your roster?",
            a: "We focus on high engagement, quality storytelling, and professionalism rather than just raw follower vanity numbers. Typically, creators with 20K+ engaged followers or creators who produce exceptional cinematic/niche UGC content are invited. Apply below and our talent management team will review your channels within 24 hours."
        }
    ];

    const comparisonItems = [
        {
            feature: "Deal Amount Visibility",
            traditional: "Hidden black box. Brand amount kept secret.",
            creatorConnect: "100% Open-Book. You inspect the master brand invoice."
        },
        {
            feature: "Agency Cut & Fees",
            traditional: "35% to 60% hidden margin taken quietly.",
            creatorConnect: "Flat transparent 15-20% fee. You keep 80-85%."
        },
        {
            feature: "Payout Speed",
            traditional: "Net-60 to Net-120 days. Creators chase money.",
            creatorConnect: "Net-14 days guaranteed upon delivery approval."
        },
        {
            feature: "Creator IP & Image Rights",
            traditional: "Perpetual, blanket rights surrendered to agency.",
            creatorConnect: "Creator owns 100% of IP. Clear, limited brand licenses."
        },
        {
            feature: "Contract Terms",
            traditional: "2+ years lock-in with heavy non-compete penalties.",
            creatorConnect: "Flexible 6-month cycles with 30-day exit clause."
        },
        {
            feature: "Brand Invoicing",
            traditional: "Double-invoicing with inflated line-item markups.",
            creatorConnect: "Direct 3-way transparent contract & single invoice."
        },
        {
            feature: "Creator Network Access",
            traditional: "Isolated roster. Zero peer collabs.",
            creatorConnect: "Direct access to 10,000+ creators for cross-pollination."
        },
        {
            feature: "Dedicated Talent Support",
            traditional: "1 junior manager juggling 150+ creators.",
            creatorConnect: "Capped 1:12 manager ratio for high-touch strategy."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500 selection:text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/85 border-b border-white/10 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/5"
                        >
                            <span>←</span>
                            <span className="hidden sm:inline">Back to Platform</span>
                        </button>

                        <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>

                        <div
                            onClick={onNavigateHome}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="bg-gradient-to-tr from-rose-500 to-amber-500 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-rose-500/20">
                                <Zap className="h-4 w-4 text-white fill-white" />
                            </div>
                            <span className="font-extrabold text-lg tracking-tight text-white">
                                Creator<span className="text-zinc-400">Connect</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Agency
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center space-x-1 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-zinc-300">
                        <a href="#why-transparency" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Why Us</a>
                        <a href="#calculator" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Calculator</a>
                        <a href="#comparison" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Comparison</a>
                        <a href="#for-creators" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">For Creators</a>
                        <a href="#for-brands" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">For Brands</a>
                        <a href="#faq" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">FAQ</a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <a
                            href="#apply-form"
                            onClick={() => setFormType('creator')}
                            className="hidden sm:inline-flex text-xs font-bold text-zinc-300 hover:text-white px-3 py-2 rounded-full border border-white/10 hover:border-white/30 transition"
                        >
                            I'm a Creator
                        </a>
                        <a
                            href="#apply-form"
                            onClick={() => setFormType('brand')}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition transform hover:-translate-y-0.5"
                        >
                            Hire Talent / Apply
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-28 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-rose-500/20 via-amber-500/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Eyebrow Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wide text-zinc-300">
                            Full-Service Talent Management & Influencer Marketing
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                            100% Radical Transparency
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6">
                        Most Agencies Hide Deal Amounts & Pocket 50% Cuts. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400 animate-shimmer bg-[length:200%_auto]">
                            We Don't. Welcome to Radical Transparency.
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
                        Creator Connect Agency represents premier digital talent and crafts high-converting influencer campaigns for ambitious brands — built on an uncompromising <strong className="text-white font-bold">100% Open-Book Model</strong>. You see every invoice, every dollar, and every clause in the bright light of day.
                    </p>

                    {/* Hero Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <a
                            href="#apply-form"
                            onClick={() => setFormType('creator')}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-rose-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                        >
                            <span>Apply for Talent Management</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#apply-form"
                            onClick={() => setFormType('brand')}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-base backdrop-blur-md transition flex items-center justify-center gap-2"
                        >
                            <Briefcase className="w-5 h-5 text-amber-400" />
                            <span>Book a Brand Campaign</span>
                        </a>
                    </div>

                    {/* Trust Proof Metrics Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
                        <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Open Invoices</p>
                            <p className="text-[11px] text-zinc-500 mt-1">You inspect the master contract</p>
                        </div>
                        <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-2xl sm:text-3xl font-black text-rose-400">0%</p>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Hidden Margins</p>
                            <p className="text-[11px] text-zinc-500 mt-1">No double billing or markups</p>
                        </div>
                        <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-2xl sm:text-3xl font-black text-amber-400">14 Days</p>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Fast Payouts</p>
                            <p className="text-[11px] text-zinc-500 mt-1">Never wait 90 days for money</p>
                        </div>
                        <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-2xl sm:text-3xl font-black text-white">10,000+</p>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Creator Network</p>
                            <p className="text-[11px] text-zinc-500 mt-1">Vetted cross-collab ecosystem</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Harsh Truth: Why Old Agencies Are Broken */}
            <section id="why-transparency" className="py-20 bg-zinc-900/40 border-y border-white/5 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-3">
                            <AlertCircle className="w-4 h-4" />
                            <span>The Dirty Secret of Influencer Marketing</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
                            How Traditional Talent Agencies Exploit Creators & Overcharge Brands
                        </h2>
                        <p className="text-zinc-400 text-base leading-relaxed">
                            For years, middleman agencies have operated in shadows. They treat creators like inventory and brands like cash cows. Here is what actually happens behind closed doors:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box 1 */}
                        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-red-500/20 relative group hover:border-red-500/40 transition">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 font-black text-lg">
                                01
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">The "Double Invoicing" Black Box</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                A brand approves a campaign budget of <strong className="text-white">$15,000</strong>. The agency tells the creator: <em>"The brand only has a tight budget of $4,500."</em> The agency quietly pockets the remaining $10,500 without disclosing anything. Neither the brand nor the creator ever knows they were scammed.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                                ✕ 60-70% secret cuts are standard practice
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-red-500/20 relative group hover:border-red-500/40 transition">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 font-black text-lg">
                                02
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">The 90-to-120 Day Cashflow Trap</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Brands pay agencies upfront or Net-30. Yet traditional agencies delay creator payouts for 3 to 6 months. Creators have to send repeated follow-ups and beg for their own money while the agency uses those funds as interest-free corporate loans.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                                ✕ Endless invoice chasing & delayed livelihoods
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-red-500/20 relative group hover:border-red-500/40 transition">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 font-black text-lg">
                                03
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Hostage Contracts & IP Traps</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Heavy 30-page exclusive contracts with perpetual usage rights, harsh non-compete clauses, and punitive exit fees. If the agency does zero work for 6 months, you still can’t leave or take inbound deals independently.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                                ✕ Loss of creative ownership & freedom
                            </div>
                        </div>

                        {/* Box 4 */}
                        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-red-500/20 relative group hover:border-red-500/40 transition">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 font-black text-lg">
                                04
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Fake Vanity Metrics for Brands</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Brands are sold inflated rosters with purchased followers and engagement pods. Middleman markups reach 300%, leaving brands with poor conversions, no verifiable pixel data, and zero long-term retention.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit">
                                ✕ Sky-high costs with zero measurable ROI
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution: Our 5 Transparency Pillars */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 mb-2 block">
                            The Antidote
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            The Creator Connect Standard: 100% Radical Transparency
                        </h2>
                        <p className="text-zinc-400 text-base">
                            We engineered a modern agency model where talent and brands operate as true partners with complete honesty.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-rose-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-rose-500/10 text-rose-400 mb-6">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">1. Open-Book Master Invoices</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Every creator gets direct access to the original purchase order from the brand. You see every line item, usage right fee, and payment schedule. Zero secrets.
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-amber-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-400 mb-6">
                                <Percent className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">2. Capped, Fair Flat Cut (15-20%)</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                We only take a pre-agreed 15% to 20% commission that covers pitch preparation, legal contracting, rate maximization, and production management. You keep 80-85%.
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">3. Guaranteed 14-Day Payouts</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                As soon as the deliverables are approved, funds are disbursed. You never have to wait 90 days or chase an accounting team again.
                            </p>
                        </div>

                        {/* Pillar 4 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-blue-500/10 text-blue-400 mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">4. Creator-First IP Protection</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                You own your likeness, voice, and raw files. Brands only get stipulated license windows (e.g., 30/90 days paid whitelisting), protecting your future rate value.
                            </p>
                        </div>

                        {/* Pillar 5 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">5. Dedicated 1:12 Talent Ratio</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Our managers don’t manage 200 creators. We cap rosters at 12 creators per lead manager so you get personalized strategy, daily pitches, and strategic brand positioning.
                            </p>
                        </div>

                        {/* Pillar 6 */}
                        <div className="bg-zinc-900/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-rose-500/40 transition">
                            <div className="p-3 w-fit rounded-2xl bg-rose-500/10 text-rose-400 mb-6">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">6. Global Creator Network Power</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Seamlessly collaborate with travel nomads, tech reviewers, and filmmakers worldwide directly through our proprietary Creator Connect platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Calculator: Transparency Simulator */}
            <section id="calculator" className="py-20 bg-zinc-900/50 border-y border-white/10 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
                            Interactive Fee Simulator
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                            See How Much More You Keep with Creator Connect
                        </h2>
                        <p className="text-zinc-400 text-sm mt-2">
                            Adjust the deal size below to see the shocking difference between traditional hidden commissions and our transparent model.
                        </p>
                    </div>

                    {/* Calculator Card */}
                    <div className="bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                        {/* Slider Controls */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-zinc-300">Brand Deal Budget:</label>
                                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                                    ${dealAmount.toLocaleString()}
                                </span>
                            </div>

                            <input
                                type="range"
                                min={1000}
                                max={50000}
                                step={1000}
                                value={dealAmount}
                                onChange={(e) => setDealAmount(Number(e.target.value))}
                                className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />

                            <div className="flex justify-between text-xs text-zinc-500 mt-2 font-mono">
                                <span>$1,000</span>
                                <span>$10,000</span>
                                <span>$25,000</span>
                                <span>$50,000</span>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {[2500, 5000, 10000, 25000, 50000].map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setDealAmount(preset)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${dealAmount === preset
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        ${preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Traditional Agency Card */}
                            <div className="bg-zinc-900/60 border border-red-500/20 rounded-2xl p-6 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md">
                                        Traditional Agency
                                    </span>
                                    <span className="text-xs text-zinc-500">~45% Hidden Cut</span>
                                </div>

                                <div className="space-y-3 mb-6 text-sm">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Brand Pays:</span>
                                        <span className="text-white font-medium">${dealAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-red-400">
                                        <span>Hidden Agency Pocket:</span>
                                        <span>-${traditionalCut.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 text-xs">
                                        <span>Invoice Transparency:</span>
                                        <span>0% (Kept Secret)</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 text-xs">
                                        <span>Payment Time:</span>
                                        <span>60-120 days</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs text-zinc-400 uppercase font-semibold">Creator Receives:</p>
                                    <p className="text-2xl font-black text-zinc-300 mt-1">${traditionalTakeHome.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Creator Connect Agency Card */}
                            <div className="bg-gradient-to-b from-rose-950/30 to-zinc-900/80 border border-rose-500/40 rounded-2xl p-6 relative shadow-lg shadow-rose-500/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        Creator Connect Agency
                                    </span>
                                    <span className="text-xs text-rose-400 font-bold">Flat 15% Fee</span>
                                </div>

                                <div className="space-y-3 mb-6 text-sm">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Brand Pays:</span>
                                        <span className="text-white font-medium">${dealAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Agency Management Fee (15%):</span>
                                        <span>-${ccCut.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-400 text-xs">
                                        <span>Invoice Transparency:</span>
                                        <span>100% (Original Master Invoice)</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-400 text-xs">
                                        <span>Payment Time:</span>
                                        <span>Net 14 Days Guaranteed</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-rose-500/30">
                                    <p className="text-xs text-rose-300 uppercase font-semibold">Creator Keeps:</p>
                                    <p className="text-3xl font-black text-white mt-1 flex items-baseline gap-2">
                                        ${ccTakeHome.toLocaleString()}
                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                                            +${extraMoneyInPocket.toLocaleString()} More in your pocket!
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Value Statement */}
                        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs sm:text-sm text-zinc-300">
                            💡 On a single <strong>${dealAmount.toLocaleString()}</strong> brand partnership, you keep an extra <strong className="text-emerald-400">${extraMoneyInPocket.toLocaleString()}</strong> that other agencies would have pocketed behind your back without telling you.
                        </div>
                    </div>
                </div>
            </section>

            {/* Direct Comparison Matrix */}
            <section id="comparison" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400 mb-2 block">
                        Head to Head
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                        Traditional Agencies vs. Creator Connect
                    </h2>
                    <p className="text-zinc-400 text-sm mt-3">
                        Compare our transparent partnership model against the industry status quo.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-bold">Capability / Term</th>
                                <th className="py-4 px-4 font-bold text-red-400 bg-red-950/20 rounded-t-xl">Traditional Agency</th>
                                <th className="py-4 px-4 font-bold text-emerald-400 bg-rose-950/30 rounded-t-xl border-t-2 border-rose-500">Creator Connect Agency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {comparisonItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition">
                                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                                        <span>{item.feature}</span>
                                    </td>
                                    <td className="py-4 px-4 text-zinc-400 bg-red-950/10">
                                        <div className="flex items-start gap-2">
                                            <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                            <span>{item.traditional}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-zinc-200 bg-rose-950/20 font-medium">
                                        <div className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span>{item.creatorConnect}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Two Wings: For Creators vs For Brands */}
            <section className="py-20 bg-zinc-900/30 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* For Creators */}
                        <div id="for-creators" className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8 sm:p-10 relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Talent Representation</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                                For Creators: Turn Your Passion into an Honest Empire
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Stop leaving tens of thousands of dollars on the table and stop wondering if your manager is taking secret cuts. We handle all the business so you can focus on creating.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Rate card negotiation: We secure 2x-5x higher payouts for Reels, TikToks, and YouTube integrations.",
                                    "Spam filtration: Directing inbound brand emails to your dedicated agent inbox.",
                                    "Contract redlining: Shielding your IP, restricting usage rights, and rejecting exploitative exclusivity.",
                                    "Retainers & Brand Ambassadorships: Transforming one-off posts into predictable monthly income.",
                                    "Nomad & Collab matching: Travel anywhere in the world and match with fellow vetted creators to multiply reach."
                                ].map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#apply-form"
                                onClick={() => setFormType('creator')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition"
                            >
                                <span>Apply for Talent Management</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* For Brands */}
                        <div id="for-brands" className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8 sm:p-10 relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6">
                                <Building className="w-3.5 h-3.5" />
                                <span>Influencer Marketing</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                                For Brands: High-Converting Campaigns Without Agency Bloat
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Work with authentic creators who actually care about your brand. We execute turnkey campaigns with verified engagement data, transparent pricing, and zero middleman markups.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Hyper-targeted creator curation across Travel, Tech, SaaS, D2C, Fashion, and Finance.",
                                    "Single clear invoice: You see exactly what creators receive and what our management fee covers.",
                                    "Full rights clearance & whitelisting for Meta & TikTok Spark Ads amplification.",
                                    "Strict quality control: Briefing, script reviews, creative iterations, and timely delivery.",
                                    "Live ROI & conversion metrics: Real business impact instead of shallow vanity metrics."
                                ].map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#apply-form"
                                onClick={() => setFormType('brand')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm transition"
                            >
                                <span>Plan Your Brand Campaign</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application / Inquiry Form */}
            <section id="apply-form" className="py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 mb-2 block">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white">
                            Partner With Creator Connect Agency
                        </h2>
                        <p className="text-zinc-400 text-sm mt-3">
                            Whether you're a creator seeking honest management or a brand ready to scale, let’s talk.
                        </p>
                    </div>

                    {/* Toggle Tab */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-zinc-900 p-1.5 rounded-full border border-white/10 flex gap-2">
                            <button
                                onClick={() => { setFormType('creator'); setFormSubmitted(false); }}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition ${formType === 'creator'
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                    : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                I am a Creator (Apply for Management)
                            </button>
                            <button
                                onClick={() => { setFormType('brand'); setFormSubmitted(false); }}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition ${formType === 'brand'
                                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25'
                                    : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                I am a Brand / Business (Hire Creators)
                            </button>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
                        {formSubmitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
                                <p className="text-zinc-400 max-w-md mx-auto text-sm mb-6 leading-relaxed">
                                    Thank you, <strong className="text-white">{formData.name || 'there'}</strong>. Our senior talent director will review your profile and reach out within 24 business hours to discuss our transparent partnership.
                                </p>
                                <button
                                    onClick={() => {
                                        setFormSubmitted(false);
                                        setFormData({ name: '', email: '', phone: '', handleOrCompany: '', nicheOrBudget: '', message: '' });
                                    }}
                                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                                >
                                    Submit Another Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                            {formType === 'creator' ? 'Your Full Name *' : 'Contact Person Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={formType === 'creator' ? 'e.g. Alex Rivera' : 'e.g. Priya Sharma'}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                            {formType === 'creator' ? 'Email Address *' : 'Work Email *'}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@domain.com"
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                            WhatsApp / Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 98765 43210 or +1 (555)..."
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                            {formType === 'creator' ? 'Primary Social Handle / URL *' : 'Company / Brand Name & Website *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.handleOrCompany}
                                            onChange={(e) => setFormData({ ...formData, handleOrCompany: e.target.value })}
                                            placeholder={formType === 'creator' ? '@yourinstagram or youtube.com/@...' : 'e.g. Acme Corp (acme.com)'}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                        {formType === 'creator' ? 'Content Niche & Current Follower Count' : 'Target Niche & Campaign Budget Range'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nicheOrBudget}
                                        onChange={(e) => setFormData({ ...formData, nicheOrBudget: e.target.value })}
                                        placeholder={formType === 'creator' ? 'e.g. Travel & Lifestyle, 140k Instagram followers' : 'e.g. Tech / SaaS, Budget: $10,000 - $25,000'}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                        {formType === 'creator' ? 'Tell us about your brand deal goals & past agency experience' : 'Campaign Objectives & What creators you are looking for'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={formType === 'creator' ? 'Why are you seeking transparent representation? What brands would you love to work with?' : 'Tell us about your campaign goals, target markets, or deliverables required...'}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-2 ${formType === 'creator'
                                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-500/25'
                                        : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-zinc-950 shadow-amber-500/25'
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{formType === 'creator' ? 'Submit Creator Application' : 'Request Campaign Strategy'}</span>
                                </button>

                                <p className="text-center text-xs text-zinc-500">
                                    🔒 100% Privacy. Your details are safe with us and will never be shared with third parties.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-zinc-900/30 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                            Have Questions?
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden transition"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02] transition"
                                >
                                    <span className="font-bold text-base text-white">{faq.q}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="w-5 h-5 text-rose-400 shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="py-20 bg-gradient-to-tr from-rose-950/40 via-zinc-950 to-amber-950/30 border-t border-white/10 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                        Ready for an Agency that Treats You Like a Partner?
                    </h2>
                    <p className="text-zinc-300 text-base max-w-2xl mx-auto mb-8">
                        Join the transparent revolution. No secret cuts. No hidden invoices. Pure creator growth and authentic brand impact.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#apply-form"
                            onClick={() => setFormType('creator')}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-rose-500/25 transition"
                        >
                            Apply as a Creator
                        </a>
                        <button
                            onClick={onNavigateHome}
                            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition"
                        >
                            Explore Creator Connect Platform
                        </button>
                    </div>
                </div>
            </section>

            {/* Agency Footer */}
            <footer className="bg-zinc-950 border-t border-white/10 py-12 text-zinc-500 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-rose-500 to-amber-500 p-1.5 rounded-lg">
                            <Zap className="h-4 w-4 text-white fill-white" />
                        </div>
                        <span className="font-bold text-sm text-white">
                            CreatorConnect <span className="text-rose-400 font-extrabold">Agency</span>
                        </span>
                        <span className="text-zinc-600">|</span>
                        <span>Talent Management & Influencer Marketing Division</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-zinc-400">
                        <button onClick={onNavigateHome} className="hover:text-white transition">Platform Home</button>
                        <a href="#why-transparency" className="hover:text-white transition">Manifesto</a>
                        <a href="#calculator" className="hover:text-white transition">Calculator</a>
                        <a href="#apply-form" className="hover:text-white transition">Contact</a>
                        <span className="text-zinc-600">contact: agency@creatorconnect.app</span>
                    </div>

                    <p>© {new Date().getFullYear()} Creator Connect Agency. 100% Radical Transparency Guaranteed.</p>
                </div>
            </footer>
        </div>
    );
};
