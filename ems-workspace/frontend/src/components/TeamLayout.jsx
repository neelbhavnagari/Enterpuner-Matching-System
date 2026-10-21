import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeamSidebar from './TeamSidebar';
import useClientStore from '../store/useClientStore';

export function TeamLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarOpen } = useClientStore();

  const currentPath = location.pathname.toLowerCase();

  const pageTitles = {
    '/team/dashboard': {
      title: 'Talent & Skills Hub 👨‍💻',
      desc: 'Discover early-stage startups seeking your technical execution skills',
      icon: '👨‍💻',
    },
    '/team/listings': {
      title: 'Startup Opportunities 🚀',
      desc: 'Browse startup listings offering co-founder equity & salary',
      icon: '🚀',
    },
    '/team/skills': {
      title: 'My Skill Matrix 🛠️',
      desc: 'Configure tech stack, frameworks, UI/UX tools & experience level',
      icon: '🛠️',
    },
    '/team/matches': {
      title: 'AI Team Matches 🎯',
      desc: 'Vector-matched startup co-founder roles matching your skills',
      icon: '🎯',
    },
    '/team/connections': {
      title: 'Founder Network 🤝',
      desc: 'Manage active connected founders & product leaders',
      icon: '🤝',
    },
    '/team/requests': {
      title: 'Recruitment Invites 📩',
      desc: 'Inbound founder recruitment invites & meeting requests',
      icon: '📩',
    },
    '/team/messages': {
      title: 'Direct Messages 💬',
      desc: 'Real-time encrypted chats with startup founders & engineers',
      icon: '💬',
    },
    '/team/profile': {
      title: 'Talent Profile 👤',
      desc: 'Manage technical portfolio, Github links & co-founder bio',
      icon: '👤',
    },
  };

  const currentPage = pageTitles[currentPath] || {
    title: 'Talent Portal 👨‍💻',
    desc: 'Bring execution & technical skills to innovative startups',
    icon: '👨‍💻',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        <TeamSidebar />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white"
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
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      TEAM MEMBER
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-200/70 hidden sm:block font-medium">
                    {currentPage.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>🛠️ Skills Active</span>
                </span>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-1 shadow-inner">
                  {[
                    { path: '/team/dashboard', icon: '👨‍💻', label: 'Talent' },
                    { path: '/team/listings', icon: '🚀', label: 'Jobs' },
                    { path: '/team/matches', icon: '🎯', label: 'Matches' },
                    { path: '/team/connections', icon: '🤝', label: 'Network' },
                  ].map((tab) => {
                    const isActive = currentPath === tab.path.toLowerCase();
                    return (
                      <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
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

          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TeamLayout;
