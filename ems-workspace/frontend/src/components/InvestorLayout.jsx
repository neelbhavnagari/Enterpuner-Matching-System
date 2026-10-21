import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvestorSidebar from './InvestorSidebar';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function InvestorLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarOpen, user } = useClientStore();
  const { t } = useLanguage();

  const currentPath = location.pathname.toLowerCase();

  // Route map for top app bar titles
  const pageTitles = {
    '/investor/dashboard': {
      title: 'Deal Flow Dashboard 💼',
      desc: 'Discover & review high-yield early stage startup pitches',
      icon: '💼',
    },
    '/investor/listings': {
      title: 'Startup Listings 📈',
      desc: 'Filter startups seeking seed capital & technical partners',
      icon: '📈',
    },
    '/investor/matches': {
      title: 'AI Deal Matches 🎯',
      desc: 'Vector-matched investments based on ticket size & stage preferences',
      icon: '🎯',
    },
    '/investor/connections': {
      title: 'Founder Connections 🤝',
      desc: 'Manage your active network of startup founders & dealmakers',
      icon: '🤝',
    },
    '/investor/requests': {
      title: 'Pitch Deck Requests 📩',
      desc: 'Inbound pitch deck submissions & meeting invitations',
      icon: '📩',
    },
    '/investor/messages': {
      title: 'Direct Messages 💬',
      desc: 'Real-time encrypted chats with startup founders & syndicate partners',
      icon: '💬',
    },
    '/investor/preferences': {
      title: 'Investment Mandate ⚙️',
      desc: 'Configure check size ($25K–$500K), funding stage & sector focus',
      icon: '⚙️',
    },
    '/investor/profile': {
      title: 'Investor Profile 👤',
      desc: 'Manage accredited investor status, syndicate info & bio',
      icon: '👤',
    },
  };

  const currentPage = pageTitles[currentPath] || {
    title: 'Investor Portal 💰',
    desc: 'Capital deployment & deal flow management',
    icon: '💰',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background lighting with Money / Emerald Feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        {/* Investor Sidebar */}
        <InvestorSidebar />

        {/* Main Workspace Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Investor App Bar */}
          <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-xl border-b border-emerald-500/30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Hamburger toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-100 leading-tight flex items-center gap-1.5">
                      <span>{currentPage.title}</span>
                    </h2>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      INVESTOR
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/70 hidden sm:block font-medium">
                    {currentPage.desc}
                  </p>
                </div>
              </div>

              {/* Right Quick Controls & Live Status */}
              <div className="flex items-center gap-3">
                {/* Capital Status Badge */}
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>💰 Capital Available</span>
                </span>

                {/* Quick Nav Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-900/90 border border-emerald-500/30 rounded-xl p-1 shadow-inner">
                  {[
                    { path: '/investor/dashboard', icon: '💼', label: 'Deal Flow' },
                    { path: '/investor/listings', icon: '📈', label: 'Listings' },
                    { path: '/investor/matches', icon: '🎯', label: 'Matches' },
                    { path: '/investor/connections', icon: '🤝', label: 'Network' },
                  ].map((tab) => {
                    const isActive = currentPath === tab.path.toLowerCase();
                    return (
                      <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                        title={tab.label}
                      >
                        <span>{tab.icon}</span>
                        <span className="hidden md:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content View */}
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default InvestorLayout;
