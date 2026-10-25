import React, { useState, useMemo } from 'react';
import { Partner, User } from '../../types';

interface PartnerPageProps {
  partners: Partner[];
  user: User | null;
  onNavigateHome: () => void;
  onAddPartner: (newPartner: Partner) => void;
  onOpenAuth: () => void;
}

export const PartnerPage: React.FC<PartnerPageProps> = ({
  partners,
  user,
  onNavigateHome,
  onAddPartner,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  // Application form fields
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('Holistic Bodywork & Lomilomi');
  const [location, setLocation] = useState('Sedona, Arizona');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Category counts
  const categories = [
    'Holistic Bodywork & Lomilomi',
    'Acoustic Healing & Sound Alchemy',
    'Artisan Craft Cultivator / Dispensary',
    'Infused Farm-to-Table Dining',
    'Yoga & Meditation Guide',
    'Luxury Villa Estate',
  ];

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [partners, selectedCategory, searchQuery]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) return;

    const newPartner: Partner = {
      id: `prt-${Date.now()}`,
      name: bizName.trim(),
      category,
      bio: bio.trim() || 'Verified Sanctuary holistic healing & cannabis wellness partner.',
      location: location.trim(),
      plan: selectedPlan,
      price: selectedPlan === 'yearly' ? '$500 / year' : '$50 / month',
      active: true,
      website: website.trim() || 'https://sanctuaryretreats.com',
      phone: phone.trim() || '(555) 000-0000',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    };

    onAddPartner(newPartner);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowApplyModal(false);
      setBizName('');
      setBio('');
      setWebsite('');
      setPhone('');
    }, 2200);
  };

  return (
    <div className="partner-page" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '4.8rem' }}>
      {/* Breadcrumb Navigation Bar */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <button
              onClick={onNavigateHome}
              type="button"
              className="cp-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.48rem' }}
            >
              <span>&larr;</span> Back to Home &amp; Retreats
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ fontSize: '0.46rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Partner &amp; Specialist Directory
            </span>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            type="button"
            className="ncta"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.46rem' }}
          >
            ✦ Join Partner Network ($50/mo)
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        {/* Page Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
            Sanctuary Healer &amp; Business Network
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', fontWeight: 200, color: '#fff', margin: '0 0 0.8rem 0' }}>
            Elevate Your Healing Practice to <em>Affluent Guests</em>
          </h1>
          <p style={{ fontSize: '0.68rem', color: 'var(--muted)', maxWidth: '680px', margin: '0 auto 2.2rem', lineHeight: '1.8' }}>
            Join our curated network of certified holistic healers, artisanal cannabis dispensaries, private chefs, and luxury wellness estates. Showcase your services directly to verified guests booking personalized multi-day retreats.
          </p>

          {/* Pricing Options Banner */}
          <div
            style={{
              display: 'inline-flex',
              gap: '1.8rem',
              background: '#121212',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '24px',
              padding: '1.6rem 2.4rem',
              alignItems: 'center',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.44rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Partner Placement Membership
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', color: '#fff', margin: '0.2rem 0' }}>
                $50 <span style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'Montserrat, sans-serif' }}>/ month</span> &nbsp;&middot;&nbsp;
                <span style={{ color: 'var(--gold)' }}>$500</span> <span style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'Montserrat, sans-serif' }}>/ year</span>
              </div>
              <div style={{ fontSize: '0.5rem', color: '#7EC87A' }}>
                &#10003; Annual subscription saves $100 (2 months free) &middot; Zero commission on guest bookings
              </div>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              type="button"
              className="bk-next"
              style={{ padding: '0.8rem 2rem', fontSize: '0.54rem' }}
            >
              Subscribe &amp; Get Listed &rarr;
            </button>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.4rem',
            marginBottom: '4rem',
          }}
        >
          <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.8rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem', color: 'var(--gold)' }}>&#127807;</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
              Targeted Wellness Audience
            </h3>
            <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Connect with discerning retreat travelers looking for plant medicine ceremony guides, acoustic sound baths, massage therapists, and farm-to-table culinary artists.
            </p>
          </div>

          <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.8rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem', color: 'var(--gold)' }}>&#128222;</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
              Direct Contact &amp; Link
            </h3>
            <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Your verified profile displays your direct phone number, website link, and service catalog. Guests can call or book your services directly without intermediaries.
            </p>
          </div>

          <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.8rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem', color: 'var(--gold)' }}>&#128274;</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
              Escrow-Secured Retreats
            </h3>
            <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Retreat packages booked through Sanctuary are backed by our transparent itemized price breakdown, escrow assurance, and concierge fulfillment.
            </p>
          </div>
        </div>

        {/* Directory Listing Section Header & Search */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.48rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Active Healers &amp; Partners ({partners.length})
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#fff', margin: '0.2rem 0 0 0' }}>
                Featured Specialists Directory
              </h2>
            </div>

            <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '320px' }}>
              <input
                type="text"
                className="bk-inp"
                style={{ margin: 0, padding: '0.5rem 0.85rem', fontSize: '0.52rem' }}
                placeholder="Search partners by name, city, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              type="button"
              style={{
                background: selectedCategory === 'all' ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === 'all' ? '#000' : 'var(--text)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.46rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Specialties ({partners.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                style={{
                  background: selectedCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                  color: selectedCategory === cat ? '#000' : 'var(--text)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '999px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.46rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Partner Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.6rem' }}>
            {filteredPartners.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3.5rem', textAlign: 'center', background: '#121212', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>&#128073;</div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#fff' }}>No Partners Found in this Category</h4>
                <p style={{ fontSize: '0.56rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
                  Be the first healer or business to represent this category!
                </p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  type="button"
                  className="bk-next"
                  style={{ padding: '0.6rem 1.4rem' }}
                >
                  Apply &amp; Subscribe Now
                </button>
              </div>
            ) : (
              filteredPartners.map((p) => (
                <div
                  key={p.id}
                  className="partner-card"
                  style={{
                    background: '#121212',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{ padding: '1.6rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '14px',
                          backgroundImage: `url(${p.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(201,168,76,0.25)',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.36rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.12rem 0.5rem', borderRadius: '999px', background: 'rgba(90,158,82,0.14)', border: '1px solid rgba(90,158,82,0.3)', color: '#7EC87A' }}>
                            &#10003; {p.price}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: '#fff', margin: '0.15rem 0' }}>
                          {p.name}
                        </h3>
                        <div style={{ fontSize: '0.46rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>
                          {p.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.52rem', color: 'var(--teal)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>&#128205;</span> {p.location}
                    </div>

                    <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '1.2rem' }}>
                      {p.bio}
                    </p>
                  </div>

                  <div style={{ background: '#0e0e0e', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {p.phone ? (
                      <a
                        href={`tel:${p.phone.replace(/[^0-9]/g, '')}`}
                        style={{ fontSize: '0.5rem', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>📞</span> {p.phone}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.5rem', color: 'var(--muted)' }}>Sanctuary Concierge Partner</span>
                    )}

                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="cp-btn"
                      style={{ fontSize: '0.46rem', padding: '0.35rem 0.8rem', textDecoration: 'none' }}
                    >
                      Visit Website &rarr;
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Partner FAQ Section */}
        <div style={{ background: '#121212', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem', marginTop: '4rem' }}>
          <div style={{ fontSize: '0.46rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#fff', margin: '0 0 1.8rem 0' }}>
            Partner Directory &amp; Subscription Inquiries
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>
                How do retreat guests contact my business?
              </div>
              <p style={{ fontSize: '0.54rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                When your subscription is active, your direct phone number and website link are presented directly on this portal and in retreat itinerary options for verified guests.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>
                How does the $50/month subscription billing work?
              </div>
              <p style={{ fontSize: '0.54rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                Subscriptions are billed monthly with no long-term commitment. You can also choose the $500/year annual plan to receive 2 months free and save $100.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>
                What are the compliance requirements?
              </div>
              <p style={{ fontSize: '0.54rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                All partners must operate strictly within the legal framework of their local jurisdiction (100% legal adult-use or state medical card reciprocity).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Application & Subscription Checkout Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div className="gp-box" style={{ maxWidth: '540px', padding: '2.2rem', borderRadius: '24px', background: '#141414', border: '1px solid rgba(201,168,76,0.3)', position: 'relative' }}>
            <button
              onClick={() => setShowApplyModal(false)}
              type="button"
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              &#x2715;
            </button>

            <div style={{ fontSize: '0.45rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.35rem' }}>
              Partner Registration &amp; Subscription
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', color: '#fff', margin: '0 0 1.2rem 0' }}>
              Join the Sanctuary Network
            </h3>

            {paymentSuccess ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#7EC87A' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>&#10003;</div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#fff' }}>Welcome to Sanctuary!</h4>
                <p style={{ fontSize: '0.55rem', color: 'var(--muted)' }}>
                  Your partner subscription has been activated. Your business is now featured on the Sanctuary Partner Portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                {/* Plan Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '1.2rem' }}>
                  <div
                    onClick={() => setSelectedPlan('monthly')}
                    style={{
                      border: `1px solid ${selectedPlan === 'monthly' ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedPlan === 'monthly' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                      padding: '0.9rem',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.44rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Monthly</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', color: '#fff' }}>$50/mo</div>
                    <div style={{ fontSize: '0.42rem', color: 'var(--muted)' }}>Billed monthly &middot; Cancel anytime</div>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('yearly')}
                    style={{
                      border: `1px solid ${selectedPlan === 'yearly' ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedPlan === 'yearly' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                      padding: '0.9rem',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <span style={{ position: 'absolute', top: '-8px', right: '12px', background: 'var(--gold)', color: '#000', fontSize: '0.36rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      SAVE $100
                    </span>
                    <div style={{ fontSize: '0.44rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Annual Plan</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', color: 'var(--gold)' }}>$500/yr</div>
                    <div style={{ fontSize: '0.42rem', color: '#7EC87A' }}>2 Months Free</div>
                  </div>
                </div>

                <div style={{ marginBottom: '0.7rem' }}>
                  <label className="clbl">Business or Practitioner Name</label>
                  <input
                    type="text"
                    required
                    className="bk-inp"
                    placeholder="e.g. Wailea Botanical Massage & Sound"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '0.7rem' }}>
                  <div>
                    <label className="clbl">Category</label>
                    <select
                      className="bk-sel"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Holistic Bodywork & Lomilomi">Holistic Bodywork &amp; Lomilomi</option>
                      <option value="Acoustic Healing & Sound Alchemy">Acoustic Healing &amp; Sound</option>
                      <option value="Artisan Craft Cultivator / Dispensary">Artisan Craft Dispensary</option>
                      <option value="Infused Farm-to-Table Dining">Private Chef &amp; Infusions</option>
                      <option value="Yoga & Meditation Guide">Yoga &amp; Breathwork Guide</option>
                      <option value="Luxury Villa Estate">Luxury Villa Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="clbl">Location (City, State / Country)</label>
                    <input
                      type="text"
                      required
                      className="bk-inp"
                      placeholder="e.g. Sedona, Arizona"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '0.7rem' }}>
                  <div>
                    <label className="clbl">Business Telephone</label>
                    <input
                      type="text"
                      className="bk-inp"
                      placeholder="e.g. (928) 555-0192"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="clbl">Website URL</label>
                    <input
                      type="url"
                      className="bk-inp"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label className="clbl">Short Bio &amp; Healing Offerings</label>
                  <textarea
                    className="ec-textarea"
                    rows={3}
                    placeholder="Brief description of your holistic wellness services..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="bk-next"
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  Pay {selectedPlan === 'yearly' ? '$500 / Year' : '$50 / Month'} &amp; Get Listed &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
