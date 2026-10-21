const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['founder', 'investor', 'mentor', 'team'],
      default: 'founder'
    },
    category: {
      type: String,
      default: 'General'
    },
    status: {
      type: String,
      default: 'Seeking Co-Founder'
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      default: 'Remote'
    },
    score: {
      type: Number,
      default: 90
    },
    stage: {
      type: String,
      default: ''
    },
    fundingRequired: {
      type: String,
      default: ''
    },
    problemSolved: {
      type: String,
      default: ''
    },
    targetUsers: {
      type: String,
      default: ''
    },
    teamSize: {
      type: String,
      default: ''
    },
    founderName: {
      type: String,
      default: ''
    },
    needs: {
      type: [String],
      default: []
    },
    industry: {
      type: String,
      default: ''
    },
    // Investor metadata if listing is by investor
    investorType: { type: String, default: '' },
    investmentRange: { type: String, default: '' },
    investmentPortfolio: { type: String, default: '' },
    preferredIndustry: { type: String, default: '' },
    preferredStage: { type: String, default: '' },
    investmentGoals: { type: String, default: '' },
    investmentExperience: { type: String, default: '' },
    avatar: { type: String, default: '' },
    about: { type: String, default: '' },
    // Mentor metadata if listing is by mentor
    expertise: { type: [String], default: [] },
    yearsOfExperience: { type: String, default: '' },
    availability: { type: String, default: '' },
    mentorshipType: { type: String, default: '' },
    goals: { type: String, default: '' },
    patentStatus: {
      type: String,
      default: 'No Patent'
    },
    isPatented: {
      type: Boolean,
      default: false
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Startup', startupSchema);
