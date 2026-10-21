import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useClientStore from '../../store/useClientStore';
import {
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
  deleteMessageApi,
} from '../../services/apiClient';

/* ─── Role colour map ─── */
const ROLE = {
  founder:  { color: 'text-indigo-400',  bg: 'bg-indigo-500/15',  border: 'border-indigo-500/30' },
  investor: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  mentor:   { color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30' },
  team:     { color: 'text-cyan-400',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30' },
};

/* ─── Avatar ─── */
function Avatar({ user, size = 9, online = false }) {
  const r = ROLE[user?.role] || ROLE.founder;
  return (
    <div className={`relative flex-shrink-0 w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-sm ${r.bg} ${r.color} border ${r.border}`}>
      {user?.avatar
        ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        : (user?.name?.[0]?.toUpperCase() || '?')}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
      )}
    </div>
  );
}

/* ─── Format timestamp ─── */
function fmtTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/* ─── Spinner ─── */
const Spin = () => (
  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
);

/* ════════════════════════════════════════
   ChatWindow
════════════════════════════════════════ */
export function ChatWindow() {
  const location = useLocation();
  const { user } = useClientStore();
  const myId = user?._id || user?.id;

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);  // conversation object
  const [messages, setMessages]           = useState([]);
  const [inputText, setInputText]         = useState('');
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [sending, setSending]             = useState(false);
  const [error, setError]                 = useState('');
  const [toastMsg, setToastMsg]           = useState('');
  const [hoveredMsg, setHoveredMsg]       = useState(null);

  const msgEndRef  = useRef(null);
  const inputRef   = useRef(null);
  const pollRef    = useRef(null);

  /* ── Load conversation list ── */
  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversationsApi();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ── Open conversation ── */
  const openConversation = useCallback((conv) => {
    setActiveConv(conv);
    setMessages([]);
    setError('');
    loadMessages(conv);
  }, []);

  /* ── Handle navigation state to select user ── */
  useEffect(() => {
    if (location.state?.openUserId || location.state?.openUser) {
      const targetId = location.state.openUserId || location.state.openUser?._id || location.state.openUser?.id;
      const targetUser = location.state.openUser;

      if (conversations.length > 0) {
        const found = conversations.find(c => (c.user?._id || c.user?.id)?.toString() === targetId?.toString());
        if (found) {
          openConversation(found);
        } else if (targetUser) {
          const syntheticConv = {
            conversationId: `conv_${targetId}`,
            user: targetUser,
            lastMessage: null,
            unreadCount: 0,
          };
          openConversation(syntheticConv);
        }
      } else if (targetUser) {
        const syntheticConv = {
          conversationId: `conv_${targetId}`,
          user: targetUser,
          lastMessage: null,
          unreadCount: 0,
        };
        openConversation(syntheticConv);
      }
    }
  }, [location.state, conversations, openConversation]);

  /* ── Load messages for active conversation ── */
  const loadMessages = async (conv) => {
    if (!conv || !conv.user) return;
    setLoadingMsgs(true);
    try {
      const targetId = conv.user._id || conv.user.id;
      const data = await getMessagesApi(targetId);
      setMessages(data.messages || []);
      // refresh convs to clear unread badge
      loadConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMsgs(false);
    }
  };

  /* ── Poll messages every 4s when a chat is open ── */
  useEffect(() => {
    if (!activeConv) return;
    pollRef.current = setInterval(() => {
      loadMessages(activeConv);
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [activeConv]);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── Focus input when conversation opens ── */
  useEffect(() => {
    if (activeConv) inputRef.current?.focus();
  }, [activeConv]);

  /* ── Show Toast ── */
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* ── Send message ── */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !activeConv) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    // Optimistic message
    const temp = {
      _id: `temp_${Date.now()}`,
      senderId: myId,
      senderName: user?.name || 'Me',
      text,
      createdAt: new Date().toISOString(),
      _temp: true,
    };
    setMessages((prev) => [...prev, temp]);

    try {
      await sendMessageApi({
        receiverId: activeConv.user._id || activeConv.user.id,
        text,
      });
      await loadMessages(activeConv);
      await loadConversations();
    } catch (err) {
      setError(err.message);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m._id !== temp._id));
    } finally {
      setSending(false);
    }
  };

  /* ── Delete / Remove message ── */
  const handleDelete = async (msgId, isOwnMessage = true) => {
    try {
      if (isOwnMessage && !msgId.toString().startsWith('temp_')) {
        await deleteMessageApi(msgId);
      }
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
      triggerToast('Message removed ✓');
    } catch (err) {
      setError(err.message);
    }
  };

  /* ── Group messages by date ── */
  const groupedMessages = () => {
    const groups = [];
    let lastDate = null;
    messages.forEach((msg) => {
      const d = new Date(msg.createdAt).toDateString();
      if (d !== lastDate) {
        groups.push({ type: 'date', label: d === new Date().toDateString() ? 'Today' : new Date(msg.createdAt).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) });
        lastDate = d;
      }
      groups.push({ type: 'msg', msg });
    });
    return groups;
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[520px] bg-slate-900/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl relative">

      {/* Toast popup */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 rounded-full shadow-lg flex items-center gap-1.5"
          >
            <span>🗑️</span> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════
          LEFT SIDEBAR — connections
      ══════════════════════════ */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-950/40">

        {/* Sidebar header */}
        <div className="px-4 py-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              💬 <span>Messages</span>
            </h3>
            <button
              onClick={loadConversations}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Only connected users can message</p>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs && (
            <div className="py-8 flex flex-col items-center gap-2">
              <Spin />
              <p className="text-xs text-slate-500">Loading…</p>
            </div>
          )}

          {!loadingConvs && conversations.length === 0 && (
            <div className="px-4 py-10 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <p className="text-xs font-semibold text-slate-400">No connections yet</p>
              <p className="text-[10px] text-slate-600 mt-1.5 leading-relaxed">
                Connect with founders, investors &amp; mentors to start chatting.
              </p>
            </div>
          )}

          <div className="py-1">
            {conversations.map((conv) => {
              const isActive = activeConv?.conversationId === conv.conversationId;
              const r = ROLE[conv.user?.role] || ROLE.founder;
              return (
                <button
                  key={conv.conversationId}
                  onClick={() => openConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2 ${
                    isActive
                      ? 'bg-slate-800/80 border-indigo-500'
                      : 'border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  <Avatar user={conv.user} size={9} online={isActive} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-100 truncate">{conv.user?.name}</span>
                      {conv.lastMessage && (
                        <span className="text-[9px] text-slate-500 flex-shrink-0 ml-1">{fmtTime(conv.lastMessage?.createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-500 truncate">
                        {conv.lastMessage
                          ? (conv.lastMessage.senderId?.toString() === myId?.toString() ? 'You: ' : '') + conv.lastMessage.text
                          : <span className={`${r.color}`}>Start chatting →</span>
                        }
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-1 flex-shrink-0 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-semibold ${r.color} mt-0.5 block`}>{r.label || conv.user?.role}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          RIGHT PANEL — chat area
      ══════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* No conversation selected */}
        {!activeConv && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">
              💬
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-200 mb-1">Your Messages</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Select a connection from the list to start a private conversation. You can only message people you are connected with.
              </p>
            </div>
          </div>
        )}

        {/* Active chat */}
        {activeConv && (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
              <Avatar user={activeConv.user} size={10} online />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100">{activeConv.user?.name}</p>
                <p className="text-[10px] text-slate-500">{activeConv.user?.title || activeConv.user?.role} · <span className="text-emerald-400">Connected</span></p>
              </div>
              <button
                onClick={() => setActiveConv(null)}
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-4 mt-2 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                ⚠️ {error}
                <button onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-300">✕</button>
              </div>
            )}

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {loadingMsgs && messages.length === 0 && (
                <div className="py-8 flex flex-col items-center gap-2">
                  <Spin />
                  <p className="text-xs text-slate-500">Loading messages…</p>
                </div>
              )}

              {!loadingMsgs && messages.length === 0 && (
                <div className="py-10 text-center">
                  <div className="text-2xl mb-2">👋</div>
                  <p className="text-xs text-slate-400 font-semibold">No messages yet</p>
                  <p className="text-[10px] text-slate-600 mt-1">Say hello to {activeConv.user?.name}!</p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {groupedMessages().map((item, idx) => {
                  if (item.type === 'date') {
                    return (
                      <div key={`date-${idx}`} className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
                        <div className="flex-1 h-px bg-slate-800" />
                      </div>
                    );
                  }

                  const msg = item.msg;
                  const isMe = msg.senderId?.toString() === myId?.toString();

                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setHoveredMsg(msg._id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-2`}
                    >
                      <div className={`relative flex items-center gap-2 max-w-[72%] ${isMe ? 'flex-row-reverse' : ''}`}>
                        {!isMe && <Avatar user={activeConv.user} size={7} />}

                        <div className="flex flex-col">
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                              isMe
                                ? `bg-indigo-600 text-white rounded-br-sm ${msg._temp ? 'opacity-70' : ''}`
                                : 'bg-slate-800 text-slate-100 border border-slate-700/70 rounded-bl-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className={`text-[9px] text-slate-600 mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {fmtTime(msg.createdAt)}
                            {msg._temp && ' · sending…'}
                          </span>
                        </div>

                        {/* Delete / Remove message button */}
                        {!msg._temp && hoveredMsg === msg._id && (
                          <button
                            onClick={() => handleDelete(msg._id, isMe)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title={isMe ? "Delete message" : "Remove message from view"}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={msgEndRef} />
            </div>

            {/* Input row */}
            <form
              onSubmit={handleSend}
              className="flex items-end gap-3 px-4 py-3.5 border-t border-slate-800 bg-slate-900/40"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={`Message ${activeConv.user?.name}…`}
                  className="w-full resize-none px-4 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
                  style={{ minHeight: 42, maxHeight: 120 }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-2xl transition-all shadow-md shadow-indigo-500/20 disabled:shadow-none"
              >
                {sending
                  ? <Spin />
                  : (
                    <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  )
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
