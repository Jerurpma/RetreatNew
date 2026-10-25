import React, { useState } from 'react';
import { Review, Booking } from '../../types';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  bookings: Booking[];
  onAddReview: (review: Review) => void;
  onHelpful: (reviewId: string) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  bookings,
  onAddReview,
  onHelpful,
}) => {
  const [stars, setStars] = useState(5);
  const [wellnessStars, setWellnessStars] = useState(5);
  const [cannabisStars, setCannabisStars] = useState(5);
  const [venueStars, setVenueStars] = useState(5);
  const [conciergeStars, setConciergeStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(bookings[0]?.planId || '');
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const matchedBooking = bookings.find((b) => b.planId === selectedBooking) || bookings[0];
    const newRev: Review = {
      id: `rv-${Date.now()}`,
      author: matchedBooking?.leadGuest || 'Verified Guest',
      initials: (matchedBooking?.leadGuest || 'VG')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      dest: `${matchedBooking?.dest || 'Sanctuary Retreat'} · Verified Stay`,
      dates: `${matchedBooking?.checkin || 'Spring 2026'}`,
      date: 'Just now',
      stars,
      text: reviewText.trim(),
      helpfulCount: 0,
    };

    onAddReview(newRev);
    setReviewText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div id="reviews-overlay" className="portal show" style={{ display: 'block' }}>
      <div className="rv-top">
        <div className="rv-logo">
          Sanctuary <span style={{ fontSize: '0.42rem', letterSpacing: '0.22em', color: 'var(--muted)' }}>Guest Reviews &amp; Verifications</span>
        </div>
        <button className="bk-xbtn" onClick={onClose} type="button">
          Close &#x2715;
        </button>
      </div>

      <div className="rv-wrap">
        {/* Rating Breakdown Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            Verified Community Ratings
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 200, color: '#fff', margin: 0 }}>
            4.97 <span style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          </h2>
          <p style={{ fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            Based on 348 verified retreat stays · 98.4% recommendation rate
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.8rem',
              marginTop: '1.4rem',
              background: '#111',
              border: '1px solid rgba(201,168,76,0.15)',
              padding: '1rem',
              borderRadius: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Healing &amp; Wellness</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--gold)', marginTop: '0.15rem' }}>4.98</div>
            </div>
            <div>
              <div style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Cannabis Protocol</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--gold)', marginTop: '0.15rem' }}>4.95</div>
            </div>
            <div>
              <div style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Luxury &amp; Accommodations</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--gold)', marginTop: '0.15rem' }}>4.99</div>
            </div>
            <div>
              <div style={{ fontSize: '0.4rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Concierge Care</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--gold)', marginTop: '0.15rem' }}>4.96</div>
            </div>
          </div>
        </div>

        {/* Submit Review Card */}
        <div className="rv-submit-card">
          <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.85rem' }}>
            &#10022; Leave a Verified Retreat Review (+100 Loyalty Pts)
          </div>

          <form onSubmit={handleSubmit}>
            {bookings.length > 0 && (
              <div className="rv-booking-info">
                <div>
                  <div className="rv-bi-dest">{bookings[0]?.dest}</div>
                  <div className="rv-bi-dates">Stay: {bookings[0]?.checkin} - {bookings[0]?.checkout} ({bookings[0]?.nights} nights)</div>
                </div>
                <div className="rv-bi-plan">Plan: {bookings[0]?.planId}</div>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.44rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                Overall Experience Rating
              </div>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`star-btn ${s <= stars ? 'active' : ''}`}
                    onClick={() => setStars(s)}
                    style={{ color: s <= stars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                  >
                    &#9733;
                  </button>
                ))}
              </div>
            </div>

            <div className="rv-cats">
              <div>
                <div className="rv-cat-lbl">Holistic Healing &amp; Modalities</div>
                <div className="rv-cat-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rv-cat-star ${s <= wellnessStars ? 'on' : ''}`}
                      onClick={() => setWellnessStars(s)}
                      style={{ color: s <= wellnessStars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="rv-cat-lbl">Cannabis Integration &amp; Safety</div>
                <div className="rv-cat-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rv-cat-star ${s <= cannabisStars ? 'on' : ''}`}
                      onClick={() => setCannabisStars(s)}
                      style={{ color: s <= cannabisStars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="rv-cat-lbl">Private Villa / Luxury Venue</div>
                <div className="rv-cat-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rv-cat-star ${s <= venueStars ? 'on' : ''}`}
                      onClick={() => setVenueStars(s)}
                      style={{ color: s <= venueStars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="rv-cat-lbl">Concierge &amp; Specialist Care</div>
                <div className="rv-cat-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rv-cat-star ${s <= conciergeStars ? 'on' : ''}`}
                      onClick={() => setConciergeStars(s)}
                      style={{ color: s <= conciergeStars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              className="rv-textarea"
              placeholder="Describe your retreat experience, the healer connection, plant medicine ceremonies, and overall impact..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />

            <label className="rv-check">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              I verify this review reflects my authentic personal stay and authorize Sanctuary to feature it anonymously or with initials.
            </label>

            {submitted && (
              <div style={{ color: '#7EC87A', fontSize: '0.55rem', marginBottom: '0.8rem', padding: '0.4rem 0.6rem', background: 'rgba(90,158,82,0.1)', border: '1px solid rgba(90,158,82,0.3)' }}>
                Mahalo! Your review has been submitted and 100 Sanctuary Loyalty Points credited to your account.
              </div>
            )}

            <button type="submit" className="rv-submit">
              Post Verified Review
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div>
          <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
            Guest Testimonials ({reviews.length})
          </div>

          {reviews.map((rev) => (
            <div key={rev.id} className="rv-card">
              <div className="rv-card-hdr">
                <div className="rv-av">{rev.initials}</div>
                <div className="rv-info">
                  <div className="rv-gname">{rev.author}</div>
                  <div className="rv-dest">{rev.dest}</div>
                </div>
                <div className="rv-date">{rev.date}</div>
              </div>

              <div className="rv-stars">
                {Array.from({ length: rev.stars }).map((_, i) => (
                  <span key={i}>&#9733;</span>
                ))}
              </div>

              <div className="rv-text">&ldquo;{rev.text}&rdquo;</div>

              <div className="rv-helpful">
                <span>Was this review helpful?</span>
                <button type="button" className="rv-helpful-btn" onClick={() => onHelpful(rev.id)}>
                  &#128077; Helpful ({rev.helpfulCount})
                </button>
              </div>

              {rev.response && (
                <div className="rv-resp">
                  <div className="rv-resp-lbl">Concierge Reply &middot; {rev.response.author}</div>
                  <div className="rv-resp-txt">{rev.response.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
