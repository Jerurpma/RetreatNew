import React, { useState, useEffect } from 'react';
import { HERO_COLLAGE_IMAGES } from '../data/mockData';

interface HeroProps {
  onExplore: () => void;
  avgRating: string;
  onOpenReviews?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, avgRating, onOpenReviews }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_COLLAGE_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Photo Collage / Carousel Background */}
      {HERO_COLLAGE_IMAGES.map((img, index) => (
        <div
          key={img.url}
          className="h-bg"
          style={{
            backgroundImage: `url(${img.url})`,
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1.6s ease-in-out, transform 8s ease-out',
            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
            filter: 'brightness(0.72) saturate(1.15) contrast(1.06)',
            position: 'absolute',
            inset: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            zIndex: 1,
          }}
        />
      ))}

      <div className="h-ov" style={{ zIndex: 2 }} />
      <div className="h-lbx t" />
      <div className="h-lbx b" />

      {/* Slide Caption Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '5.5rem',
          right: '2rem',
          zIndex: 10,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)',
          padding: '0.35rem 0.8rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', animation: 'fdot 1.2s infinite' }} />
        <span style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>
          {HERO_COLLAGE_IMAGES[currentSlide].caption}
        </span>
      </div>

      <div className="h-c" style={{ zIndex: 10 }}>
        <div className="h-pre">
          <div className="h-pline" />
          <span className="h-ptxt">
            Cannabis &amp; Healing Retreats &nbsp;·&nbsp; 17 Destinations &nbsp;·&nbsp; 18+ Only
          </span>
          <div className="h-pline" />
        </div>

        <h1 className="h-h1">
          Where Healing
          <br />
          Becomes <em>Ritual</em>
        </h1>
        <h2 className="h-h2">Curated cannabis wellness retreats for the discerning traveler</h2>
        <p className="h-body">
          Luxury healing experiences across 17 curated destinations — tailored hotel bookings, private chauffeur transportation, sound baths, and plant medicine wellness.
        </p>

        <div className="h-ctas">
          <button className="h-bp" onClick={onExplore} type="button">
            &#10022; &nbsp; Explore Destinations &amp; Cities
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="h-stats" style={{ zIndex: 10 }}>
        <div className="h-stat">
          <div className="h-sv">17</div>
          <div className="h-sl">Destinations</div>
        </div>
        <div className="h-stat">
          <div className="h-sv">100%</div>
          <div className="h-sl">Legal &amp; Medical</div>
        </div>
        <div
          className="h-stat"
          onClick={onOpenReviews}
          style={{ cursor: onOpenReviews ? 'pointer' : 'default' }}
          title="Click to view verified guest reviews page"
        >
          <div className="h-sv" style={{ color: 'var(--gold)' }}>{avgRating}&#11088;</div>
          <div className="h-sl">Avg Rating &rarr;</div>
        </div>
        <div className="h-stat">
          <div className="h-sv">18+</div>
          <div className="h-sl">Adults Only</div>
        </div>
      </div>
    </div>
  );
};
