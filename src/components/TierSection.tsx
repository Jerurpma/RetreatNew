import React from 'react';
import { TierType } from '../types';

interface TierSectionProps {
  curTier: TierType;
  onSetTier: (tier: TierType) => void;
}

export const TierSection: React.FC<TierSectionProps> = ({ curTier, onSetTier }) => {
  return (
    <div id="tier-sec">
      <div className="wrap" style={{ padding: '4.5rem 0' }}>
        <div className="slbl">Simple Transparent Pricing</div>
        <div className="stit">
          Three Tiers. <em>One Clear Path.</em>
        </div>
        <div className="sdiv" />
        <p className="ssub">
          Browse free. Subscribe for the simulator. Upgrade for unlimited quotes, full booking, banking, and all portals.
        </p>

        <div className="tsw">
          <span style={{ fontSize: '0.44rem', letterSpacing: '0.19em', textTransform: 'uppercase', color: 'var(--muted)', alignSelf: 'center', paddingLeft: '0.5rem' }}>
            View as:
          </span>
          <button
            className={`tsw-btn ${curTier === 'free' ? 'active' : ''}`}
            onClick={() => onSetTier('free')}
            type="button"
          >
            🌐 Free
          </button>
          <button
            className={`tsw-btn ${curTier === 't1' ? 'active' : ''}`}
            onClick={() => onSetTier('t1')}
            type="button"
          >
            🔵 Tier 1 · $59.99/mo
          </button>
          <button
            className={`tsw-btn ${curTier === 't2' ? 'active' : ''}`}
            onClick={() => onSetTier('t2')}
            type="button"
          >
            🟣 Tier 2 · $149/mo
          </button>
        </div>

        <div className="tg">
          {/* Free Tier */}
          <div className="tc">
            <div className="tc-tier">Free · Explorer</div>
            <div className="tc-name">Browse</div>
            <div className="tc-price">$0</div>
            <ul className="tc-feats">
              <li className="on"><span className="fic fic-y">✓</span>17 destination gallery</li>
              <li className="on"><span className="fic fic-y">✓</span>Cannabis legal status</li>
              <li><span className="fic fic-n">—</span>Quote Studio preview</li>
              <li><span className="fic fic-n">🔒</span>Direct booking &amp; escrow</li>
            </ul>
            <button
              className="tc-btn free"
              onClick={() => onSetTier('free')}
              type="button"
            >
              {curTier === 'free' ? 'Current — Free' : 'Switch to Free'}
            </button>
          </div>

          {/* Tier 1 */}
          <div className="tc">
            <div className="tc-tier">Tier 1 · Simulator</div>
            <div className="tc-name">Healer</div>
            <div className="tc-price">$59<span>.99/mo</span></div>
            <ul className="tc-feats">
              <li className="on"><span className="fic fic-y">✓</span>Everything in Free</li>
              <li className="on"><span className="fic fic-y">✓</span>Quote Studio unlocked</li>
              <li className="on"><span className="fic fic-g">🏛</span>Banking portal</li>
              <li><span className="fic fic-n">🔒</span>Full booking flow preview</li>
            </ul>
            <button
              className="tc-btn t1"
              onClick={() => onSetTier('t1')}
              type="button"
            >
              {curTier === 't1' ? 'Active Tier 1' : 'Subscribe — $59.99/mo'}
            </button>
          </div>

          {/* Tier 2 */}
          <div className="tc feat">
            <div className="tc-badge">Most Popular</div>
            <div className="tc-tier">Tier 2 · Full Access</div>
            <div className="tc-name">Visionary</div>
            <div className="tc-price">$149<span>/mo</span></div>
            <ul className="tc-feats">
              <li className="on"><span className="fic fic-y">✓</span>Everything in Tier 1</li>
              <li className="on"><span className="fic fic-t">✦</span>5-step booking + payment</li>
              <li className="on"><span className="fic fic-g">🏛</span>Banking + group pool escrow</li>
              <li className="on"><span className="fic fic-t">⭐</span>Email notification center</li>
              <li className="on"><span className="fic fic-t">✦</span>Dedicated concierge support</li>
            </ul>
            <button
              className="tc-btn t2"
              onClick={() => onSetTier('t2')}
              type="button"
            >
              {curTier === 't2' ? 'Active Tier 2 — Visionary' : 'Upgrade — $149/mo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
