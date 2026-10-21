import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useClientStore from '../store/useClientStore';
import { loginApi, registerApi, googleAuthApi } from '../services/apiClient';
import GoogleAuthModal from './GoogleAuthModal';

/* ─── Validation ─── */
const validate = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'At least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Letters, spaces, hyphens only';
    return null;
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email';
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
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

/* ─── Eye icons ─── */
const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18"/><path d="M10.6 5.2C11 5.1 11.5 5 12 5c7 0 10.5 7 10.5 7-.6 1.2-1.7 2.8-3.3 4.2M6.6 6.6C3.7 8.3 1.5 12 1.5 12s3.5 7 10.5 7c1.7 0 3.2-.4 4.4-1"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/>
  </svg>
);

/* ─── Google SVG ─── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

/* ─── Corner glyph SVGs ─── */
const GlyphFounder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="12" cy="12" r="9.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>
  </svg>
);
const GlyphCofounder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>
  </svg>
);
const GlyphInvestor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M3 20h18M6 20V13M12 20V6M18 20v-3"/>
  </svg>
);
const GlyphTeam = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/>
    <path d="M2.5 20c0-3.3 2.5-5.5 5.5-5.5S13.5 16.7 13.5 20"/>
    <path d="M10.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/>
  </svg>
);

/* ─── Roles config ─── */
const ROLES = [
  { id: 'founder',  label: 'Founder',     dot: '#f0cf8c', glow: 'rgba(240,207,140,0.7)' },
  { id: 'investor', label: 'Investor',    dot: '#4fd8a8', glow: 'rgba(79,216,168,0.7)'  },
  { id: 'mentor',   label: 'Mentor',      dot: '#7c6cf0', glow: 'rgba(124,108,240,0.7)' },
  { id: 'team',     label: 'Team Member', dot: '#e0879a', glow: 'rgba(224,135,154,0.7)' },
];

