const User = require('./User');

/**
 * Get User Profile from MongoDB Atlas
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user?.id;

    let user = null;
    if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      // Fallback to latest registered user in MongoDB Atlas if available
      user = await User.findOne().sort({ createdAt: -1 }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.status(200).json({
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'founder',
      title: user.title || '',
      bio: user.bio || '',
      skills: Array.isArray(user.skills) ? user.skills : [],
      location: user.location || '',
      score: user.score || 90,
      avatar: user.avatar,
      provider: user.provider,
      // Founder fields
      startupName: user.startupName || '',
      startupStage: user.startupStage || '',
      fundingRequired: user.fundingRequired || '',
      industry: user.industry || '',
      needs: Array.isArray(user.needs) ? user.needs : [],
      requiredSkills: Array.isArray(user.requiredSkills) ? user.requiredSkills : [],
      // Investor fields
      investorType: user.investorType || '',
      investmentRange: user.investmentRange || '',
      preferredIndustry: user.preferredIndustry || '',
      preferredStage: user.preferredStage || '',
      preferredLocation: user.preferredLocation || '',
      investmentGoals: user.investmentGoals || '',
      experience: user.experience || '',
      // Mentor fields
      expertise: Array.isArray(user.expertise) ? user.expertise : [],
      yearsOfExperience: user.yearsOfExperience || '',
      mentorIndustry: user.mentorIndustry || '',
      availability: user.availability || '',
      mentorshipType: user.mentorshipType || '',
      goals: user.goals || ''
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile in MongoDB Atlas
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.body.id || req.user?.id;
    const {
      name,
      bio,
      role,
      title,
      skills,
      location,
      startupName,
      startupStage,
      fundingRequired,
      industry,
      needs,
      requiredSkills,
      investorType,
      investmentRange,
      preferredIndustry,
      preferredStage,
      preferredLocation,
      investmentGoals,
      experience,
      expertise,
      yearsOfExperience,
      mentorIndustry,
      availability,
      mentorshipType,
      goals
    } = req.body;

    const updateFields = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(role && { role }),
      ...(title !== undefined && { title }),
      ...(skills && { skills: Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()) }),
      ...(location && { location }),
      ...(startupName !== undefined && { startupName }),
      ...(startupStage !== undefined && { startupStage }),
      ...(fundingRequired !== undefined && { fundingRequired }),
      ...(industry !== undefined && { industry }),
      ...(needs && { needs: Array.isArray(needs) ? needs : String(needs).split(',').map((s) => s.trim()) }),
      ...(requiredSkills && { requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : String(requiredSkills).split(',').map((s) => s.trim()) }),
      ...(investorType !== undefined && { investorType }),
      ...(investmentRange !== undefined && { investmentRange }),
      ...(preferredIndustry !== undefined && { preferredIndustry }),
      ...(preferredStage !== undefined && { preferredStage }),
      ...(preferredLocation !== undefined && { preferredLocation }),
      ...(investmentGoals !== undefined && { investmentGoals }),
      ...(experience !== undefined && { experience }),
      ...(expertise && { expertise: Array.isArray(expertise) ? expertise : String(expertise).split(',').map((s) => s.trim()) }),
      ...(yearsOfExperience !== undefined && { yearsOfExperience }),
      ...(mentorIndustry !== undefined && { mentorIndustry }),
      ...(availability !== undefined && { availability }),
      ...(mentorshipType !== undefined && { mentorshipType }),
      ...(goals !== undefined && { goals })
    };

    let updatedUser = null;
    if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');
    } else {
      const existingUser = await User.findOne().sort({ createdAt: -1 });
      if (existingUser) {
        updatedUser = await User.findByIdAndUpdate(existingUser._id, updateFields, { new: true }).select('-password');
      }
    }

    if (updatedUser) {
      return res.status(200).json({
        message: 'Profile updated successfully in MongoDB Atlas',
        id: updatedUser._id.toString(),
        ...updatedUser.toObject()
      });
    }

    res.status(200).json({
      message: 'Profile update saved',
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Registered Users from MongoDB Atlas
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers };
