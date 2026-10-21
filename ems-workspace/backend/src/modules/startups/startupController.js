const Startup = require('./Startup');
const User = require('../users/User');
const { rankCandidatesWithTfidf } = require('../../services/tfidfMatcher');

/**
 * Get dynamic startup & member matches ranked using TF-IDF and Cosine Similarity
 */
const getStartups = async (req, res, next) => {
  try {
    // Fetch actual startup listings created in MongoDB Atlas
    const startups = await Startup.find().sort({ createdAt: -1 });

    const startupProfiles = startups.map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      name: s.name || '',
      role: s.role || 'founder',
      title: s.title || '',
      category: s.category || s.industry || 'FinTech',
      industry: s.industry || s.category || '',
      status: s.status || 'Seeking Co-Founder',
      score: s.score || 90,
      stage: s.stage || '',
      fundingRequired: s.fundingRequired || '',
      problemSolved: s.problemSolved || '',
      targetUsers: s.targetUsers || '',
      teamSize: s.teamSize || '',
      founderName: s.founderName || s.name || '',
      founderId: s.founderId ? s.founderId.toString() : null,
      needs: Array.isArray(s.needs) ? s.needs : [],
      bio: s.bio || s.about || '',
      skills: Array.isArray(s.skills) ? s.skills : [],
      location: s.location || 'Remote',
      avatar: s.avatar || '',
      investorType: s.investorType || '',
      investmentRange: s.investmentRange || '',
      investmentPortfolio: s.investmentPortfolio || '',
      preferredIndustry: s.preferredIndustry || '',
      preferredStage: s.preferredStage || '',
      investmentGoals: s.investmentGoals || '',
      investmentExperience: s.investmentExperience || s.yearsOfExperience || s.experience || '',
      experience: s.investmentExperience || s.yearsOfExperience || s.experience || '',
      about: s.about || s.bio || '',
      expertise: Array.isArray(s.expertise) ? s.expertise : [],
      yearsOfExperience: s.yearsOfExperience || '',
      availability: s.availability || '',
      goals: s.goals || s.investmentGoals || '',
      mentorshipType: s.mentorshipType || '',
      patentStatus: s.patentStatus || 'No Patent',
      isPatented: s.isPatented || false
    }));

    // If authenticated user is present, calculate TF-IDF & Cosine Similarity ranking!
    const currentUser = req.user || null;
    if (currentUser) {
      try {
        const mlRes = await fetch('http://localhost:8000/rank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: currentUser,
            candidates: startupProfiles
          })
        });
        if (mlRes.ok) {
          const mlData = await mlRes.json();
          if (mlData.matches && mlData.matches.length > 0) {
            return res.status(200).json(mlData.matches);
          }
        }
      } catch (mlErr) {
        // Fallback to native Node.js TF-IDF engine if ML service is unreachable
      }

      const tfidfRanked = rankCandidatesWithTfidf(currentUser, startupProfiles);
      return res.status(200).json(tfidfRanked);
    }

    res.status(200).json(startupProfiles);
  } catch (error) {
    next(error);
  }
};

/**
 * Force recalculate TF-IDF & Cosine Similarity matches for user profile
 */
