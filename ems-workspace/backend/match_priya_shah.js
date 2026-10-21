const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./src/config/env');
const { rankCandidatesWithTfidf } = require('./src/services/tfidfMatcher');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const priyaProfile = {
  name: 'Priya Shah',
  email: 'priyashah@investor.com',
  role: 'investor',
  investmentRange: '₹10L – ₹50L',
  preferredIndustry: 'AI, FinTech, HealthTech',
  industry: 'AI, FinTech, HealthTech',
  category: 'AI / FinTech / HealthTech',
  preferredStage: 'Idea / Seed',
  stage: 'Idea / Seed',
  location: 'Pune',
  experience: '8 Years',
  investmentGoals: 'Early-stage technology startups',
  goals: 'Early-stage technology startups',
  bio: 'Interested in supporting promising technology startups.',
  about: 'Interested in supporting promising technology startups.',
  title: 'Angel Investor (AI, FinTech, HealthTech)',
  skills: ['AI/ML', 'FinTech', 'HealthTech', 'Venture Capital', 'Startup Investment']
};

async function executeMatching() {
  try {
    console.log('Connecting to MongoDB Atlas using backend config...');
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas\n');

    const User = mongoose.connection.collection('users');
    const Startup = mongoose.connection.collection('startups');

    // 1. Upsert Priya Shah in Users collection
    let existingPriya = await User.findOne({ email: priyaProfile.email });
    if (!existingPriya) {
      const res = await User.insertOne({
        ...priyaProfile,
        password: '$2b$10$71kjF32vJ97ibDDnbQ.jN.3kifE5Uwl8Tco9cRvVsm3taH1WyQfha',
        score: 95,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      existingPriya = { _id: res.insertedId, ...priyaProfile };
      console.log('👤 Created Priya Shah Investor Profile in MongoDB Users collection.');
    } else {
      await User.updateOne({ email: priyaProfile.email }, { $set: priyaProfile });
      console.log('👤 Updated Priya Shah Investor Profile in MongoDB Users collection.');
    }

    // 2. Fetch all candidate Founders & Mentors
    const userDocs = await User.find({ email: { $ne: priyaProfile.email } }).toArray();
    const startupDocs = await Startup.find({}).toArray();

    const candidates = [];

    // Map startups (Founders)
    startupDocs.forEach(s => {
      candidates.push({
        id: s._id.toString(),
        name: s.name,
        role: s.role || 'founder',
        title: s.title || '',
        category: s.category || s.industry || 'FinTech',
        industry: s.industry || s.category || 'AI/ML',
        stage: s.stage || 'Seed Stage',
        fundingRequired: s.fundingRequired || '₹10L - ₹50L',
        bio: s.bio || '',
        skills: Array.isArray(s.skills) ? s.skills : (s.skills ? [s.skills] : ['AI/ML']),
        location: s.location || 'Remote',
        founderName: s.founderName || s.name
      });
    });

    // Map users (Founders & Mentors)
    userDocs.forEach(u => {
      if (!candidates.some(c => c.name?.toLowerCase() === u.name?.toLowerCase())) {
        const userRole = u.role || (u.email?.includes('mentor') ? 'mentor' : 'founder');
        candidates.push({
          id: u._id.toString(),
          name: u.name,
          role: userRole,
          title: u.title || (userRole === 'mentor' ? 'Senior Advisory & Startup Mentor' : 'Startup Founder'),
          category: u.mentorIndustry || u.industry || 'AI & FinTech',
          industry: u.mentorIndustry || u.industry || 'AI/ML',
          stage: u.startupStage || u.preferredStage || 'Seed Stage',
          fundingRequired: u.fundingRequired || '₹20 Lakhs',
          bio: u.bio || u.goals || u.investmentGoals || 'Passionate about building scalable AI and FinTech products.',
          skills: Array.isArray(u.skills) && u.skills.length > 0 ? u.skills : (Array.isArray(u.expertise) && u.expertise.length > 0 ? u.expertise : ['AI/ML', 'React', 'Node.js']),
          location: u.location || 'Remote'
        });
      }
    });

    console.log(`🔍 Running TF-IDF & Cosine Similarity algorithm for Priya Shah against ${candidates.length} profiles...\n`);

    const rankedMatches = rankCandidatesWithTfidf(priyaProfile, candidates);

    console.log('===============================================================');
    console.log('⚡ TF-IDF & COSINE SIMILARITY MATCH RESULTS FOR PRIYA SHAH');
    console.log('===============================================================\n');

    rankedMatches.forEach((m, idx) => {
      console.log(`Rank #${idx + 1}: ${m.name} (${m.role.toUpperCase()})`);
      console.log(`   - TF-IDF Cosine Match Score: ${m.score}%`);
      console.log(`   - Title/Headline: "${m.title}"`);
      console.log(`   - Bio/Description: "${m.bio.slice(0, 70)}..."`);
      console.log(`   - Shared TF-IDF Terms: [${(m.matchDetails?.matchedKeywords || []).join(', ')}]`);
      console.log(`   - Category / Stage / Location: ${m.category} | ${m.stage || 'Seed'} | ${m.location}`);
      console.log('---------------------------------------------------------------');
    });

    process.exit(0);
  } catch (err) {
    console.error('Error executing matching:', err);
    process.exit(1);
  }
}

executeMatching();
