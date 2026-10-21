import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginApi, registerApi, googleAuthApi } from '../services/apiClient';
import useClientStore from '../store/useClientStore';
import GoogleAuthModal from './GoogleAuthModal';

/* ─── Validation ─── */
const validate = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'At least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Letters and spaces only';
    return null;
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email address';
    return null;
  },
  password: (v, isSignup) => {
    if (!v) return 'Password is required';
    if (isSignup) {
      if (v.length < 8) return 'Minimum 8 characters';
      if (!/[A-Z]/.test(v)) return 'At least one uppercase letter';
      if (!/[0-9]/.test(v)) return 'At least one number';
    }
    return null;
  },
  confirm: (v, pw) => {
    if (!v) return 'Please confirm your password';
    if (v !== pw) return 'Passwords do not match';
    return null;
  },
};

function pwStrength(pw) {
  let s = 0;
  if (!pw) return s;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

/* ─── Icons ─── */
const EyeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18"/><path d="M10.6 5.2C11 5.1 11.5 5 12 5c7 0 10.5 7 10.5 7-.6 1.2-1.7 2.8-3.3 4.2M6.6 6.6C3.7 8.3 1.5 12 1.5 12s3.5 7 10.5 7c1.7 0 3.2-.4 4.4-1"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

/* ─── Role config ─── */
const ROLES = [
  { id: 'founder',  label: 'Founder',     icon: '🚀', dot: '#f0cf8c', border: 'rgba(240,207,140,0.35)', bg: 'rgba(240,207,140,0.08)', text: '#f0cf8c' },
  { id: 'investor', label: 'Investor',    icon: '💼', dot: '#4fd8a8', border: 'rgba(79,216,168,0.35)',   bg: 'rgba(79,216,168,0.08)',  text: '#4fd8a8' },
  { id: 'mentor',   label: 'Mentor',      icon: '🎓', dot: '#7c6cf0', border: 'rgba(124,108,240,0.35)', bg: 'rgba(124,108,240,0.08)', text: '#7c6cf0' },
  { id: 'team',     label: 'Team',        icon: '⚡', dot: '#e0879a', border: 'rgba(224,135,154,0.35)', bg: 'rgba(224,135,154,0.08)', text: '#e0879a' },
];

const STRENGTH = {
  1: { label: 'Weak',   color: '#e0879a' },
  2: { label: 'Fair',   color: '#d9b46a' },
  3: { label: 'Good',   color: '#7c6cf0' },
  4: { label: 'Strong', color: '#4fd8a8' },
};

/* ─── Inline field error ─── */
const FieldErr = ({ msg, show }) => (
  <AnimatePresence>
    {show && msg && (
      <motion.span
        key={msg}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.13 }}
        style={{ display: 'block', color: '#e0879a', fontSize: 11, marginTop: 4, fontFamily: 'Inter,sans-serif' }}
      >⚠ {msg}</motion.span>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════
   InlineAuthForm
════════════════════════════════════════════ */
export function InlineAuthForm({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login } = useClientStore();

  const [mode, setMode]           = useState(initialMode);
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError]   = useState('');
  const [role, setRole]           = useState('founder');
  const [fields, setFields]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched]     = useState({});
  const cardRef = useRef(null);

  const isSignup = mode === 'signup';

  const errs = {
    name:     isSignup ? validate.name(fields.name) : null,
    email:    validate.email(fields.email),
    password: validate.password(fields.password, isSignup),
    confirm:  isSignup ? validate.confirm(fields.confirm, fields.password) : null,
  };
  const allValid = Object.values(errs).every((e) => !e);
  const strength = pwStrength(fields.password);

  /* 3-D tilt — desktop only */
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !window.matchMedia('(hover: hover)').matches) return;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${(1 - y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
    };
    const onLeave = () => { card.style.transform = 'rotateX(1deg) rotateY(0deg)'; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  const reset = () => {
    setFields({ name: '', email: '', password: '', confirm: '' });
    setTouched({});
    setApiError('');
    setSuccessMsg('');
    setShowPw(false);
    setShowCpw(false);
  };
  const switchMode = (m) => {
    setMode(m);
    reset();
    navigate(m === 'signup' ? '/register' : '/login');
  };
  const setF = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));
  const touch = (k) => () => setTouched((p) => ({ ...p, [k]: true }));
  const touchAll = () => setTouched({ name: true, email: true, password: true, confirm: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    setApiError('');
    setSuccessMsg('');
    if (!allValid) return;
    setIsLoading(true);
    try {
      if (!isSignup) {
        const res = await loginApi(fields.email, fields.password);
        if (res?.user) {
          login(res.user, res.token);
          navigate('/matches');
        }
        else setApiError(res?.message || 'Invalid credentials. Please try again.');
      } else {
        const res = await registerApi({ email: fields.email, password: fields.password, name: fields.name, role });
        if (res?.user || res?.message) {
          setSuccessMsg('Account created! Please sign in.');
          switchMode('login');
        } else setApiError(res?.message || 'Registration failed.');
      }
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogle = () => {
    setShowGoogleModal(true);
  };

  /* Shared input style */
  const inp = (hasErr) => ({
    width: '100%', padding: '10px 13px', borderRadius: 10,
    border: `1px solid ${hasErr ? 'rgba(224,135,154,0.5)' : 'rgba(255,255,255,0.09)'}`,
    background: hasErr ? 'rgba(224,135,154,0.04)' : 'rgba(255,255,255,0.03)',
    color: '#f4f4f7', fontSize: 13, fontFamily: 'Inter,sans-serif',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s, box-shadow .2s',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes auraDrift{0%,100%{transform:translate(0,0) scale(1);opacity:0.20;}50%{transform:translate(18px,-12px) scale(1.05);opacity:0.27;}}
        @keyframes dotPulse{0%,100%{opacity:0.65;transform:scale(1);}50%{opacity:1;transform:scale(1.4);}}
        @keyframes cubeGlow{0%,100%{box-shadow:0 6px 16px -6px rgba(217,180,106,0.5),inset 0 1px 0 rgba(255,255,255,0.45);}50%{box-shadow:0 8px 22px -4px rgba(217,180,106,0.75),inset 0 1px 0 rgba(255,255,255,0.55);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        .iaf-input:focus{border-color:#7c6cf0 !important;background:rgba(124,108,240,0.07) !important;box-shadow:0 0 0 3px rgba(124,108,240,0.14) !important;}
        .iaf-input::placeholder{color:#6b6e82;}
        .iaf-google:hover{background:rgba(255,255,255,0.06) !important;border-color:rgba(255,255,255,0.18) !important;}
        .iaf-role:hover{border-color:rgba(255,255,255,0.2) !important;transform:translateY(-1px);}
        .iaf-forgot:hover{color:#f0cf8c !important;}
        .iaf-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 18px 32px -10px rgba(217,180,106,0.6),inset 0 1px 0 rgba(255,255,255,0.5) !important;}
        .iaf-tab:hover{color:#f4f4f7 !important;}
      `}</style>

      {/* ── Full-page scrollable wrapper ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingTop: 24,
        paddingBottom: 32,
      }}>

        {/* Background auras — fixed behind everything */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {[
            { color: '#f0cf8c', top: -180, left: -160, size: 440 },
            { color: '#7c6cf0', top: -150, right: -160, size: 400 },
            { color: '#4fd8a8', bottom: -180, left: -150, size: 420 },
            { color: '#e0879a', bottom: -160, right: -150, size: 400 },
          ].map((a, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%', filter: 'blur(80px)',
              width: a.size, height: a.size,
              top: a.top, bottom: a.bottom, left: a.left, right: a.right,
              background: `radial-gradient(circle,${a.color},transparent 70%)`,
              animation: `auraDrift ${16 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * -4}s`,
              animationDirection: i % 2 === 1 ? 'reverse' : 'normal',
            }} />
          ))}

          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage: 'radial-gradient(ellipse at 50% 40%,black 0%,transparent 68%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%,black 0%,transparent 68%)',
          }} />
        </div>

        {/* ── Two-column content ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 48,
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 16px',
          flexWrap: 'wrap',
        }}>

          {/* ── LEFT: hero copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ flex: '1 1 280px', maxWidth: 340, paddingTop: 12 }}
          >
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#f0cf8c,#d9b46a 60%,#8a6d2c)',
                boxShadow: '0 6px 16px -6px rgba(217,180,106,0.55),inset 0 1px 0 rgba(255,255,255,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900, color: '#191204',
                animation: 'cubeGlow 3.2s ease-in-out infinite',
              }}>⚡</div>
              <span style={{ fontFamily: 'Fraunces,serif', fontWeight: 600, fontSize: 20, color: '#f4f4f7' }}>EMS Platform</span>
            </div>

            <h1 style={{ fontFamily: 'Fraunces,serif', fontWeight: 500, fontSize: 28, letterSpacing: '-0.02em', color: '#f4f4f7', lineHeight: 1.25, marginBottom: 12 }}>
              Every side of<br />the table,<br />one platform.
            </h1>
            <p style={{ fontSize: 13, color: '#a5a8ba', lineHeight: 1.65, marginBottom: 24 }}>
              Connect with <b style={{ color: '#f0cf8c' }}>founders</b>, <b style={{ color: '#4fd8a8' }}>investors</b>, <b style={{ color: '#7c6cf0' }}>mentors</b> &amp; <b style={{ color: '#e0879a' }}>teams</b>. AI-powered matching built for the startup ecosystem.
            </p>

            {/* Role dots */}
            <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
              {ROLES.map((r, i) => (
                <div key={r.id} style={{ textAlign: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, boxShadow: `0 0 8px ${r.dot}99`, margin: '0 auto 6px', animation: `dotPulse 2.4s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
                  <span style={{ fontSize: 10.5, color: '#6b6e82', fontFamily: 'Inter,sans-serif' }}>{r.label}</span>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '🎯', text: 'AI compatibility scoring' },
                { icon: '💬', text: 'Live MongoDB Atlas chat' },
                { icon: '🔒', text: 'Secure authenticated sessions' },
              ].map((f) => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: '#a5a8ba', fontFamily: 'Inter,sans-serif' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: form card ── */}
          <div style={{ flex: '0 0 auto', perspective: 1200 }}>
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.1 }}
              style={{
                width: 370,
                maxWidth: '92vw',
                borderRadius: 20,
                padding: '24px 24px 22px',
                background: 'rgba(18,20,31,0.62)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 32px 64px -20px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.07)',
                transformStyle: 'preserve-3d',
                fontFamily: 'Inter,sans-serif',
                color: '#f4f4f7',
              }}
            >
              {/* Mode tabs */}
              <div style={{ display: 'flex', gap: 3, padding: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, marginBottom: 20 }}>
                {[{ id: 'login', label: '🔑 Sign In' }, { id: 'signup', label: '🚀 Register' }].map((tab) => (
                  <button key={tab.id} onClick={() => switchMode(tab.id)} className="iaf-tab"
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: mode === tab.id ? 'linear-gradient(135deg,#f0cf8c,#d9b46a 65%,#b3893d)' : 'transparent',
                      color: mode === tab.id ? '#191204' : '#a5a8ba',
                      fontWeight: mode === tab.id ? 700 : 500, fontSize: 12.5,
                      fontFamily: 'Inter,sans-serif', transition: 'all .2s',
                      boxShadow: mode === tab.id ? '0 4px 12px -4px rgba(217,180,106,0.45)' : 'none',
                    }}
                  >{tab.label}</button>
                ))}
              </div>

              {/* Title */}
              <h2 style={{ fontFamily: 'Fraunces,serif', fontWeight: 500, fontSize: 19, letterSpacing: '-0.01em', marginBottom: 4, lineHeight: 1.2 }}>
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h2>
              <p style={{ fontSize: 12, color: '#a5a8ba', marginBottom: 16, lineHeight: 1.5 }}>
                {isSignup ? 'Join as a founder, investor, mentor or team member.' : 'Sign in to access your matches, profile and messages.'}
              </p>

              {/* Banners */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div key="s" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ padding: '8px 12px', borderRadius: 9, border: '1px solid rgba(79,216,168,0.3)', background: 'rgba(79,216,168,0.07)', color: '#4fd8a8', fontSize: 11.5, fontWeight: 600, display: 'flex', gap: 6 }}>
                      ✅ {successMsg}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {apiError && (
                  <motion.div key="e" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ padding: '8px 12px', borderRadius: 9, border: '1px solid rgba(224,135,154,0.3)', background: 'rgba(224,135,154,0.07)', color: '#e0879a', fontSize: 11.5, fontWeight: 600, display: 'flex', gap: 6 }}>
                      ⚠️ {apiError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google */}
              <button onClick={handleGoogle} disabled={isLoading || gLoading} className="iaf-google"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.03)', color: '#f4f4f7', fontWeight: 600, fontSize: 12.5,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginBottom: 14, fontFamily: 'Inter,sans-serif', transition: 'background .2s, border-color .2s',
                  opacity: (isLoading || gLoading) ? 0.5 : 1,
                }}
              >
                {gLoading ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.22)', borderTopColor: '#f0cf8c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <GoogleIcon />}
                {gLoading ? 'Authenticating…' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize: 9.5, color: '#6b6e82', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>

                {/* Name — signup only */}
                <AnimatePresence>
                  {isSignup && (
                    <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b6e82', marginBottom: 5 }}>Full Name</label>
                      <input id="iaf-name" type="text" placeholder="e.g. Priya Sharma" value={fields.name} onChange={setF('name')} onBlur={touch('name')} className="iaf-input" style={inp(touched.name && errs.name)} />
                      <FieldErr msg={errs.name} show={touched.name} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b6e82', marginBottom: 5 }}>Email</label>
                  <input id="iaf-email" type="email" placeholder="you@yourventure.com" value={fields.email} onChange={setF('email')} onBlur={touch('email')} autoComplete="email" className="iaf-input" style={inp(touched.email && errs.email)} />
                  <FieldErr msg={errs.email} show={touched.email} />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b6e82', marginBottom: 5 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="iaf-password" type={showPw ? 'text' : 'password'} placeholder="••••••••••" value={fields.password} onChange={setF('password')} onBlur={touch('password')} autoComplete={isSignup ? 'new-password' : 'current-password'} className="iaf-input" style={{ ...inp(touched.password && errs.password), paddingRight: 40 }} />
                    <button type="button" tabIndex={-1} onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', top: '50%', right: 5, transform: 'translateY(-50%)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#6b6e82', cursor: 'pointer', borderRadius: 6, transition: 'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f4f4f7'}
                      onMouseLeave={e => e.currentTarget.style.color = '#6b6e82'}
                    >{showPw ? <EyeOff /> : <EyeOn />}</button>
                  </div>
                  <FieldErr msg={errs.password} show={touched.password} />
                  {/* Strength bar — signup only */}
                  {isSignup && fields.password && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      {[1, 2, 3, 4].map((s) => (
                        <div key={s} style={{ height: 2.5, flex: 1, borderRadius: 2, background: strength >= s ? STRENGTH[strength]?.color : 'rgba(255,255,255,0.07)', transition: 'background .3s' }} />
                      ))}
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: STRENGTH[strength]?.color || '#6b6e82', minWidth: 30, textAlign: 'right' }}>{STRENGTH[strength]?.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password — signup only */}
                <AnimatePresence>
                  {isSignup && (
                    <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b6e82', marginBottom: 5 }}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <input id="iaf-confirm" type={showCpw ? 'text' : 'password'} placeholder="Re-enter password" value={fields.confirm} onChange={setF('confirm')} onBlur={touch('confirm')} className="iaf-input" style={{ ...inp(touched.confirm && errs.confirm), paddingRight: 40 }} />
                        <button type="button" tabIndex={-1} onClick={() => setShowCpw(!showCpw)}
                          style={{ position: 'absolute', top: '50%', right: 5, transform: 'translateY(-50%)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#6b6e82', cursor: 'pointer', borderRadius: 6, transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f4f4f7'}
                          onMouseLeave={e => e.currentTarget.style.color = '#6b6e82'}
                        >{showCpw ? <EyeOff /> : <EyeOn />}</button>
                      </div>
                      <FieldErr msg={errs.confirm} show={touched.confirm} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Role picker — signup only */}
                <AnimatePresence>
                  {isSignup && (
                    <motion.div key="roles" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} style={{ overflow: 'hidden' }}>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b6e82', marginBottom: 7 }}>Your Role</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {ROLES.map((r) => {
                          const active = role === r.id;
                          return (
                            <button key={r.id} type="button" onClick={() => setRole(r.id)} className="iaf-role"
                              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', borderRadius: 9, cursor: 'pointer', fontFamily: 'Inter,sans-serif', border: active ? `1px solid ${r.border}` : '1px solid rgba(255,255,255,0.07)', background: active ? r.bg : 'rgba(255,255,255,0.02)', transition: 'all .18s' }}
                            >
                              <span style={{ fontSize: 14 }}>{r.icon}</span>
                              <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? r.text : '#a5a8ba' }}>{r.label}</span>
                              {active && <span style={{ marginLeft: 'auto', fontSize: 9, color: r.text }}>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember + Forgot — login only */}
                {!isSignup && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#a5a8ba', cursor: 'pointer', fontWeight: 400, userSelect: 'none' }}>
                      <input type="checkbox" style={{ accentColor: '#d9b46a', width: 13, height: 13 }} />
                      Keep me signed in
                    </label>
                    <a href="#" className="iaf-forgot" style={{ fontSize: 12, color: '#a5a8ba', textDecoration: 'none', transition: 'color .2s' }}>
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || gLoading}
                  className="iaf-submit"
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none', marginTop: 4,
                    background: 'linear-gradient(135deg,#f0cf8c,#d9b46a 65%,#b3893d)',
                    color: '#191204', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 13.5,
                    cursor: (isLoading || gLoading) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || gLoading) ? 0.7 : 1,
                    boxShadow: '0 12px 24px -8px rgba(217,180,106,0.48),inset 0 1px 0 rgba(255,255,255,0.42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'transform .2s, box-shadow .2s',
                  }}
                >
                  {isLoading
                    ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(25,18,4,0.3)', borderTopColor: '#191204', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing…</>
                    : isSignup ? '🚀 Create Account' : '🔑 Sign In'
                  }
                </button>
              </form>

              {/* Footer */}
              <p style={{ textAlign: 'center', fontSize: 12, color: '#6b6e82', marginTop: 14, fontFamily: 'Inter,sans-serif' }}>
                {!isSignup
                  ? <>New here?{' '}<button type="button" onClick={() => switchMode('signup')} style={{ background: 'none', border: 'none', color: '#f0cf8c', fontWeight: 700, cursor: 'pointer', fontSize: 12, padding: 0 }}>Create account →</button></>
                  : <>Already registered?{' '}<button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: '#f0cf8c', fontWeight: 700, cursor: 'pointer', fontSize: 12, padding: 0 }}>Sign in →</button></>
                }
              </p>

              {/* Role strip */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                {ROLES.map((r, i) => (
                  <div key={r.id} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.dot, boxShadow: `0 0 7px ${r.dot}88`, margin: '0 auto 5px', animation: `dotPulse 2.4s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
                    <span style={{ fontSize: 9.5, color: '#6b6e82', fontFamily: 'Inter,sans-serif' }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        initialRole={role}
      />
    </>
  );
}

export default InlineAuthForm;
