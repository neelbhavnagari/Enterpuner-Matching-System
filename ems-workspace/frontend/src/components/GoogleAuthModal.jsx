import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadGsiScript, getStoredGoogleClientId, saveGoogleClientId, decodeGoogleJwt } from '../services/googleAuthService';
import { googleAuthApi } from '../services/apiClient';
import useClientStore from '../store/useClientStore';

const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const ROLES = [
  { id: 'founder', label: 'Founder', dot: '#f0cf8c' },
  { id: 'investor', label: 'Investor', dot: '#4fd8a8' },
  { id: 'mentor', label: 'Mentor', dot: '#7c6cf0' },
  { id: 'team', label: 'Team Member', dot: '#e0879a' }
];

export default function GoogleAuthModal({ isOpen, onClose, onSuccess, initialRole = 'founder' }) {
  const { login } = useClientStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState(initialRole);
  const [clientId, setClientId] = useState(getStoredGoogleClientId());
  const [showConfig, setShowConfig] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  
  const gsiContainerRef = useRef(null);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  // Attempt to initialize GIS script if Client ID is set
  useEffect(() => {
    if (!isOpen) return;
    setError('');

    let isMounted = true;
    loadGsiScript()
      .then((accounts) => {
        if (!isMounted) return;
        setGsiReady(true);
        const currentClientId = getStoredGoogleClientId();
        if (currentClientId && accounts?.id) {
          try {
            accounts.id.initialize({
              client_id: currentClientId,
              callback: handleGsiResponse
            });

            if (gsiContainerRef.current) {
              accounts.id.renderButton(gsiContainerRef.current, {
                theme: 'filled_black',
                size: 'large',
                text: 'continue_with',
                shape: 'pill',
                width: 280
              });
            }
          } catch (e) {
            console.warn('Google Identity initialization error:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('GSI script error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, clientId]);

  const handleGsiResponse = async (response) => {
    if (!response || !response.credential) {
      setError('Google Sign-In credential not received.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const decoded = decodeGoogleJwt(response.credential);
      const googleEmail = decoded?.email || '';
      const googleName = decoded?.name || googleEmail.split('@')[0];
      const googleAvatar = decoded?.picture || null;

      const res = await googleAuthApi({
        credential: response.credential,
        email: googleEmail,
        name: googleName,
        avatar: googleAvatar,
        role: role
      });

      if (res?.user && res?.token) {
        login(res.user, res.token);
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setError('Failed to authenticate Google user with backend.');
      }
    } catch (err) {
      setError(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid Google email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address (e.g., user@gmail.com).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedName = name.trim() || email.trim().split('@')[0];
      const defaultAvatar = avatar.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=4285f4&color=fff`;

      const res = await googleAuthApi({
        email: email.trim().toLowerCase(),
        name: formattedName,
        avatar: defaultAvatar,
        role: role
      });

      if (res?.user && res?.token) {
        login(res.user, res.token);
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setError('Failed to authenticate Google user.');
      }
    } catch (err) {
      setError(err.message || 'Google Auth Error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    saveGoogleClientId(clientId);
    setShowConfig(false);
    setError('Saved Google Client ID! Try signing in with native Google popup now.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 p-6 shadow-2xl text-slate-100 font-sans"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            ✕
          </button>

          {/* Header with Google logo */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/15 shadow-inner">
              <GoogleIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Google Sign-In</h3>
              <p className="text-xs text-slate-400">Dynamic Google Account Authentication</p>
            </div>
          </div>

          {error && (
            <div className={`mb-4 rounded-lg p-3 text-xs border ${error.includes('Saved') ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/60 border-rose-500/30 text-rose-300'}`}>
              {error}
            </div>
          )}

          {/* Native Google SDK Button Container if Client ID is configured */}
          {clientId && gsiReady && (
            <div className="mb-5 flex flex-col items-center justify-center gap-2 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div ref={gsiContainerRef} className="min-h-[44px]"></div>
              <span className="text-[10px] text-slate-400">Official Google OAuth 2.0 Popup Active</span>
            </div>
          )}

          {/* Dynamic Google User Login Form */}
          <form onSubmit={handleDynamicSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.founder@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (from Google Profile)</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      role === r.id
                        ? 'border-indigo-500 bg-indigo-500/15 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.dot }} />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] disabled:opacity-50 transition"
            >
              {loading ? (
                <span>Authenticating with Google...</span>
              ) : (
                <>
                  <GoogleIcon size={18} />
                  <span>Sign In with Dynamic Google User</span>
                </>
              )}
            </button>
          </form>

          {/* OAuth Client ID Configuration option */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline transition"
            >
              {showConfig ? 'Hide Google Cloud OAuth Client ID settings' : '⚡ Configure Google Cloud OAuth Client ID (Native Popup)'}
            </button>

            {showConfig && (
              <form onSubmit={handleSaveClientId} className="mt-3 text-left space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400">VITE_GOOGLE_CLIENT_ID</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-abc...apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Save Client ID
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveGoogleClientId('');
                      setClientId('');
                    }}
                    className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-400 hover:bg-slate-700"
                  >
                    Clear
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
