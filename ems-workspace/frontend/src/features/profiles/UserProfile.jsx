import React, { useState, useEffect } from 'react';
import useUserProfileQuery from '../../hooks/useUserProfileQuery';
import useClientStore from '../../store/useClientStore';
import useLanguage from '../../hooks/useLanguage';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/RoleBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export function UserProfile() {
  const { user } = useClientStore();
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfileQuery(user?.id || user?._id);
  const { t } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [roleInput, setRoleInput] = useState('founder');
  const [skillsInput, setSkillsInput] = useState('');

  const currentProfile = profile || {
    name: user?.name || '',
    role: user?.role || 'founder',
    title: user?.title || '',
    bio: user?.bio || '',
    skills: user?.skills && user?.skills.length > 0 ? user.skills : []
  };

  useEffect(() => {
    if (currentProfile) {
      setNameInput(currentProfile.name || '');
      setTitleInput(currentProfile.title || '');
      setBioInput(currentProfile.bio || '');
      setRoleInput(currentProfile.role || 'founder');
      setSkillsInput(Array.isArray(currentProfile.skills) ? currentProfile.skills.join(', ') : '');
    }
  }, [profile, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const skillsArray = skillsInput ? skillsInput.split(',').map((s) => s.trim()) : [];
    
    await updateProfile({
      id: user?.id || user?._id,
      name: nameInput,
      title: titleInput,
      bio: bioInput,
      role: roleInput,
      skills: skillsArray
    });

    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading user profile from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-6 border border-slate-700/60 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {currentProfile.name ? currentProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{currentProfile.name}</h3>
              <p className="text-xs text-indigo-300 font-medium">{currentProfile.title || 'Platform Member'}</p>
            </div>
          </div>

          <RoleBadge role={currentProfile.role || 'founder'} size="lg" />
        </div>

        {/* Biography */}
        <div className="mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 block mb-1.5">{t('profile.bio')}</span>
          <p className="text-sm text-slate-200 leading-relaxed">
            {currentProfile.bio || 'No biography provided yet. Click Update Profile to add one.'}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-400 block mb-2">{t('profile.skills')}</span>
          <div className="flex flex-wrap gap-2">
            {currentProfile.skills && currentProfile.skills.length > 0 ? (
              currentProfile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No skills added yet</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          ✏️ {t('profile.update')}
        </Button>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Registered Profile"
        subtitle="Update your profile details and save directly to MongoDB Atlas"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Title / Headline</label>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. Full-Stack AI Engineer & Co-Founder"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Registered Platform Role</label>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="founder">🚀 Founder</option>
              <option value="investor">💼 Investor</option>
              <option value="mentor">🎓 Mentor</option>
              <option value="team">⚡ Team Member</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Skills (comma separated)</label>
            <Input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. React, Node.js, Python, AI/ML"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Biography</label>
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              rows={4}
              placeholder="Tell other founders and investors about your background..."
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUpdating}>
              Save to MongoDB
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserProfile;
