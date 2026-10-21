import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';

export function MentorSidebar() {
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

  const mentorNavItems = [
    {
      path: '/mentor/dashboard',
      label: 'Advisory Dashboard',
      icon: '🧑‍🏫',
      badge: 'Guidance',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Founder advising & requests',
    },
    {
      path: '/mentor/listings',
      label: 'Founder Listings',
      icon: '💡',
      badge: 'Startups',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      desc: 'Explore founders seeking guidance',
    },
    {
      path: '/mentor/expertise',
      label: 'Expertise & Advisory',
      icon: '🧭',
      badge: 'Domain',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Configure advisory focus',
    },
    {
      path: '/mentor/matches',
      label: 'AI Match Engine',
      icon: '🎯',
      badge: '94% Fit',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc: 'Matched founders seeking advice',
    },
    {
      path: '/mentor/connections',
      label: 'Advisory Connections',
      icon: '🤝',
      badge: 'Network',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Active advisee founders',
    },
    {
      path: '/mentor/requests',
      label: 'Mentorship Requests',
      icon: '📩',
      badge: 'Inbound',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      desc: 'Founder advisory requests',
    },
    {
      path: '/mentor/messages',
      label: 'Direct Messages',
      icon: '💬',
      badge: 'Real-time',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Chat with founders & mentors',
    },
    {
      path: '/mentor/profile',
      label: 'Mentor Profile',
      icon: '👤',
      badge: 'Expert',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Advisory bio & credentials',
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
    <div className="flex flex-col h-full justify-between select-none bg-gradient-to-b from-slate-950 via-amber-950/40 to-slate-950 border-r border-amber-500/30">
      <div>
        <div className="flex items-center justify-between p-4 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/30 flex-shrink-0 cursor-pointer"
              onClick={() => handleNavClick('/mentor/dashboard')}
            >
              🧑‍🏫
            </motion.div>

            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-base font-black bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent leading-none">
                  EMS Mentor Hub
                </h1>
                <span className="text-[10px] text-amber-300/80 font-bold tracking-wider uppercase block mt-1">
                  🧑‍🏫 "I HAVE KNOWLEDGE" • ADVISORY
                </span>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/30 items-center justify-center text-xs font-bold transition-all"
          >
            {sidebarCollapsed ? '»' : '«'}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {user && (
          <div
            onClick={() => handleNavClick('/mentor/profile')}
            className={`p-3 mx-3 my-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 hover:border-amber-400/60 flex items-center gap-3 transition-all cursor-pointer backdrop-blur-md shadow-lg group ${
              sidebarCollapsed ? 'justify-center p-2 mx-2' : ''
            }`}
            title="Click to view & edit Mentor Profile"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center justify-center shadow-md overflow-hidden border border-amber-400/40">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'M'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-100 truncate">{user.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    MENTOR
                  </span>
                </div>
                <p className="text-[10px] text-amber-300/80 truncate font-mono">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        <nav className="px-3 space-y-1.5">
          {mentorNavItems.map((item) => {
            const isActive = currentPath === item.path.toLowerCase();

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg shadow-amber-600/30 border border-amber-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-amber-950/50 hover:border-amber-500/20 border border-transparent'
                }`}
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

      <div className="p-3 border-t border-amber-500/20 space-y-2">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
            </button>
            <button
              onClick={logout}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
            >
              <span>🚪 Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={logout} className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
              🚪
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
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

export default MentorSidebar;
