import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function InvestorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapse,
  } = useClientStore();

  const { t } = useLanguage();

  // Investor-specific navigation items centered around Money, Capital & Deal Flow
  const investorNavItems = [
    {
      path: '/investor/dashboard',
      label: 'Deal Flow Dashboard',
      icon: '💼',
      badge: 'Live Stream',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'Vetted startup pitches & feed',
    },
    {
      path: '/investor/listings',
      label: 'Startup Listings',
      icon: '📈',
      badge: 'Browse',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      desc: 'Filter startups seeking capital',
    },
    {
      path: '/investor/matches',
      label: 'AI Deal Matches',
      icon: '🎯',
      badge: '98% Match',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc: 'Vector-matched investment deals',
    },
    {
      path: '/investor/connections',
      label: 'Founder Connections',
      icon: '🤝',
      badge: 'Network',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Active connected founders',
    },
    {
      path: '/investor/requests',
      label: 'Pitch Deck Requests',
      icon: '📩',
      badge: 'Inbound',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Founder meeting & deck invites',
    },
    {
      path: '/investor/messages',
      label: 'Direct Messages',
      icon: '💬',
      badge: 'Encrypted',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      desc: 'Instant chats with founders',
    },
    {
      path: '/investor/profile',
      label: 'Investor Profile',
      icon: '👤',
      badge: 'Accredited',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'Bio, ticket size & 10 criteria',
    },
  ];

  const currentPath = location.pathname.toLowerCase();

  const handleNavClick = (path) => {
    navigate(path);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 border-r border-emerald-500/30">
      {/* ── Top Header / Investor Money Branding ── */}
      <div>
        <div className="flex items-center justify-between p-4 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30 flex-shrink-0 cursor-pointer"
              onClick={() => handleNavClick('/investor/dashboard')}
            >
              💰
            </motion.div>

            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-base font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent leading-none">
                  EMS Investor Hub
                </h1>
                <span className="text-[10px] text-emerald-300/80 font-bold tracking-wider uppercase block mt-1">
                  💵 "I HAVE MONEY" • CAPITAL FLOW
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 items-center justify-center text-xs font-bold transition-all"
          >
            {sidebarCollapsed ? '»' : '«'}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* ── Investor User Profile Card (Clickable to open /investor/profile) ── */}
        {user && (
          <div
            onClick={() => handleNavClick('/investor/profile')}
            className={`p-3 mx-3 my-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 hover:border-emerald-400/60 flex items-center gap-3 transition-all cursor-pointer backdrop-blur-md shadow-lg group ${
              sidebarCollapsed ? 'justify-center p-2 mx-2' : ''
            }`}
            title="Click to view & edit Investor Profile"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-md overflow-hidden border border-emerald-400/40">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'I'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-100 truncate">{user.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    INVESTOR
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300/80 truncate font-mono">
                  {user.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    💎 Accredited Capital
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Money & Capital Metrics Card (Desktop view) ── */}
        {!sidebarCollapsed && (
          <div className="mx-3 mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 mb-1.5">
              <span>💼 Investor Capital Summary</span>
              <span className="text-amber-400">💵</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Check Size</span>
                <span className="font-bold text-emerald-400">$25K–$250K</span>
              </div>
              <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Deal Stage</span>
                <span className="font-bold text-teal-300">Seed & Pre-Seed</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Investor Navigation Links ── */}
        <nav className="px-3 space-y-1.5">
          {investorNavItems.map((item) => {
            const isActive = currentPath === item.path.toLowerCase();

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/50 hover:border-emerald-500/20 border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <div className="text-left truncate">
                      <span className="block font-bold leading-tight">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal block leading-tight">
                        {item.desc}
                      </span>
                    </div>
                  )}
                </div>

                {!sidebarCollapsed && (
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border ml-2 flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Footer Actions (Theme Toggle & Logout) ── */}
      <div className="p-3 border-t border-emerald-500/20 space-y-2">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>{theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
              title="Logout session"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
              title="Logout"
            >
              🚪
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar Container */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation Backdrop & Sheet */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default InvestorSidebar;
