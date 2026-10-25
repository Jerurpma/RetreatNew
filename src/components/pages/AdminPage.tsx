import React, { useState, useMemo } from 'react';
import { Booking, WaitlistEntry, Transaction, User } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

interface AdminPageProps {
  user: User | null;
  bookings: Booking[];
  waitlists: WaitlistEntry[];
  transactions: Transaction[];
  onNavigateHome: () => void;
  onOpenFinance?: () => void;
  onUpdateBookingStatus: (bookingId: string, called: boolean) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  user,
  bookings,
  waitlists,
  transactions,
  onNavigateHome,
  onOpenFinance,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'waitlist' | 'transactions' | 'compliance'>('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [confirmedState, setConfirmedState] = useState<Record<string, boolean>>({
    'bk-2': true,
  });

  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase() === 'jeremy.urpman@gocsps.com';

  const handleToggleConfirmed = async (bookingId: string) => {
    const nextState = !confirmedState[bookingId];
    setConfirmedState((prev) => ({ ...prev, [bookingId]: nextState }));
    onUpdateBookingStatus(bookingId, nextState);

    if (db) {
      try {
        await updateDoc(doc(db, 'retreat_bookings', bookingId), {
          adminCalledAndBooked: nextState,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `retreat_bookings/${bookingId}`);
      }
    }
  };

  // Filter reservations by search and fulfillment status
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isConfirmed = confirmedState[b.id] ?? b.adminCalledAndBooked ?? false;
      if (statusFilter === 'pending' && isConfirmed) return false;
      if (statusFilter === 'confirmed' && !isConfirmed) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        b.leadGuest?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.state?.toLowerCase().includes(q) ||
        b.dest?.toLowerCase().includes(q) ||
        b.accommodation?.toLowerCase().includes(q) ||
        b.cannabisProgram?.toLowerCase().includes(q) ||
        b.planId?.toLowerCase().includes(q) ||
        b.amountPaid?.toLowerCase().includes(q)
      );
    });
  }, [bookings, searchTerm, statusFilter, confirmedState]);

  // Gross retreat volume
  const totalGMV = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const num = parseFloat(b.amountPaid?.replace(/[^0-9.]/g, '') || '0');
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }, [bookings]);

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#e05555' }}>&#128737;</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.4rem', marginBottom: '0.8rem' }}>
          Administrator Access Required
        </h1>
        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', maxWidth: '480px', lineHeight: '1.8', marginBottom: '2rem' }}>
          This dedicated portal is reserved for Sanctuary Concierge Administrators (Jeremy Urpman) to review booked reservations, inspect guest budgets, and manage retreat packages.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="bk-next"
            onClick={onNavigateHome}
            style={{ padding: '0.8rem 1.6rem' }}
          >
            &larr; Return to Guest Retreats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Admin Bar */}
      <div
        style={{
          background: '#0d0d0d',
          borderBottom: '1px solid rgba(224,85,85,0.3)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          backdropFilter: 'blur(16px)',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateHome}
              type="button"
              className="cp-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.5rem' }}
            >
              <span>&larr;</span> Back to Sanctuary Website
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>
                Sanctuary
              </span>
              <span
                style={{
                  fontSize: '0.42rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'rgba(224,85,85,0.15)',
                  border: '1px solid rgba(224,85,85,0.5)',
                  color: '#ff7b7b',
                  fontWeight: 700,
                }}
              >
                Dedicated Admin Fulfillment Portal
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.5rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>&#128737;</span> <strong>Jeremy Urpman</strong> (Master Admin)
            </span>
            <button
              type="button"
              onClick={onNavigateHome}
              className="bk-back"
              style={{ padding: '0.45rem 1rem', fontSize: '0.48rem' }}
            >
              Exit Admin &#x2715;
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Page Container */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Page Title & Mission */}
        <div style={{ marginBottom: '2.2rem' }}>
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            Concierge Retreat Reservations &amp; Guest Fulfillment
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#fff', margin: 0, fontWeight: 300 }}>
            Master Administrator Portal
          </h1>
          <p style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '0.4rem', maxWidth: '720px', lineHeight: '1.7' }}>
            Review all reservations placed by guests. Displays strictly the <strong>City &amp; State</strong> in which they booked, the <strong>Package Booked</strong>, their dates of stay, and the total budget picked.
          </p>
        </div>

        {/* Top KPI Metrics Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.4rem' }}>
          <div className="ef-kpi" style={{ borderLeft: '3px solid #e05555', background: '#121212', padding: '1.2rem', borderRadius: '14px' }}>
            <div className="ef-kpi-lbl" style={{ fontSize: '0.44rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Booked Reservations</div>
            <div className="ef-kpi-val" style={{ color: '#ff7b7b', fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>{bookings.length}</div>
            <div className="ef-kpi-chg" style={{ fontSize: '0.46rem', color: '#ff9b9b' }}>All guest packages booked</div>
          </div>

          <div className="ef-kpi" style={{ borderLeft: '3px solid var(--gold)', background: '#121212', padding: '1.2rem', borderRadius: '14px' }}>
            <div className="ef-kpi-lbl" style={{ fontSize: '0.44rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Gross Budget / GMV</div>
            <div className="ef-kpi-val" style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>
              ${totalGMV.toLocaleString()}
            </div>
            <div className="ef-kpi-chg" style={{ fontSize: '0.46rem', color: '#7EC87A' }}>Across all confirmed guests</div>
          </div>

          <div className="ef-kpi" style={{ borderLeft: '3px solid var(--bank)', background: '#121212', padding: '1.2rem', borderRadius: '14px' }}>
            <div className="ef-kpi-lbl" style={{ fontSize: '0.44rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Escrow Secured</div>
            <div className="ef-kpi-val" style={{ color: 'var(--bank)', fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>$98,500</div>
            <div className="ef-kpi-chg" style={{ fontSize: '0.46rem', color: 'var(--muted)' }}>AES-256 Vaulted</div>
          </div>

          <div className="ef-kpi" style={{ borderLeft: '3px solid var(--teal)', background: '#121212', padding: '1.2rem', borderRadius: '14px' }}>
            <div className="ef-kpi-lbl" style={{ fontSize: '0.44rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Waitlist Inquiries</div>
            <div className="ef-kpi-val" style={{ color: 'var(--teal)', fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>{waitlists.length}</div>
            <div className="ef-kpi-chg" style={{ fontSize: '0.46rem', color: 'var(--muted)' }}>High demand in Sedona &amp; Maui</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mr-tabs" style={{ marginBottom: '2rem' }}>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
            style={{ fontWeight: 700, fontSize: '0.52rem' }}
          >
            &#128197; Reservations ({bookings.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'waitlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('waitlist')}
            style={{ fontSize: '0.52rem' }}
          >
            &#9203; Waitlist Requests ({waitlists.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
            style={{ fontSize: '0.52rem' }}
          >
            &#128181; Escrow &amp; Banking Ledger ({transactions.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
            style={{ fontSize: '0.52rem' }}
          >
            &#128737; 100% Legal &amp; Medical Oversight
          </button>
        </div>

        {/* TAB 1: RESERVATIONS (ALL GUEST BOOKINGS - STRICTLY CITY, STATE, PACKAGE) */}
        {activeTab === 'reservations' && (
          <div>
            {/* Filter & Search Bar */}
            <div
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.22)',
                borderRadius: '16px',
                padding: '1.4rem 1.6rem',
                marginBottom: '1.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                  &#128197; Guest Reservations Fulfillment Queue
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Status Filter */}
                  <div style={{ display: 'flex', background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.15rem' }}>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        border: 'none',
                        background: statusFilter === 'all' ? 'rgba(201,168,76,0.25)' : 'transparent',
                        color: statusFilter === 'all' ? '#fff' : 'var(--muted)',
                        fontSize: '0.44rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      All ({bookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('pending')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        border: 'none',
                        background: statusFilter === 'pending' ? 'rgba(224,85,85,0.25)' : 'transparent',
                        color: statusFilter === 'pending' ? '#ff7b7b' : 'var(--muted)',
                        fontSize: '0.44rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Needs Concierge Fulfillment
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('confirmed')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        border: 'none',
                        background: statusFilter === 'confirmed' ? 'rgba(90,158,82,0.25)' : 'transparent',
                        color: statusFilter === 'confirmed' ? '#7EC87A' : 'var(--muted)',
                        fontSize: '0.44rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Confirmed &amp; Scheduled
                    </button>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search guest, city, state, package, budget..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.52rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      background: '#141414',
                      color: '#fff',
                      minWidth: '260px',
                    }}
                  />
                </div>
              </div>

              <p style={{ fontSize: '0.56rem', color: 'var(--text)', margin: 0, lineHeight: '1.7' }}>
                Every reservation placed by guests is listed below with the <strong>User Name</strong>, the <strong>City &amp; State Booked</strong>, the <strong>Package Booked</strong>, and the <strong>Budget Picked</strong>.
              </p>
            </div>

            {/* List of Bookings */}
            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#121212', borderRadius: '18px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>&#128197;</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', color: '#fff' }}>
                  No reservations match your filter
                </div>
                <p style={{ fontSize: '0.55rem', marginTop: '0.4rem' }}>
                  {searchTerm ? `No results for "${searchTerm}". Try another search.` : 'No reservations in this view.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredBookings.map((b) => {
                  const isConfirmed = confirmedState[b.id] ?? b.adminCalledAndBooked ?? false;
                  const bookedCity = b.city || b.dest?.split(',')[0]?.trim() || 'Sedona';
                  const bookedState = b.state || b.dest?.split(',')[1]?.trim() || 'Arizona';
                  const bookedPackage = `${b.accommodation || 'Luxury Sanctuary Villa'} · ${b.cannabisProgram || 'Full THC & CBD Holistic'}`;

                  return (
                    <div
                      key={b.id}
                      style={{
                        background: '#121212',
                        border: `1px solid ${isConfirmed ? 'rgba(90,158,82,0.45)' : 'rgba(201,168,76,0.35)'}`,
                        borderRadius: '20px',
                        padding: '1.8rem',
                        position: 'relative',
                        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
                      }}
                    >
                      {/* Top Row: Status, Lead Guest, Total Budget */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '1.4rem' }}>
                        <div>
                          <span
                            style={{
                              fontSize: '0.4rem',
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              padding: '0.2rem 0.7rem',
                              borderRadius: '999px',
                              background: isConfirmed ? 'rgba(90,158,82,0.16)' : 'rgba(201,168,76,0.16)',
                              border: `1px solid ${isConfirmed ? '#5A9E52' : 'var(--gold)'}`,
                              color: isConfirmed ? '#7EC87A' : 'var(--gold)',
                              fontWeight: 700,
                              display: 'inline-block',
                              marginBottom: '0.6rem',
                            }}
                          >
                            {isConfirmed ? '✓ Confirmed & Concierge Scheduled' : '✦ Pending Concierge Review'}
                          </span>

                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                            User / Guest Name
                          </div>
                          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', color: '#fff', margin: '0.2rem 0' }}>
                            {b.leadGuest || 'Guest Traveler'}
                          </h2>
                          <div style={{ fontSize: '0.52rem', color: 'var(--gold)' }}>
                            Plan ID: <strong>{b.planId}</strong> &middot; Email: <strong>{b.email}</strong>
                          </div>
                        </div>

                        {/* Total Budget Picked Box */}
                        <div
                          style={{
                            background: 'rgba(201,168,76,0.08)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            padding: '1rem 1.4rem',
                            borderRadius: '14px',
                            textAlign: 'right',
                            minWidth: '200px',
                          }}
                        >
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                            Total Budget Picked
                          </div>
                          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.2rem', color: '#fff', fontWeight: 600, margin: '0.1rem 0' }}>
                            {b.amountPaid}
                          </div>
                          <div style={{ fontSize: '0.46rem', color: '#7EC87A' }}>
                            {b.guests} Guests &middot; Paid via {b.paymentMethod}
                          </div>
                        </div>
                      </div>

                      {/* Middle Details: ONLY City & State Booked, Package Booked, and Dates */}
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          padding: '1.4rem',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                          gap: '1.4rem',
                          marginBottom: '1.4rem',
                        }}
                      >
                        {/* 1. Booked City & State */}
                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                            City &amp; State Booked
                          </div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '0.3rem' }}>
                            {bookedCity}, {bookedState}
                          </div>
                          <div style={{ fontSize: '0.48rem', color: 'var(--teal)', marginTop: '0.2rem' }}>
                            Jurisdiction: Verified 100% Legal / Medical Compliant
                          </div>
                        </div>

                        {/* 2. Package Booked */}
                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                            Package Booked
                          </div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--gold)', marginTop: '0.3rem' }}>
                            {bookedPackage}
                          </div>
                          <div style={{ fontSize: '0.48rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                            Specialist Assigned: {b.specialist || 'Lead Holistic Concierge'}
                          </div>
                        </div>

                        {/* 3. Dates of Stay */}
                        <div>
                          <div style={{ fontSize: '0.42rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                            Dates of Stay &amp; Party
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '0.3rem' }}>
                            {b.checkin} — {b.checkout}
                          </div>
                          <div style={{ fontSize: '0.5rem', color: '#7EC87A', marginTop: '0.2rem' }}>
                            Duration: <strong>{b.nights} Nights</strong> &middot; Party: <strong>{b.guests} Guests</strong>
                          </div>
                        </div>
                      </div>

                      {/* Full Itemized Budget Breakdown */}
                      <div
                        style={{
                          background: '#0a0a0a',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '14px',
                          padding: '1.2rem',
                          marginBottom: '1.4rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                          <span style={{ fontSize: '0.45rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                            Itemized Budget Picked by Guest
                          </span>
                          <span style={{ fontSize: '0.48rem', color: 'var(--muted)' }}>
                            Total Budget: <strong style={{ color: '#fff' }}>{b.amountPaid}</strong>
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', textAlign: 'center' }}>
                          <div style={{ background: '#141414', padding: '0.7rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)', textTransform: 'uppercase' }}>🏨 Accommodations</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                              ${b.breakdown?.hotel?.toLocaleString() || '4,800'}
                            </div>
                          </div>
                          <div style={{ background: '#141414', padding: '0.7rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)', textTransform: 'uppercase' }}>🚗 Transportation</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                              ${b.breakdown?.transportation?.toLocaleString() || '950'}
                            </div>
                          </div>
                          <div style={{ background: '#141414', padding: '0.7rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)', textTransform: 'uppercase' }}>🌿 Cannabis &amp; Ceremonies</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                              ${b.breakdown?.activities?.toLocaleString() || '1,850'}
                            </div>
                          </div>
                          <div style={{ background: '#141414', padding: '0.7rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)', textTransform: 'uppercase' }}>🛎️ Concierge Care</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                              ${b.breakdown?.concierge?.toLocaleString() || '1,100'}
                            </div>
                          </div>
                          <div style={{ background: '#141414', padding: '0.7rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.4rem', color: 'var(--muted)', textTransform: 'uppercase' }}>🏛️ Taxes &amp; Surcharges</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginTop: '0.2rem' }}>
                              ${b.breakdown?.taxes?.toLocaleString() || '583'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Fulfillment Actions */}
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="cp-btn"
                          onClick={() => handleToggleConfirmed(b.id)}
                          style={{
                            background: isConfirmed ? 'rgba(90,158,82,0.18)' : 'rgba(255,255,255,0.06)',
                            borderColor: isConfirmed ? '#5A9E52' : 'rgba(201,168,76,0.35)',
                            color: isConfirmed ? '#7EC87A' : 'var(--gold)',
                            padding: '0.7rem 1.4rem',
                            fontSize: '0.5rem',
                          }}
                        >
                          {isConfirmed ? '✓ Confirmed (Click to mark pending)' : '✓ Mark as Confirmed & Scheduled'}
                        </button>

                        <button
                          type="button"
                          className="cp-btn teal"
                          onClick={() => alert(`Emailing booking confirmation to ${b.email} confirming retreat package in ${bookedCity}, ${bookedState}.`)}
                          style={{ padding: '0.7rem 1.4rem', fontSize: '0.5rem' }}
                        >
                          ✉ Email Guest Confirmation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WAITLIST INQUIRIES */}
        {activeTab === 'waitlist' && (
          <div>
            <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>
              Pending Waitlist Inquiries
            </div>
            {waitlists.map((w) => (
              <div key={w.id} className="wl-entry" style={{ background: '#121212', borderRadius: '14px', padding: '1.4rem', marginBottom: '1rem' }}>
                <div>
                  <div className="wl-entry-dest" style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>{w.dest}</div>
                  <div className="wl-entry-date" style={{ color: 'var(--muted)', marginTop: '0.3rem', fontSize: '0.56rem' }}>
                    Guest: <strong>{w.name}</strong> ({w.email}) &middot; Requested Dates: {w.dateRange} &middot; Party: {w.groupSize}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span className="wl-entry-pos" style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.52rem' }}>
                    Position #{w.position}
                  </span>
                  <button
                    type="button"
                    className="cp-btn"
                    onClick={() => alert(`Priority opening notification sent to ${w.email} for ${w.dest}!`)}
                    style={{ fontSize: '0.5rem', padding: '0.55rem 1rem' }}
                  >
                    Send Priority Opening
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ESCROW & TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Active Escrow Vault &amp; Banking Transactions
              </div>
              {onOpenFinance && (
                <button type="button" className="cp-btn" onClick={onOpenFinance} style={{ fontSize: '0.5rem', padding: '0.5rem 1rem' }}>
                  Open P&amp;L Suite &rarr;
                </button>
              )}
            </div>

            {transactions.map((tx) => (
              <div key={tx.id} className="bp-tx-row" style={{ padding: '1.1rem', background: '#121212', marginBottom: '0.8rem', borderRadius: '12px' }}>
                <div className="bp-tx-ic">{tx.type === 'in' ? '↙' : '↗'}</div>
                <div className="bp-tx-info">
                  <div className="bp-tx-desc" style={{ color: '#fff', fontSize: '0.74rem' }}>{tx.desc}</div>
                  <div className="bp-tx-date" style={{ fontSize: '0.52rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    {tx.date} &middot; Status: <strong style={{ color: tx.status === 'Cleared' || tx.status === 'Credited' ? '#7EC87A' : 'var(--gold)' }}>{tx.status}</strong>
                  </div>
                </div>
                <div className={`bp-tx-amt ${tx.type}`} style={{ fontSize: '0.95rem' }}>
                  {tx.type === 'in' ? '+' : '-'}${tx.amt.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="ef-panel" style={{ background: '#121212', borderRadius: '18px', padding: '2rem' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', color: '#ff7b7b', marginBottom: '1rem' }}>
              State &amp; Sovereign Cannabis Jurisdiction Compliance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.62rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
              <div>
                <strong style={{ color: '#7EC87A' }}>100% Legal Adult-Use (21+):</strong> Arizona, California, Nevada, Colorado, Washington, Thailand. Guests must present valid government photo ID demonstrating age 21+.
              </div>
              <div>
                <strong style={{ color: 'var(--teal)' }}>Medical Marijuana Card Reciprocity:</strong> Hawaii (329 Card), Oklahoma (OMMA), Puerto Rico (DOH). Out-of-state cards must be pre-cleared 14 days in advance with state health registries.
              </div>
              <div>
                <strong style={{ color: 'var(--gold)' }}>Decriminalized Retreat Zones:</strong> Costa Rica (Nosara &amp; Arenal), Jamaica (Negril), Spain (Barcelona private social associations). Private consumption respected on private villa estates.
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Admin Concierge Protocol:</strong> Administrators verify private concierge guides, medical reciprocity pre-clearance, and private chauffeur itineraries.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