/* ─── Inline error ─── */
const FieldError = ({ msg, show }) => (
  <AnimatePresence>
    {show && msg && (
      <motion.p
        key={msg}
        initial={{ opacity: 0, y: -4, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -4, height: 0 }}
        transition={{ duration: 0.15 }}
        style={{ color: '#e0879a', fontSize: 11, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <span>⚠</span> {msg}
      </motion.p>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════
   AuthModal
════════════════════════════════════════════ */
export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login } = useClientStore();

  const [mode, setMode]           = useState('login');
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError]   = useState('');
  const [role, setRole]           = useState('founder');
  const [fields, setFields]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched]     = useState({});
  const [ripple, setRipple]       = useState({ x: '50%', y: '50%' });
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

  useEffect(() => {
    if (authModalOpen) { setMode(authModalMode || 'login'); reset(); }
  }, [authModalOpen, authModalMode]);

  /* 3D tilt */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const wrap = card.parentElement;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${(2 - y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    };
    const onLeave = () => { card.style.transform = 'rotateX(2deg) rotateY(0deg)'; };
    wrap?.addEventListener('mousemove', onMove);
    wrap?.addEventListener('mouseleave', onLeave);
    return () => { wrap?.removeEventListener('mousemove', onMove); wrap?.removeEventListener('mouseleave', onLeave); };
  }, [authModalOpen]);

  const reset = () => {
    setFields({ name: '', email: '', password: '', confirm: '' });
    setTouched({});
    setApiError('');
    setSuccessMsg('');
    setShowPw(false);
    setShowCpw(false);
  };

  const switchMode = (m) => { setMode(m); reset(); };
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
      if (mode === 'login') {
        const res = await loginApi(fields.email, fields.password);
        if (res?.user) { login(res.user, res.token); closeAuthModal(); }
        else setApiError(res?.message || 'Invalid credentials. Please try again.');
      } else {
        const res = await registerApi({ email: fields.email, password: fields.password, name: fields.name, role });
        if (res?.user || res?.message) {
          setSuccessMsg('Account created! Please sign in.');
          switchMode('login');
        } else setApiError(res?.message || 'Registration failed. Please try again.');
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

  const strengthColors = ['', '#e0879a', '#d9b46a', '#7c6cf0', '#4fd8a8'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!authModalOpen) return null;

  /* ── shared input style ── */
  const inputStyle = (hasErr) => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: `1px solid ${hasErr ? '#e0879a55' : 'rgba(255,255,255,0.10)'}`,
    background: hasErr ? 'rgba(224,135,154,0.05)' : 'rgba(255,255,255,0.03)',
    color: '#f4f4f7',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color .2s, background .2s, box-shadow .2s',
    boxSizing: 'border-box',
  });

  return (
    <>
      {/* Google font injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .ventry-input:focus {
          border-color: #7c6cf0 !important;
          background: rgba(124,108,240,0.07) !important;
          box-shadow: 0 0 0 4px rgba(124,108,240,0.14) !important;
        }
        .ventry-input::placeholder { color: #6b6e82; }
        .ventry-btn-google:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.2) !important; }
        .ventry-tab:hover { color: #f0cf8c !important; }
        .ventry-role-btn:hover { border-color: rgba(255,255,255,0.25) !important; transform: translateY(-1px); }
        @keyframes auraDrift {
          0%,100%{ transform:translate(0,0) scale(1); opacity:0.28; }
          50%{ transform:translate(26px,-18px) scale(1.08); opacity:0.36; }
        }
        @keyframes glyphFloat {
          0%,100%{ margin-top:0px; }
          50%{ margin-top:-14px; }
        }
        @keyframes dotPulse {
          0%,100%{ opacity:0.75; transform:scale(1); }
          50%{ opacity:1; transform:scale(1.35); }
        }
        @keyframes cardRise {
          from{ opacity:0; transform:translateY(28px) rotateX(2deg) scale(0.97); }
          to{ opacity:1; transform:translateY(0) rotateX(2deg) scale(1); }
        }
        @keyframes cubeGlow {
          0%,100%{ box-shadow:0 8px 20px -6px rgba(217,180,106,0.55), inset 0 1px 0 rgba(255,255,255,0.5); }
          50%{ box-shadow:0 8px 26px -4px rgba(217,180,106,0.8), inset 0 1px 0 rgba(255,255,255,0.6); }
        }
        @keyframes fadeInUp {
          from{ opacity:0; transform:translateY(10px); }
          to{ opacity:1; transform:translateY(0); }
        }
        @keyframes floorFade {
          from{ opacity:0; } to{ opacity:1; }
        }
      `}</style>

      <AnimatePresence>
        {authModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, overflow: 'auto',
          }}>

            {/* ── Backdrop ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAuthModal}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(7,8,13,0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />

            {/* ── Auras ── */}
            {[
              { cls: 'founder',   style: { width:500,height:500,top:-180,left:-160,  background:'radial-gradient(circle,#f0cf8c,transparent 70%)', animationDelay:'0s' } },
              { cls: 'cofounder', style: { width:460,height:460,top:-160,right:-160, background:'radial-gradient(circle,#7c6cf0,transparent 70%)', animationDelay:'-4s', animationDirection:'reverse' } },
              { cls: 'investor',  style: { width:480,height:480,bottom:-180,left:-160,background:'radial-gradient(circle,#4fd8a8,transparent 70%)', animationDelay:'-8s' } },
              { cls: 'team',      style: { width:460,height:460,bottom:-160,right:-160,background:'radial-gradient(circle,#e0879a,transparent 70%)', animationDelay:'-12s', animationDirection:'reverse' } },
            ].map((a) => (
              <div key={a.cls} style={{
                position:'fixed', borderRadius:'50%', filter:'blur(100px)',
                zIndex:1, opacity:0.28, pointerEvents:'none',
                animation:'auraDrift 16s ease-in-out infinite',
                ...a.style,
              }} />
            ))}

            {/* ── Grid floor ── */}
            <div style={{
              position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
              backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
              backgroundSize:'56px 56px',
              maskImage:'radial-gradient(circle at 50% 42%,black 0%,transparent 72%)',
              WebkitMaskImage:'radial-gradient(circle at 50% 42%,black 0%,transparent 72%)',
              animation:'floorFade 2.4s ease-out',
            }} />

            {/* ── Corner glyphs ── */}
            {[
              { Glyph: GlyphFounder,   style: { top:'6%',   left:'4%',  width:140, transform:'rotate(-8deg)', animationDelay:'0s,0.1s'  } },
              { Glyph: GlyphCofounder, style: { top:'8%',   right:'4%', width:130, transform:'rotate(6deg)',  animationDelay:'-2s,0.25s' } },
              { Glyph: GlyphInvestor,  style: { bottom:'7%',left:'5%',  width:145, transform:'rotate(5deg)',  animationDelay:'-4s,0.4s'  } },
              { Glyph: GlyphTeam,      style: { bottom:'6%',right:'4%', width:135, transform:'rotate(-6deg)', animationDelay:'-5.5s,0.55s'} },
            ].map(({ Glyph, style }, i) => (
              <div key={i} style={{
                position:'fixed', zIndex:1, color:'rgba(255,255,255,0.05)',
                pointerEvents:'none', height: style.width,
                animation:`glyphFloat 7s ease-in-out infinite`,
                animationDelay: style.animationDelay?.split(',')[0],
                ...style,
              }}>
                <Glyph />
              </div>
            ))}

            {/* ── Card wrapper (perspective) ── */}
            <div style={{ position:'relative', zIndex:10, perspective:1600 }}>
              <div
                ref={cardRef}
                style={{
                  width: 420, maxWidth: '92vw',
                  borderRadius: 26,
                  padding: '40px 36px 34px',
                  background: 'rgba(18,20,31,0.55)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 50px 100px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
                  transformStyle: 'preserve-3d',
                  animation: 'cardRise 0.9s cubic-bezier(.16,1,.3,1) backwards',
                  fontFamily: 'Inter, sans-serif',
                  color: '#f4f4f7',
                  position: 'relative',
                }}
              >
                {/* Close button */}
                <button
                  onClick={closeAuthModal}
                  style={{
                    position:'absolute', top:16, right:16,
                    width:32,height:32,borderRadius:8,border:'none',
                    background:'rgba(255,255,255,0.06)',
                    color:'#a5a8ba',cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:14,transition:'background .2s,color .2s',
                  }}
                  onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.12)';e.target.style.color='#f4f4f7';}}
                  onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,0.06)';e.target.style.color='#a5a8ba';}}
                >✕</button>

                {/* ── Brand mark ── */}
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:32, animation:'fadeInUp 0.7s ease-out 0.15s backwards' }}>
                  <div style={{
                    width:32, height:32, borderRadius:9,
                    background:'linear-gradient(135deg,#f0cf8c,#d9b46a 60%,#8a6d2c)',
                    boxShadow:'0 8px 20px -6px rgba(217,180,106,0.55), inset 0 1px 0 rgba(255,255,255,0.5)',
                    animation:'cubeGlow 3.2s ease-in-out infinite',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:14, fontWeight:900, color:'#191204',
                  }}>⚡</div>
                  <span style={{ fontFamily:'Fraunces,serif', fontWeight:600, fontSize:19 }}>EMS Platform</span>
                </div>

                {/* ── Mode tabs ── */}
                <div style={{ display:'flex', gap:4, padding:4, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, marginBottom:28, animation:'fadeInUp 0.7s ease-out 0.2s backwards' }}>
                  {[{ id:'login', label:'🔑 Sign In' },{ id:'signup', label:'🚀 Register' }].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => switchMode(tab.id)}
                      className="ventry-tab"
                      style={{
                        flex:1, padding:'10px 0', borderRadius:10, border:'none',
                        background: mode === tab.id
                          ? 'linear-gradient(135deg,#f0cf8c,#d9b46a 65%,#b3893d)'
                          : 'transparent',
                        color: mode === tab.id ? '#191204' : '#a5a8ba',
                        fontWeight: mode === tab.id ? 700 : 500,
                        fontSize:13, cursor:'pointer',
                        transition:'all .2s',
                        fontFamily:'Inter,sans-serif',
                        boxShadow: mode === tab.id ? '0 8px 20px -8px rgba(217,180,106,0.5)' : 'none',
                      }}
                    >{tab.label}</button>
                  ))}
                </div>

                {/* ── Title ── */}
                <h1 style={{ fontFamily:'Fraunces,serif', fontWeight:500, fontSize:26, letterSpacing:'-0.01em', animation:'fadeInUp 0.7s ease-out 0.22s backwards', lineHeight:1.2 }}>
                  {isSignup ? 'Create Account' : 'Welcome back'}
                </h1>
                <p style={{ marginTop:8, fontSize:13, color:'#a5a8ba', lineHeight:1.5, animation:'fadeInUp 0.7s ease-out 0.28s backwards', marginBottom:24 }}>
                  {isSignup
                    ? 'Join as a founder, investor, mentor, or team member.'
                    : <>One account for every side of the table — <b style={{color:'#f4f4f7'}}>founders</b>, <b style={{color:'#f4f4f7'}}>investors</b>, <b style={{color:'#f4f4f7'}}>mentors</b> &amp; <b style={{color:'#f4f4f7'}}>teams</b>.</>
                  }
                </p>

                {/* ── Banners ── */}
                <AnimatePresence>
                  {successMsg && (
                    <motion.div key="suc" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden',marginBottom:14}}>
                      <div style={{ padding:'10px 14px', borderRadius:10, border:'1px solid rgba(79,216,168,0.3)', background:'rgba(79,216,168,0.08)', color:'#4fd8a8', fontSize:12, fontWeight:600, display:'flex', gap:6 }}>
                        ✅ {successMsg}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {apiError && (
                    <motion.div key="err" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden',marginBottom:14}}>
                      <div style={{ padding:'10px 14px', borderRadius:10, border:'1px solid rgba(224,135,154,0.3)', background:'rgba(224,135,154,0.08)', color:'#e0879a', fontSize:12, fontWeight:600, display:'flex', gap:6 }}>
                        ⚠️ {apiError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Google button ── */}
                <button
                  onClick={handleGoogle}
                  disabled={isLoading || gLoading}
                  className="ventry-btn-google"
                  style={{
                    width:'100%', padding:'12px 16px', borderRadius:12,
                    border:'1px solid rgba(255,255,255,0.10)',
                    background:'rgba(255,255,255,0.03)',
                    color:'#f4f4f7', fontWeight:600, fontSize:13.5,
                    cursor:'pointer', display:'flex', alignItems:'center',
                    justifyContent:'center', gap:10, marginBottom:20,
                    transition:'background .2s, border-color .2s',
                    fontFamily:'Inter,sans-serif',
                    animation:'fadeInUp 0.7s ease-out 0.32s backwards',
                    opacity: (isLoading||gLoading) ? 0.5 : 1,
                  }}
                >
                  {gLoading
                    ? <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#f0cf8c',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
                    : <GoogleIcon />
                  }
                  {gLoading ? 'Authenticating…' : 'Continue with Google'}
                </button>

                {/* ── Divider ── */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize:10.5, color:'#6b6e82', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>or email</span>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} noValidate style={{ animation:'fadeInUp 0.7s ease-out 0.34s backwards' }}>

                  {/* Name — signup only */}
                  <AnimatePresence>
                    {isSignup && (
                      <motion.div key="name" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.18}} style={{overflow:'hidden'}}>
                        <div style={{ marginBottom:16 }}>
                          <label style={{ display:'block', fontSize:11.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'#6b6e82', marginBottom:8 }}>Full Name</label>
                          <input
                            id="auth-name"
                            type="text"
                            placeholder="e.g. Priya Sharma"
                            value={fields.name}
                            onChange={setF('name')}
                            onBlur={touch('name')}
                            className="ventry-input"
                            style={inputStyle(touched.name && errs.name)}
                          />
                          <FieldError msg={errs.name} show={touched.name} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontSize:11.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'#6b6e82', marginBottom:8 }}>Email</label>
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="you@yourventure.com"
                      value={fields.email}
                      onChange={setF('email')}
                      onBlur={touch('email')}
                      autoComplete="email"
                      className="ventry-input"
                      style={inputStyle(touched.email && errs.email)}
                    />
                    <FieldError msg={errs.email} show={touched.email} />
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom:isSignup?16:20 }}>
                    <label style={{ display:'block', fontSize:11.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'#6b6e82', marginBottom:8 }}>Password</label>
                    <div style={{ position:'relative' }}>
                      <input
                        id="auth-password"
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••••"
                        value={fields.password}
                        onChange={setF('password')}
                        onBlur={touch('password')}
                        autoComplete={isSignup ? 'new-password' : 'current-password'}
                        className="ventry-input"
                        style={{ ...inputStyle(touched.password && errs.password), paddingRight:48 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        tabIndex={-1}
                        style={{ position:'absolute', top:'50%', right:6, transform:'translateY(-50%)', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', borderRadius:8, color:'#6b6e82', cursor:'pointer', transition:'color .2s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='#f4f4f7'}
                        onMouseLeave={e=>e.currentTarget.style.color='#6b6e82'}
                      >
                        {showPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    <FieldError msg={errs.password} show={touched.password} />

                    {/* Strength bar */}
                    {isSignup && fields.password && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
                        <div style={{ display:'flex', gap:3, flex:1 }}>
                          {[1,2,3,4].map((s) => (
                            <div key={s} style={{ height:3, flex:1, borderRadius:4, background: strength>=s ? strengthColors[strength] : 'rgba(255,255,255,0.08)', transition:'background .3s' }} />
                          ))}
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, color: strengthColors[strength] || '#6b6e82', minWidth:34, textAlign:'right' }}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm password — signup only */}
                  <AnimatePresence>
                    {isSignup && (
                      <motion.div key="confirm" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.18}} style={{overflow:'hidden'}}>
                        <div style={{ marginBottom:20 }}>
                          <label style={{ display:'block', fontSize:11.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'#6b6e82', marginBottom:8 }}>Confirm Password</label>
                          <div style={{ position:'relative' }}>
                            <input
                              id="auth-confirm"
                              type={showCpw ? 'text' : 'password'}
                              placeholder="Re-enter password"
                              value={fields.confirm}
                              onChange={setF('confirm')}
                              onBlur={touch('confirm')}
                              className="ventry-input"
                              style={{ ...inputStyle(touched.confirm && errs.confirm), paddingRight:48 }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCpw(!showCpw)}
                              tabIndex={-1}
                              style={{ position:'absolute', top:'50%', right:6, transform:'translateY(-50%)', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', borderRadius:8, color:'#6b6e82', cursor:'pointer', transition:'color .2s' }}
                              onMouseEnter={e=>e.currentTarget.style.color='#f4f4f7'}
                              onMouseLeave={e=>e.currentTarget.style.color='#6b6e82'}
                            >
                              {showCpw ? <EyeOff /> : <EyeOn />}
                            </button>
                          </div>
                          <FieldError msg={errs.confirm} show={touched.confirm} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Role picker — signup only */}
                  <AnimatePresence>
                    {isSignup && (
                      <motion.div key="roles" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.18}} style={{overflow:'hidden'}}>
                        <div style={{ marginBottom:24 }}>
                          <label style={{ display:'block', fontSize:11.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'#6b6e82', marginBottom:10 }}>Your Role</label>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                            {ROLES.map((r) => {
                              const active = role === r.id;
                              return (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => setRole(r.id)}
                                  className="ventry-role-btn"
                                  style={{
                                    display:'flex', alignItems:'center', gap:8, padding:'10px 12px',
                                    borderRadius:10, cursor:'pointer', fontFamily:'Inter,sans-serif',
                                    border: active ? `1px solid ${r.dot}44` : '1px solid rgba(255,255,255,0.08)',
                                    background: active ? `${r.dot}12` : 'rgba(255,255,255,0.02)',
                                    transition:'all .2s',
                                  }}
                                >
                                  <div style={{ width:8, height:8, borderRadius:'50%', background:r.dot, boxShadow:`0 0 8px ${r.glow}`, flexShrink:0 }} />
                                  <span style={{ fontSize:12.5, fontWeight:active?700:500, color: active ? r.dot : '#a5a8ba' }}>{r.label}</span>
                                  {active && <span style={{ marginLeft:'auto', fontSize:10, color:r.dot }}>✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember + Forgot — login only */}
                  {!isSignup && (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, animation:'fadeInUp 0.7s ease-out 0.46s backwards' }}>
                      <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#a5a8ba', textTransform:'none', letterSpacing:'normal', fontWeight:400, cursor:'pointer' }}>
                        <input type="checkbox" style={{ accentColor:'#d9b46a', width:15, height:15 }} />
                        Keep me signed in
                      </label>
                      <a href="#" style={{ fontSize:13, color:'#a5a8ba', textDecoration:'none', borderBottom:'1px solid transparent', transition:'color .2s, border-color .2s' }}
                        onMouseEnter={e=>{e.target.style.color='#f0cf8c';e.target.style.borderColor='#f0cf8c';}}
                        onMouseLeave={e=>{e.target.style.color='#a5a8ba';e.target.style.borderColor='transparent';}}
                      >Forgot password?</a>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading || gLoading}
                    onMouseDown={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setRipple({ x: `${((e.clientX-rect.left)/rect.width*100)}%`, y: `${((e.clientY-rect.top)/rect.height*100)}%` });
                    }}
                    style={{
                      width:'100%', padding:'14px', borderRadius:12, border:'none',
                      background:'linear-gradient(135deg,#f0cf8c,#d9b46a 65%,#b3893d)',
                      color:'#191204', fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:14.5,
                      cursor: (isLoading||gLoading) ? 'not-allowed' : 'pointer',
                      opacity: (isLoading||gLoading) ? 0.7 : 1,
                      boxShadow:'0 16px 30px -12px rgba(217,180,106,0.5), inset 0 1px 0 rgba(255,255,255,0.5)',
                      transition:'transform .2s, box-shadow .2s',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      animation:'fadeInUp 0.7s ease-out 0.52s backwards',
                    }}
                    onMouseEnter={e=>{ if(!isLoading&&!gLoading){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 22px 38px -14px rgba(217,180,106,0.6),inset 0 1px 0 rgba(255,255,255,0.5)'; }}}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 16px 30px -12px rgba(217,180,106,0.5),inset 0 1px 0 rgba(255,255,255,0.5)'; }}
                  >
                    {isLoading
                      ? <><div style={{ width:16,height:16,border:'2px solid rgba(25,18,4,0.3)',borderTopColor:'#191204',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> Processing…</>
                      : isSignup ? '🚀 Create Account' : '🔑 Sign In'
                    }
                  </button>
                </form>

                {/* ── Role strip (decorative) ── */}
                <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', animation:'fadeInUp 0.7s ease-out 0.64s backwards' }}>
                  {ROLES.map((r, i) => (
                    <div key={r.id} style={{ textAlign:'center', flex:1, cursor:'default' }}>
                      <div style={{
                        width:8, height:8, borderRadius:'50%', background:r.dot,
                        boxShadow:`0 0 8px ${r.glow}`, margin:'0 auto 8px',
                        animation:`dotPulse 2.4s ease-in-out infinite`,
                        animationDelay:`${i*0.3}s`,
                      }} />
                      <span style={{ fontSize:10.5, color:'#6b6e82', letterSpacing:'0.02em' }}>{r.label.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>

                {/* ── Footer link ── */}
                <div style={{ marginTop:20, textAlign:'center', fontSize:13, color:'#6b6e82', animation:'fadeInUp 0.7s ease-out 0.58s backwards' }}>
                  {mode === 'login' ? (
                    <>New here?{' '}
                      <button type="button" onClick={() => switchMode('signup')} style={{ background:'none', border:'none', color:'#f0cf8c', fontWeight:600, cursor:'pointer', fontSize:13, padding:0, textDecoration:'underline' }}>
                        Create account →
                      </button>
                    </>
                  ) : (
                    <>Already registered?{' '}
                      <button type="button" onClick={() => switchMode('login')} style={{ background:'none', border:'none', color:'#f0cf8c', fontWeight:600, cursor:'pointer', fontSize:13, padding:0, textDecoration:'underline' }}>
                        Sign in →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Google Auth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => closeAuthModal()}
        initialRole={role}
      />

      {/* Spin keyframe */}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}

export default AuthModal;
