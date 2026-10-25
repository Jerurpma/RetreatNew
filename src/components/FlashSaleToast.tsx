import React, { useState, useEffect } from 'react';
import { TierType } from '../types';

interface FlashSaleToastProps {
  onUpgradeTier: (tier: TierType) => void;
  onApplyPromo?: (code: string) => void;
}

export const FlashSaleToast: React.FC<FlashSaleToastProps> = ({
  onUpgradeTier,
  onApplyPromo,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 14:59
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show toast after a slight delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('SANCTUARY15');
    setCopied(true);
    onApplyPromo?.('SANCTUARY15');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = () => {
    onUpgradeTier('t2');
    onApplyPromo?.('SANCTUARY15');
    setIsVisible(false);
  };

  return (
    <div className="flash-toast show">
      <div className="flash-shim" />
      <button className="flash-x" onClick={() => setIsVisible(false)} type="button">
        &#x2715;
      </button>

      <div className="flash-body">
        <div className="flash-badge">
          <div className="flash-dot" /> Limited Flash Opportunity
        </div>

        <div className="flash-title">15% Off Tier 2 Visionary</div>
        <div className="flash-sub">
          Unlock unlimited quotes, full banking, group escrow pools, and dedicated concierge access.
        </div>

        <div className="flash-code-row">
          <div className="flash-code" onClick={handleCopyCode} title="Click to copy code">
            SANCTUARY15
          </div>
          <button type="button" className="flash-copy" onClick={handleCopyCode}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flash-timer-row">
          <span className="flash-timer-lbl">Offer expires in:</span>
          <span className="flash-timer">{timerStr}</span>
        </div>

        <button type="button" className="flash-btn" onClick={handleClaim}>
          Claim 15% Off Now &rarr;
        </button>
      </div>
    </div>
  );
};
