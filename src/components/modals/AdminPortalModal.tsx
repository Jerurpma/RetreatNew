import React, { useState } from 'react';
import { Booking, WaitlistEntry, Transaction } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  waitlists: WaitlistEntry[];
  transactions: Transaction[];
  onOpenFinance: () => void;
  onUpdateBookingStatus?: (bookingId: string, called: boolean) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  bookings,
  waitlists,
  transactions,
  onOpenFinance,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'waitlist' | 'compliance' | 'transactions'>('reservations');
  const [calledState, setCalledState] = useState<Record<string, boolean>>({
    'bk-2': true,
  });
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleToggleCalled = async (bookingId: string) => {
    const nextState = !calledState[bookingId];
    setCalledState((prev) => ({ ...prev, [bookingId]: nextState }));
    onUpdateBookingStatus?.(bookingId, nextState);

    // Update in Firestore
    try {
      await updateDoc(doc(db, 'retreat_bookings', bookingId), {
        adminCalledAndBooked: nextState,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `retreat_bookings/${bookingId}`);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.leadGuest?.toLowerCase().includes(q) ||
      b.dest?.toLowerCase().includes(q) ||
      b.city?.toLowerCase().includes(q) ||
      b.hotelName?.toLowerCase().includes(q) ||
      b.planId?.toLowerCase().includes(q)
    );
  });

  return (
    <div id="admin-portal" className="portal show" style={{ display: 'block', zIndex: 990 }}>
      <div className="adm-topbar">
        <div className="adm-logo">
          Sanctuary <span style={{ fontSize: '0.44rem', letterSpacing: '0.28em', color: 'rgba(255,80,80,0.6)' }}>Concierge Fulfillment &amp; Master Admin</span>
        </div>
        <div className="adm-user">
          <span className="adm-badge">&#128737; Jeremy Urpman &middot; Admin</span>
          <button className="adm-btn-sm" onClick={onClose} type="button">
            Exit Admin &#x2715;
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* KPI Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div className="ef-kpi" style={{ borderLeft: '3px solid #e05555' }}>
            <div className="ef-kpi-lbl">Booked Retreats to Fulfill</div>
            <div className="ef-kpi-val" style={{ color: '#e05555' }}>{bookings.length}</div>
            <div className="ef-kpi-chg">Requires calling hotel</div>
          </div>
          <div className="ef-kpi">
            <div className="ef-kpi-lbl">Total Gross Retreat GMV</div>
            <div className="ef-kpi-val" style={{ color: 'var(--gold)' }}>$412,890</div>
            <div className="ef-kpi-chg">+24.8% this month</div>
          </div>
          <div className="ef-kpi">
            <div className="ef-kpi-lbl">Escrow Held</div>
            <div className="ef-kpi-val" style={{ color: 'var(--bank)' }}>$98,500</div>
            <div className="ef-kpi-chg">AES-256 secured</div>
          </div>
          <div className="ef-kpi">
            <div className="ef-kpi-lbl">Waitlist Requests</div>
            <div className="ef-kpi-val">{waitlists.length}</div>
            <div className="ef-kpi-chg">High demand in Sedona &amp; Maui</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mr-tabs" style={{ marginBottom: '1.8rem' }}>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
            style={{ fontWeight: 700 }}
          >
            &#128197; Reservations ({bookings.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'waitlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('waitlist')}
          >
            &#9203; Waitlist Requests ({waitlists.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            &#128181; Escrow Ledger ({transactions.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            &#128737; 100% Legal &amp; Medical Compliance
          </button>
        </div>

        {/* TAB 1: RESERVATIONS (CALL & FULFILL HOTEL) */}
        {activeTab === 'reservations' && (
          <div>
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '1.2rem 1.4rem', borderRadius: '14px', marginBottom: '1.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.6rem' }}>
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                  &#128222; Admin Reservation Fulfillment Center
                </div>
                <input
                  type="text"
                  placeholder="Search by guest name, destination, hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.52rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#181818',
                    color: '#fff',
                    minWidth: '240px',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.55rem', color: 'var(--text)', margin: '0', lineHeight: '1.7' }}>
                All booked guest reservations appear here under <strong>Reservations</strong>. Each entry displays strictly the <strong>User Name</strong>, the <strong>City &amp; State Booked</strong>, the <strong>Package Booked</strong>, and the <strong>Total Budget Picked</strong>.
              </p>
            </div>

            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#121212', borderRadius: '16px', color: 'var(--muted)' }}>
                No reservations found matching your criteria.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {filteredBookings.map((b) => {
                  const isCalled = calledState[b.id] ?? b.adminCalledAndBooked ?? false;
                  const bookedCity = b.city || b.dest?.split(',')[0]?.trim() || 'Sedona';
                  const bookedState = b.state || b.dest?.split(',')[1]?.trim() || 'Arizona';
                  const bookedPackage = `${b.accommodation || 'Luxury Sanctuary Villa'} · ${b.cannabisProgram || 'Full THC & CBD Holistic'}`;

                  return (
                    <div
                      key={b.id}
                      className="bk-card"
                      style={{
                        background: '#121212',
                        border: `1px solid ${isCalled ? 'rgba(90,158,82,0.35)' : 'rgba(201,168,76,0.4)'}`,
                        borderRadius: '18px',
                        padding: '1.6rem',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <span
                            style={{
                              fontSize: '0.38rem',
                              letterSpacing: '0.14em',
                              textTransform: 'uppercase',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '999px',
                              background: isCalled ? 'rgba(90,158,82,0.14)' : 'rgba(201,168,76,0.14)',
                              border: `1px solid ${isCalled ? '#5A9E52' : 'var(--gold)'}`,
                              color: isCalled ? '#7EC87A' : 'var(--gold)',
                              fontWeight: 700,
                            }}
                          >
                            {isCalled ? '✓ Confirmed & Concierge Scheduled' : '✦ Pending Concierge Review'}
                          </span>

                          <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                              User / Lead Guest Name
                            </div>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', margin: '0.2rem 0' }}>
                              {b.leadGuest || 'Guest Traveler'}
                            </h3>
                          </div>

                          <div style={{ fontSize: '0.52rem', color: 'var(--gold)', marginTop: '0.2rem' }}>
                            Plan ID: <strong>{b.planId}</strong> &middot; Email: {b.email}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Total Package Paid</div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--gold)' }}>
                            {b.amountPaid}
                          </div>
                          <div style={{ fontSize: '0.45rem', color: '#7EC87A' }}>via {b.paymentMethod}</div>
                        </div>
                      </div>

                      {/* City, State & Package Booked Details */}
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(201,168,76,0.22)',
                          padding: '1.2rem',
                          borderRadius: '14px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                          gap: '1rem',
                          marginBottom: '1.2rem',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                            City &amp; State Booked
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                            {bookedCity}, {bookedState}
                          </div>
                          <div style={{ fontSize: '0.48rem', color: 'var(--teal)', marginTop: '0.15rem' }}>
                            100% Legal / Medical Compliant
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                            Package Booked
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gold)', marginTop: '0.25rem' }}>
                            {bookedPackage}
                          </div>
                          <div style={{ fontSize: '0.48rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                            Specialist: {b.specialist || 'Holistic Concierge'}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                            Dates of Stay
                          </div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginTop: '0.25rem' }}>
                            {b.checkin} — {b.checkout}
                          </div>
                          <div style={{ fontSize: '0.48rem', color: '#7EC87A', marginTop: '0.15rem' }}>
                            {b.nights} Nights &middot; {b.guests} Guests
                          </div>
                        </div>
                      </div>

                      {/* Full Price Breakdown */}
                      <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ fontSize: '0.44rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
                          Itemized Package Price Breakdown
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.8rem', textAlign: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)' }}>Accommodations</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              ${b.breakdown?.hotel?.toLocaleString() || '4,800'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)' }}>Transportation</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              ${b.breakdown?.transportation?.toLocaleString() || '950'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)' }}>Cannabis &amp; Rituals</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              ${b.breakdown?.activities?.toLocaleString() || '1,850'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)' }}>Concierge Care</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              ${b.breakdown?.concierge?.toLocaleString() || '1,100'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)' }}>Taxes &amp; Surcharges</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', marginTop: '0.15rem' }}>
                              ${b.breakdown?.taxes?.toLocaleString() || '583'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="cp-btn"
                          onClick={() => handleToggleCalled(b.id)}
                          style={{
                            background: isCalled ? 'rgba(90,158,82,0.15)' : 'rgba(255,255,255,0.06)',
                            borderColor: isCalled ? '#5A9E52' : 'rgba(201,168,76,0.3)',
                            color: isCalled ? '#7EC87A' : 'var(--gold)',
                          }}
                        >
                          {isCalled ? '✓ Confirmed (Click to mark pending)' : '✓ Mark as Confirmed & Scheduled'}
                        </button>

                        <button
                          type="button"
                          className="cp-btn teal"
                          onClick={() => alert(`Emailing booking confirmation to ${b.email} confirming retreat package in ${bookedCity}, ${bookedState}.`)}
                        >
                          Email Guest Itinerary Confirmation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WAITLIST REQUESTS */}
        {activeTab === 'waitlist' && (
          <div>
            <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
              Pending Waitlist Inquiries
            </div>
            {waitlists.map((w) => (
              <div key={w.id} className="wl-entry" style={{ background: '#121212', borderRadius: '12px', padding: '1rem' }}>
                <div>
                  <div className="wl-entry-dest">{w.dest}</div>
                  <div className="wl-entry-date" style={{ color: 'var(--muted)', marginTop: '0.2rem' }}>
                    Guest: {w.name} ({w.email}) &middot; Requested Dates: {w.dateRange} &middot; Group: {w.groupSize}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span className="wl-entry-pos">Pos #{w.position}</span>
                  <button
                    type="button"
                    className="cp-btn"
                    onClick={() => alert(`Priority opening dispatch sent to ${w.email} for ${w.dest}!`)}
                  >
                    Send Priority Opening
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TRANSACTIONS & ESCROW */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Active Escrow Vault &amp; Banking Transactions
              </div>
              <button type="button" className="cp-btn" onClick={onOpenFinance}>
                Open Full P&amp;L Suite &rarr;
              </button>
            </div>

            {transactions.map((tx) => (
              <div key={tx.id} className="bp-tx-row" style={{ padding: '0.9rem', background: '#121212', marginBottom: '0.6rem', borderRadius: '10px' }}>
                <div className="bp-tx-ic">{tx.type === 'in' ? '↙' : '↗'}</div>
                <div className="bp-tx-info">
                  <div className="bp-tx-desc" style={{ color: '#fff' }}>{tx.desc}</div>
                  <div className="bp-tx-date">{tx.date} &middot; Status: {tx.status}</div>
                </div>
                <div className={`bp-tx-amt ${tx.type}`}>
                  {tx.type === 'in' ? '+' : '-'}${tx.amt.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="ef-panel">
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#e05555', marginBottom: '0.8rem' }}>
              State &amp; Sovereign Cannabis Jurisdiction Oversight
            </h4>
            <div className="ef-list">
              <div><strong>100% Legal Adult-Use (21+):</strong> Arizona, California, Nevada, Colorado, Washington, Thailand. 100% ID age validation confirmed.</div>
              <div><strong>Medical Marijuana Card Reciprocity:</strong> Hawaii (329 Card), Oklahoma (OMMA), Puerto Rico (DOH). Pre-cleared 14 days in advance.</div>
              <div><strong>Decriminalized Zones:</strong> Costa Rica (Nosara &amp; Arenal), Jamaica (Negril), Spain (Barcelona private social clubs).</div>
              <div><strong>Admin Concierge Duty:</strong> Admins directly call hotel establishment phone numbers to verify room readiness and private cannabis consumption guidelines.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
