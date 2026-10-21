import React, { useState } from 'react';
import useMatchesQuery from '../../hooks/useMatchesQuery';
import useLanguage from '../../hooks/useLanguage';
import useClientStore from '../../store/useClientStore';

export function MatchCard() {
  const { user } = useClientStore();
  const { matches, isLoading, isError, recalculateMatches, isCalculating } = useMatchesQuery();
  const { t } = useLanguage();
  const [connectedMap, setConnectedMap] = useState({});

  const handleConnect = (id) => {
    setConnectedMap((prev) => ({ ...prev, [id]: true }));
  };

  if (isLoading) {
    return <div className="loading-spinner">{t('matching.loading')}</div>;
  }

  if (isError) {
    return <div className="error-alert">{t('matching.error')}</div>;
  }

  return (
    <div className="matching-section">
      <div className="section-header">
        <h3>{t('matching.title')}</h3>
        <button
          onClick={() => recalculateMatches({ user: { skills: user?.skills || [] } })}
          disabled={isCalculating}
          className="recalculate-btn"
        >
          {isCalculating ? '🔄 ...' : '⚡ ' + t('matching.calculate')}
        </button>
      </div>

      <div className="matches-grid">
        {matches.map((item) => {
          const isConnected = connectedMap[item.id];
          return (
            <div key={item.id} className="match-card">
              <div className="match-card-header">
                <div>
                  <h4 className="match-name">{item.name}</h4>
                  <p className="match-title">{item.title}</p>
                </div>
                <span className="match-badge">
                  {t('matching.matchPercent', { score: item.score })}
                </span>
              </div>

              <div className="match-tags">
                {item.tags?.map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleConnect(item.id)}
                disabled={isConnected}
                className={`connect-btn ${isConnected ? 'connected' : ''}`}
              >
                {isConnected ? '✓ ' + t('matching.connected') : '🤝 ' + t('matching.connect')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchCard;
