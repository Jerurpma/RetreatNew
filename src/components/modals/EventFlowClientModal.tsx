import React, { useState } from 'react';
import { Booking } from '../../types';

interface EventFlowClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onOpenReviews: () => void;
}

export const EventFlowClientModal: React.FC<EventFlowClientModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenReviews,
}) => {
  const [activeTab, setActiveTab] = useState<'passes' | 'invoices' | 'waivers' | 'messages'>('passes');

  if (!isOpen) return null;

  return (
    <div id="ef-client" className="portal show" style={{ display: 'block' }}>
      <button className="ef-close-btn" onClick={onClose} type="button">
        Close Client Hub &#x2715;
      </button>

      <div className="ef-wrap" style={{ overflowY: 'auto' }}>
        <div style={{ maxWidth: '940px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>&#128196;</span>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 200, color: '#fff', margin: 0 }}>
                Client Retreat Passport &amp; Hub
              </h2>
              <div style={{ fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Encrypted Mobile Boarding Passes &amp; Specialist Concierge
              </div>
            </div>
          </div>

          {/* Client Portal Tabs */}
          <div className="cp-tabs">
            <button
              type="button"
              className={`cp-tab ${activeTab === 'passes' ? 'active' : ''}`}
              onClick={() => setActiveTab('passes')}
            >
              &#127915; Active Retreat Tickets ({bookings.length})
            </button>
            <button
              type="button"
              className={`cp-tab ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              &#128181; Receipts &amp; Escrow Statements
            </button>
            <button
              type="button"
              className={`cp-tab ${activeTab === 'waivers' ? 'active' : ''}`}
              onClick={() => setActiveTab('waivers')}
            >
              &#128221; Medical 329 &amp; Consent Waivers
            </button>
            <button
              type="button"
              className={`cp-tab ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              &#128172; Concierge Briefings
            </button>
          </div>

          {activeTab === 'passes' && (
            <div>
              {bookings.map((b) => (
                <div key={b.id} className="cp-card">
                  <div className="cp-card-hdr">
                    <div>
                      <div className="cp-card-dest">{b.dest}</div>
                      <div style={{ fontSize: '0.48rem', color: 'var(--gold)', letterSpacing: '0.12em', marginTop: '0.2rem' }}>
                        Plan: {b.planId}
                      </div>
                    </div>
                    <span className="bk-status c">Pass Active &amp; Validated</span>
                  </div>

                  <div className="cp-card-tags">
                    <span className="cp-card-tag">{b.checkin} - {b.checkout}</span>
                    <span className="cp-card-tag">{b.nights} Nights &middot; {b.guests} Guests</span>
                    <span className="cp-card-tag">{b.accommodation}</span>
                    <span className="cp-card-tag">{b.cannabisProgram}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'center', marginTop: '1rem', background: '#121212', padding: '1rem', borderRadius: '12px' }}>
                    {/* Visual QR Code Generator */}
                    <div style={{ textAlign: 'center' }}>
                      <div className="cp-qr">
                        <div className="qr-grid">
                          <div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div>
                          <div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div>
                          <div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div>
                          <div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c w"></div>
                          <div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div>
                          <div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c w"></div>
                          <div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c w"></div><div className="qr-c b"></div><div className="qr-c b"></div><div className="qr-c b"></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.4rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        Gate Pass: #SNCT-{b.id.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <div className="cp-card-meta">
                        <strong>Assigned Healer Concierge:</strong> {b.specialist}
                        <br />
                        <strong>Private Luxury Venue:</strong> {b.venue}
                        <br />
                        <strong>Private Gate Check-in:</strong> 3:00 PM HST &middot; Strict 18+ ID protocol
                        <br />
                        <strong>Total Amount Paid:</strong> <span style={{ color: 'var(--gold)' }}>{b.amountPaid}</span> via {b.paymentMethod}
                      </div>

                      <div className="cp-card-actions">
                        <button
                          type="button"
                          className="cp-btn"
                          onClick={() => alert(`Retreat Passport ${b.planId} added to your Apple Wallet.`)}
                        >
                          &#127822; Add to Apple Wallet
                        </button>
                        <button
                          type="button"
                          className="cp-btn"
                          onClick={() => alert(`Downloading high-resolution PDF itinerary & gate pass for ${b.planId}...`)}
                        >
                          &#128196; PDF Itinerary &amp; Vouchers
                        </button>
                        <button
                          type="button"
                          className="cp-btn teal"
                          onClick={onOpenReviews}
                        >
                          &#11088; Leave Verified Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div>
              {bookings.map((b) => (
                <div key={b.id} className="bk-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#fff' }}>
                      Invoice #{b.planId.replace('SAN-', 'INV-')}
                    </div>
                    <div style={{ fontSize: '0.5rem', color: 'var(--muted)' }}>
                      {b.dest} &middot; {b.nights} Nights &middot; Issued {b.checkin}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--gold)' }}>
                      {b.amountPaid}
                    </div>
                    <span className="ef-badge paid">Paid in Full &amp; Escrow Protected</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'waivers' && (
            <div className="ef-panel">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '0.8rem' }}>
                Signed Legal Agreements &amp; Health Consents
              </h4>
              <div className="ef-list">
                <div>&#9989; <strong>Hawaii 329 State Reciprocity Intake:</strong> Verified with State Dept of Health.</div>
                <div>&#9989; <strong>Plant Medicine &amp; Holistic Consent:</strong> Electronic waiver executed on booking.</div>
                <div>&#9989; <strong>Luxury Villa Property Agreement:</strong> Zero-damage bond held via Sanctuary escrow.</div>
                <div>&#9989; <strong>Emergency Contact &amp; Medical Disclosure:</strong> On file with Dr. Kaimana Kahale.</div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="ef-panel">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--teal)', marginBottom: '0.8rem' }}>
                Concierge Briefings &amp; Arrival Protocol
              </h4>
              <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.8' }}>
                &ldquo;Aloha! We have personalized your strain selection and organic terpene profiles to match your evening meditation and oceanfront bodywork. Your private SUV chauffeur will meet you at Kahului Airport (OGG) baggage claim upon arrival.&rdquo;
                <br />
                <span style={{ color: 'var(--teal)', fontWeight: 600 }}>— Dr. Kaimana Kahale, Dedicated Concierge</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
