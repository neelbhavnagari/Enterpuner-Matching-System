import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { RoleBadge } from './ui/RoleBadge';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
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

  const navItems = [
    {
      id: 'matches',
      label: t('nav.matches') || 'Matches',
      icon: '🎯',
      desc: 'Discover & AI Matches',
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: '🤝',
      desc: 'Network & Requests',
    },
    {
      id: 'profile',
      label: t('nav.profile') || 'Profile',
      icon: '👤',
      desc: 'View & Edit Profile',
    },
    {
      id: 'messages',
      label: t('nav.messages') || 'Messages',
      icon: '💬',
      desc: 'Direct Messages',
    },
    {
      id: 'template',
      label: 'EMS Overview',
      icon: '⚡',
      desc: 'Website & Roles Map',
    },
  ];

  const currentPath = location.pathname.replace(/^\//, '').toLowerCase();
  const currentActive = ['matches', 'connections', 'profile', 'messages', 'template', 'info', 'about'].includes(currentPath)
    ? (currentPath === 'info' || currentPath === 'about' ? 'template' : currentPath)
    : activeTab;

  const handleNavClick = (id) => {
    setActiveTab(id);
    navigate(`/${id}`);
    if (sidebarOpen) {
      setSidebarOpen(false); // Auto-close on mobile
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* ── Top Header / Branding ── */}
      <div>
        <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 flex-shrink-0 cursor-pointer"
              onClick={() => handleNavClick('matches')}
            >
              ⚡
            </motion.div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-base font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent leading-none">
                  EMS Network
                </h1>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-1">
                  Founder & Investor Hub
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 items-center justify-center text-xs font-bold transition-all border border-slate-700/60"
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

        {/* ── User Quick Profile Badge ── */}
        {user && (
          <div className={`p-3.5 mx-3 my-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 transition-all ${
            sidebarCollapsed ? 'justify-center p-2 mx-2' : ''
          }`}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-md overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-100 truncate">{user.name || 'Member'}</p>
                </div>
                <div className="mt-1">
                  <RoleBadge role={user.role || 'founder'} size="sm" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation Links ── */}
        <nav className="px-3 space-y-1.5 pt-1">
          {navItems.map((item) => {
            const isActive = currentActive === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                } ${sidebarCollapsed ? 'justify-center px-2 py-3' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 border border-indigo-500/50 rounded-xl shadow-md shadow-indigo-500/20 -z-10"
                  />
                )}
                <span className="text-base flex-shrink-0">{item.icon}</span>

                {!sidebarCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <span className="block leading-none">{item.label}</span>
                    <span className={`text-[10px] font-medium block mt-1 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {item.desc}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom Controls ── */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Language selector */}
        {!sidebarCollapsed ? (
          <div className="px-1 py-1">
            <LanguageSelector className="w-full" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <LanguageSelector className="scale-90" />
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/60 ${
            sidebarCollapsed ? 'justify-center px-2' : ''
          }`}
        >
          <span className="text-sm">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {!sidebarCollapsed && (
            <span>{theme === 'dark' ? t('app.theme.light') : t('app.theme.dark')}</span>
          )}
        </button>

        {/* Sign Out */}
        <button
          onClick={logout}
          title="Sign Out"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 ${
            sidebarCollapsed ? 'justify-center px-2' : ''
          }`}
        >
          <span className="text-sm">🚪</span>
          {!sidebarCollapsed && <span>{t('auth.logout') || 'Sign Out'}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Fixed Sidebar ── */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 bg-slate-900/95 border-r border-slate-800/90 backdrop-blur-xl z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer Sidebar & Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50 shadow-2xl overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
