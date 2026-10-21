import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from '../../components/ui/ProfileCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import useMatchesQuery from '../../hooks/useMatchesQuery';
import useLanguage from '../../hooks/useLanguage';
import useClientStore from '../../store/useClientStore';
import { createStartupApi, updateStartupApi, deleteStartupApi, sendConnectionRequestApi } from '../../services/apiClient';

/**
 * AnimatedFeed - Main networking feed with dynamic MongoDB Atlas data,
 * role filtering, owner listing controls (add, edit, delete), and connection requests.
 */
export function AnimatedFeed() {
  const { matches, isLoading, isError, recalculateMatches, isCalculating, refetchMatches } = useMatchesQuery();
  const { t } = useLanguage();
  const { user, isAuthenticated, openAuthModal } = useClientStore();

  const [selectedRole, setSelectedRole] = useState('all');
  const [connectedIds, setConnectedIds] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [listingType, setListingType] = useState('founder');

  // Form states for creating/editing startup & investor listings
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('FinTech');
  const [location, setLocation] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [stage, setStage] = useState('Seed Stage');
  const [fundingRequired, setFundingRequired] = useState('$50k - $250k');
  const [skills, setSkills] = useState('');
  const [teamSize, setTeamSize] = useState('1-5');
  const [role, setRole] = useState('founder');
  const [patentStatus, setPatentStatus] = useState('No Patent');

  // Mentor explicit fields state
  const [expertise, setExpertise] = useState('Scaling & Growth, Fundraising, Tech Leadership');
  const [yearsOfExperience, setYearsOfExperience] = useState('12+ Years');
  const [goals, setGoals] = useState('Guiding early-stage founders to PMF and Series A');

  // Investor 11 explicit fields state
  const [investmentRange, setInvestmentRange] = useState('₹10L – ₹50L');
  const [investmentPortfolio, setInvestmentPortfolio] = useState('');
  const [preferredIndustry, setPreferredIndustry] = useState('AI, FinTech, HealthTech');
  const [preferredStage, setPreferredStage] = useState('Idea / Seed');
  const [investmentExperience, setInvestmentExperience] = useState('8 Years');
  const [investmentGoals, setInvestmentGoals] = useState('');
  const [availability, setAvailability] = useState('Active Investor');

  const displayProfiles = matches && matches.length > 0 ? matches : [];

  const userRole = (user?.role || '').toLowerCase();

  const checkIsOwner = (profile) => {
    if (!user) return false;
    const uid = user.id || user._id;
    if (!profile.founderId) return false;
    if (String(profile.founderId) !== String(uid)) return false;

    const uRole = (user.role || '').toLowerCase();
    if ((uRole === 'investor' || uRole === 'mentor') && profile.role === 'founder') {
      return false;
    }
    return true;
  };

  const filteredProfiles = displayProfiles.filter((profile) => {
    if (selectedRole === 'my') {
      return checkIsOwner(profile);
    }
    if (selectedRole === 'all') return true;
    return profile.role === selectedRole;
  });

  const handleOpenAddModal = () => {
    if (!isAuthenticated) {
      openAuthModal('signup');
      return;
    }

    const isInv = userRole === 'investor' || selectedRole === 'investor';
    const isMen = userRole === 'mentor' || selectedRole === 'mentor';
    setListingType(isMen ? 'mentor' : isInv ? 'investor' : 'founder');
    setEditingId(null);

    setName(user?.name || user?.startupName || '');
    setAvatar(user?.avatar || user?.profilePhoto || '');
    setTitle(user?.title || (isMen ? 'Mentor & Advisor' : isInv ? 'Investor' : 'Founder'));
    setBio(user?.bio || user?.about || '');
    setAbout(user?.about || user?.bio || 'Interested in supporting promising technology ventures.');
    setLocation(user?.location || 'Pune');

    // Founder specific defaults
    setCategory('FinTech');
    setProblemSolved('');
    setTargetUsers('');
    setStage('Seed Stage');
    setFundingRequired('$50k - $250k');
    setSkills(Array.isArray(user?.skills) ? user.skills.join(', ') : 'Product Strategy, Venture Capital');
    setTeamSize('1-5');
    setPatentStatus('No Patent');

    // Mentor specific defaults
    setExpertise(Array.isArray(user?.expertise) ? user.expertise.join(', ') : user?.expertise || 'Scaling & Growth, Fundraising, Tech Leadership');
    setYearsOfExperience(user?.yearsOfExperience || user?.experience || '12+ Years');
    setGoals(user?.goals || 'Guiding early-stage founders to PMF and Series A');

    // Investor 11 fields defaults
    setInvestmentRange(user?.investmentRange || '₹10L – ₹50L');
    setInvestmentPortfolio(user?.investmentPortfolio || 'PayMax, HealthPulse, EduLearn');
    setPreferredIndustry(user?.preferredIndustry || 'AI, FinTech, HealthTech');
    setPreferredStage(user?.preferredStage || 'Idea / Seed');
    setInvestmentExperience(user?.investmentExperience || user?.experience || '8 Years');
    setInvestmentGoals(user?.investmentGoals || 'Early-stage technology startups');
    setAvailability(user?.availability || (isMen ? '5 hrs/week / Open for Mentees' : 'Active Investor'));

    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile) => {
    setEditingId(profile.id || profile._id);
    const pRole = (profile.role || '').toLowerCase();
    const isInv = pRole === 'investor';
    const isMen = pRole === 'mentor';
    setListingType(isMen ? 'mentor' : isInv ? 'investor' : 'founder');

    setName(profile.name || '');
    setAvatar(profile.avatar || '');
    setTitle(profile.title || (isMen ? 'Mentor & Advisor' : isInv ? 'Investor' : 'Founder'));
    setBio(profile.bio || profile.about || '');
    setAbout(profile.about || profile.bio || '');
    setLocation(profile.location || 'Remote');

    // Founder specific
    setCategory(profile.category || profile.industry || 'FinTech');
    setProblemSolved(profile.problemSolved || '');
    setTargetUsers(profile.targetUsers || '');
    setStage(profile.stage || 'Seed Stage');
    setFundingRequired(profile.fundingRequired || '$50k - $250k');
    setSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
    setTeamSize(profile.teamSize || '1-5');
    setRole(profile.role || 'founder');
    setPatentStatus(profile.patentStatus || 'No Patent');

    // Mentor fields
    setExpertise(Array.isArray(profile.expertise) ? profile.expertise.join(', ') : profile.expertise || 'Scaling & Growth, Fundraising');
    setYearsOfExperience(profile.yearsOfExperience || profile.experience || '12+ Years');
    setGoals(profile.goals || profile.investmentGoals || '');

    // Investor 11 fields
    setInvestmentRange(profile.investmentRange || profile.fundingRequired || '₹10L – ₹50L');
    setInvestmentPortfolio(profile.investmentPortfolio || '');
    setPreferredIndustry(profile.preferredIndustry || profile.category || 'AI, FinTech, HealthTech');
    setPreferredStage(profile.preferredStage || profile.stage || 'Idea / Seed');
    setInvestmentExperience(profile.investmentExperience || profile.experience || profile.yearsOfExperience || '8 Years');
    setInvestmentGoals(profile.investmentGoals || '');
    setAvailability(profile.availability || 'Active Mentor');

    setIsModalOpen(true);
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing from MongoDB Atlas?')) return;
    try {
      await deleteStartupApi(id);
      await refetchMatches();
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleConnect = async (profile) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const targetId = profile.id || profile._id;
    try {
      setConnectedIds((prev) => ({ ...prev, [targetId]: true }));
      await sendConnectionRequestApi(targetId, 'Hi! I would like to connect with you on EMS workspace.');
    } catch (err) {
      if (!err.message?.includes('already')) {
        alert(err.message || 'Failed to send connection request');
      }
    }
  };

  const handleCreateOrUpdateStartup = async (e) => {
    e.preventDefault();
    if (!name || (!bio && !about && !title)) {
      alert('Please fill in the Name and Description/About fields');
      return;
    }

    setIsPosting(true);
    try {
      const isInv = listingType === 'investor';
      const isMen = listingType === 'mentor';
      const payload = isInv
        ? {
            name,
            avatar,
            title: title || 'Investor',
            role: 'investor',
            location,
            about: about || bio,
            bio: bio || about,
            investmentRange,
            investmentPortfolio,
            preferredIndustry,
            preferredStage,
            investmentExperience,
            experience: investmentExperience,
            investmentGoals,
            availability,
            founderName: user?.name || name
          }
        : isMen
        ? {
            name,
            avatar,
            title: title || 'Mentor & Advisor',
            role: 'mentor',
            location,
            category,
            industry: category,
            expertise: expertise ? (Array.isArray(expertise) ? expertise : expertise.split(',').map((s) => s.trim())) : [],
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim())) : [],
            yearsOfExperience,
            experience: yearsOfExperience,
            goals,
            investmentGoals: goals,
            availability,
            about: about || bio,
            bio: bio || about,
            founderName: user?.name || name
          }
        : {
            name,
            avatar,
            title: title || bio.slice(0, 60),
            role: 'founder',
            category,
            location,
            problemSolved,
            targetUsers,
            stage,
            fundingRequired,
            skills: skills ? skills.split(',').map((s) => s.trim()) : [],
            teamSize,
            patentStatus: patentStatus || 'No Patent',
            founderName: user?.name || name,
            bio: bio || about,
            about: about || bio
          };

      if (editingId) {
        await updateStartupApi(editingId, payload);
      } else {
        await createStartupApi(payload);
      }

      await refetchMatches();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (err) {
      alert(err.message || 'Failed to save listing');
    } finally {
      setIsPosting(false);
    }
  };

  const roleFilterTabs = [
    { id: 'all', label: 'All Members', icon: '🌐' },
    ...(isAuthenticated ? [{ id: 'my', label: 'My Listings', icon: '⭐' }] : []),
    { id: 'founder', label: 'Founders', icon: '🚀' },
    { id: 'investor', label: 'Investors', icon: '💼' },
    { id: 'mentor', label: 'Mentors', icon: '🎓' },
    { id: 'team', label: 'Team Members', icon: '⚡' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Feed Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">Entrepreneur Network Feed</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Live MongoDB Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time AI matched profiles for Founders, Investors, Mentors, and Team Members
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenAddModal}
            variant="secondary"
            size="sm"
          >
            {userRole === 'mentor' || selectedRole === 'mentor'
              ? '🎓 + Add Mentor Listing'
              : userRole === 'investor' || selectedRole === 'investor'
              ? '💼 + Add Investor Listing'
              : '🚀 + Add Startup Listing'}
          </Button>

          <Button
            onClick={() => recalculateMatches({ role: selectedRole })}
            isLoading={isCalculating}
            size="sm"
            className="shadow-glow"
          >
            ⚡ Recalculate AI Matches
          </Button>
        </div>
      </div>

      {/* Role Filter Bar with 4 Distinct Role Visual Themes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Roles', icon: '🌐', activeClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-indigo-500/20' },
          { id: 'my', label: 'My Listings', icon: '👤', activeClass: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-pink-500/20' },
          { id: 'founder', label: '🚀 Founder (Idea)', icon: '💡', activeClass: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white border-indigo-400 shadow-indigo-500/30' },
          { id: 'investor', label: '💼 Investor (Capital)', icon: '💎', activeClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-400 shadow-emerald-500/30' },
          { id: 'mentor', label: '🎓 Mentor (Advisory)', icon: '🌟', activeClass: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-amber-400 shadow-amber-500/30' },
          { id: 'team', label: '⚡ Team Member (Talent)', icon: '🛠️', activeClass: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white border-cyan-400 shadow-cyan-500/30' },
        ].map((tab) => {
          const isActive = selectedRole === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? `${tab.activeClass} shadow-lg ring-1 ring-white/20`
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading live profiles from MongoDB Atlas...</p>
        </div>
      )}

      {/* Main Grid */}
      {!isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((profile) => {
              const isOwner = checkIsOwner(profile);
              return (
                <ProfileCard
                  key={profile.id || profile._id}
                  profile={profile}
                  isOwner={isOwner}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteListing}
                  onConnect={handleConnect}
                  isConnected={connectedIds[profile.id || profile._id]}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && filteredProfiles.length === 0 && (
        <div className="text-center py-12 bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl">
          <p className="text-sm text-slate-400">
            {selectedRole === 'my'
              ? 'You have not posted any listings yet. Click "+ Add Listing" to post your first venture!'
              : displayProfiles.length === 0
              ? 'No listings found in the database. Click "+ Add Listing" to create one!'
              : 'No profiles found for this role filter.'}
          </p>
        </div>
      )}

      {/* Modal for Adding / Editing Founder Startup, Investor, or Mentor Listing in MongoDB */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingId
            ? (userRole === 'mentor' || listingType === 'mentor'
                ? "✏️ Edit Mentor Listing"
                : userRole === 'investor' || listingType === 'investor'
                ? "✏️ Edit Investor Listing"
                : "✏️ Edit Founder Startup Listing")
            : (userRole === 'mentor' || listingType === 'mentor'
                ? "🎓 Create Mentor Profile Listing"
                : userRole === 'investor' || listingType === 'investor'
                ? "💼 Create Investor Profile Listing"
                : "🚀 Create Founder Startup Listing")
        }
        subtitle={
          editingId
            ? "Update your profile listing details in MongoDB Atlas"
            : (userRole === 'mentor' || listingType === 'mentor'
                ? "Post your mentor profile with expertise, goals, and experience to MongoDB Atlas"
                : userRole === 'investor' || listingType === 'investor'
                ? "Post your investor details with check size, portfolio, and goals to MongoDB Atlas"
                : "Post your startup venture details to MongoDB Atlas")
        }
      >
        <form onSubmit={handleCreateOrUpdateStartup} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Listing Type Toggle (Only show toggle if user is not fixed to a specific role) */}
          {userRole !== 'investor' && userRole !== 'founder' && userRole !== 'mentor' && (
            <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setListingType('founder')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  listingType === 'founder'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🚀 Founder Startup</span>
              </button>
              <button
                type="button"
                onClick={() => setListingType('investor')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  listingType === 'investor'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💼 Investor Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setListingType('mentor')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  listingType === 'mentor'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🎓 Mentor Profile</span>
              </button>
            </div>
          )}

          {userRole === 'mentor' || listingType === 'mentor' ? (
            /* ==================== MENTOR PROFILE FIELDS ==================== */
            <>
              {/* 1. Mentor Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">👤 Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  required
                />
              </div>

              {/* 2. Professional Title */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">💼 Professional Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Tech Mentor & Startup Advisor"
                />
              </div>

              {/* 3. Profile Photo */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🖼️ Profile Photo (Image URL)</label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* 4. Mentorship Expertise */}
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">🌟 Expertise (Comma separated)</label>
                <Input
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="e.g. Scaling & Growth, Fundraising, Tech Leadership, Product Strategy"
                />
              </div>

              {/* 4 & 5. Skills & Years of Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">🛠️ Core Skills</label>
                  <Input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Pitching, Venture Capital, Marketing"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">⭐ Years of Experience</label>
                  <Input
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="e.g. 12+ Years"
                  />
                </div>
              </div>

              {/* 6 & 7. Industry & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">🏷️ Industry Focus</label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. FinTech, AI / ML, SaaS"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">📍 Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India or Remote"
                  />
                </div>
              </div>

              {/* 8. Availability */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">⏳ Availability</label>
                <Input
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. 5 hrs/week / Open for Mentees"
                />
              </div>

              {/* 9. Mentorship Goals */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🎯 Mentorship Goals</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={2}
                  placeholder="e.g. Helping early-stage founders refine product-market fit and prepare for Seed funding"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* 10. About */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">📝 About / Bio</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  placeholder="Experienced tech leader passionate about mentoring high-growth startup founders..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </>
          ) : userRole === 'investor' || listingType === 'investor' ? (
            /* ==================== 11 INVESTOR FIELDS ==================== */
            <>
              {/* 1. Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">👤 Investor Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Shah"
                  required
                />
              </div>

              {/* 2. Profile Photo */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🖼️ Profile Photo (Image URL)</label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* 3 & 4. Investment Range & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">💰 Investment Range (Check Size)</label>
                  <Input
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                    placeholder="e.g. ₹10L – ₹50L or $50k - $250k"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">📍 Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune, India"
                  />
                </div>
              </div>

              {/* 5. Investment Portfolio */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">💼 Investment Portfolio</label>
                <Input
                  value={investmentPortfolio}
                  onChange={(e) => setInvestmentPortfolio(e.target.value)}
                  placeholder="e.g. PayMax, HealthPulse, EduLearn AI"
                />
              </div>

              {/* 6 & 7. Preferred Industry & Preferred Stage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">🏷️ Preferred Industry</label>
                  <Input
                    value={preferredIndustry}
                    onChange={(e) => setPreferredIndustry(e.target.value)}
                    placeholder="e.g. AI, FinTech, HealthTech"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">📊 Preferred Startup Stage</label>
                  <Input
                    value={preferredStage}
                    onChange={(e) => setPreferredStage(e.target.value)}
                    placeholder="e.g. Idea / Seed Stage"
                  />
                </div>
              </div>

              {/* 8 & 9. Investment Experience & Availability */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">⭐ Investment Experience</label>
                  <Input
                    value={investmentExperience}
                    onChange={(e) => setInvestmentExperience(e.target.value)}
                    placeholder="e.g. 8 Years"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">⏳ Availability</label>
                  <Input
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Active Investor / Open for Deals"
                  />
                </div>
              </div>

              {/* 10. Investment Goals */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🎯 Investment Goals</label>
                <textarea
                  value={investmentGoals}
                  onChange={(e) => setInvestmentGoals(e.target.value)}
                  rows={2}
                  placeholder="e.g. Seeking early-stage technology startups with strong founding teams"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* 11. About */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">📝 About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  placeholder="Interested in supporting promising technology startups..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </>
          ) : (
            /* ==================== FOUNDER FIELDS ==================== */
            <>
              {/* 1. Startup Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🚀 Startup Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Health AI"
                  required
                />
              </div>

              {/* 2. Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">📝 Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Describe your startup mission, product overview, and vision..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* 3 & 4. Category & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">🏷️ Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="SaaS">SaaS</option>
                    <option value="EdTech">EdTech</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="DeepTech">DeepTech</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">📍 Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India or Remote"
                  />
                </div>
              </div>

              {/* 5. Problem Being Solved */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">💡 Problem Being Solved</label>
                <textarea
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  rows={2}
                  placeholder="What core problem or pain point does your startup solve?"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* 6. Target Users */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">🎯 Target Users</label>
                <Input
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  placeholder="e.g. B2B Enterprise Clinics, Hospitals, Independent Doctors"
                />
              </div>

              {/* 7 & 8. Stage & Funding Required */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">📊 Startup Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Idea Stage">Idea Stage</option>
                    <option value="MVP / Prototype">MVP / Prototype</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Seed Stage">Seed Stage</option>
                    <option value="Series A+">Series A+</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">💰 Funding Required</label>
                  <select
                    value={fundingRequired}
                    onChange={(e) => setFundingRequired(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Bootstrapped">Bootstrapped ($0)</option>
                    <option value="$10k - $50k">$10k - $50k</option>
                    <option value="$50k - $250k">$50k - $250k</option>
                    <option value="$250k - $1M">$250k - $1M</option>
                    <option value="$1M+">$1M+</option>
                  </select>
                </div>
              </div>

              {/* 9 & 10. Required Skills & Team Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">🛠️ Required Skills</label>
                  <Input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Python, PyTorch, Sales"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">👥 Team Members</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1 (Solo Founder)">1 (Solo Founder)</option>
                    <option value="2-5 Members">2-5 Members</option>
                    <option value="5-10 Members">5-10 Members</option>
                    <option value="10-25 Members">10-25 Members</option>
                    <option value="25+ Members">25+ Members</option>
                  </select>
                </div>
              </div>

              {/* 11. Patent Status / Is Your Idea Patented? */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">📜 Patent Status (Is Your Idea Patented?)</label>
                <select
                  value={patentStatus}
                  onChange={(e) => setPatentStatus(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="No Patent">❌ No Patent Yet</option>
                  <option value="Patent Pending">⏳ Patent Pending (Application Filed)</option>
                  <option value="Provisional Patent">📝 Provisional Patent</option>
                  <option value="Patented">📜 Patented (Granted Patent)</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPosting}>
              {editingId ? "Update Listing" : "Save Listing to MongoDB"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AnimatedFeed;
