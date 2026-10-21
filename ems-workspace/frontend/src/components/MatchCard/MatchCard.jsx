import React from 'react';
import { ProfileCard } from '../ui/ProfileCard';

export function MatchCard({ match, ...props }) {
  return <ProfileCard profile={match} {...props} />;
}

export default MatchCard;
