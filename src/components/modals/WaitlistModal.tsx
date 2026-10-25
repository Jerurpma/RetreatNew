import React, { useState } from 'react';
import { WaitlistEntry } from '../../types';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  destName: string;
  onJoinWaitlist: (entry: WaitlistEntry) => void;
  onOpenMyRetreats: (tab?: string) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  destName,
  onJoinWaitlist,
  onOpenMyRetreats,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [size, setSize] = useState('2');
  const [flex, setFlex] = useState('3days');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifWhatsapp, setNotifWhatsapp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Selected Dates';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const notifs: string[] = [];
    if (notifEmail) notifs.push('Email');
    if (notifSms) notifs.push('SMS');
    if (notifWhatsapp) notifs.push('WhatsApp');

    const entry: WaitlistEntry = {
      id: 'WL-' + Date.now(),
      dest: destName || 'Maui, Hawaii',
      dateRange: dateStr,
      name,
      email,
      groupSize: `${size} Guests`,
      flexibility: flex === 'exact' ? 'Exact' : flex === '3days' ? '+/- 3 days' : '+/- 1 week',
      position: 5,
      notification: notifs,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    onJoinWaitlist(entry);
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-corner" onClick={onClose} type="button">
        ✕
      </button>

      <div className="wl-box" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <div>
            <div style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.4rem' }}>⏳</div>
            <div className="wl-title">Join the Waitlist</div>
            <div className="wl-dest">{destName || 'Maui, Hawaii'} — {dateStr}</div>
            <div className="wl-sub">
              These dates are fully reserved. Join our priority waitlist and we will notify you immediately if an opening arises — or assist with an alternative private sanctuary.
            </div>
            <div className="wl-badge">
              • Fully Booked — 4 guests ahead of you
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '0.4rem' }}>
                <label className="wl-label">Your Email</label>
                <input
                  className="wl-inp"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '0.4rem' }}>
                <label className="wl-label">Your Full Name</label>
                <input
                  className="wl-inp"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div className="wl-row" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <label className="wl-label">Group Size</label>
                  <select
                    className="wl-inp"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="1">Solo (1 guest)</option>
                    <option value="2">Couple (2 guests)</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="6">6 guests</option>
                    <option value="8">8 guests</option>
                  </select>
                </div>
                <div>
                  <label className="wl-label">Flexibility</label>
                  <select
                    className="wl-inp"
                    value={flex}
                    onChange={(e) => setFlex(e.target.value)}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="exact">Exact dates only</option>
                    <option value="3days">+/- 3 days flexible</option>
                    <option value="1week">+/- 1 week flexible</option>
                    <option value="any">Any available date</option>
                  </select>
                </div>
              </div>

              <label className="wl-label">Notification Channels</label>
              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.45rem', color: 'var(--muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    style={{ accentColor: 'var(--gold)' }}
                  /> Email
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.45rem', color: 'var(--muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    style={{ accentColor: 'var(--gold)' }}
                  /> SMS
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.45rem', color: 'var(--muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifWhatsapp}
                    onChange={(e) => setNotifWhatsapp(e.target.checked)}
                    style={{ accentColor: 'var(--gold)' }}
                  /> WhatsApp
                </label>
              </div>

              <button className="wl-btn" type="submit">
                ✦ Join Waitlist — Notify Me Instantly
              </button>
              <div
                className="wl-skip"
                onClick={onClose}
                style={{ textAlign: 'center', marginTop: '0.8rem', cursor: 'pointer' }}
              >
                No thanks — browse other dates
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
            <div className="wl-title">You're on the List</div>
            <div className="wl-badge" style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--gold)', margin: '0.6rem auto' }}>
              Waitlist Position #5
            </div>
            <p className="wl-sub">
              We’ll email you the moment a spot opens. Dr. Kaimana Kahale will also reach out within 24 hours with bespoke alternate itineraries.
            </p>
            <div style={{ background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.2)', padding: '0.7rem 0.9rem', marginBottom: '1rem', fontSize: '0.46rem', color: '#7EC87A', textAlign: 'left', lineHeight: '1.7', borderRadius: '8px' }}>
              ✓ Confirmation notification sent to {email}<br />
              ✓ Added to concierge priority radar<br />
              ✓ Preferred rates held for 24 hours
            </div>
            <button
              className="wl-btn"
              style={{ background: 'linear-gradient(135deg, var(--teal), #148f77)' }}
              onClick={() => {
                onClose();
                onOpenMyRetreats('bookings');
              }}
              type="button"
            >
              ✦ View My Waitlists in My Retreats
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
