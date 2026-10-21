const Message = require('./Message');
const Connection = require('../connections/Connection');

/* ── helper: get authenticated user id ── */
const uid = (req) => req.user?._id || req.user?.id || null;

/* ── verify two users are connected ── */
const areConnected = async (idA, idB) => {
  const conn = await Connection.findOne({
    $or: [
      { sender: idA, receiver: idB },
      { sender: idB, receiver: idA },
    ],
    status: 'accepted',
  });
  return !!conn;
};

/* ──────────────────────────────────────────
   GET /api/messages/conversations
   Returns all people the current user has had
   chats with (from accepted connections), with
   the last message and unread count per convo.
────────────────────────────────────────── */
exports.getConversations = async (req, res) => {
  try {
    const me = uid(req);
    if (!me) return res.status(401).json({ error: 'Not authenticated' });

    // Get my accepted connections
    const connections = await Connection.find({
      $or: [{ sender: me }, { receiver: me }],
      status: 'accepted',
    })
      .populate('sender',   'name email role title avatar')
      .populate('receiver', 'name email role title avatar');

    const conversations = await Promise.all(
      connections.map(async (conn) => {
        const other = conn.sender._id.toString() === me.toString()
          ? conn.receiver
          : conn.sender;

        const convId = Message.conversationId(me, other._id);

        const lastMsg = await Message.findOne({ conversationId: convId })
          .sort({ createdAt: -1 });

        const unread = await Message.countDocuments({
          conversationId: convId,
          receiverId: me,
          read: false,
        });

        return {
          conversationId: convId,
          user: other,
          lastMessage: lastMsg || null,
          unreadCount: unread,
        };
      })
    );

    // Sort by last message date, most recent first
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return new Date(bTime) - new Date(aTime);
    });

    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────
   GET /api/messages/:otherUserId
   Returns all messages in a conversation
────────────────────────────────────────── */
exports.getMessages = async (req, res) => {
  try {
    const me = uid(req);
    if (!me) return res.status(401).json({ error: 'Not authenticated' });

    const { otherUserId } = req.params;

    // Only connected users can chat
    const connected = await areConnected(me, otherUserId);
    if (!connected)
      return res.status(403).json({ error: 'You can only chat with your connections' });

    const convId = Message.conversationId(me, otherUserId);
    const messages = await Message.find({ conversationId: convId })
      .sort({ createdAt: 1 })
      .limit(200);

    // Mark incoming messages as read
    await Message.updateMany(
      { conversationId: convId, receiverId: me, read: false },
      { read: true }
    );

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────
   POST /api/messages/send
   Body: { receiverId, text }
────────────────────────────────────────── */
exports.sendMessage = async (req, res) => {
  try {
    const me = uid(req);
    if (!me) return res.status(401).json({ error: 'Not authenticated' });

    const { receiverId, text } = req.body;
    if (!receiverId) return res.status(400).json({ error: 'receiverId is required' });
    if (!text?.trim()) return res.status(400).json({ error: 'Message text is required' });

    // Only connected users can message each other
    const connected = await areConnected(me, receiverId);
    if (!connected)
      return res.status(403).json({ error: 'You can only message your connections' });

    const convId = Message.conversationId(me, receiverId);

    const message = await Message.create({
      conversationId: convId,
      senderId: me,
      senderName: req.user?.name || 'User',
      receiverId,
      text: text.trim(),
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────
   DELETE /api/messages/:messageId
   Delete own message
────────────────────────────────────────── */
exports.deleteMessage = async (req, res) => {
  try {
    const me = uid(req);
    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    if (msg.senderId.toString() !== me?.toString())
      return res.status(403).json({ error: 'Not authorized' });

    await msg.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
