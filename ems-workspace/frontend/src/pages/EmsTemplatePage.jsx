import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function EmsTemplatePage() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useClientStore();
  const { t } = useLanguage();

  // Selected active role in the role matrix
  const [selectedRole, setSelectedRole] = useState('founder');

  // Interactive match simulator state
  const [simDomain, setSimDomain] = useState('AI & Machine Learning');
  const [simStage, setSimStage] = useState('Seed Stage');
  const [simSkillFit, setSimSkillFit] = useState(94);
  const [simCapitalFit, setSimCapitalFit] = useState(90);
  const [simDomainFit, setSimDomainFit] = useState(96);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Upgraded role definitions based on explicit user prompt specification:
  // 🚀 Founder → "I have an IDEA" → Create your startup and find the people you need.
  // 💰 Investor → "I have MONEY" → Discover startups that match your investment interests.
  // 🧑‍🏫 Mentor → "I have KNOWLEDGE" → Guide founders with your expertise.
  // 👨‍💻 Team Member → "I have SKILLS" → Find startups where your skills can contribute.
  const roles = [
    {
      id: 'founder',
      emoji: '🚀',
      title: 'Founder',
      quote: '"I have an IDEA"',
      subtitle: 'Create your startup and find the people you need.',
      asset: 'IDEA',
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      borderColor: 'border-indigo-500/60',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      glowColor: 'shadow-indigo-500/25',
      accentGradient: 'from-indigo-500 to-purple-500',
      description:
        'Founders bring groundbreaking ideas, venture vision, and execution drive. On EMS, create your startup profile, showcase your pitch deck, publish funding requirements, and connect with investors for money, mentors for guidance, and teammates for skills.',
      keyPillars: [
        { title: 'Publish Startup Idea', desc: 'Create detailed listings with pitch decks & financial targets' },
        { title: 'Find Investors & Capital', desc: 'Discover angel investors & VC funds matching your stage' },
        { title: 'Recruit Co-Founders & Team', desc: 'Hire skilled engineers, designers & marketers' },
      ],
      sampleProfile: {
        name: 'Alex Rivera',
        role: 'Founder & CEO',
        company: 'NeuroScale AI',
        quote: '"Building autonomous AI agents for enterprise workflow automation."',
        seeking: 'Seeking $500K Seed Capital + Lead Full Stack Engineer',
        tags: ['Generative AI', 'B2B SaaS', 'Python', 'PyTorch'],
        matchScore: 98,
      },
    },
    {
      id: 'investor',
      emoji: '💰',
      title: 'Investor',
      quote: '"I have MONEY"',
      subtitle: 'Discover startups that match your investment interests.',
      asset: 'MONEY',
      color: 'from-emerald-600 via-teal-600 to-cyan-600',
      borderColor: 'border-emerald-500/60',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/25',
      accentGradient: 'from-emerald-500 to-teal-500',
      description:
        'Investors deploy financial capital into high-growth startups. Define your ticket size, preferred funding stage (Pre-Seed, Seed, Series A), and domain verticals to access AI-filtered deal flow with verified pitch deck analytics.',
      keyPillars: [
        { title: 'Set Deal Criteria', desc: 'Filter by ticket size ($25K–$2M+), valuation, stage & domain' },
        { title: 'Vetted Pitch Decks', desc: 'Review verified founder metrics, cap tables & traction' },
        { title: 'Direct Deal Pipeline', desc: 'Connect instantly with high-intent founders seeking capital' },
      ],
      sampleProfile: {
        name: 'Elena Rostova',
        role: 'Angel Investor / General Partner',
        company: 'Apex Ventures',
        quote: '"Backing visionary tech founders building scalable SaaS & AI platforms."',
        seeking: 'Deploying $50K–$250K checks in Pre-Seed/Seed Tech',
        tags: ['FinTech', 'AI/ML', 'CleanTech', 'Pre-Seed', 'Syndicate'],
        matchScore: 95,
      },
    },
    {
      id: 'mentor',
      emoji: '🧑‍🏫',
      title: 'Mentor',
      quote: '"I have KNOWLEDGE"',
      subtitle: 'Guide founders with your expertise.',
      asset: 'KNOWLEDGE',
      color: 'from-amber-600 via-orange-600 to-yellow-600',
      borderColor: 'border-amber-500/60',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      glowColor: 'shadow-amber-500/25',
      accentGradient: 'from-amber-500 to-orange-500',
      description:
        'Mentors provide strategic wisdom, advisory coaching, and industry connections. Seasoned executives and entrepreneurs share domain knowledge to help early-stage founders navigate product-market fit, pitch decks, and scaling.',
      keyPillars: [
        { title: 'Strategic Advisory', desc: 'Guide founders through fundraising, GTM strategy & growth' },
        { title: 'Share Industry Expertise', desc: 'Offer advisory sessions in tech, marketing, ops & legal' },
        { title: 'Expand Venture Network', desc: 'Connect founders to strategic partners & early adopters' },
      ],
      sampleProfile: {
        name: 'Dr. Marcus Vance',
        role: 'Veteran Startup Advisor',
        company: 'Ex-VP of Growth @ ScaleUp',
        quote: '"Helping early-stage founders conquer GTM scaling and Series A fundraising."',
        seeking: 'Advising Pre-Seed to Series A SaaS & DeepTech Founders',
        tags: ['Go-To-Market', 'Product Strategy', 'Fundraising', 'B2B Scaling'],
        matchScore: 94,
      },
    },
    {
      id: 'teamMember',
      emoji: '👨‍💻',
      title: 'Team Member',
      quote: '"I have SKILLS"',
      subtitle: 'Find startups where your skills can contribute.',
      asset: 'SKILLS',
      color: 'from-cyan-600 via-blue-600 to-indigo-600',
      borderColor: 'border-cyan-500/60',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      glowColor: 'shadow-cyan-500/25',
      accentGradient: 'from-cyan-500 to-blue-500',
      description:
        'Team Members bring execution talent across engineering, UI/UX design, marketing, data science, and operations. Match with groundbreaking startups looking for skills in exchange for equity, competitive compensation, or co-founder roles.',
      keyPillars: [
        { title: 'Skill Matrix Showcase', desc: 'List your technical stack, portfolio & project experience' },
        { title: 'Find Ideal Startup Fit', desc: 'Filter by early-stage ventures matching your passion' },
        { title: 'Co-Founder & Equity Roles', desc: 'Join as early engineer, lead designer, or growth lead' },
      ],
      sampleProfile: {
        name: 'Sophia Chen',
        role: 'Full Stack Engineer & UI/UX Specialist',
        company: 'Ex-Tech Lead @ TechCorp',
        quote: '"Passionate about crafting slick React/Node interfaces & cloud architectures."',
        seeking: 'Seeking Technical Co-Founder Role in AI or Web3 Venture',
        tags: ['React', 'Node.js', 'Python', 'Tailwind', 'System Architecture'],
        matchScore: 97,
      },
    },
  ];

  const activeRoleData = roles.find((r) => r.id === selectedRole) || roles[0];

  // Calculated match score for simulator
  const calculatedSimScore = Math.round(
    simSkillFit * 0.4 + simCapitalFit * 0.3 + simDomainFit * 0.3
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ==========================================
            1. HEADER
        ========================================== */}
        <header id="header" className="sticky top-4 z-50 mb-8">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Branding */}
            <div
              className="flex items-center gap-3.5 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:rotate-12 group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  EMS Platform
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  Entrepreneur & Startup Matching Platform
                </p>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 text-xs font-semibold">
              {[
                { id: 'hero', label: 'Hero' },
                { id: 'what-is-ems', label: 'What is EMS?' },
                { id: 'how-ems-works', label: 'How It Works' },
                { id: 'choose-your-role', label: 'Choose Your Role' },
                { id: 'how-matching-works', label: 'How Matching Works' },
                { id: 'features', label: 'Features' },
                { id: 'cta', label: 'Get Started' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
                >
                  App Dashboard →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      openAuthModal && openAuthModal('login');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ==========================================
            FLOW ARROW ↓ (1)
        ========================================== */}
        <div className="flex justify-center my-4">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono animate-bounce">
            <span>HEADER</span>
            <span className="font-bold">↓</span>
            <span>HERO SECTION</span>
          </div>
        </div>

        {/* ==========================================
            2. HERO SECTION
        ========================================== */}
        <section id="hero" className="py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Next-Gen Entrepreneur & Startup Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-tight tracking-tight">
                Where Visionaries Meet{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Capital, Guidance & Skills
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                EMS is the intelligent matchmaking platform connecting{' '}
                <strong className="text-indigo-400">Founders with Ideas</strong>,{' '}
                <strong className="text-emerald-400">Investors with Money</strong>,{' '}
                <strong className="text-amber-400">Mentors with Knowledge</strong>, and{' '}
                <strong className="text-cyan-400">Team Members with Skills</strong>.
              </p>

              {/* Roles Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs">
                  <span className="text-base mr-1">🚀</span>
                  <span className="font-bold text-indigo-300">Founder</span>
                  <div className="text-[10px] text-slate-400 italic">"I have an IDEA"</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs">
                  <span className="text-base mr-1">💰</span>
                  <span className="font-bold text-emerald-300">Investor</span>
                  <div className="text-[10px] text-slate-400 italic">"I have MONEY"</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs">
                  <span className="text-base mr-1">🧑‍🏫</span>
                  <span className="font-bold text-amber-300">Mentor</span>
                  <div className="text-[10px] text-slate-400 italic">"I have KNOWLEDGE"</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs">
                  <span className="text-base mr-1">👨‍💻</span>
                  <span className="font-bold text-cyan-300">Team</span>
                  <div className="text-[10px] text-slate-400 italic">"I have SKILLS"</div>
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('choose-your-role')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <span>Choose Your Role</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => scrollToSection('how-matching-works')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
                >
                  <span>⚡ Try Match Score Simulator</span>
                </button>
              </div>

              {/* Platform metrics counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-black text-indigo-400">4,850+</div>
                  <div className="text-xs text-slate-400 font-medium">Founders & Ideas</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">$35M+</div>
                  <div className="text-xs text-slate-400 font-medium">Capital Invested</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400">1,200+</div>
                  <div className="text-xs text-slate-400 font-medium">Expert Mentors</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-400">98.4%</div>
                  <div className="text-xs text-slate-400 font-medium">Match Score Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Live Network Matching Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    localhost:3000
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xl">
                        🚀
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">Founder • Alex Rivera</h4>
                        <p className="text-[11px] text-indigo-300 font-medium">"I have an IDEA"</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      IDEA
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xl">
                        💰
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">Investor • Elena Rostova</h4>
                        <p className="text-[11px] text-emerald-300 font-medium">"I have MONEY"</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      MONEY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xl">
                        🧑‍🏫
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">Mentor • Dr. Marcus Vance</h4>
                        <p className="text-[11px] text-amber-300 font-medium">"I have KNOWLEDGE"</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      KNOWLEDGE
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xl">
                        👨‍💻
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">Team Member • Sophia Chen</h4>
                        <p className="text-[11px] text-cyan-300 font-medium">"I have SKILLS"</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      SKILLS
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    ⚡ Neural Cosine Vector Matching Engine Running Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (2)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono animate-bounce">
            <span>HERO SECTION</span>
            <span className="font-bold">↓</span>
            <span>WHAT IS EMS?</span>
          </div>
        </div>

        {/* ==========================================
            3. WHAT IS EMS?
        ========================================== */}
        <section id="what-is-ems" className="py-12 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              PLATFORM OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              What is <span className="text-indigo-400">EMS</span>?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>EMS (Entrepreneur & Startup Matching Platform)</strong> is a specialized,
              data-driven ecosystem engineered to eliminate friction in early-stage venture
              building. By uniting key startup assets—<strong>Idea</strong>, <strong>Money</strong>,{' '}
              <strong>Knowledge</strong>, and <strong>Skills</strong>—into one intelligent matching
              network, EMS empowers founders to build world-class startups efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Intent-Based Role Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every member on EMS defines their primary asset—whether pitching an <strong>IDEA</strong>,
                investing <strong>MONEY</strong>, sharing <strong>KNOWLEDGE</strong>, or contributing <strong>SKILLS</strong>.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Neural Vector Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our recommendation engine analyzes startup domain, stage, required investment, skill
                taxonomy, timezone, and compensation preferences to return percentage-ranked matches.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Seamless Direct Connection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send formal connection requests, exchange pitch decks, engage in real-time encrypted messaging,
                and track team building right on localhost:3000.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (3)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono animate-bounce">
            <span>WHAT IS EMS?</span>
            <span className="font-bold">↓</span>
            <span>HOW EMS WORKS</span>
          </div>
        </div>

        {/* ==========================================
            4. HOW EMS WORKS
        ========================================== */}
        <section id="how-ems-works" className="py-12 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              WORKFLOW FLOWCHART
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              How <span className="text-purple-400">EMS Works</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              A 4-step workflow connecting visionaries, capital, knowledge, and execution talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'STEP 01',
                title: 'Select Role & Asset',
                desc: 'Sign up as Founder (IDEA), Investor (MONEY), Mentor (KNOWLEDGE), or Team Member (SKILLS).',
                icon: '📌',
                color: 'text-indigo-400',
              },
              {
                step: 'STEP 02',
                title: 'Set Target Criteria',
                desc: 'Post your startup listing or specify target funding, domain focus, or technical skill requirements.',
                icon: '⚙️',
                color: 'text-purple-400',
              },
              {
                step: 'STEP 03',
                title: 'AI Neural Matching',
                desc: 'Our engine generates ranked match scores showing exact compatibility percentages.',
                icon: '🧠',
                color: 'text-pink-400',
              },
              {
                step: 'STEP 04',
                title: 'Connect & Collaborate',
                desc: 'Send connection invites, review pitch decks, start direct messaging, and form high-performing teams.',
                icon: '🚀',
                color: 'text-emerald-400',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black tracking-wider ${st.color}`}>{st.step}</span>
                    <span className="text-2xl">{st.icon}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 text-lg font-bold z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (4)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono animate-bounce">
            <span>HOW EMS WORKS</span>
            <span className="font-bold">↓</span>
            <span>CHOOSE YOUR ROLE</span>
          </div>
        </div>

        {/* ==========================================
            5. CHOOSE YOUR ROLE
            🚀 Founder → "I have an IDEA" → Create your startup and find the people you need.
            💰 Investor → "I have MONEY" → Discover startups that match your investment interests.
            🧑‍🏫 Mentor → "I have KNOWLEDGE" → Guide founders with your expertise.
            👨‍💻 Team Member → "I have SKILLS" → Find startups where your skills can contribute.
        ========================================== */}
        <section id="choose-your-role" className="py-12 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              CORE ROLE MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              Choose Your <span className="text-emerald-400">Role</span>
            </h2>
            <p className="text-sm text-slate-300">
              Select a role below to explore how EMS optimizes matching for your primary asset.
            </p>
          </div>

          {/* Role Cards Matrix (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {roles.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${isSelected
                    ? `bg-slate-900 ${r.borderColor} ring-2 ring-indigo-500/60 shadow-2xl ${r.glowColor} scale-[1.03]`
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                >
                  <div>
                    {/* Header Emoji & Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                        {r.emoji}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${r.bgColor} ${r.textColor}`}>
                        {r.asset}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="text-2xl font-black text-slate-100 mb-1">
                      {r.title}
                    </h3>

                    {/* Prominent Quote */}
                    <div className={`text-sm font-extrabold ${r.textColor} mb-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80`}>
                      {r.quote}
                    </div>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                      {r.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAuthenticated) {
                        navigate('/matches');
                      } else {
                        navigate(`/login?role=${r.id}`);
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-white bg-gradient-to-r ${r.color} hover:opacity-90 shadow-lg`}
                  >
                    {isAuthenticated ? `Go to ${r.title} Dashboard →` : `Log In as ${r.title} →`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Detailed Active Role View */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeRoleData.emoji}</span>
                  <div>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${activeRoleData.bgColor} ${activeRoleData.textColor} border ${activeRoleData.borderColor}`}>
                      {activeRoleData.title} • {activeRoleData.asset}
                    </span>
                    <h3 className="text-2xl font-black text-slate-100 mt-1">
                      {activeRoleData.quote}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeRoleData.description}
                </p>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Value Pillars for {activeRoleData.title}s:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeRoleData.keyPillars.map((kp, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-xs font-bold text-slate-200 mb-1">{kp.title}</div>
                        <div className="text-[11px] text-slate-400 leading-snug">{kp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Profile Card */}
              <div className="lg:col-span-5">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400">Sample {activeRoleData.title} Profile</span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {activeRoleData.sampleProfile.matchScore}% Compatibility
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{activeRoleData.emoji}</span>
                      <h4 className="text-base font-bold text-slate-100">
                        {activeRoleData.sampleProfile.name}
                      </h4>
                    </div>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                      {activeRoleData.sampleProfile.role} • {activeRoleData.sampleProfile.company}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                      {activeRoleData.sampleProfile.quote}
                    </div>

                    <div className="mt-2 text-xs font-semibold text-emerald-400">
                      Target: {activeRoleData.sampleProfile.seeking}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeRoleData.sampleProfile.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate('/matches');
                      } else {
                        navigate(`/login?role=${activeRoleData.id}`);
                      }
                    }}
                    className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md"
                  >
                    {isAuthenticated ? `Go to ${activeRoleData.title} Dashboard →` : `Log In as ${activeRoleData.title} (${activeRoleData.asset}) →`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (5)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono animate-bounce">
            <span>CHOOSE YOUR ROLE</span>
            <span className="font-bold">↓</span>
            <span>HOW MATCHING WORKS</span>
          </div>
        </div>

        {/* ==========================================
            6. HOW MATCHING WORKS
        ========================================== */}
        <section id="how-matching-works" className="py-12 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
              SMART VECTOR ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              How <span className="text-cyan-400">Matching Works</span>
            </h2>
            <p className="text-sm text-slate-300">
              Our neural matching engine scores compatibility between Idea, Money, Knowledge, and Skills across four weighted dimensions.
            </p>
          </div>

          {/* Interactive Match Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-5">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>⚡ Interactive Match Simulator</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Startup Domain Vertical
                    </label>
                    <select
                      value={simDomain}
                      onChange={(e) => setSimDomain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>AI & Machine Learning</option>
                      <option>FinTech & Blockchain</option>
                      <option>HealthTech & Bio</option>
                      <option>CleanTech & Energy</option>
                      <option>E-Commerce & SaaS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Venture Stage
                    </label>
                    <select
                      value={simStage}
                      onChange={(e) => setSimStage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>Idea / Concept Stage</option>
                      <option>Pre-Seed Stage</option>
                      <option>Seed Stage</option>
                      <option>Series A Stage</option>
                    </select>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Skill & Expertise Alignment</span>
                      <span className="text-cyan-400 font-bold">{simSkillFit}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={simSkillFit}
                      onChange={(e) => setSimSkillFit(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Capital & Ticket Size Fit</span>
                      <span className="text-emerald-400 font-bold">{simCapitalFit}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={simCapitalFit}
                      onChange={(e) => setSimCapitalFit(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Domain & Market Alignment</span>
                      <span className="text-purple-400 font-bold">{simDomainFit}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={simDomainFit}
                      onChange={(e) => setSimDomainFit(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-slate-950 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Match Score Display */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Match Score Calculation
                </div>

                <div className="relative w-36 h-36 flex items-center justify-center my-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500 transition-all duration-500 ease-out"
                      strokeDasharray={`${calculatedSimScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-100">
                    {calculatedSimScore}%
                  </span>
                </div>

                <div className="text-xs text-indigo-400 font-bold mb-2">
                  {calculatedSimScore >= 90
                    ? '🔥 Exceptional Match Potential!'
                    : calculatedSimScore >= 75
                      ? '✨ Strong Strategic Fit'
                      : '👍 Moderate Compatibility'}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug max-w-xs">
                  Domain: <span className="text-slate-200 font-semibold">{simDomain}</span> | Stage:{' '}
                  <span className="text-slate-200 font-semibold">{simStage}</span>.
                </p>

                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/matches');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
                >
                  {isAuthenticated ? 'View Active Platform Matches →' : 'Log In to View Matches →'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (6)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-mono animate-bounce">
            <span>HOW MATCHING WORKS</span>
            <span className="font-bold">↓</span>
            <span>FEATURES</span>
          </div>
        </div>

        {/* ==========================================
            7. FEATURES
        ========================================== */}
        <section id="features" className="py-12 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold border border-pink-500/20">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              EMS Platform <span className="text-pink-400">Features</span>
            </h2>
            <p className="text-sm text-slate-300">
              Built for speed, security, and high-precision venture matchmaking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💬',
                title: 'Real-Time Direct Messaging',
                desc: 'Chat directly with potential co-founders, investors, and mentors with full online status indicators.',
              },
              {
                icon: '🛡️',
                title: 'Verified Role Credentials',
                desc: 'Identity verification for accredited investors and credential verification for mentors.',
              },
              {
                icon: '📊',
                title: 'Venture Pipeline Analytics',
                desc: 'Track connection requests, profile views, match percentages, and application status in real-time.',
              },
              {
                icon: '📁',
                title: 'Structured Pitch Deck Viewer',
                desc: 'Host secure pitch deck summaries, financial asks, cap tables, and product roadmap items.',
              },
              {
                icon: '🌐',
                title: 'Multi-Language Localization',
                desc: 'Full i18n support for English, Hindi, and Gujarati to connect international startup founders.',
              },
              {
                icon: '⚡',
                title: 'High-Performance API Routes',
                desc: 'Fast RESTful and WebSockets backend running on localhost:3000 & localhost:5000.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (7)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono animate-bounce">
            <span>FEATURES</span>
            <span className="font-bold">↓</span>
            <span>CALL TO ACTION</span>
          </div>
        </div>

        {/* ==========================================
            8. CALL TO ACTION (CTA)
        ========================================== */}
        <section id="cta" className="py-12 border-t border-slate-800/60">
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                READY TO JOIN THE NETWORK?
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
                Join EMS Platform Today
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Whether you have an <strong>IDEA</strong> (Founder), <strong>MONEY</strong> (Investor),{' '}
                <strong>KNOWLEDGE</strong> (Mentor), or <strong>SKILLS</strong> (Team Member), your
                ideal venture match is waiting on EMS.
              </p>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    openAuthModal && openAuthModal('login');
                  }}
                  className="px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all"
                >
                  Log In to Platform →
                </button>
              </div>

              {/* Website Routes Map */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800/60">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Platform Routes Directory (localhost:3000)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
                  <a href="/" className="hover:text-indigo-400">/ (Root Default)</a>
                  <a href="/template" className="hover:text-indigo-400">/template (Info)</a>
                  <a href="/login" className="hover:text-indigo-400">/login (Auth)</a>
                  <a href="/register" className="hover:text-indigo-400">/register (Auth)</a>
                  <a href="/matches" className="hover:text-indigo-400">/matches (Feed)</a>
                  <a href="/founder/dashboard" className="hover:text-indigo-400">/founder/*</a>
                  <a href="/investor/dashboard" className="hover:text-indigo-400">/investor/*</a>
                  <a href="/mentor/dashboard" className="hover:text-indigo-400">/mentor/*</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FLOW ARROW ↓ (8)
        ========================================== */}
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono animate-bounce">
            <span>CALL TO ACTION</span>
            <span className="font-bold">↓</span>
            <span>FOOTER</span>
          </div>
        </div>

        {/* ==========================================
            9. FOOTER
        ========================================== */}
        <footer id="footer" className="py-10 border-t border-slate-800 text-slate-400 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  ⚡
                </div>
                <span className="font-bold text-sm text-slate-200">EMS Platform</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Entrepreneur & Startup Matching Platform connecting Founders, Investors, Mentors, and Skilled Team Members.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3">Roles Matrix</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5">
                  <span className="text-indigo-400">🚀</span> Founder → "I have an IDEA"
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">💰</span> Investor → "I have MONEY"
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">🧑‍🏫</span> Mentor → "I have KNOWLEDGE"
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-cyan-400">👨‍💻</span> Team Member → "I have SKILLS"
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3">Platform Routes</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-400">/ (Default Root)</button></li>
                <li><button onClick={() => navigate('/template')} className="hover:text-indigo-400">/template (Overview)</button></li>
                <li><button onClick={() => navigate('/matches')} className="hover:text-indigo-400">/matches (Feed)</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-indigo-400">/register & /login</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-3">System Status</h4>
              <p className="text-slate-400 mb-2">Host: http://localhost:3000</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Atlas Connected
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© 2026 EMS — Entrepreneur & Startup Matching Platform. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#hero" className="hover:text-slate-300">Back to Top ↑</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default EmsTemplatePage;
