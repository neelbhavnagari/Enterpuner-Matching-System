const Connection = require('./Connection');
const User = require('../users/User');

/* ─────────────────────────────────────────
   Helper: safe user id
───────────────────────────────────────── */
const getUid = (req) => req.user?._id || req.user?.id || null;

/* ─────────────────────────────────────────
   POST /api/connections/send
   Body: { receiverId, message? }
───────────────────────────────────────── */
exports.sendRequest = async (req, res) => {
  try {
    const senderId = getUid(req);
    if (!senderId) return res.status(401).json({ error: 'Not authenticated' });

    const { receiverId, message = '' } = req.body;
    if (!receiverId) return res.status(400).json({ error: 'receiverId is required' });
    if (senderId.toString() === receiverId.toString())
      return res.status(400).json({ error: 'Cannot connect with yourself' });

    // Check if already exists (either direction)
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted')
        return res.status(409).json({ error: 'Already connected' });
      if (existing.status === 'pending')
        return res.status(409).json({ error: 'Connection request already sent' });
      if (existing.status === 'rejected') {
        // Allow re-request by resetting
        existing.status = 'pending';
        existing.sender = senderId;
        existing.receiver = receiverId;
        existing.message = message;
        await existing.save();
        return res.json({ success: true, connection: existing });
      }
    }

    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    res.status(201).json({ success: true, connection });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Connection request already exists' });
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   PUT /api/connections/accept/:connectionId
───────────────────────────────────────── */
exports.acceptRequest = async (req, res) => {
  try {
    const uid = getUid(req);
    const conn = await Connection.findById(req.params.connectionId);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    const isReceiver = conn.receiver.toString() === uid?.toString();
    const isSender   = conn.sender.toString() === uid?.toString();
    if (!isReceiver && !isSender)
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    if (conn.status !== 'pending')
      return res.status(400).json({ error: 'Request is not pending' });

    conn.status = 'accepted';
    await conn.save();
    res.json({ success: true, connection: conn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   PUT /api/connections/reject/:connectionId
───────────────────────────────────────── */
exports.rejectRequest = async (req, res) => {
  try {
    const uid = getUid(req);
    const conn = await Connection.findById(req.params.connectionId);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    if (conn.receiver.toString() !== uid?.toString())
      return res.status(403).json({ error: 'Not authorized to reject this request' });

    conn.status = 'rejected';
    await conn.save();
    res.json({ success: true, connection: conn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   DELETE /api/connections/:connectionId
   (remove accepted connection or cancel sent)
───────────────────────────────────────── */
exports.removeConnection = async (req, res) => {
  try {
    const uid = getUid(req);
    const conn = await Connection.findById(req.params.connectionId);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });

    const isSender   = conn.sender.toString()   === uid?.toString();
    const isReceiver = conn.receiver.toString() === uid?.toString();
    if (!isSender && !isReceiver)
      return res.status(403).json({ error: 'Not authorized' });

    await conn.deleteOne();
    res.json({ success: true, message: 'Connection removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/connections/my
   Returns accepted connections for current user
───────────────────────────────────────── */
exports.getMyConnections = async (req, res) => {
  try {
    const uid = getUid(req);
    const connections = await Connection.find({
      $or: [{ sender: uid }, { receiver: uid }],
      status: 'accepted',
    })
      .populate('sender',   '-password')
      .populate('receiver', '-password')
      .sort({ updatedAt: -1 });

    // Return the "other" person in each connection
    const result = connections.map((c) => {
      const other = c.sender._id.toString() === uid?.toString() ? c.receiver : c.sender;
      return { connectionId: c._id, status: c.status, createdAt: c.createdAt, user: other };
    });

    res.json({ success: true, connections: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/connections/requests
   Returns pending requests received by current user
───────────────────────────────────────── */
exports.getPendingRequests = async (req, res) => {
  try {
    const uid = getUid(req);
    const requests = await Connection.find({ receiver: uid, status: 'pending' })
      .populate('sender', '-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/connections/sent
   Returns pending requests sent by current user
───────────────────────────────────────── */
exports.getSentRequests = async (req, res) => {
  try {
    const uid = getUid(req);
    const sent = await Connection.find({ sender: uid, status: 'pending' })
      .populate('receiver', '-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/connections/all-users
   Returns all users (for discovery), with connection status for each
───────────────────────────────────────── */
exports.getAllUsersWithStatus = async (req, res) => {
  try {
    const uid = getUid(req);
    const users = await User.find({}).select('-password').lean();

    // Fetch all connections involving this user
    const myConns = uid
      ? await Connection.find({
          $or: [{ sender: uid }, { receiver: uid }],
        }).lean()
      : [];

    const connMap = {};
    myConns.forEach((c) => {
      const otherId =
        c.sender.toString() === uid?.toString()
          ? c.receiver.toString()
          : c.sender.toString();
      connMap[otherId] = {
        connectionId: c._id,
        status: c.status,
        isSender: c.sender.toString() === uid?.toString(),
      };
    });

    const result = users
      .filter((u) => u._id.toString() !== uid?.toString())
      .map((u) => ({
        ...u,
        id: u._id,
        connection: connMap[u._id.toString()] || null,
      }));

    res.json({ success: true, users: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
