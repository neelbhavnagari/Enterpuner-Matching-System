const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = process.env.MONGO_URI;

console.log('Testing connection to MONGO_URI...');

mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then((conn) => {
    console.log('SUCCESS: Connected to MongoDB Atlas!', conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR connecting to MongoDB Atlas:');
    console.error(err);
    process.exit(1);
  });
