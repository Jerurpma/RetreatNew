import React from 'react';
import { StatePlace, CityDestination } from '../../types';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  statePlace: StatePlace | null;
  onSelectCity: (city: CityDestination) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  statePlace,
  onSelectCity,
}) => {
  if (!isOpen || !statePlace) return null;

  const isFullLegal = statePlace.legalStatus === '100% Legal';

  return (
    <div id="city-selector-modal" className="portal show" style={{ display: 'block', zIndex: 980 }}>
      <div className="bk-header" style={{ padding: '1rem 2rem', background: '#0a0a0a', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="bk-logo">
          {statePlace.stateName} <span style={{ fontSize: '0.45rem', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Select Retreat City</span>
        </div>
        <button className="bk-xbtn" onClick={onClose} type="button">
          Close &#x2715;
        </button>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* State Banner */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '2rem',
            border: '1px solid rgba(201,168,76,0.25)',
            background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%), url(${statePlace.heroImage}) center/cover no-repeat`,
            minHeight: '220px',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.45rem',
                letterSpacing: '0.14em',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0.22rem 0.75rem',
                borderRadius: '999px',
                background: isFullLegal ? 'rgba(90,158,82,0.22)' : 'rgba(139,196,192,0.2)',
                border: `1px solid ${isFullLegal ? 'var(--rec)' : 'var(--med)'}`,
                color: isFullLegal ? '#7EC87A' : 'var(--teal)',
              }}
            >
              {statePlace.badge}
            </span>
            <span style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              {statePlace.cities.length} Curated Cities Available
            </span>
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 200, color: '#fff', margin: '0 0 0.4rem 0' }}>
            {statePlace.stateName} Healing Retreats
          </h2>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.78)', margin: 0, maxWidth: '700px', lineHeight: '1.7' }}>
            {statePlace.description}
          </p>
        </div>

        {/* City Options Grid */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            Choose Your Destination City
          </div>
          <p style={{ fontSize: '0.52rem', color: 'var(--muted)', margin: '0 0 1.2rem 0' }}>
            Select any city below. When you reserve, our admin team calls the establishment directly at the listed phone number to finalize your reservations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.2rem' }}>
          {statePlace.cities.map((city) => (
            <div
              key={city.id}
              className="bk-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(201,168,76,0.18)',
                padding: '1.2rem',
                borderRadius: '16px',
                background: '#121212',
              }}
            >
              <div>
                <div
                  style={{
                    height: '140px',
                    borderRadius: '12px',
                    backgroundImage: `url(${city.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '1rem',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.6rem',
                      right: '0.6rem',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(6px)',
                      padding: '0.2rem 0.6rem',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: 'var(--gold)',
                      fontSize: '0.46rem',
                      fontWeight: 600,
                      borderRadius: '999px',
                    }}
                  >
                    From ${city.basePrice}/night
                  </span>
                </div>

                <div style={{ fontSize: '0.42rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>
                  {city.stateName} &middot; City Choice
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', fontWeight: 300, color: '#fff', margin: '0 0 0.5rem 0' }}>
                  {city.cityName}
                </h3>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                  <div style={{ fontSize: '0.42rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Designated Establishment
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text)', marginTop: '0.15rem' }}>
                    {city.hotelName}
                  </div>
                  <div style={{ fontSize: '0.52rem', color: 'var(--teal)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>&#128222; Establishment Phone:</span>
                    <strong>{city.hotelPhone}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.65', marginBottom: '0.8rem' }}>
                  {city.description}
                </p>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                  {city.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.4rem',
                        padding: '0.12rem 0.45rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.65)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      &#10003; {h}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="bk-next"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.5rem' }}
                onClick={() => onSelectCity(city)}
              >
                Book Retreat in {city.cityName} &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
