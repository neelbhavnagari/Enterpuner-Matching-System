import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useClientStore from '../../store/useClientStore';
import { ConnectionCard } from '../../components/ConnectionCard/ConnectionCard';
import {
  discoverUsersApi,
  getMyConnectionsApi,
  getPendingRequestsApi,
  getSentRequestsApi,
  sendConnectionRequestApi,
  acceptConnectionApi,
  rejectConnectionApi,
  removeConnectionApi,
} from '../../services/apiClient';

/* ─── Helper: Get role-specific messages route ─── */
function getMessagesRoute(role) {
  const r = (role || '').toLowerCase();
  if (r === 'investor') return '/investor/messages';
  if (r === 'mentor') return '/mentor/messages';
  if (r === 'team' || r === 'teammember') return '/team/messages';
  return '/founder/messages';
}

/* ─── Spinner ─── */
const Spinner = () => (
  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
);

/* ─── Section tabs ─── */
const TABS = [
  { id: 'discover',  label: 'Discover',  icon: '🌐' },
  { id: 'connected', label: 'Connected', icon: '🤝' },
  { id: 'requests',  label: 'Requests',  icon: '📩' },
  { id: 'sent',      label: 'Sent',      icon: '📤' },
];

/* ════════════════════════════════════════════
   ConnectionsPage
════════════════════════════════════════════ */
export function ConnectionsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useClientStore();

  const [activeTab, setActiveTab]       = useState('discover');
  const [discover, setDiscover]         = useState([]);
  const [connected, setConnected]       = useState([]);
  const [requests, setRequests]         = useState([]);
  const [sent, setSent]                 = useState([]);
  const [loading, setLoading]           = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError]               = useState('');
  const [toast, setToast]               = useState(null); // { message, targetUser }
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [showMsgModal, setShowMsgModal] = useState(null); // user obj
  const [msgText, setMsgText]           = useState('');

  const showToast = (message, targetUser = null) => {
    setToast({ message, targetUser });
    setTimeout(() => setToast(null), 5000);
  };

  const handleStartChat = (targetUser) => {
    if (!targetUser) return;
    const msgRoute = getMessagesRoute(currentUser?.role);
    navigate(msgRoute, { state: { openUserId: targetUser._id || targetUser.id, openUser: targetUser } });
  };

  /* ── Load data ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [d, c, r, s] = await Promise.all([
        discoverUsersApi(),
        getMyConnectionsApi(),
        getPendingRequestsApi(),
        getSentRequestsApi(),
      ]);
      setDiscover(d.users || []);
      setConnected(c.connections || []);
      setRequests(r.requests || []);
      setSent(s.sent || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── Badge counts ── */
  const counts = {
    discover:  discover.filter(u => !u.connection).length,
    connected: connected.length,
    requests:  requests.length,
    sent:      sent.length,
  };

  /* ── Actions ── */
  const setAL = (id, val) => setActionLoading(p => ({ ...p, [id]: val }));

  const handleSend = async (user, message = '') => {
    if (!user) return;
    const uid = typeof user === 'string' ? user : (user._id || user.id);
    if (!uid) return;
    const userName = typeof user === 'object' ? user.name : 'user';
    setAL(uid, 'sending');
    try {
      await sendConnectionRequestApi(uid, message);
      showToast(`Connection request sent to ${userName}! ✓`);
      await loadAll();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setAL(uid, null);
      setShowMsgModal(null);
      setMsgText('');
    }
  };

  const handleAccept = async (conn) => {
    if (!conn) return;
    const connId = typeof conn === 'string' ? conn : (conn._id || conn.connectionId);
    if (!connId) return;
    setAL(connId, 'accepting');
    try {
      await acceptConnectionApi(connId);
      const targetUser = typeof conn === 'object' ? (conn.sender || conn.user) : null;
      showToast(`Connected with ${targetUser?.name || 'user'}! ✓`, targetUser);
      await loadAll();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setAL(connId, null);
    }
  };

  const handleReject = async (conn) => {
    if (!conn) return;
    const connId = typeof conn === 'string' ? conn : (conn._id || conn.connectionId);
    if (!connId) return;
    setAL(connId, 'rejecting');
    try {
      await rejectConnectionApi(connId);
      showToast('Request declined.');
      await loadAll();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setAL(connId, null);
    }
  };

  const handleRemove = async (conn, name) => {
    if (!conn) return;
    const connId = typeof conn === 'string' ? conn : (conn._id || conn.connectionId);
    if (!connId) return;
    setAL(connId, 'removing');
    try {
      await removeConnectionApi(connId);
      showToast(`Removed connection with ${name || 'user'}.`);
      await loadAll();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setAL(connId, null);
    }
  };

  /* ── Filtered discover list ── */
  const filtered = discover.filter((u) => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.title?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()) ||
      u.bio?.toLowerCase().includes(search.toLowerCase()) ||
      u.industry?.toLowerCase().includes(search.toLowerCase()) ||
      u.startupName?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="w-full space-y-6">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-semibold text-slate-100 shadow-2xl flex items-center gap-3"
          >
            <span>✅</span>
            <span>{toast.message}</span>
            {toast.targetUser && (
              <button
                onClick={() => handleStartChat(toast.targetUser)}
                className="ml-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                💬 Start Chat
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Send Request Modal ── */}
      <AnimatePresence>
        {showMsgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMsgModal(null)} className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 340 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 p-5"
            >
              <h3 className="text-base font-bold text-slate-100 mb-1">Connect with {showMsgModal.name}</h3>
              <p className="text-xs text-slate-400 mb-4">Add an optional message to your request.</p>
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="Hi! I'd love to connect about..."
                className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowMsgModal(null)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button
                  onClick={() => handleSend(showMsgModal, msgText)}
                  disabled={actionLoading[showMsgModal._id || showMsgModal.id] === 'sending'}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {actionLoading[showMsgModal._id || showMsgModal.id] === 'sending' ? <Spinner /> : '🤝 Send Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/60 px-5 py-4 rounded-2xl border border-slate-700/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">Connections &amp; Network</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              🤝 {connected.length} connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Explore full profiles, bio, and role details across founders, investors, mentors &amp; team members.</p>
        </div>
        <button onClick={loadAll} disabled={loading} className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-slate-700/60 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 transition-all disabled:opacity-50">
          {loading ? <Spinner /> : '🔄'} Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {counts[tab.id] > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════
          DISCOVER TAB
      ═══════════════════════════════ */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          {/* Search + Role filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members by name, bio, title, or industry…"
              className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'all', label: '🌐 All' },
                { id: 'founder', label: '🚀 Founders' },
                { id: 'investor', label: '💼 Investors' },
                { id: 'mentor', label: '🎓 Mentors' },
                { id: 'team', label: '⚡ Team' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoleFilter(r.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    roleFilter === r.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-700/80'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading members…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.length === 0 ? (
                <div className="col-span-full py-12 text-center text-sm text-slate-500">No members found matching your search.</div>
              ) : (
                filtered.map((user) => {
                  const uid = user._id || user.id;
                  return (
                    <ConnectionCard
                      key={uid}
                      connection={{ user }}
                      onConnect={(targetUser) => handleSend(targetUser)}
                      showConnectModal={setShowMsgModal}
                      onStartChat={handleStartChat}
                      onAccept={(connId) => handleAccept({ _id: connId, sender: user })}
                      onRemove={(connId, name) => handleRemove(connId, name || user.name)}
                      actionLoading={actionLoading[uid]}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════
          MY CONNECTIONS TAB
      ═══════════════════════════════ */}
      {activeTab === 'connected' && (
        <div className="space-y-4">
          {loading && <div className="py-8 flex justify-center"><Spinner /></div>}
          {!loading && connected.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-sm font-semibold text-slate-300">No connections yet</p>
              <p className="text-xs text-slate-500 mt-1">Go to Discover to connect with founders, investors &amp; mentors.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {connected.map((c) => (
              <ConnectionCard
                key={c.connectionId}
                connection={c}
                onStartChat={handleStartChat}
                onRemove={(connId, name) => handleRemove(connId, name || c.user?.name)}
                actionLoading={actionLoading[c.connectionId]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          PENDING REQUESTS TAB
      ═══════════════════════════════ */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {loading && <div className="py-8 flex justify-center"><Spinner /></div>}
          {!loading && requests.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📩</div>
              <p className="text-sm font-semibold text-slate-300">No pending requests</p>
              <p className="text-xs text-slate-500 mt-1">When someone sends you a connection request, it will appear here.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <ConnectionCard
                key={req._id}
                connection={req}
                onAccept={() => handleAccept(req)}
                actionLoading={actionLoading[req._id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          SENT REQUESTS TAB
      ═══════════════════════════════ */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {loading && <div className="py-8 flex justify-center"><Spinner /></div>}
          {!loading && sent.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📤</div>
              <p className="text-sm font-semibold text-slate-300">No sent requests</p>
              <p className="text-xs text-slate-500 mt-1">Requests you send to others will appear here.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sent.map((req) => (
              <ConnectionCard
                key={req._id}
                connection={req}
                onRemove={(connId, name) => handleRemove(req._id, name || req.receiver?.name)}
                actionLoading={actionLoading[req._id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionsPage;

