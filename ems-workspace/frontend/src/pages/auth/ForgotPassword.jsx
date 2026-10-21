import React, { useState } from 'react';
import { authService } from '../../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMsg(res.message);
    } catch (err) {
      setMsg(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-slate-100">
      <h3 className="text-xl font-bold mb-2">Reset Your Password</h3>
      <p className="text-xs text-slate-400 mb-6">Enter your email address to receive password reset instructions.</p>

      {msg && (
        <div className="mb-4 p-3 bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs rounded-xl">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1 text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
