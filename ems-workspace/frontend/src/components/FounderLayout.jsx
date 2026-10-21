import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FounderSidebar from './FounderSidebar';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function FounderLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarOpen, user } = useClientStore();
  const { t } = useLanguage();

  const currentPath = location.pathname.toLowerCase();

  // Route map for top app bar titles
  const pageTitles = {
    '/founder/dashboard': {
      title: 'Venture Dashboard 🚀',
      desc: 'Startup metrics, pitch deck views & AI match recommendations',
      icon: '🚀',
    },
    '/founder/my-listings': {
      title: 'My Startup Listings 💡',
      desc: 'Manage active pitch decks, capital asks & product details',
      icon: '💡',
    },
    '/founder/add-listing': {
      title: 'Post New Startup Idea ➕',
      desc: 'Create a new venture listing to seek funding & co-founders',
      icon: '➕',
    },
    '/founder/matches': {
      title: 'AI Network Matches 🎯',
      desc: 'Matched Investors, Mentors & Technical Teammates',
      icon: '🎯',
    },
    '/founder/connections': {
      title: 'Investor Connections 🤝',
      desc: 'Manage active founder connections & pitch discussions',
      icon: '🤝',
    },
    '/founder/requests': {
      title: 'Inbound Invites & Requests 📩',
      desc: 'Received investment interest & mentor connection invites',
      icon: '📩',
    },
    '/founder/messages': {
      title: 'Direct Messages 💬',
      desc: 'Real-time encrypted messaging with investors & teammates',
      icon: '💬',
    },
    '/founder/profile': {
      title: 'Founder Profile 👤',
      desc: 'Update your venture headline, bio & equity breakdown',
      icon: '👤',
    },
  };

  const currentPage = pageTitles[currentPath] || {
    title: 'Founder Portal 💡',
    desc: 'Turn ideas into scalable tech ventures',
    icon: '💡',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background lighting with Indigo / Founder Feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        {/* Founder Sidebar */}
        <FounderSidebar />

        {/* Main Workspace Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Founder App Bar */}
          <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-xl border-b border-indigo-500/30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Hamburger toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-slate-800 transition-colors"
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
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      FOUNDER
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200/70 hidden sm:block font-medium">
                    {currentPage.desc}
                  </p>
                </div>
              </div>

              {/* Right Quick Controls */}
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>💡 Idea Active</span>
                </span>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-indigo-500/30 rounded-xl p-1 shadow-inner">
                  {[
                    { path: '/founder/dashboard', icon: '🚀', label: 'Venture' },
                    { path: '/founder/my-listings', icon: '💡', label: 'Listings' },
                    { path: '/founder/matches', icon: '🎯', label: 'Matches' },
                    { path: '/founder/connections', icon: '🤝', label: 'Network' },
                  ].map((tab) => {
                    const isActive = currentPath === tab.path.toLowerCase();
                    return (
                      <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
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

export default FounderLayout;
