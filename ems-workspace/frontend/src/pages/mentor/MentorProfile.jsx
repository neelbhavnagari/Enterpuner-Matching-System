import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useClientStore from '../../store/useClientStore';

export function MentorProfile() {
  const { user, updateUser } = useClientStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State containing all 10 required mentor profile fields
  const [formData, setFormData] = useState({
    // 1. Name
    name: user?.name || 'Dr. Marcus Vance',
    // 2. Profile Photo
    avatar:
      user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    // 3. Expertise
    expertise: user?.expertise || [
      'Go-To-Market (GTM) Strategy',
      'Product-Market Fit (PMF)',
      'Series A Pitch Deck Coaching',
      'Scalable Tech Architecture',
    ],
    // 4. Skills
    skills: user?.skills || [
      'Strategic Advisory',
      'Pitch Coaching',
      'Fractional CPO/CTO',
      'Cap Table & Governance',
    ],
    // 5. Years of Experience
    yearsOfExperience: user?.yearsOfExperience || '12+ Years (Ex-VP of Growth @ ScaleUp, 3 Startup Exits)',
    // 6. Industry
    industry: user?.industry || 'B2B SaaS, FinTech, Artificial Intelligence & DeepTech',
    // 7. Goals
    goals:
      user?.goals ||
      'Guide early-stage founders through product validation, refine pitch decks for angel/VC syndicates, and serve as strategic board advisor.',
    // 8. Availability
    availability: user?.availability || 'Actively Mentoring • 3 Hours/Week Office Hours Available',
    // 9. Location
    location: user?.location || 'New York, NY (Global & Remote Advisory Mandate)',
    // 10. About
    about:
      user?.about ||
      'Veteran technology executive and startup mentor. Having scaled 3 early-stage ventures from Pre-Seed to Series A/B, I partner closely with visionary founders to refine their product strategy, fundraising decks, and go-to-market execution.',
  });

  const availableExpertise = [
    'Go-To-Market (GTM) Strategy',
    'Product-Market Fit (PMF)',
    'Series A Pitch Deck Coaching',
    'Scalable Tech Architecture',
    'Fundraising & Term Sheets',
    'Enterprise Sales B2B',
    'Team Hiring & Leadership',
  ];

  const availableSkills = [
    'Strategic Advisory',
    'Pitch Coaching',
    'Fractional CPO/CTO',
    'Cap Table & Governance',
    'Product Roadmap',
    'System Architecture',
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpertiseToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.expertise.includes(item);
      const next = exists
        ? prev.expertise.filter((i) => i !== item)
        : [...prev.expertise, item];
      return { ...prev, expertise: next };
    });
  };

  const handleSkillsToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(item);
      const next = exists
        ? prev.skills.filter((i) => i !== item)
        : [...prev.skills, item];
      return { ...prev, skills: next };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      avatar: formData.avatar,
      expertise: formData.expertise,
      skills: formData.skills,
      yearsOfExperience: formData.yearsOfExperience,
      industry: formData.industry,
      goals: formData.goals,
      availability: formData.availability,
      location: formData.location,
      about: formData.about,
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Toast Notification */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Mentor Profile successfully updated and saved!</span>
          </div>
          <span className="text-amber-400 font-mono text-[10px]">Saved ●</span>
        </motion.div>
      )}

      {/* ── Top Mentor Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* 2. Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border-2 border-amber-400/60 overflow-hidden shadow-2xl flex-shrink-0">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🧑‍🏫</div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 border border-slate-900">
                VERIFIED
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* 1. Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  {formData.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>🧑‍🏫</span> Mentor • KNOWLEDGE
                </span>
              </div>

              {/* 9. Location & 5. Years of Experience */}
              <div className="text-xs text-amber-200/90 font-medium flex items-center gap-2 flex-wrap">
                <span>📍 {formData.location}</span>
                <span>•</span>
                <span className="text-orange-300 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  ⏳ {formData.yearsOfExperience}
                </span>
              </div>

              {/* 8. Availability */}
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 pt-0.5">
                <span className="text-emerald-400 font-bold">⚡ {formData.availability}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isEditing ? '✕ Close Form' : '✏️ Edit Mentor Profile'}</span>
          </button>
        </div>
      </div>

      {/* ── MENTOR WORKING FLOW SECTION ── */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              EMS ADVISORY METHODOLOGY
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 flex items-center gap-2">
              <span>🧭 Mentor Working Flow</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            4-Step Founder Advisory Pipeline
          </span>
        </div>

        {/* 4-Step Interactive Flowchart Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Advisory Mandate',
              desc: 'Configure expertise (GTM, Tech, PMF), industry focus, and weekly advisory office hours.',
              icon: '⚙️',
              color: 'text-amber-400',
              borderColor: 'border-amber-500/30',
            },
            {
              step: '02',
              title: 'AI Vector Match',
              desc: 'Receive AI-matched founder connection requests based on venture stage & domain requirements.',
              icon: '🧠',
              color: 'text-orange-400',
              borderColor: 'border-orange-500/30',
            },
            {
              step: '03',
              title: 'Office Hours Review',
              desc: 'Conduct 1-on-1 sessions, review founder pitch decks, cap tables, and product roadmaps.',
              icon: '💬',
              color: 'text-pink-400',
              borderColor: 'border-pink-500/30',
            },
            {
              step: '04',
              title: 'Venture Scaling',
              desc: 'Guide founders through fundraising, Series A readiness, and advisory board governance.',
              icon: '🚀',
              color: 'text-emerald-400',
              borderColor: 'border-emerald-500/30',
            },
          ].map((st, i) => (
            <div
              key={i}
              className={`bg-slate-950 p-4 rounded-2xl border ${st.borderColor} relative flex flex-col justify-between space-y-3 hover:border-amber-400/50 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black tracking-wider ${st.color}`}>{st.step}</span>
                  <span className="text-xl">{st.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-2">{st.title}</h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">{st.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Edit Profile Form Mode ── */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>✏️ Edit Mentor Profile Fields</span>
            </h2>
            <span className="text-xs font-mono text-amber-400">10 Core Fields</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* 1. Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">1. Full Name / Title</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. Dr. Marcus Vance"
              />
            </div>

            {/* 2. Profile Photo */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">2. Profile Photo (Image URL)</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* 5. Years of Experience */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">5. Years of Experience</label>
              <input
                type="text"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. 12+ Years (Ex-VP @ ScaleUp)"
              />
            </div>

            {/* 6. Industry */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">6. Target Industry Focus</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. B2B SaaS, FinTech, AI/ML"
              />
            </div>

            {/* 9. Location */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">9. Location & Remote Focus</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. New York, NY (Remote Advisory)"
              />
            </div>

            {/* 8. Availability */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">8. Availability & Office Hours</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. Actively Mentoring • 3 Hours/Week"
              />
            </div>

            {/* 3. Expertise */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-300">3. Core Expertise Areas</label>
              <div className="flex flex-wrap gap-1.5">
                {availableExpertise.map((item) => {
                  const isSelected = formData.expertise.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleExpertiseToggle(item)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Skills */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-300">4. Skills & Advisory Tools</label>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map((item) => {
                  const isSelected = formData.skills.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleSkillsToggle(item)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-orange-500 text-slate-950 font-bold border-orange-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Goals */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">7. Advisory Goals & Value Add</label>
              <textarea
                rows={2}
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* 10. About */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">10. About (Bio & Track Record)</label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg"
            >
              💾 Save Mentor Profile
            </button>
          </div>
        </form>
      ) : (
        /* ── Display View Mode Displaying All 10 Fields ── */
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 3. Expertise */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>3. Core Expertise Areas</span>
                <span>🎯</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.expertise.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Skills */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>4. Advisory Skills</span>
                <span>⚡</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Years of Experience */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>5. Years of Experience</span>
                <span>⏳</span>
              </div>
              <div className="text-sm font-bold text-slate-100">{formData.yearsOfExperience}</div>
            </div>

            {/* 6. Industry */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>6. Industry Focus</span>
                <span>🏭</span>
              </div>
              <div className="text-sm font-bold text-slate-100">{formData.industry}</div>
            </div>

            {/* 9. Location */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>9. Location</span>
                <span>📍</span>
              </div>
              <div className="text-sm font-bold text-slate-100">{formData.location}</div>
            </div>

            {/* 8. Availability */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>8. Availability</span>
                <span>📅</span>
              </div>
              <div className="text-sm font-bold text-emerald-400">{formData.availability}</div>
            </div>
          </div>

          {/* 7. Goals */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>7. Advisory Goals & Value Add</span>
              <span>💎</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{formData.goals}</p>
          </div>

          {/* 10. About */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>10. About (Bio & Philosophy)</span>
              <span>📄</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {formData.about}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorProfile;
