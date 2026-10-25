import React, { useState } from 'react';
import { StatePlace, CityDestination } from '../types';
import { STATES_DATA } from '../data/mockData';

interface DestinationGalleryProps {
  onSelectCity: (city: CityDestination) => void;
  onOpenStateModal: (state: StatePlace) => void;
  onSelectState?: (state: StatePlace) => void;
}

export const DestinationGallery: React.FC<DestinationGalleryProps> = ({
  onSelectCity,
  onOpenStateModal,
  onSelectState,
}) => {
  const [filter, setFilter] = useState<'all' | 'rec' | 'med' | 'dec' | 'us' | 'intl'>('all');

  const filteredStates = STATES_DATA.filter((state) => {
    if (filter === 'all') return true;
    if (filter === 'rec') return state.legalStatus === '100% Legal';
    if (filter === 'med') return state.legalStatus === 'Medical Marijuana Card Required';
    if (filter === 'dec') return state.legalStatus === 'Decriminalized';
    if (filter === 'us') return state.country === 'USA';
    if (filter === 'intl') return state.country === 'International';
    return true;
  });

  const handleStateClick = (state: StatePlace) => {
    if (onSelectState) {
      onSelectState(state);
    } else {
      onOpenStateModal(state);
    }
  };

  return (
    <div id="dest-sec">
      <div className="wrap" style={{ padding: '4.5rem 0 1.5rem' }}>
        <div className="slbl">State &amp; City Retreat Directory</div>
        <div className="stit">
          Where Cannabis is <em>100% Legal &amp; Medical</em>
        </div>
        <div className="sdiv" />
        <p className="ssub">
          Click any state below to instantly calculate your retreat, choose your city and price point — everything else is handled by Sanctuary Concierge.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="dfbar">
        <span className="dfl">Filter By Cannabis Status:</span>
        <button
          type="button"
          className={`dfb ${filter === 'all' ? 'on' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Places ({STATES_DATA.length})
        </button>
        <button
          type="button"
          className={`dfb rec ${filter === 'rec' ? 'on' : ''}`}
          onClick={() => setFilter('rec')}
        >
          &#127807; 100% Legal (Adult-Use 21+)
        </button>
        <button
          type="button"
          className={`dfb med ${filter === 'med' ? 'on' : ''}`}
          onClick={() => setFilter('med')}
        >
          &#128138; Medical Card Required
        </button>
        <button
          type="button"
          className={`dfb dec ${filter === 'dec' ? 'on' : ''}`}
          onClick={() => setFilter('dec')}
        >
          &#127793; Decriminalized
        </button>
        <button
          type="button"
          className={`dfb ${filter === 'us' ? 'on' : ''}`}
          onClick={() => setFilter('us')}
        >
          &#127482;&#127480; US States
        </button>
        <button
          type="button"
          className={`dfb ${filter === 'intl' ? 'on' : ''}`}
          onClick={() => setFilter('intl')}
        >
          &#127758; International
        </button>

        <span className="dcount">
          Showing <b>{filteredStates.length}</b> regions
        </span>
      </div>

      {/* Grid of States & Countries */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredStates.map((st) => {
            const is100Legal = st.legalStatus === '100% Legal';
            const isMed = st.legalStatus === 'Medical Marijuana Card Required';

            return (
              <div
                key={st.id}
                className="dc"
                onClick={() => handleStateClick(st)}
                style={{
                  minHeight: '340px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid rgba(201,168,76,0.2)',
                  boxShadow: '0 18px 44px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  className="dc-bg"
                  style={{
                    backgroundImage: `url(${st.heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="dc-ov" />

                {/* Prominent Legal Status Badge */}
                <div
                  className="dc-st"
                  style={{
                    top: '0.8rem',
                    right: '0.8rem',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    background: is100Legal
                      ? 'rgba(45,90,39,0.85)'
                      : isMed
                      ? 'rgba(20,50,60,0.85)'
                      : 'rgba(60,50,20,0.85)',
                    border: `1px solid ${
                      is100Legal ? 'var(--rec)' : isMed ? 'var(--med)' : 'var(--dec)'
                    }`,
                  }}
                >
                  <div
                    className={`dc-dot ${
                      is100Legal ? 'rec' : isMed ? 'med' : 'dec'
                    }`}
                  />
                  <span
                    className="dc-sl"
                    style={{
                      fontSize: '0.42rem',
                      fontWeight: 700,
                      color: is100Legal ? '#7EC87A' : isMed ? 'var(--teal)' : 'var(--dec)',
                    }}
                  >
                    {is100Legal ? '100% Legal (21+)' : isMed ? 'Medical Card Required' : 'Decriminalized'}
                  </span>
                </div>

                <div className="dc-hint" style={{ fontSize: '0.46rem' }}>
                  &#9889; Calculate Retreat in {st.stateName} &rarr;
                </div>

                <div className="dc-info" style={{ padding: '1.2rem' }}>
                  <div className="dc-reg">
                    {st.country} &middot; {st.cities.length} Cities
                  </div>
                  <h3 className="dc-name" style={{ fontSize: '1.6rem' }}>
                    {st.stateName}
                  </h3>
                  <div style={{ fontSize: '0.44rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                    Cities: {st.cities.map((c) => c.cityName).join(', ')}
                  </div>
                  <div className="dc-pr" style={{ marginTop: '0.4rem', color: 'var(--gold)', fontWeight: 600 }}>
                    From ${st.cities[0]?.basePrice || 480}/night &middot; Click to calculate &amp; pick price point
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
