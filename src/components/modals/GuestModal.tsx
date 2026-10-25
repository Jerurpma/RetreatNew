import React, { useState } from 'react';
import { User } from '../../types';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: User) => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
}) => {
  const [email, setEmail] = useState('demo@sanctuary.com');
  const [password, setPassword] = useState('retreat123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (email.toLowerCase() === 'demo@sanctuary.com' && password === 'retreat123') {
      setError('');
      onSignIn({
        name: 'Demo Guest',
        email: 'demo@sanctuary.com',
        tier: 't2',
        points: 1250,
      });
      onClose();
    } else {
      setError('✗ Invalid credentials. For demo access use: demo@sanctuary.com / retreat123');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-corner" onClick={onClose} type="button">
        ✕
      </button>

      <div className="gp-box" onClick={(e) => e.stopPropagation()}>
        <div className="gp-hdr">
          <div className="gp-logo">Sanctuary</div>
          <div className="gp-tagline">Guest Portal Sign In</div>
        </div>

        <form className="gp-body" onSubmit={handleSubmit}>
          {error && <div className="gp-err">{error}</div>}

          <div style={{ marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.2rem' }}>
              Email Address
            </label>
            <input
              className="gp-inp"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@sanctuary.com"
            />
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <label style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.2rem' }}>
              Password
            </label>
            <input
              className="gp-inp"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="gp-submit" type="submit">
            Sign In to Sanctuary
          </button>

          <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '6px', fontSize: '0.45rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--gold)' }}>Demo Credentials:</strong><br />
            Email: <code>demo@sanctuary.com</code><br />
            Password: <code>retreat123</code> (Tier 2 Visionary · 1,250 points)
          </div>
        </form>
      </div>
    </div>
  );
};
