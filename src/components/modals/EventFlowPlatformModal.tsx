import React, { useState } from 'react';

interface EventFlowPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFinance: () => void;
  onOpenClient: () => void;
}

export const EventFlowPlatformModal: React.FC<EventFlowPlatformModalProps> = ({
  isOpen,
  onClose,
  onOpenFinance,
  onOpenClient,
}) => {
  const [activeNav, setActiveNav] = useState<'overview' | 'finance' | 'client' | 'network' | 'compliance'>('overview');

  if (!isOpen) return null;

  return (
    <div id="eventflow-platform-hub" className="portal show" style={{ display: 'block' }}>
      <div className="efp-shell">
        <div className="efp-topbar">
          <div className="efp-brand">
            <div className="efp-mark">&#9889;</div>
            <div>
              <div className="efp-title">EventFlow Platform Hub</div>
              <div className="efp-sub">Sanctuary Operational Infrastructure &amp; Logistics</div>
            </div>
          </div>
          <div className="efp-actions">
            <span className="efp-pill">Production v3.4.1</span>
            <button className="efp-close" onClick={onClose} type="button">
              Return to Retreat &#x2715;
            </button>
          </div>
        </div>

        <div className="efp-body">
          <div className="efp-sidebar">
            <button
              type="button"
              className={`efp-navbtn ${activeNav === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveNav('overview')}
            >
              <span className="efp-nav-ic">&#127760;</span> Architecture Overview
            </button>
            <button
              type="button"
              className={`efp-navbtn ${activeNav === 'finance' ? 'active' : ''}`}
              onClick={() => {
                onOpenFinance();
              }}
            >
              <span className="efp-nav-ic">&#128181;</span> Financial Operations
            </button>
            <button
              type="button"
              className={`efp-navbtn ${activeNav === 'client' ? 'active' : ''}`}
              onClick={() => {
                onOpenClient();
              }}
            >
              <span className="efp-nav-ic">&#128196;</span> Client Retreat Passes
            </button>
            <button
              type="button"
              className={`efp-navbtn ${activeNav === 'network' ? 'active' : ''}`}
              onClick={() => setActiveNav('network')}
            >
              <span className="efp-nav-ic">&#9874;</span> Healer &amp; Venue Mesh
            </button>
            <button
              type="button"
              className={`efp-navbtn ${activeNav === 'compliance' ? 'active' : ''}`}
              onClick={() => setActiveNav('compliance')}
            >
              <span className="efp-nav-ic">&#128737;</span> Regulatory Engine
            </button>

            <div className="efp-context">
              <strong>EventFlow Runtime:</strong>
              <br />
              Synchronizes real-time quotes, multi-currency escrow ledger, and verified guest ticketing across all 17 destinations.
            </div>
          </div>

          <div className="efp-main">
            {activeNav === 'overview' && (
              <div className="efp-overview">
                <div className="efp-hero">
                  <div className="efp-eyebrow">Enterprise Healing Operations</div>
                  <h1 className="efp-h1">Where Technology Serves Ritual</h1>
                  <p className="efp-copy">
                    EventFlow powers the end-to-end guest journey for luxury cannabis retreats. From dynamic quoting and AES-256 escrow fund segregation to specialist dispatch and QR pass issuance, the platform guarantees confidentiality, safety, and seamless hospitality.
                  </p>
                </div>

                <div className="efp-grid">
                  <div className="efp-card">
                    <div className="efp-card-ic">&#128274;</div>
                    <div className="efp-card-t">Escrow Architecture</div>
                    <div className="efp-card-p">
                      Zero counterparty risk with automated escrow locking. Guest funds are secured until post-retreat verification.
                    </div>
                    <button type="button" onClick={onOpenFinance}>
                      View Escrow Ledger &rarr;
                    </button>
                  </div>

                  <div className="efp-card">
                    <div className="efp-card-ic">&#128196;</div>
                    <div className="efp-card-t">Digital Client Passport</div>
                    <div className="efp-card-p">
                      Encrypted digital retreat tickets with custom QR check-in, itinerary schedules, and medical 329 verification.
                    </div>
                    <button type="button" onClick={onOpenClient}>
                      Open Client Hub &rarr;
                    </button>
                  </div>

                  <div className="efp-card">
                    <div className="efp-card-ic">&#127793;</div>
                    <div className="efp-card-t">Cannabis Protocol Mesh</div>
                    <div className="efp-card-p">
                      Automated jurisdiction routing for 17 regions: Recreational 21+, Medical Reciprocity, and Decriminalized zones.
                    </div>
                    <button type="button" onClick={() => setActiveNav('compliance')}>
                      View Regulations &rarr;
                    </button>
                  </div>

                  <div className="efp-card">
                    <div className="efp-card-ic">&#9874;</div>
                    <div className="efp-card-t">Specialist Marketplace</div>
                    <div className="efp-card-p">
                      Direct matching with certified master healers, somatic bodyworkers, sound alchemists, and plant shamans.
                    </div>
                    <button type="button" onClick={() => setActiveNav('network')}>
                      Explore Network &rarr;
                    </button>
                  </div>
                </div>

                <div className="efp-flow">
                  <div className="efp-panel">
                    <h4>Five-Stage Guest Lifecycle</h4>
                    <div className="efp-list">
                      <div>1. Dynamic Quote Studio with customizable luxury tiers &amp; durations</div>
                      <div>2. 5-Step Secure Booking Flow with credit card &amp; split-pay escrow options</div>
                      <div>3. Automated Welcome Dispatch &amp; Medical 329 state registry verification</div>
                      <div>4. Dedicated Healer Concierge Pairing &amp; digital retreat pass generation</div>
                      <div>5. Post-Retreat Somatic Integration &amp; verified reviews with loyalty rewards</div>
                    </div>
                  </div>

                  <div className="efp-panel">
                    <h4>Active Platform Integrations</h4>
                    <div className="efp-list">
                      <div>Stripe Terminal &amp; Plaid ACH for ancillary retreat billing</div>
                      <div>Jumio &amp; Stripe Identity for biometric 18+/21+ compliance</div>
                      <div>Hawaii DOH Medical Cannabis Registry API reciprocity checks</div>
                      <div>SendGrid &amp; Twilio for encrypted concierge dispatches</div>
                      <div>AES-256 Vault architecture for multi-party group funding pools</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'network' && (
              <div className="efp-overview">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '0.8rem' }}>
                  Healer &amp; Luxury Venue Network
                </h3>
                <p style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Over 40 vetted holistic specialists and 17 private luxury sanctuary properties currently onboarded across North America, the Caribbean, and Europe.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="efp-card">
                    <div className="efp-card-t">Featured Healers</div>
                    <div className="efp-list" style={{ marginTop: '0.5rem' }}>
                      <div>Dr. Kaimana Kahale — Lomilomi &amp; Hawaiian Herbalism (Maui)</div>
                      <div>Amara Osei — Sound Alchemist &amp; Breathwork (Sedona)</div>
                      <div>Mateo Chen — Microdosing Integration Specialist (Vancouver)</div>
                      <div>Elena Vasquez — Traditional Ayahuasca &amp; Kambo (Costa Rica)</div>
                    </div>
                  </div>
                  <div className="efp-card">
                    <div className="efp-card-t">Featured Sanctuary Estates</div>
                    <div className="efp-list" style={{ marginTop: '0.5rem' }}>
                      <div>Four Seasons Resort Wailea Oceanfront Casitas (Maui)</div>
                      <div>Enchantment Resort Boynton Canyon (Sedona)</div>
                      <div>Amangiri Desert Wellness Villas (Utah)</div>
                      <div>Castel Monastero Estate &amp; Thermal Spa (Tuscany)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'compliance' && (
              <div className="efp-overview">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--teal)', marginBottom: '0.8rem' }}>
                  EventFlow Regulatory Engine &amp; Jurisdiction Routing
                </h3>
                <div className="efp-list" style={{ marginTop: '1rem' }}>
                  <div><strong>Jurisdiction Rule 01 (US Recreational):</strong> Valid government-issued photo ID showing age 21 or older required prior to check-in. Zero interstate transport.</div>
                  <div><strong>Jurisdiction Rule 02 (US Medical Reciprocity):</strong> Hawaii, Oklahoma, Puerto Rico require patient state card pre-registration through digital intake 14 days in advance.</div>
                  <div><strong>Jurisdiction Rule 03 (International Decriminalized):</strong> Costa Rica, Jamaica, Thailand, Portugal, Spain follow sovereign territorial codes for personal consumption.</div>
                  <div><strong>FinCEN BSA Guidelines:</strong> Escrow deposits handled exclusively for non-plant-touching hospitality, luxury lodging, and holistic bodywork services.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
