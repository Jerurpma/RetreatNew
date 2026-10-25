import React, { useState } from 'react';
import { User, Quote, Booking, WaitlistEntry } from '../../types';
import { generateItineraryPDF } from '../../utils/pdfGenerator';

interface MyRetreatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  user: User | null;
  quotes: Quote[];
  bookings: Booking[];
  waitlists: WaitlistEntry[];
  bpBalance: number;
  onLoadQuote: (dest: string) => void;
  onDeleteQuote: (id: string) => void;
  onOpenBanking: () => void;
  onOpenReviews: () => void;
  onShowToast: (msg: string) => void;
}

export const MyRetreatsModal: React.FC<MyRetreatsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quotes',
  user,
  quotes,
  bookings,
  waitlists,
  bpBalance,
  onLoadQuote,
  onDeleteQuote,
  onOpenBanking,
  onOpenReviews,
  onShowToast,
}) => {
  const [tab, setTab] = useState(initialTab);
  const [refStats, setRefStats] = useState({
    sent: 3,
    conv: 1,
    cred: 100,
  });

  if (!isOpen) return null;

  const points = user ? user.points : 1250;
  let tierName = 'Seedling';
  let tierNext = 'Cultivator';
  let tierMax = 500;
  let tierMin = 0;

  if (points >= 5000) {
    tierName = 'Sanctuary Elite';
    tierNext = '';
    tierMax = 5000;
    tierMin = 5000;
  } else if (points >= 2000) {
    tierName = 'Botanist';
    tierNext = 'Sanctuary Elite';
    tierMin = 2000;
    tierMax = 5000;
  } else if (points >= 500) {
    tierName = 'Cultivator';
    tierNext = 'Botanist';
    tierMin = 500;
    tierMax = 2000;
  }

  const progressPct = tierMax > tierMin ? Math.min(100, Math.round(((points - tierMin) / (tierMax - tierMin)) * 100)) : 100;
  const refCode = user ? user.email.split('@')[0].toUpperCase().substring(0, 8) : 'SANCTUARY';
  const refLink = `https://sanctuary.com/join?ref=${refCode}`;

  const copyRefLink = () => {
    navigator.clipboard?.writeText(refLink);
    setRefStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
    onShowToast('🔗 Referral link copied to clipboard!');
  };

  const handleShare = (channel: string) => {
    setRefStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
    onShowToast(`📱 Opening ${channel} share composer...`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-corner" onClick={onClose} type="button">
        ✕
      </button>

      <div className="mr-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="mr-top">
          <div className="mr-logo">✦ My Sanctuary Account</div>
          <button
            className="bk-back"
            style={{ padding: '0.2rem 0.65rem', fontSize: '0.45rem' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* User Hero */}
        <div className="mr-hero">
          <div className="mr-av">{user ? user.name.charAt(0) : 'G'}</div>
          <div>
            <div className="mr-hname">{user ? user.name : 'Demo Guest'}</div>
            <div className="mr-htier">
              {user?.tier === 't2'
                ? 'Visionary — $149/mo'
                : user?.tier === 't1'
                ? 'Healer — $59.99/mo'
                : 'Free Explorer'}
            </div>
            <div className="mr-hemail">{user ? user.email : 'demo@sanctuary.com'}</div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mr-stats-bar">
          <div className="mrs">
            <div className="mrs-v">{quotes.length}</div>
            <div className="mrs-l">Saved Quotes</div>
          </div>
          <div className="mrs">
            <div className="mrs-v">{points.toLocaleString()}</div>
            <div className="mrs-l">Loyalty Points</div>
          </div>
          <div className="mrs">
            <div className="mrs-v">{refStats.sent}</div>
            <div className="mrs-l">Referrals Sent</div>
          </div>
          <div className="mrs">
            <div className="mrs-v">${Math.round(bpBalance).toLocaleString()}</div>
            <div className="mrs-l">Banking Balance</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mr-tabs" style={{ margin: '1rem' }}>
          <button
            className={`mr-tab ${tab === 'quotes' ? 'active' : ''}`}
            onClick={() => setTab('quotes')}
            type="button"
          >
            📊 Saved Quotes ({quotes.length})
          </button>
          <button
            className={`mr-tab ${tab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setTab('loyalty')}
            type="button"
          >
            🌿 Loyalty Points
          </button>
          <button
            className={`mr-tab ${tab === 'referral' ? 'active' : ''}`}
            onClick={() => setTab('referral')}
            type="button"
          >
            👥 Refer &amp; Earn ($100)
          </button>
          <button
            className={`mr-tab ${tab === 'bookings' ? 'active' : ''}`}
            onClick={() => setTab('bookings')}
            type="button"
          >
            📋 My Bookings ({bookings.length})
          </button>
        </div>

        {/* TAB 1: SAVED QUOTES */}
        {tab === 'quotes' && (
          <div style={{ padding: '0 1.5rem 2rem' }}>
            {quotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem', opacity: 0.3 }}>📊</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>
                  No saved quotes yet
                </div>
                <p style={{ fontSize: '0.54rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
                  Use the Quote Studio to customize an estimate — then save it here for instant booking.
                </p>
                <button
                  className="h-bp"
                  style={{ padding: '0.6rem 1.4rem' }}
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('calc-sec');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  ✦ Open Quote Studio
                </button>
              </div>
            ) : (
              <div>
                {quotes.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#141414',
                      border: '1px solid rgba(201,168,76,0.18)',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      marginBottom: '0.8rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#fff' }}>
                        {q.dest}
                      </div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--gold)' }}>
                        ${q.pp}/pp
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                      <span className="cp-card-tag">{q.lux}</span>
                      <span className="cp-card-tag">{q.dur}</span>
                      <span className="cp-card-tag">{q.grp}</span>
                      <span className="cp-card-tag" style={{ color: 'var(--gold)', borderColor: 'rgba(201,168,76,0.3)' }}>
                        Total: {q.tot}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.46rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.8rem' }}>
                      Saved on {q.d} · +{q.pts} loyalty points awarded
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="cp-btn"
                        onClick={() => {
                          onLoadQuote(q.dest);
                          onClose();
                        }}
                      >
                        ✦ Load in Quote Studio
                      </button>
                      <button
                        className="cp-btn teal"
                        onClick={() => {
                          onClose();
                          onOpenBanking();
                        }}
                      >
                        🏛 Pay via Banking Escrow
                      </button>
                      <button
                        className="bk-back"
                        style={{ padding: '0.3rem 0.7rem', fontSize: '0.42rem' }}
                        onClick={() => onDeleteQuote(q.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LOYALTY POINTS */}
        {tab === 'loyalty' && (
          <div style={{ padding: '0 1.5rem 2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #0d0d0d, #1a1400, #0d0d0d)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: '16px', padding: '1.8rem', textAlign: 'center', marginBottom: '1.4rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4.2rem', fontWeight: 200, color: 'var(--gold)', lineHeight: 1 }}>
                {points.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.4rem' }}>
                Sanctuary Reward Points
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--gold)', marginTop: '0.2rem' }}>
                {tierName} Member
              </div>

              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', margin: '1rem auto', maxWidth: '320px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(to right, var(--gold), #A8803A)', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '0.52rem', color: 'var(--muted)' }}>
                {tierNext
                  ? `Earn ${(tierMax - points).toLocaleString()} more points to reach ${tierNext} status`
                  : 'You have attained highest Sanctuary Elite status ✦'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.4rem' }}>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(201,168,76,0.1)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', color: 'var(--gold)' }}>{points.toLocaleString()}</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.15rem' }}>Points Earned</div>
              </div>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(201,168,76,0.1)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', color: 'var(--teal)' }}>0</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.15rem' }}>Redeemed</div>
              </div>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(201,168,76,0.1)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', color: '#7EC87A' }}>${Math.floor(points * 0.01)}</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.15rem' }}>Credit Value</div>
              </div>
            </div>

            <div style={{ fontSize: '0.5rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
              How to Earn Points
            </div>
            {[
              { ic: '📋', txt: 'Complete a retreat reservation', pts: '+500 pts' },
              { ic: '⭐', txt: 'Submit a verified post-retreat review', pts: '+100 pts' },
              { ic: '📊', txt: 'Save a quote in the Quote Studio', pts: '+50 pts' },
              { ic: '👥', txt: 'Refer a friend who subscribes or books', pts: '+500 pts + $100 credit' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.58rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{r.ic}</span>
                  <span style={{ color: 'var(--text)' }}>{r.txt}</span>
                </span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{r.pts}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REFERRAL */}
        {tab === 'referral' && (
          <div style={{ padding: '0 1.5rem 2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #0d0d0d, #051410, #0d0d0d)', border: '1px solid rgba(139,196,192,0.25)', borderRadius: '16px', padding: '1.6rem', textAlign: 'center', marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.3rem' }}>
                Refer a Friend
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#fff', marginBottom: '0.3rem' }}>
                Earn <em style={{ color: 'var(--gold)' }}>$100 Escrow Credit</em> + 500 Points
              </div>
              <p style={{ fontSize: '0.55rem', color: 'var(--muted)', maxWidth: '440px', margin: '0 auto' }}>
                When your colleague or friend joins Sanctuary with your VIP invite, they receive 10% off their first retreat and you receive $100 credit.
              </p>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.42rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '0.4rem' }}>
                Your Unique Invite Link
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="bk-inp"
                  readOnly
                  value={refLink}
                  style={{ margin: 0, color: 'var(--gold)' }}
                />
                <button
                  className="h-bp"
                  style={{ padding: '0.6rem 1.4rem', whiteSpace: 'nowrap' }}
                  onClick={copyRefLink}
                  type="button"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
              <button className="cp-btn" onClick={() => handleShare('Email')} type="button">💌 Email</button>
              <button className="cp-btn" onClick={() => handleShare('SMS')} type="button">📱 SMS</button>
              <button className="cp-btn" onClick={() => handleShare('WhatsApp')} type="button">💬 WhatsApp</button>
              <button className="cp-btn" onClick={() => handleShare('Instagram')} type="button">📸 Instagram</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.4rem' }}>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#fff' }}>{refStats.sent}</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Links Sent</div>
              </div>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>{refStats.conv}</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Subscribed</div>
              </div>
              <div style={{ background: 'var(--d2)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#7EC87A' }}>${refStats.cred}</div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Credits Earned</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS & WAITLISTS */}
        {tab === 'bookings' && (
          <div style={{ padding: '0 1.5rem 2rem' }}>
            <div style={{ fontSize: '0.5rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem' }}>
              Active &amp; Confirmed Retreats
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>📋</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem' }}>
                  No reservations yet
                </div>
              </div>
            ) : (
              bookings.map((bk) => (
                <div
                  key={bk.id}
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: '#fff' }}>
                        {bk.dest}
                      </div>
                      <div style={{ fontSize: '0.46rem', color: 'var(--gold)', marginTop: '0.1rem' }}>
                        Plan ID: {bk.planId} · {bk.venue}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.4rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '0.14rem 0.6rem',
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor: bk.status === 'Upcoming' ? 'rgba(52,152,219,0.4)' : 'rgba(90,158,82,0.4)',
                        color: bk.status === 'Upcoming' ? '#3498db' : '#7EC87A',
                        background: bk.status === 'Upcoming' ? 'rgba(52,152,219,0.1)' : 'rgba(90,158,82,0.1)',
                      }}
                    >
                      {bk.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.6rem 0' }}>
                    <span className="cp-card-tag">{bk.nights} Nights</span>
                    <span className="cp-card-tag">{bk.guests} Guests</span>
                    <span className="cp-card-tag">{bk.accommodation}</span>
                    <span className="cp-card-tag" style={{ color: 'var(--gold)' }}>{bk.cannabisProgram}</span>
                  </div>

                  <div style={{ fontSize: '0.48rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>
                    {bk.checkin} — {bk.checkout} · Specialist: {bk.specialist} · Paid: {bk.amountPaid} via {bk.paymentMethod}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="cp-btn"
                      onClick={() => {
                        try {
                          generateItineraryPDF(bk);
                          onShowToast(`✓ Downloaded full itinerary PDF for ${bk.planId}!`);
                        } catch (err) {
                          console.error(err);
                          onShowToast('Error generating PDF file.');
                        }
                      }}
                      type="button"
                    >
                      ⬇ Confirmation PDF
                    </button>
                    <button
                      className="cp-btn teal"
                      onClick={() => {
                        onClose();
                        onOpenBanking();
                      }}
                      type="button"
                    >
                      🏛 Escrow Details
                    </button>
                    {bk.status === 'Completed' && (
                      <button
                        className="cp-btn"
                        onClick={() => {
                          onClose();
                          onOpenReviews();
                        }}
                        type="button"
                      >
                        ⭐ Leave Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Waitlist section */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem', paddingBottom: '0.35rem', borderBottom: '1px solid rgba(201,168,76,0.14)' }}>
                ⏳ My Priority Waitlists ({waitlists.length})
              </div>

              {waitlists.length === 0 ? (
                <div style={{ fontSize: '0.52rem', color: 'var(--muted)' }}>
                  No active waitlist entries. Fully booked dates on the calendar allow 1-click waitlist joining.
                </div>
              ) : (
                waitlists.map((wl) => (
                  <div
                    key={wl.id}
                    style={{
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '0.9rem 1.1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: '#fff' }}>
                        {wl.dest}
                      </div>
                      <div style={{ fontSize: '0.44rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                        {wl.dateRange} · {wl.groupSize} · {wl.flexibility}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.42rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.18rem 0.6rem', border: '1px solid rgba(201,168,76,0.35)', color: 'var(--gold)', borderRadius: '999px' }}>
                      Position #{wl.position}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
