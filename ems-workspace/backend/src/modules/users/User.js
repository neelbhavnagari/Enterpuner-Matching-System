const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        return this.provider === 'email';
      }
    },
    role: {
      type: String,
      enum: ['founder', 'investor', 'mentor', 'team'],
      default: 'founder'
    },
    provider: {
      type: String,
      default: 'email'
    },
    avatar: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
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
      default: 92
    },
    // Founder profile fields
    startupName: { type: String, default: '' },
    startupStage: { type: String, default: '' },
    fundingRequired: { type: String, default: '' },
    industry: { type: String, default: '' },
    needs: { type: [String], default: [] },
    requiredSkills: { type: [String], default: [] },

    // Investor profile fields
    investorType: { type: String, default: '' },
    investmentRange: { type: String, default: '' },
    preferredIndustry: { type: String, default: '' },
    preferredStage: { type: String, default: '' },
    preferredLocation: { type: String, default: '' },
    investmentGoals: { type: String, default: '' },
    experience: { type: String, default: '' },

    // Mentor profile fields
    expertise: { type: [String], default: [] },
    yearsOfExperience: { type: String, default: '' },
    mentorIndustry: { type: String, default: '' },
    availability: { type: String, default: '' },
    mentorshipType: { type: String, default: '' },
    goals: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
