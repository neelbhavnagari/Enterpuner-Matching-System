import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import useLanguage from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { Button } from './ui/Button';

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, theme, toggleTheme, logout, openAuthModal } = useClientStore();
  const { t } = useLanguage();

  return (
    <header className="glass-nav rounded-2xl px-6 py-4 mb-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Branding */}
      <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
        <motion.div
          whileHover={{ rotate: 12, scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-glow"
        >
          ⚡
        </motion.div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t('app.subtitle')}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/template')}
          className="border-indigo-500/30 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10"
        >
          ⚡ EMS Overview
        </Button>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Toggle Button */}
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ ' + t('app.theme.light') : '🌙 ' + t('app.theme.dark')}
        </Button>

        {/* User Session */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 bg-slate-950/60 p-1.5 pr-3 rounded-full border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold block leading-none text-slate-200">{user.name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
                {user.provider === 'google' ? 'G Google Account' : '● Active'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-rose-400 px-2 py-1">
              ✕
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                navigate('/login');
                openAuthModal('login');
              }}
            >
              {t('auth.login')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
