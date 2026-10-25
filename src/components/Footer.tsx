import React from 'react';

interface FooterProps {
  onScrollTo: (id: string) => void;
  onNavigate: (page: 'home' | 'reviews' | 'partners' | 'admin') => void;
  onOpenAdmin: () => void;
  onOpenTutorial: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollTo,
  onNavigate,
  onOpenAdmin,
  onOpenTutorial,
}) => {
  return (
    <footer>
      <div
        className="footer-logo"
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{ cursor: 'pointer' }}
      >
        Sanctuary
      </div>
      <div style={{ fontSize: '0.44rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
        Curated Cannabis &amp; Healing Retreats · 18+ Only
      </div>

      <div className="flinks">
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          type="button"
        >
          Home
        </button>
        <button
          onClick={() => {
            onNavigate('home');
            onScrollTo('dest-sec');
          }}
          type="button"
        >
          Destinations
        </button>
        <button onClick={onOpenTutorial} type="button">
          How It Works
        </button>
        <button
          onClick={() => {
            onNavigate('home');
            onScrollTo('calc-sec');
          }}
          type="button"
        >
          Quote Studio
        </button>
        <button
          onClick={() => {
            onNavigate('reviews');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          type="button"
        >
          Guest Reviews
        </button>
        <button
          onClick={() => {
            onNavigate('partners');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          type="button"
        >
          Partner Portal ($50/mo)
        </button>
        <button onClick={() => onNavigate('admin')} type="button">Admin Portal</button>
      </div>

      <p className="flegal">
        Compliance Notice: Sanctuary operates in strict alignment with state, provincial, and national statutory frameworks. All cannabis-associated activities occur exclusively within licensed jurisdictions in accordance with local regulations (21+ adult-use or state-sanctioned medical card reciprocity). No cross-border transportation of scheduled substances is permitted. Sanctuary provides concierge curation, holistic accommodation, and specialist wellness facilitation.
      </p>
      <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.8rem' }}>
        © 2026 Sanctuary Retreats Global Inc. All rights reserved. Platform v2.17.9h
      </div>
    </footer>
  );
};
