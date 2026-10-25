import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  currentPage: 'home' | 'reviews' | 'partners' | 'admin';
  onOpenAuth: () => void;
  onSignOut: () => void;
  onNavigate: (page: 'home' | 'reviews' | 'partners' | 'admin') => void;
  onOpenAdminPortal: () => void;
  onOpenMyRetreats: (initialTab?: string) => void;
  onOpenTutorial: () => void;
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentPage,
  onOpenAuth,
  onSignOut,
  onNavigate,
  onOpenAdminPortal,
  onOpenMyRetreats,
  onOpenTutorial,
  onScrollTo,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase() === 'jeremy.urpman@gocsps.com';

  return (
    <nav>
      <div
        className="nlogo"
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{ cursor: 'pointer' }}
      >
        Sanctuary
        <span>Healing &amp; Cannabis Retreats &nbsp;·&nbsp; 18+ Only</span>
      </div>

      <div className="nlinks">
        <button
          className={`nl ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('home');
            onScrollTo('dest-sec');
          }}
          type="button"
        >
          Destinations
        </button>
        <button
          className={`nl ${currentPage === 'reviews' ? 'active' : ''}`}
          onClick={() => onNavigate('reviews')}
          type="button"
          style={currentPage === 'reviews' ? { color: 'var(--gold)', borderBottom: '2px solid var(--gold)' } : {}}
        >
          Reviews
        </button>
        <button className="nl" onClick={onOpenTutorial} type="button">
          How It Works
        </button>
        <button
          className={`nl ${currentPage === 'partners' ? 'active' : ''}`}
          onClick={() => onNavigate('partners')}
          type="button"
          style={currentPage === 'partners' ? { color: 'var(--gold)', borderBottom: '2px solid var(--gold)' } : {}}
        >
          Partners
        </button>

        <button
          className="ncta"
          onClick={() => {
            onNavigate('home');
            onScrollTo('calc-sec');
          }}
          type="button"
        >
          &#10022; Get My Quote
        </button>

        <span className="nbadge">18+ Only</span>

        {/* Account / Profile Area */}
        <div className={`nav-acct-area ${dropdownOpen ? 'open' : ''}`}>
          {user ? (
            <div
              className="nguest-chip"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Account Menu"
            >
              <div className="nguest-av">{user.name.slice(0, 1).toUpperCase()}</div>
              <span className="nguest-name">
                {user.name.split(' ')[0]} {isAdmin && '★ Admin'}
              </span>
              <span style={{ fontSize: '0.45rem', color: 'var(--gold)', marginLeft: '0.2rem' }}>▾</span>
            </div>
          ) : (
            <button className="nguest-btn" onClick={onOpenAuth} type="button">
              &#128100; Sign In / Register
            </button>
          )}

          {/* Profile Bubble Dropdown */}
          {user && dropdownOpen && (
            <div className="nacct-dd" style={{ display: 'block' }}>
              <div className="ndd-user">
                <div className="ndd-uname">{user.name}</div>
                <div className="ndd-email">{user.email}</div>
                <div style={{ fontSize: '0.42rem', color: 'var(--gold)', marginTop: '0.2rem' }}>
                  {user.points.toLocaleString()} Loyalty Points
                </div>
              </div>

              {/* ADMIN PORTAL LINK IN PROFILE DROPDOWN */}
              {isAdmin && (
                <div
                  className="ndd-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigate('admin');
                  }}
                  style={{ color: '#ff7b7b', fontWeight: 700, background: 'rgba(224,85,85,0.12)' }}
                >
                  <span className="ndd-ic">&#128737;</span> Admin Portal (Reservations)
                </div>
              )}

              <div
                className="ndd-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenMyRetreats('quotes');
                }}
              >
                <span className="ndd-ic">&#128203;</span> My Saved Quotes
              </div>
              <div
                className="ndd-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenMyRetreats('bookings');
                }}
              >
                <span className="ndd-ic">&#127961;</span> My Bookings
              </div>
              <div
                className="ndd-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenTutorial();
                }}
              >
                <span className="ndd-ic">&#127915;</span> Site Tutorial
              </div>

              <div className="ndd-div" />

              <div
                className="ndd-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onSignOut();
                }}
              >
                <span className="ndd-ic">&#8677;</span> Sign Out
              </div>
            </div>
          )}
        </div>

        {/* Partner portal direct link */}
        <button
          className={`nnav-btn teal ${currentPage === 'partners' ? 'active' : ''}`}
          onClick={() => onNavigate('partners')}
          type="button"
          style={currentPage === 'partners' ? { boxShadow: '0 0 12px rgba(139,196,192,0.6)', borderColor: 'var(--teal)' } : {}}
        >
          &#9874; Partner Portal ($50/mo)
        </button>
      </div>
    </nav>
  );
};
