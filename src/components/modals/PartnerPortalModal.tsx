import React, { useState } from 'react';
import { Booking } from '../../types';

interface PartnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export const PartnerPortalModal: React.FC<PartnerPortalModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  const [partnerLoggedIn, setPartnerLoggedIn] = useState(true);
  const [partnerEmail, setPartnerEmail] = useState('kaimana@sanctuary.com');
  const [partnerPass, setPartnerPass] = useState('healer2026');
  const [activeTab, setActiveTab] = useState<'sessions' | 'earnings' | 'intake'>('sessions');

  if (!isOpen) return null;

  return (
    <div id="healer-portal" className="portal show" style={{ display: 'block' }}>
      <div className="d-top">
        <div className="d-logo teal">
          Sanctuary <span style={{ fontSize: '0.42rem', letterSpacing: '0.2em', color: 'var(--muted)', marginLeft: '0.6rem' }}>Partner &amp; Healer Portal</span>
        </div>
        <div className="d-user">
          <div className="d-av teal">KK</div>
          <div>
            <div className="d-name">Dr. Kaimana Kahale</div>
            <div className="d-role teal">Lead Lomilomi &amp; Plant Medicine Specialist</div>
          </div>
          <button className="d-out" onClick={onClose} type="button">
            Exit Portal &#x2715;
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem' }}>
        {/* Navigation tabs */}
        <div className="mr-tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            &#128197; My Assigned Retreat Sessions ({bookings.length})
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            &#128181; Specialist Earnings &amp; Escrow Payouts
          </button>
          <button
            type="button"
            className={`mr-tab ${activeTab === 'intake' ? 'active' : ''}`}
            onClick={() => setActiveTab('intake')}
          >
            &#128203; Clinical Cannabis Intake &amp; 329 Verification
          </button>
        </div>

        {activeTab === 'sessions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--teal)' }}>
                Upcoming Sanctuary Client Sessions
              </div>
              <div style={{ fontSize: '0.45rem', color: 'var(--muted)' }}>
                Syncing with Sanctuary Master Scheduler
              </div>
            </div>

            {bookings.map((b) => (
              <div key={b.id} className="bk-card" style={{ borderLeft: '3px solid var(--teal)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="bk-date">{b.checkin} - {b.checkout} &middot; {b.nights} Nights</div>
                    <div className="bk-guest">{b.leadGuest} ({b.guests} Guests)</div>
                    <div className="bk-svc">
                      <strong>Destination:</strong> {b.dest} &middot; <strong>Villa:</strong> {b.accommodation}
                    </div>
                    <div style={{ fontSize: '0.52rem', color: 'var(--teal)', marginTop: '0.3rem' }}>
                      <strong>Program:</strong> {b.cannabisProgram} &middot; <strong>Plan ID:</strong> {b.planId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="bk-status c">Active &amp; Escrow Confirmed</span>
                    <div style={{ fontSize: '0.62rem', color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", marginTop: '0.4rem' }}>
                      Specialist Fee: $1,400.00
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.8rem' }}>
                  <button
                    type="button"
                    className="cp-btn teal"
                    onClick={() => alert(`Client Clinical Notes for ${b.leadGuest}:\n\n- Medical Intake: Approved\n- Focus: Somatic emotional release & sacred Lomilomi massage\n- Contact: ${b.email} | ${b.phone}`)}
                  >
                    View Clinical Intake
                  </button>
                  <button
                    type="button"
                    className="cp-btn"
                    onClick={() => alert(`Message dispatched to ${b.leadGuest} from Dr. Kaimana Kahale.`)}
                  >
                    Direct Message Guest
                  </button>
                  <button
                    type="button"
                    className="cp-btn"
                    onClick={() => alert(`Marking session ${b.planId} preparation checklist as complete.`)}
                  >
                    Check-in Protocol
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="ef-kpi">
                <div className="ef-kpi-lbl">2026 YTD Payouts</div>
                <div className="ef-kpi-val" style={{ color: 'var(--teal)' }}>$28,450</div>
                <div className="ef-kpi-chg">+18.5% YoY</div>
              </div>
              <div className="ef-kpi">
                <div className="ef-kpi-lbl">Escrow Locked</div>
                <div className="ef-kpi-val" style={{ color: 'var(--gold)' }}>$4,200</div>
                <div className="ef-kpi-chg">2 active retreats</div>
              </div>
              <div className="ef-kpi">
                <div className="ef-kpi-lbl">Average Session Fee</div>
                <div className="ef-kpi-val">$350</div>
                <div className="ef-kpi-chg">90-min sacred ritual</div>
              </div>
              <div className="ef-kpi">
                <div className="ef-kpi-lbl">Healer Satisfaction</div>
                <div className="ef-kpi-val">5.00 &#9733;</div>
                <div className="ef-kpi-chg">100% 5-star reviews</div>
              </div>
            </div>

            <div className="ef-panel">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--teal)', marginBottom: '0.8rem' }}>
                Automated Escrow Disbursement Schedule
              </h4>
              <p style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.8' }}>
                All specialist and healer compensation is secured upfront in the Sanctuary AES-256 Escrow Vault upon booking confirmation. Funds are automatically transferred to your designated direct deposit account within 24 hours of retreat session completion.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                <button type="button" className="ef-export-btn" onClick={() => alert('Exporting Form 1099-NEC & Healer Payout Statement...')}>
                  &#128196; Download 1099-NEC Tax Statement
                </button>
                <button type="button" className="ef-export-btn" onClick={() => alert('Direct Deposit Bank Settings: Bank of Hawaii (Checking ...8812) - Verified')}>
                  &#127974; Manage Direct Deposit
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intake' && (
          <div className="ef-panel">
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--teal)', marginBottom: '0.8rem' }}>
              Compliant Clinical Cannabis &amp; State Reciprocity Intake
            </h4>
            <div className="ef-list" style={{ marginTop: '1rem' }}>
              <div><strong>Hawaii 329 Card Verification:</strong> Electronic registry link connected to Hawaii Department of Health Medical Cannabis Registry. Reciprocity verified for 38 out-of-state programs.</div>
              <div><strong>Somatic Dosage Protocol:</strong> 1:1 THC to CBD full-spectrum tinctures administered prior to sound healing and Lomilomi breathwork.</div>
              <div><strong>Consent &amp; Safety Waivers:</strong> Pre-screened for cardiovascular contraindications and prescription interactions.</div>
              <div><strong>Certified Dispensary Partner:</strong> Maui Grown Therapies (Kahului) and Cure Oahu (Honolulu) licensed transport compliance.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
