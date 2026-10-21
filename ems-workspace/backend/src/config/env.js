require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ems_db',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
};