const recalculateTfidfMatches = async (req, res, next) => {
  try {
    const userProfile = req.body?.user || req.user || {};
    const startups = await Startup.find().sort({ createdAt: -1 });

    const startupProfiles = startups.map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      name: s.name || '',
      role: s.role || 'founder',
      title: s.title || '',
      category: s.category || s.industry || 'FinTech',
      industry: s.industry || s.category || '',
      status: s.status || 'Seeking Co-Founder',
      stage: s.stage || '',
      fundingRequired: s.fundingRequired || '',
      problemSolved: s.problemSolved || '',
      targetUsers: s.targetUsers || '',
      teamSize: s.teamSize || '',
      founderName: s.founderName || s.name || '',
      founderId: s.founderId ? s.founderId.toString() : null,
      bio: s.bio || '',
      skills: Array.isArray(s.skills) ? s.skills : [],
      location: s.location || 'Remote',
      investmentRange: s.investmentRange || '',
      preferredIndustry: s.preferredIndustry || '',
      preferredStage: s.preferredStage || '',
      expertise: Array.isArray(s.expertise) ? s.expertise : []
    }));

    try {
      const mlRes = await fetch('http://localhost:8000/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userProfile,
          candidates: startupProfiles
        })
      });
      if (mlRes.ok) {
        const mlData = await mlRes.json();
        return res.status(200).json({
          success: true,
          algorithm: 'TF-IDF & Cosine Similarity (Python ML)',
          matches: mlData.matches
        });
      }
    } catch (err) {
      // Fallback
    }

    const ranked = rankCandidatesWithTfidf(userProfile, startupProfiles);
    res.status(200).json({
      success: true,
      algorithm: 'TF-IDF & Cosine Similarity (Node Engine)',
      matches: ranked
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Startup / Member listing in MongoDB Atlas
 */
const createStartup = async (req, res, next) => {
  try {
    const {
      name,
      title,
      role,
      category,
      industry,
      status,
      stage,
      fundingRequired,
      problemSolved,
      targetUsers,
      teamSize,
      founderName,
      needs,
      bio,
      skills,
      location,
      investorType,
      investmentRange,
      preferredIndustry,
      preferredStage,
      investmentPortfolio,
      investmentGoals,
      goals,
      investmentExperience,
      experience,
      about,
      avatar,
      expertise,
      yearsOfExperience,
      availability,
      mentorshipType,
      patentStatus,
      isPatented
    } = req.body;

    if (!name || (!title && !bio && !about)) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const pStatus = patentStatus || 'No Patent';
    const pPatented = isPatented !== undefined ? Boolean(isPatented) : (pStatus !== 'No Patent');
    const effectiveRole = role || req.user?.role || 'founder';

    const newStartup = await Startup.create({
      name,
      title: title || (about || bio || '').slice(0, 60),
      role: effectiveRole,
      category: category || industry || preferredIndustry || 'General',
      industry: industry || category || preferredIndustry || '',
      status: status || (effectiveRole === 'investor' ? 'Active Capital' : effectiveRole === 'mentor' ? 'Active Mentor' : 'Seeking Co-Founder'),
      stage: stage || preferredStage || '',
      fundingRequired: fundingRequired || '',
      problemSolved: problemSolved || '',
      targetUsers: targetUsers || '',
      teamSize: teamSize || '',
      founderName: founderName || req.user?.name || name,
      needs: Array.isArray(needs) ? needs : (needs ? String(needs).split(',').map(s => s.trim()) : []),
      bio: bio || about || '',
      about: about || bio || '',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()) : []),
      location: location || '',
      avatar: avatar || '',
      score: Math.floor(Math.random() * 8) + 88,
      investorType: investorType || '',
      investmentRange: investmentRange || '',
      investmentPortfolio: investmentPortfolio || '',
      preferredIndustry: preferredIndustry || '',
      preferredStage: preferredStage || '',
      investmentGoals: investmentGoals || goals || '',
      goals: goals || investmentGoals || '',
      investmentExperience: investmentExperience || experience || yearsOfExperience || '',
      expertise: Array.isArray(expertise) ? expertise : (expertise ? String(expertise).split(',').map(s => s.trim()) : []),
      yearsOfExperience: yearsOfExperience || experience || investmentExperience || '',
      availability: availability || '',
      mentorshipType: mentorshipType || '',
      patentStatus: pStatus,
      isPatented: pPatented,
      founderId: req.user?._id || req.user?.id || null
    });

    res.status(201).json({
      message: 'Listing created successfully and stored in MongoDB Atlas',
      startup: newStartup
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Startup listing in MongoDB Atlas (Owner only)
 */
const updateStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;
    const userRole = (req.user?.role || '').toLowerCase();

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const isOwner = startup.founderId && startup.founderId.toString() === userId.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'You are only authorized to edit your own listings' });
    }

    if ((userRole === 'investor' || userRole === 'mentor') && startup.role === 'founder') {
      return res.status(403).json({ error: 'Investors and Mentors are not permitted to edit founder listings.' });
    }

    const {
      name,
      title,
      role,
      category,
      industry,
      status,
      stage,
      fundingRequired,
      problemSolved,
      targetUsers,
      teamSize,
      needs,
      bio,
      skills,
      location,
      investorType,
      investmentRange,
      preferredIndustry,
      preferredStage,
      investmentPortfolio,
      investmentGoals,
      investmentExperience,
      experience,
      about,
      avatar,
      expertise,
      yearsOfExperience,
      availability,
      mentorshipType,
      patentStatus,
      isPatented
    } = req.body;

    if (name !== undefined) startup.name = name;
    if (title !== undefined) startup.title = title;
    if (role !== undefined) startup.role = role;
    if (category !== undefined) startup.category = category;
    if (industry !== undefined) startup.industry = industry || category;
    if (status !== undefined) startup.status = status;
    if (stage !== undefined) startup.stage = stage;
    if (fundingRequired !== undefined) startup.fundingRequired = fundingRequired;
    if (problemSolved !== undefined) startup.problemSolved = problemSolved;
    if (targetUsers !== undefined) startup.targetUsers = targetUsers;
    if (teamSize !== undefined) startup.teamSize = teamSize;
    if (needs !== undefined) startup.needs = Array.isArray(needs) ? needs : (needs ? String(needs).split(',').map(s => s.trim()) : []);
    if (bio !== undefined) startup.bio = bio;
    if (about !== undefined) startup.about = about;
    if (skills !== undefined) startup.skills = Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()) : []);
    if (location !== undefined) startup.location = location;
    if (avatar !== undefined) startup.avatar = avatar;
    if (investorType !== undefined) startup.investorType = investorType;
    if (investmentRange !== undefined) startup.investmentRange = investmentRange;
    if (investmentPortfolio !== undefined) startup.investmentPortfolio = investmentPortfolio;
    if (preferredIndustry !== undefined) startup.preferredIndustry = preferredIndustry;
    if (preferredStage !== undefined) startup.preferredStage = preferredStage;
    if (investmentGoals !== undefined) startup.investmentGoals = investmentGoals;
    if (investmentExperience !== undefined) startup.investmentExperience = investmentExperience;
    if (experience !== undefined && !investmentExperience) startup.investmentExperience = experience;
    if (expertise !== undefined) startup.expertise = Array.isArray(expertise) ? expertise : (expertise ? String(expertise).split(',').map(s => s.trim()) : []);
    if (yearsOfExperience !== undefined) startup.yearsOfExperience = yearsOfExperience;
    if (availability !== undefined) startup.availability = availability;
    if (mentorshipType !== undefined) startup.mentorshipType = mentorshipType;
    if (patentStatus !== undefined) {
      startup.patentStatus = patentStatus;
      startup.isPatented = patentStatus !== 'No Patent';
    }
    if (isPatented !== undefined) startup.isPatented = isPatented;

    await startup.save();

    res.status(200).json({
      message: 'Listing updated successfully',
      startup
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Startup listing from MongoDB Atlas (Owner only)
 */
const deleteStartup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;
    const userRole = (req.user?.role || '').toLowerCase();

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ error: 'Startup listing not found' });
    }

    const isOwner = startup.founderId && startup.founderId.toString() === userId.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'You are only authorized to delete your own listings' });
    }

    if ((userRole === 'investor' || userRole === 'mentor') && startup.role === 'founder') {
      return res.status(403).json({ error: 'Investors and Mentors are not permitted to delete founder listings.' });
    }

    await startup.deleteOne();

    res.status(200).json({
      message: 'Listing deleted successfully',
      id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStartups,
  recalculateTfidfMatches,
  createStartup,
  updateStartup,
  deleteStartup
};
