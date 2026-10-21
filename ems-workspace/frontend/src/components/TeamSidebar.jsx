import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';

export function TeamSidebar() {
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

  const teamNavItems = [
    {
      path: '/team/dashboard',
      label: 'Talent & Skills Hub',
      icon: '👨‍💻',
      badge: 'Skills',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Startup team matches & feed',
    },
    {
      path: '/team/listings',
      label: 'Startup Listings',
      icon: '🚀',
      badge: 'Positions',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      desc: 'Explore startups seeking skills',
    },
    {
      path: '/team/skills',
      label: 'My Skill Matrix',
      icon: '🛠️',
      badge: 'Tech Stack',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Configure languages & tools',
    },
    {
      path: '/team/matches',
      label: 'AI Team Matches',
      icon: '🎯',
      badge: '97% Fit',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      desc: 'Matched startup co-founder roles',
    },
    {
      path: '/team/connections',
      label: 'Founder Connections',
      icon: '🤝',
      badge: 'Network',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      desc: 'Active connected founders',
    },
    {
      path: '/team/requests',
      label: 'Recruitment Invites',
      icon: '📩',
      badge: 'Inbound',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Offers & meeting requests',
    },
    {
      path: '/team/messages',
      label: 'Direct Messages',
      icon: '💬',
      badge: 'Real-time',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Chat with founders & engineers',
    },
    {
      path: '/team/profile',
      label: 'Talent Profile',
      icon: '👤',
      badge: 'Verified',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Manage portfolio & resume',
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
    <div className="flex flex-col h-full justify-between select-none bg-gradient-to-b from-slate-950 via-cyan-950/40 to-slate-950 border-r border-cyan-500/30">
      <div>
        <div className="flex items-center justify-between p-4 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/30 flex-shrink-0 cursor-pointer"
              onClick={() => handleNavClick('/team/dashboard')}
            >
              👨‍💻
            </motion.div>

            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-base font-black bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent leading-none">
                  EMS Talent Hub
                </h1>
                <span className="text-[10px] text-cyan-300/80 font-bold tracking-wider uppercase block mt-1">
                  👨‍💻 "I HAVE SKILLS" • EXECUTION
                </span>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 items-center justify-center text-xs font-bold transition-all"
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
            className={`p-3 mx-3 my-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 transition-all backdrop-blur-md shadow-lg ${
              sidebarCollapsed ? 'justify-center p-2 mx-2' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md overflow-hidden border border-cyan-400/40">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'T'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-100 truncate">{user.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    TEAM
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300/80 truncate font-mono">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        <nav className="px-3 space-y-1.5">
          {teamNavItems.map((item) => {
            const isActive = currentPath === item.path.toLowerCase();

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-950/50 hover:border-cyan-500/20 border border-transparent'
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

      <div className="p-3 border-t border-cyan-500/20 space-y-2">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <button onClick={toggleTheme} className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
              <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
            </button>
            <button onClick={logout} className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20">
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

export default TeamSidebar;
