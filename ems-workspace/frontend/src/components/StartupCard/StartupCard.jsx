import React from 'react';
import { ProfileCard } from '../ui/ProfileCard';

export function StartupCard({ startup, ...props }) {
  return <ProfileCard profile={startup} {...props} />;
}

export default StartupCard;
