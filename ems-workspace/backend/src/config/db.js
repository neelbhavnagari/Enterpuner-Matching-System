const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

// Ensure DNS uses Google & Cloudflare DNS for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    isConnected = true;
    console.log(`[DB] Successfully connected to MongoDB Atlas database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn('[DB] Connection notice:', error.message);
    if (error.message.includes('authentication failed')) {
      console.warn('[DB] Please check MongoDB Atlas username/password permissions in backend/.env');
    }
    console.log('[DB] Running in resilient hybrid mode with local memory fallback.');
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
