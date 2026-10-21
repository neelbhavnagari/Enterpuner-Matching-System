import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useClientStore from '../../store/useClientStore';

export function InvestorProfile() {
  const { user, updateUser } = useClientStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State containing the 10 required investor profile fields
  const [formData, setFormData] = useState({
    // 1. Name
    name: user?.name || 'Elena Rostova',
    // 2. Profile Photo
    avatar:
      user?.avatar ||
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    // 3. Investment Range
    investmentRange: user?.investmentRange || '$50,000 – $250,000',
    // 4. Preferred Industry
    preferredIndustry: user?.preferredIndustry || [
      'FinTech',
      'Artificial Intelligence / ML',
      'B2B SaaS',
      'CleanTech',
      'DeepTech',
    ],
    // 5. Preferred Startup Stage
    preferredStage: user?.preferredStage || ['Pre-Seed', 'Seed', 'Series A'],
    // 6. Location
    location: user?.location || 'San Francisco, CA (Global & Remote)',
    // 7. Investment Experience
    experience: user?.experience || '8+ Years (24 Angel Investments, 4 Exits)',
    // 8. Goals
    goals:
      user?.goals ||
      'Lead pre-seed rounds, provide strategic GTM advisory, connect founders with enterprise buyers, and co-invest with tier-1 syndicates.',
    // 9. Availability
    availability: user?.availability || 'Actively Deploying Capital • Open for 30-min Pitch Reviews',
    // 10. About
    about:
      user?.about ||
      'Experienced tech executive and angel investor focused on early-stage B2B software, AI infrastructure, and FinTech platforms. I partner closely with visionary founders to navigate product-market fit, enterprise sales, and follow-on Series A fundraising.',
  });

  const availableIndustries = [
    'FinTech',
    'Artificial Intelligence / ML',
    'B2B SaaS',
    'CleanTech',
    'HealthTech & Bio',
    'DeepTech',
    'E-Commerce & Retail',
    'Web3 & Crypto',
    'Cybersecurity',
    'EdTech',
  ];

  const availableStages = ['Idea / Concept', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIndustryToggle = (ind) => {
    setFormData((prev) => {
      const exists = prev.preferredIndustry.includes(ind);
      const next = exists
        ? prev.preferredIndustry.filter((item) => item !== ind)
        : [...prev.preferredIndustry, ind];
      return { ...prev, preferredIndustry: next };
    });
  };

  const handleStageToggle = (stg) => {
    setFormData((prev) => {
      const exists = prev.preferredStage.includes(stg);
      const next = exists
        ? prev.preferredStage.filter((item) => item !== stg)
        : [...prev.preferredStage, stg];
      return { ...prev, preferredStage: next };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      avatar: formData.avatar,
      investmentRange: formData.investmentRange,
      preferredIndustry: formData.preferredIndustry,
      preferredStage: formData.preferredStage,
      location: formData.location,
      experience: formData.experience,
      goals: formData.goals,
      availability: formData.availability,
      about: formData.about,
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculate completeness score across all 10 fields
  const filledCount = [
    formData.name,
    formData.avatar,
    formData.investmentRange,
    formData.preferredIndustry.length > 0,
    formData.preferredStage.length > 0,
    formData.location,
    formData.experience,
    formData.goals,
    formData.availability,
    formData.about,
  ].filter(Boolean).length;

  const completionPercentage = Math.round((filledCount / 10) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Investor Profile successfully saved to memory!</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px]">Saved ●</span>
        </motion.div>
      )}

      {/* Top Investor Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* 2. Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border-2 border-emerald-400/60 overflow-hidden shadow-2xl flex-shrink-0">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">💰</div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 border border-slate-900">
                ACCREDITED
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* 1. Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  {formData.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>💰</span> Accredited Investor
                </span>
              </div>

              {/* 6. Location & 3. Investment Range */}
              <div className="text-xs text-emerald-200/90 font-medium flex items-center gap-2 flex-wrap">
                <span>📍 {formData.location}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  💵 {formData.investmentRange}
                </span>
              </div>

              {/* 9. Availability */}
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 pt-0.5">
                <span className="text-emerald-400 font-bold">⚡ {formData.availability}</span>
              </div>
            </div>
          </div>

          {/* Profile Strength & Edit Trigger */}
          <div className="w-full md:w-auto flex flex-col items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="w-full md:w-48 bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-right">
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-slate-400">Profile Completeness</span>
                <span className="text-emerald-400">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{isEditing ? '✕ Close Form' : '✏️ Edit Profile Fields'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Mode */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>✏️ Configure Investor Profile Criteria</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">10 Core Fields</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* 1. Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">1. Full Name / Entity Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Elena Rostova"
              />
            </div>

            {/* 2. Profile Photo */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">2. Profile Photo (Image URL)</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* 3. Investment Range */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">3. Investment Range (Check Size)</label>
              <select
                value={formData.investmentRange}
                onChange={(e) => handleInputChange('investmentRange', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option>$10,000 – $50,000 (Micro Angel)</option>
                <option>$50,000 – $250,000 (Angel / Syndicate Lead)</option>
                <option>$250,000 – $1,000,000 (Pre-Seed Lead / VC)</option>
                <option>$1,000,000+ (Institutional VC / Fund)</option>
              </select>
            </div>

            {/* 6. Location */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">6. Location & Geographic Focus</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. San Francisco, CA (Global Mandate)"
              />
            </div>

            {/* 7. Investment Experience */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">7. Investment Experience & Portfolio History</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 8+ Years (24 Angel Deals, 4 Exits)"
              />
            </div>

            {/* 4. Preferred Industry */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-300">4. Preferred Industry Sectors</label>
              <div className="flex flex-wrap gap-1.5">
                {availableIndustries.map((ind) => {
                  const isSelected = formData.preferredIndustry.includes(ind);
                  return (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => handleIndustryToggle(ind)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Preferred Startup Stage */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-300">5. Preferred Startup Stage</label>
              <div className="flex flex-wrap gap-1.5">
                {availableStages.map((stg) => {
                  const isSelected = formData.preferredStage.includes(stg);
                  return (
                    <button
                      type="button"
                      key={stg}
                      onClick={() => handleStageToggle(stg)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. Goals */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">8. Investment Goals & Value Add</label>
              <textarea
                rows={2}
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* 9. Availability */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">9. Availability & Pitch Engagement</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 10. About */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">10. About (Investor Thesis & Bio)</label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
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
              className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
            >
              💾 Save Profile Criteria
            </button>
          </div>
        </form>
      ) : (
        /* Display View Mode displaying all 10 fields */
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 3. Investment Range */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>3. Investment Range</span>
                <span>💵</span>
              </div>
              <div className="text-xl font-black text-emerald-400">{formData.investmentRange}</div>
              <p className="text-[11px] text-slate-400">Typical ticket check size per startup.</p>
            </div>

            {/* 6. Location */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>6. Location</span>
                <span>📍</span>
              </div>
              <div className="text-base font-bold text-slate-100">{formData.location}</div>
              <p className="text-[11px] text-slate-400">Geographic mandate & remote focus.</p>
            </div>

            {/* 4. Preferred Industry */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>4. Preferred Industry</span>
                <span>🎯</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.preferredIndustry.map((ind, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    #{ind}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Preferred Startup Stage */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>5. Preferred Startup Stage</span>
                <span>🚀</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.preferredStage.map((stg, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20"
                  >
                    {stg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Investment Experience */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>7. Investment Experience</span>
              <span>📈</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{formData.experience}</div>
          </div>

          {/* 8. Goals */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>8. Goals & Value Add</span>
              <span>💎</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{formData.goals}</p>
          </div>

          {/* 9. Availability */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>9. Availability</span>
              <span>⚡</span>
            </div>
            <div className="text-xs font-bold text-emerald-400">{formData.availability}</div>
          </div>

          {/* 10. About */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>10. About (Investor Thesis)</span>
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

export default InvestorProfile;
