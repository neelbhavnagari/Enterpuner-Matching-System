import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MentorSidebar from './MentorSidebar';
import useClientStore from '../store/useClientStore';

export function MentorLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarOpen } = useClientStore();

  const currentPath = location.pathname.toLowerCase();

  const pageTitles = {
    '/mentor/dashboard': {
      title: 'Advisory Dashboard 🧑‍🏫',
      desc: 'Guide early-stage founders & review advisory requests',
      icon: '🧑‍🏫',
    },
    '/mentor/listings': {
      title: 'Founder Listings 💡',
      desc: 'Browse innovative startup listings seeking expert mentorship',
      icon: '💡',
    },
    '/mentor/expertise': {
      title: 'Expertise & Advisory Mandate 🧭',
      desc: 'Configure your advisory domain (GTM, Product, Legal, Tech)',
      icon: '🧭',
    },
    '/mentor/matches': {
      title: 'AI Advisory Matches 🎯',
      desc: 'Vector-matched founders matching your mentorship profile',
      icon: '🎯',
    },
    '/mentor/connections': {
      title: 'Advisory Network 🤝',
      desc: 'Manage active advisee founders & startup connections',
      icon: '🤝',
    },
    '/mentor/requests': {
      title: 'Mentorship Requests 📩',
      desc: 'Inbound advisory requests & founder pitch review invites',
      icon: '📩',
    },
    '/mentor/messages': {
      title: 'Direct Messages 💬',
      desc: 'Real-time encrypted advisory chats with founders',
      icon: '💬',
    },
    '/mentor/profile': {
      title: 'Mentor Profile 👤',
      desc: 'Manage your advisory bio, career achievements & track record',
      icon: '👤',
    },
  };

  const currentPage = pageTitles[currentPath] || {
    title: 'Mentor Portal 🧑‍🏫',
    desc: 'Share strategic wisdom & guide next-gen founders',
    icon: '🧑‍🏫',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        <MentorSidebar />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-xl border-b border-amber-500/30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 hover:text-white"
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
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      MENTOR
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/70 hidden sm:block font-medium">
                    {currentPage.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>🧭 Knowledge Active</span>
                </span>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-amber-500/30 rounded-xl p-1 shadow-inner">
                  {[
                    { path: '/mentor/dashboard', icon: '🧑‍🏫', label: 'Advisory' },
                    { path: '/mentor/listings', icon: '💡', label: 'Founders' },
                    { path: '/mentor/matches', icon: '🎯', label: 'Matches' },
                    { path: '/mentor/connections', icon: '🤝', label: 'Network' },
                  ].map((tab) => {
                    const isActive = currentPath === tab.path.toLowerCase();
                    return (
                      <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
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

export default MentorLayout;
