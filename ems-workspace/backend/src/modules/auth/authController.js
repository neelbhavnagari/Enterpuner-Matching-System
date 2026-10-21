
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../users/User');

/**
 * Register User Controller targeting MongoDB Atlas
 */
const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if mongoose is connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'MongoDB Atlas is not connected (bad auth: authentication failed). Please verify your Database Username & Password in backend/.env'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists in MongoDB' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save document to MongoDB Atlas
    const newUser = await User.create({
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'founder',
      provider: 'email',
      skills: Array.isArray(req.body.skills) ? req.body.skills : []
    });

    const token = `jwt_token_${Date.now()}_${newUser._id}`;

    res.status(201).json({
      message: 'User registered successfully and stored in MongoDB Atlas',
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        provider: newUser.provider,
        avatar: newUser.avatar,
        skills: newUser.skills
      }
    });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('buffering timed out') || error.message.includes('auth')) {
      return res.status(500).json({
        error: 'MongoDB Atlas Error: Could not save user to database due to authentication failure (code 8000). Please check your .env credentials.'
      });
    }
    next(error);
  }
};

/**
 * Login User Controller targeting MongoDB Atlas
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'MongoDB Atlas is not connected (bad auth: authentication failed). Please verify your Database Username & Password in backend/.env'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();


    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database. Please sign up first.' });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }

    const token = `jwt_token_${Date.now()}_${user._id}`;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
        skills: user.skills
      }
    });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('buffering timed out') || error.message.includes('auth')) {
      return res.status(500).json({
        error: 'MongoDB Atlas Error: Authentication failed with MongoDB Atlas (code 8000). Please check your .env credentials.'
      });
    }
    next(error);
  }
};

/**
 * Google Auth Controller targeting MongoDB Atlas
 */
const googleAuthUser = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'MongoDB Atlas is not connected (bad auth: authentication failed). Please verify your Database Username & Password in backend/.env'
      });
    }

    let { email, name, avatar, role, credential } = req.body || {};

    // Decode Google ID Token (credential) if provided by Google Identity Services SDK
    if (credential && !email) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          if (payload && payload.email) {
            email = payload.email;
            name = payload.name || payload.given_name || email.split('@')[0];
            avatar = payload.picture || avatar || null;
          }
        }
      } catch (err) {
        console.warn('Failed to parse Google credential token:', err.message);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Google email is required' });
    }

    const googleEmail = email.toLowerCase().trim();
    const googleName = name || googleEmail.split('@')[0];
    const googleAvatar = avatar || null;

    let user = await User.findOne({ email: googleEmail });
    if (!user) {
      user = await User.create({
        name: googleName,
        email: googleEmail,
        role: role || 'founder',
        provider: 'google',
        avatar: googleAvatar,
        skills: Array.isArray(req.body.skills) ? req.body.skills : []
      });
    } else {
      let updated = false;
      if (googleAvatar && user.avatar !== googleAvatar) {
        user.avatar = googleAvatar;
        updated = true;
      }
      if (googleName && (!user.name || user.name === user.email.split('@')[0])) {
        user.name = googleName;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    const token = `jwt_google_token_${Date.now()}_${user._id}`;

    res.status(200).json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
        skills: user.skills
      }
    });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('buffering timed out') || error.message.includes('auth')) {
      return res.status(500).json({
        error: 'MongoDB Atlas Error: Authentication failed with MongoDB Atlas (code 8000). Please check your .env credentials.'
      });
    }
    next(error);
  }
};

module.exports = { registerUser, loginUser, googleAuthUser };

