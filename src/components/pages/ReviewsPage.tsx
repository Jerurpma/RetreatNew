import React, { useState, useMemo } from 'react';
import { Review, Destination, User } from '../../types';

interface ReviewsPageProps {
  reviews: Review[];
  destinations: Destination[];
  user: User | null;
  onNavigateHome: () => void;
  onAddReview: (review: Review) => void;
  onHelpful: (reviewId: string) => void;
  onOpenAuth: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  destinations,
  user,
  onNavigateHome,
  onAddReview,
  onHelpful,
  onOpenAuth,
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form states
  const [formAuthor, setFormAuthor] = useState(user?.name || '');
  const [formDest, setFormDest] = useState(destinations[0]?.name ? `${destinations[0].name}, ${destinations[0].location}` : 'Maui, Hawaii');
  const [formStars, setFormStars] = useState(5);
  const [formText, setFormText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Calculate stats
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.stars || 5), 0) / totalCount).toFixed(1)
    : '4.9';

  const fiveStarCount = reviews.filter((r) => r.stars === 5).length;
  const fourStarCount = reviews.filter((r) => r.stars === 4).length;
  const threeStarCount = reviews.filter((r) => r.stars === 3).length;

  const fiveStarPct = totalCount > 0 ? Math.round((fiveStarCount / totalCount) * 100) : 90;
  const fourStarPct = totalCount > 0 ? Math.round((fourStarCount / totalCount) * 100) : 10;
  const threeStarPct = totalCount > 0 ? Math.round((threeStarCount / totalCount) * 100) : 0;

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchStars = selectedStarFilter === 'all' || r.stars === selectedStarFilter;
      const matchDest = selectedDestFilter === 'all' || r.dest.toLowerCase().includes(selectedDestFilter.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.dest.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStars && matchDest && matchQuery;
    });
  }, [reviews, selectedStarFilter, selectedDestFilter, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formText.trim()) return;

    const newRev: Review = {
      id: `rv-${Date.now()}`,
      author: formAuthor.trim(),
      initials: formAuthor
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'SG',
      dest: formDest,
      date: 'Just now',
      stars: formStars,
      text: formText.trim(),
      helpfulCount: 0,
    };

    onAddReview(newRev);
    setFormText('');
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowSubmitForm(false);
    }, 2400);
  };

  return (
    <div className="reviews-page" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '4.8rem' }}>
      {/* Breadcrumb & Navigation Bar */}
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
              Verified Guest Reviews
            </span>
          </div>

          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            type="button"
            className="ncta"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.46rem' }}
          >
            {showSubmitForm ? 'Close Form &#x2715;' : '✦ Write a Verified Review'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        {/* Page Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
            Sanctuary Traveler Testimonials
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 200, color: '#fff', margin: '0 0 0.8rem 0' }}>
            Where Healing Meets <em>Authenticity</em>
          </h1>
          <p style={{ fontSize: '0.66rem', color: 'var(--muted)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.8' }}>
            Every review is verified from real guests who reserved luxury hotel accommodations, private concierge fulfillment, and plant medicine wellness through Sanctuary.
          </p>
        </div>

        {/* Rating Overview & Breakdown Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
            background: '#121212',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '24px',
            padding: '2.2rem',
            marginBottom: '3rem',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          }}
        >
          {/* Main Average Score */}
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.44rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>
              Overall Guest Score
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4.2rem', fontWeight: 200, color: '#fff', lineHeight: 1 }}>
              {avgRating}
            </div>
            <div style={{ color: 'var(--gold)', fontSize: '1.4rem', margin: '0.4rem 0' }}>
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
            <div style={{ fontSize: '0.54rem', color: 'var(--muted)' }}>
              Based on {totalCount} authentic guest stays
            </div>
            <div style={{ marginTop: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(126,200,122,0.1)', border: '1px solid rgba(126,200,122,0.3)', color: '#7EC87A', fontSize: '0.44rem' }}>
              &#10003; 100% Escrow-Verified Reservations
            </div>
          </div>

          {/* Star Rating Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.44rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>
              Rating Distribution
            </div>

            {/* 5 Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.52rem' }}>
              <span style={{ width: '45px', color: 'var(--gold)' }}>5 &#9733;</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${fiveStarPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), #7EC87A)', borderRadius: '999px' }} />
              </div>
              <span style={{ width: '38px', textAlign: 'right', color: 'var(--muted)' }}>{fiveStarPct}%</span>
            </div>

            {/* 4 Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.52rem' }}>
              <span style={{ width: '45px', color: 'var(--gold)' }}>4 &#9733;</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${fourStarPct}%`, height: '100%', background: 'var(--gold)', borderRadius: '999px' }} />
              </div>
              <span style={{ width: '38px', textAlign: 'right', color: 'var(--muted)' }}>{fourStarPct}%</span>
            </div>

            {/* 3 Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.52rem' }}>
              <span style={{ width: '45px', color: 'rgba(255,255,255,0.3)' }}>3 &#9733;</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${threeStarPct}%`, height: '100%', background: 'var(--gold)', borderRadius: '999px' }} />
              </div>
              <span style={{ width: '38px', textAlign: 'right', color: 'var(--muted)' }}>{threeStarPct}%</span>
            </div>

            {/* 2 & 1 Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.52rem' }}>
              <span style={{ width: '45px', color: 'rgba(255,255,255,0.2)' }}>1–2 &#9733;</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px' }}>
                <div style={{ width: '0%', height: '100%' }} />
              </div>
              <span style={{ width: '38px', textAlign: 'right', color: 'var(--muted)' }}>0%</span>
            </div>
          </div>

          {/* Pillars Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem', background: '#0e0e0e', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.44rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Service Pillar Ratings
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.54rem' }}>
              <span style={{ color: 'var(--muted)' }}>Accommodations &amp; Resorts:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>4.98 ★</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.54rem' }}>
              <span style={{ color: 'var(--muted)' }}>Private Chauffeur &amp; Transfers:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>4.95 ★</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.54rem' }}>
              <span style={{ color: 'var(--muted)' }}>Cannabis Wellness &amp; Healers:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>5.00 ★</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.54rem' }}>
              <span style={{ color: 'var(--muted)' }}>Concierge Hotel Fulfillment:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>4.96 ★</span>
            </div>
          </div>
        </div>

        {/* Submit Review Form (collapsible or open) */}
        {showSubmitForm && (
          <div
            style={{
              background: '#141414',
              border: '1px solid var(--gold)',
              borderRadius: '24px',
              padding: '2.5rem',
              marginBottom: '3rem',
              boxShadow: '0 20px 60px rgba(201,168,76,0.15)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <div style={{ fontSize: '0.46rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  ✦ Guest Submission Portal
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', margin: '0.2rem 0 0 0' }}>
                  Post Your Sanctuary Retreat Review
                </h3>
              </div>
              <div style={{ fontSize: '0.46rem', color: '#7EC87A', background: 'rgba(90,158,82,0.12)', border: '1px solid rgba(90,158,82,0.3)', padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                +100 Loyalty Points Reward
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="clbl">Your Full Name / Alias</label>
                  <input
                    type="text"
                    required
                    className="bk-inp"
                    placeholder="e.g. Brandon Hayes"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                  />
                </div>

                <div>
                  <label className="clbl">Retreat Destination Visited</label>
                  <select
                    className="bk-sel"
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={`${d.name}, ${d.location}`}>
                        {d.name} ({d.location})
                      </option>
                    ))}
                    <option value="Sedona, Arizona">Sedona, Arizona</option>
                    <option value="Maui, Hawaii">Maui, Hawaii</option>
                    <option value="Aspen, Colorado">Aspen, Colorado</option>
                    <option value="Oahu, Hawaii">Oahu, Hawaii</option>
                    <option value="Kauai, Hawaii">Kauai, Hawaii</option>
                  </select>
                </div>
              </div>

              {/* Star Selector */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label className="clbl" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Your Overall Star Rating (1 to 5 Stars)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormStars(s)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        color: s <= formStars ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                        padding: 0,
                        transition: 'transform 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      &#9733;
                    </button>
                  ))}
                  <span style={{ fontSize: '0.68rem', color: 'var(--gold)', marginLeft: '0.8rem', fontWeight: 600 }}>
                    {formStars} Star{formStars > 1 ? 's' : ''} &middot;{' '}
                    {formStars === 5 ? 'Exceptional Luxury' : formStars === 4 ? 'Very Good' : 'Satisfactory'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label className="clbl">Your Detailed Experience &amp; Healing Impact</label>
                <textarea
                  required
                  className="rv-textarea"
                  rows={4}
                  placeholder="Share details regarding the private accommodations, plant medicine guidance, chauffeur transfers, and overall restoration..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                />
              </div>

              {formSubmitted && (
                <div style={{ color: '#7EC87A', fontSize: '0.56rem', marginBottom: '1rem', padding: '0.7rem', background: 'rgba(90,158,82,0.12)', border: '1px solid rgba(90,158,82,0.3)', borderRadius: '10px' }}>
                  &#10003; Thank you! Your review has been verified and published to the Sanctuary network.
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <button type="submit" className="bk-next" style={{ padding: '0.8rem 2.2rem' }}>
                  Publish Verified Review &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="cp-btn"
                  style={{ padding: '0.8rem 1.4rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1rem 1.4rem',
            marginBottom: '2rem',
          }}
        >
          {/* Star Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.44rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: '0.4rem' }}>
              Filter Stars:
            </span>
            <button
              onClick={() => setSelectedStarFilter('all')}
              type="button"
              style={{
                background: selectedStarFilter === 'all' ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                color: selectedStarFilter === 'all' ? '#000' : 'var(--text)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.46rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setSelectedStarFilter(5)}
              type="button"
              style={{
                background: selectedStarFilter === 5 ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                color: selectedStarFilter === 5 ? '#000' : 'var(--text)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.46rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              5 ★ ({fiveStarCount})
            </button>
            <button
              onClick={() => setSelectedStarFilter(4)}
              type="button"
              style={{
                background: selectedStarFilter === 4 ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                color: selectedStarFilter === 4 ? '#000' : 'var(--text)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.46rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              4 ★ ({fourStarCount})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '340px' }}>
            <input
              type="text"
              className="bk-inp"
              style={{ margin: 0, padding: '0.45rem 0.8rem', fontSize: '0.52rem' }}
              placeholder="Search by keyword, guest, or retreat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#121212', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>&#128073;</div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#fff' }}>No Reviews Found</h4>
              <p style={{ fontSize: '0.56rem', color: 'var(--muted)' }}>
                Try resetting your filters or search keywords.
              </p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="rv-card"
                style={{
                  background: '#121212',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px',
                  padding: '1.8rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div className="rv-av" style={{ width: '44px', height: '44px', fontSize: '0.8rem', flexShrink: 0 }}>
                      {rev.initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#fff' }}>
                          {rev.author}
                        </span>
                        <span style={{ fontSize: '0.38rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(90,158,82,0.14)', border: '1px solid rgba(90,158,82,0.3)', color: '#7EC87A' }}>
                          &#10003; Verified Stay
                        </span>
                      </div>
                      <div style={{ fontSize: '0.48rem', color: 'var(--teal)', marginTop: '0.15rem' }}>
                        &#128205; {rev.dest}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <span key={i}>&#9733;</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.45rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      {rev.date}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.68rem', color: '#dedede', lineHeight: '1.8', fontStyle: 'normal', margin: '0.8rem 0' }}>
                  &ldquo;{rev.text}&rdquo;
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                  <span style={{ fontSize: '0.48rem', color: 'var(--muted)' }}>
                    Was this review helpful to your retreat planning?
                  </span>
                  <button
                    type="button"
                    className="rv-helpful-btn"
                    onClick={() => onHelpful(rev.id)}
                    style={{ fontSize: '0.48rem', padding: '0.3rem 0.8rem' }}
                  >
                    &#128077; Helpful ({rev.helpfulCount})
                  </button>
                </div>

                {rev.response && (
                  <div className="rv-resp" style={{ marginTop: '1rem', background: 'rgba(201,168,76,0.04)', borderLeft: '2px solid var(--gold)', padding: '0.85rem 1.1rem', borderRadius: '0 12px 12px 0' }}>
                    <div className="rv-resp-lbl" style={{ color: 'var(--gold)', fontSize: '0.44rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Sanctuary Concierge Response &middot; {rev.response.author}
                    </div>
                    <div className="rv-resp-txt" style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: '1.65' }}>
                      {rev.response.text}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
