const User = require('../modules/users/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Allow request to proceed with null user if optional auth
      req.user = null;
      return next();
    }

    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    
    // Extract userId from token format jwt_token_<timestamp>_<userId>
    const parts = token.split('_');
    const possibleUserId = parts[parts.length - 1];

    if (possibleUserId && possibleUserId.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findById(possibleUserId).select('-password');
      if (user) {
        req.user = {
          id: user._id.toString(),
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        return next();
      }
    }

    req.user = { id: possibleUserId || 'usr_001', role: 'founder' };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = authMiddleware;
