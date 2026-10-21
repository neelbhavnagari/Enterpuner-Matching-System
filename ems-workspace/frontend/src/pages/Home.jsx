import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AnimatedFeed from '../features/matching/AnimatedFeed';
import UserProfile from '../features/profiles/UserProfile';
import ChatWindow from '../features/messaging/ChatWindow';
import PageTransition from '../components/ui/PageTransition';
import InlineAuthForm from '../components/InlineAuthForm';
import ConnectionsPage from '../features/connections/ConnectionsPage';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    isAuthenticated,
    sidebarCollapsed,
    setSidebarOpen,
    user
  } = useClientStore();
  const { t } = useLanguage();

  // Keep Zustand activeTab in sync with browser URL pathname
  useEffect(() => {
    const rawPath = location.pathname.replace(/^\//, '').toLowerCase();
    const validTabs = ['matches', 'connections', 'profile', 'messages'];
    if (validTabs.includes(rawPath)) {
      if (activeTab !== rawPath) {
        setActiveTab(rawPath);
      }
    } else if (location.pathname === '/') {
      if (activeTab !== 'matches') {
        setActiveTab('matches');
      }
    }
  }, [location.pathname, activeTab, setActiveTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const tabTitles = {
    matches: {
      title: t('nav.matches') || 'Network Matches',
      desc: 'AI-matched entrepreneur listings, founders & investors'
    },
    connections: {
      title: 'Connections',
      desc: 'Manage your professional network, requests & invitations'
    },
    profile: {
      title: t('nav.profile') || 'Registered Profile',
      desc: 'Update your venture headline, expertise, bio & skills'
    },
    messages: {
      title: t('nav.messages') || 'Direct Messages',
      desc: 'Real-time chats and discussions with your network'
    },
  };

  const currentTab = tabTitles[activeTab] || tabTitles.matches;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Unauthenticated: show top header & inline form ── */}
      {!isAuthenticated ? (
        <>
          <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
            <div className="max-w-7xl mx-auto">
              <Header />
            </div>
          </div>
          <InlineAuthForm />
        </>
      ) : (
        /* ── Authenticated: Modern Sidebar Dashboard Layout ── */
        <div className="flex min-h-screen w-full">
          {/* Responsive Sidebar (Desktop fixed & Mobile drawer) */}
          <Sidebar />

          {/* Main Dashboard Area */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            {/* Top Dashboard App Bar */}
            <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Mobile hamburger menu toggle */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Open sidebar navigation"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                      {currentTab.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      {currentTab.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Real-time status badge */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    MongoDB Atlas
                  </span>

                  {/* Active tab quick switcher */}
                  <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 rounded-xl p-1">
                    {[
                      { id: 'matches', icon: '🎯', label: 'Matches' },
                      { id: 'connections', icon: '🤝', label: 'Connections' },
                      { id: 'profile', icon: '👤', label: 'Profile' },
                      { id: 'messages', icon: '💬', label: 'Messages' },
                    ].map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
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

            {/* Page content */}
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-7xl mx-auto">
                <PageTransition activeKey={activeTab}>
                  {activeTab === 'matches'     && <AnimatedFeed />}
                  {activeTab === 'connections' && <ConnectionsPage />}
                  {activeTab === 'profile'     && <UserProfile />}
                  {activeTab === 'messages'    && <ChatWindow />}
                </PageTransition>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
