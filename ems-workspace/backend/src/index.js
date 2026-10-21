const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/db');

const authRoutes = require('./modules/auth/authRoutes');
const userRoutes = require('./modules/users/userRoutes');
const startupRoutes = require('./modules/startups/startupRoutes');
const messageRoutes = require('./modules/messages/messageRoutes');
const connectionRoutes = require('./modules/connections/connectionRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Dynamic REST API Routes
// http://localhost:5001/api/auth/
// http://localhost:5001/api/users/
// http://localhost:5001/api/startups/
// http://localhost:5001/api/messages/
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connections', connectionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ems-backend' });
});

// Global Error Handler
app.use(errorMiddleware);

connectDB();

const server = app.listen(env.port, () => {
  console.log(`EMS Backend API server running on port ${env.port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${env.port} is already in use by another process.`);
    console.error(`To fix, stop the running backend process or run: npx kill-port ${env.port}`);
    process.exit(1);
  } else {
    console.error('[ERROR] Server error:', err);
  }
});
