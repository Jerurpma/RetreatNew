import React, { useState, useEffect } from 'react';
import { Destination, TierType, User } from '../types';
import { STATES_DATA, BASE_PRICES } from '../data/mockData';

interface QuoteCalculatorProps {
  destinations?: Destination[];
  curTier?: TierType;
  user: User | null;
  selectedDestName: string;
  selectedStateName?: string;
  selectedCityName?: string;
  onSelectDestName: (name: string) => void;
  onSelectStateAndCity?: (stateName: string, cityName: string) => void;
  onSaveQuote: (quoteData: {
    dest: string;
    pp: string;
    tot: string;
    lux: string;
    dur: string;
    grp: string;
    state?: string;
    city?: string;
  }) => void;
  onOpenBooking: () => void;
  onOpenBookingWithDetails?: (details: {
    state: string;
    city: string;
    pricePoint: string;
    pricePerPerson: string;
  }) => void;
  onSetTier?: (tier: TierType) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  destinations = [],
  selectedDestName,
  selectedStateName,
  selectedCityName,
  onSelectDestName,
  onSelectStateAndCity,
  onSaveQuote,
  onOpenBooking,
  onOpenBookingWithDetails,
}) => {
  // Find initial state and city
  const defaultState = STATES_DATA.find(
    (s) =>
      s.stateName.toLowerCase() === (selectedStateName || '').toLowerCase() ||
      s.cities.some((c) => c.cityName.toLowerCase() === (selectedDestName || '').toLowerCase())
  ) || STATES_DATA[0];

  const [stateName, setStateName] = useState<string>(defaultState.stateName);
  const currentStateObj = STATES_DATA.find((s) => s.stateName === stateName) || STATES_DATA[0];

  const defaultCity = currentStateObj.cities.find(
    (c) => c.cityName.toLowerCase() === (selectedCityName || selectedDestName || '').toLowerCase()
  ) || currentStateObj.cities[0];

  const [cityName, setCityName] = useState<string>(defaultCity ? defaultCity.cityName : 'Sedona');
  const [lux, setLux] = useState('2.5'); // Comfort default
  const [dur, setDur] = useState('3.2'); // 5-Day default
  const [grp, setGrp] = useState('2,0.05'); // Couple default
  const [pif, setPif] = useState(false);
  const [early, setEarly] = useState(false);

  // Sync when selectedStateName or selectedDestName changes from outside
  useEffect(() => {
    if (selectedStateName) {
      const matchState = STATES_DATA.find(
        (s) => s.stateName.toLowerCase() === selectedStateName.toLowerCase()
      );
      if (matchState) {
        setStateName(matchState.stateName);
        if (selectedCityName) {
          const matchCity = matchState.cities.find(
            (c) => c.cityName.toLowerCase() === selectedCityName.toLowerCase()
          );
          if (matchCity) setCityName(matchCity.cityName);
          else if (matchState.cities[0]) setCityName(matchState.cities[0].cityName);
        } else if (matchState.cities[0]) {
          setCityName(matchState.cities[0].cityName);
        }
      }
    } else if (selectedDestName) {
      for (const st of STATES_DATA) {
        const found = st.cities.find(
          (c) => c.cityName.toLowerCase() === selectedDestName.toLowerCase()
        );
        if (found) {
          setStateName(st.stateName);
          setCityName(found.cityName);
          break;
        }
      }
    }
  }, [selectedStateName, selectedCityName, selectedDestName]);

  const luxLabels: Record<string, { name: string; desc: string; nightlyRange: string }> = {
    '1': {
      name: 'Essential Sanctuary',
      desc: 'Private guest suite, daily herbal tea & tinctures, guided sound healing, evening breathwork',
      nightlyRange: '$450 – $750 / night',
    },
    '2.5': {
      name: 'Comfort & Boutique (Recommended)',
      desc: 'Panoramic red rock/ocean suite, private plant sommelier intake, daily lomilomi & bodywork, sound bath',
      nightlyRange: '$950 – $1,600 / night',
    },
    '7': {
      name: 'Luxury Villa Suite',
      desc: 'Exclusive private villa, dedicated wellness host, private chef plant-infused dining, custom ceremonies',
      nightlyRange: '$2,200 – $3,800 / night',
    },
    '18': {
      name: 'Ultra-Luxury Private Estate Buyout',
      desc: 'Entire private estate buyout, 24/7 dedicated medical concierge team, helicopter transit, private ceremony hall',
      nightlyRange: '$5,500 – $10,000+ / night',
    },
  };

  const durLabels: Record<string, string> = {
    '1': 'Weekend Reset (2 Nights)',
    '1.8': '3-Day Immersive (3 Nights)',
    '3.2': '5-Day Transformation (5 Nights)',
    '4.8': '7-Day Master Journey (7 Nights)',
  };

  const curCityObj = currentStateObj.cities.find((c) => c.cityName === cityName) || currentStateObj.cities[0];
  const basePrice = curCityObj?.basePrice || BASE_PRICES[cityName] || 480;
  const luxMult = parseFloat(lux) || 2.5;
  const durMult = parseFloat(dur) || 3.2;
  const [grpNStr, grpDStr] = grp.split(',');
  const grpN = parseInt(grpNStr) || 2;
  const grpD = parseFloat(grpDStr) || 0;
  const pifD = pif ? 0.08 : 0;
  const earlyD = early ? 0.05 : 0;

  const rawPp = basePrice * luxMult * durMult;
  const totalDiscount = Math.min(grpD + pifD + earlyD, 0.3);
  const savingsPerPerson = rawPp * totalDiscount;
  const finalPp = rawPp - savingsPerPerson;
  const groupTotal = finalPp * grpN;

  const handleStateChange = (newState: string) => {
    setStateName(newState);
    const foundState = STATES_DATA.find((s) => s.stateName === newState);
    if (foundState && foundState.cities.length > 0) {
      const firstCity = foundState.cities[0].cityName;
      setCityName(firstCity);
      onSelectDestName(`${firstCity}, ${newState}`);
      onSelectStateAndCity?.(newState, firstCity);
    }
  };

  const handleCityChange = (newCity: string) => {
    setCityName(newCity);
    onSelectDestName(`${newCity}, ${stateName}`);
    onSelectStateAndCity?.(stateName, newCity);
  };

  const handleSave = () => {
    onSaveQuote({
      dest: `${cityName}, ${stateName}`,
      pp: Math.round(finalPp).toLocaleString(),
      tot: '$' + Math.round(groupTotal).toLocaleString(),
      lux: luxLabels[lux]?.name || 'Comfort & Boutique',
      dur: durLabels[dur] || '5-Day Transformation',
      grp: grpN === 1 ? 'Solo Traveler' : grpN === 2 ? 'Couple' : `${grpN} Guests`,
      state: stateName,
      city: cityName,
    });
  };

  const handleReserve = () => {
    if (onOpenBookingWithDetails) {
      onOpenBookingWithDetails({
        state: stateName,
        city: cityName,
        pricePoint: luxLabels[lux]?.name || 'Comfort & Boutique',
        pricePerPerson: `$${Math.round(finalPp).toLocaleString()}`,
      });
    } else {
      onOpenBooking();
    }
  };

  return (
    <div id="calc-sec">
      <div className="wrap">
        <div className="slbl">Retreat Quote Studio</div>
        <div className="stit">
          Calculate Your <em>Retreat</em>
        </div>
        <div className="sdiv" />
        <p className="ssub">
          Pick your <strong>State</strong>, <strong>City</strong>, and <strong>Price Point</strong> — everything else is handled by Sanctuary Concierge.
        </p>

        <div className="calc-grid">
          {/* Controls */}
          <div>
            {/* Step 1: Pick State */}
            <div className="cgrp">
              <label className="clbl">
                1. Select State or Jurisdiction
                <span style={{ color: 'var(--gold)', marginLeft: '0.4rem', fontWeight: 400 }}>
                  ({currentStateObj.legalStatus})
                </span>
              </label>
              <select
                className="csel"
                value={stateName}
                onChange={(e) => handleStateChange(e.target.value)}
              >
                {STATES_DATA.map((s) => (
                  <option key={s.id} value={s.stateName}>
                    {s.stateName} ({s.country}) — {s.legalStatus}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Pick City */}
            <div className="cgrp">
              <label className="clbl">
                2. Select City in {stateName}
              </label>
              <select
                className="csel"
                value={cityName}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                {currentStateObj.cities.map((c) => (
                  <option key={c.cityName} value={c.cityName}>
                    {c.cityName} — Base rate from ${c.basePrice}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Pick Price Point / Luxury Tier */}
            <div className="cgrp">
              <label className="clbl">
                3. Choose Your Price Point &amp; Tier
              </label>
              <select
                className="csel"
                value={lux}
                onChange={(e) => setLux(e.target.value)}
              >
                <option value="1">
                  Essential Tier — {luxLabels['1'].nightlyRange} (Private Casita, Daily Herbal Regimen)
                </option>
                <option value="2.5">
                  Comfort &amp; Boutique (Recommended) — {luxLabels['2.5'].nightlyRange} (Vortex Suite, Sommelier Intake)
                </option>
                <option value="7">
                  Luxury Villa Suite — {luxLabels['7'].nightlyRange} (Private Villa, Personal Chef &amp; Concierge)
                </option>
                <option value="18">
                  Ultra-Luxury Buyout — {luxLabels['18'].nightlyRange} (Full Private Estate, 24/7 Dedicated Medical Team)
                </option>
              </select>

              {/* Price Point Tier Detail Box */}
              <div
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.22)',
                  borderRadius: '10px',
                  padding: '0.8rem 1rem',
                  marginTop: '0.6rem',
                }}
              >
                <div style={{ fontSize: '0.46rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {luxLabels[lux]?.name} &middot; {luxLabels[lux]?.nightlyRange}
                </div>
                <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.25rem', lineHeight: '1.6' }}>
                  {luxLabels[lux]?.desc}
                </div>
              </div>
            </div>

            {/* Step 4: Duration */}
            <div className="cgrp">
              <label className="clbl">4. Retreat Duration</label>
              <select
                className="csel"
                value={dur}
                onChange={(e) => setDur(e.target.value)}
              >
                <option value="1">Weekend Reset (2 Nights, 1.0x)</option>
                <option value="1.8">3-Day Immersive (3 Nights, 1.8x)</option>
                <option value="3.2">5-Day Transformation (5 Nights, 3.2x) — Recommended</option>
                <option value="4.8">7-Day Master Journey (7 Nights, 4.8x)</option>
              </select>
            </div>

            {/* Step 5: Group Size */}
            <div className="cgrp">
              <label className="clbl">5. Group Size</label>
              <select
                className="csel"
                value={grp}
                onChange={(e) => setGrp(e.target.value)}
              >
                <option value="1,0">Solo Traveler (1 Guest)</option>
                <option value="2,0.05">Couple / Duo (2 Guests, 5% group savings)</option>
                <option value="4,0.10">Small Cohort (4 Guests, 10% group savings)</option>
                <option value="6,0.15">Group Sanctuary (6 Guests, 15% group savings)</option>
                <option value="8,0.20">Full Buyout (8+ Guests, 20% group savings)</option>
              </select>
            </div>

            {/* Advance Incentives */}
            <div className="cgrp">
              <label className="clbl">6. Advance Incentives</label>
              <div className="brow">
                <label className="blbl">
                  <input
                    type="checkbox"
                    checked={pif}
                    onChange={(e) => setPif(e.target.checked)}
                  />
                  <span>Pay in Full (8% discount)</span>
                </label>
                <label className="blbl">
                  <input
                    type="checkbox"
                    checked={early}
                    onChange={(e) => setEarly(e.target.checked)}
                  />
                  <span>Early Bird 90+ days (5% discount)</span>
                </label>
              </div>
            </div>

            {/* EVERYTHING ELSE IS HANDLED BY US BANNER */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(20,40,30,0.8), rgba(10,25,20,0.9))',
                border: '1px solid rgba(126,200,122,0.3)',
                borderRadius: '14px',
                padding: '1.2rem',
                marginTop: '1.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', color: '#7EC87A' }}>✦</span>
                <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7EC87A' }}>
                  Everything Else is Handled by Us
                </span>
              </div>
              <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', margin: 0 }}>
                You pick your state, city, and target price point. Sanctuary Concierge takes care of everything else:
              </p>
              <ul style={{ margin: '0.6rem 0 0 1rem', padding: 0, fontSize: '0.5rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7' }}>
                <li>✓ Curated luxury accommodations confirmed with partner establishments</li>
                <li>✓ 100% legal &amp; out-of-state medical reciprocity paperwork pre-cleared</li>
                <li>✓ Private airport chauffeur &amp; daily black-car luxury transportation</li>
                <li>✓ Certified somatic practitioners, sound bath masters &amp; plant medicine guides</li>
                <li>✓ Dedicated 24/7 concierge wellness host assigned to your party</li>
              </ul>
            </div>
          </div>

          {/* Results Box */}
          <div className="cres">
            <div>
              <div className="res-dest">
                {cityName.toUpperCase()}, {stateName.toUpperCase()} — SANCTUARY QUOTE
              </div>
              <div style={{ fontSize: '0.42rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {luxLabels[lux]?.name} &middot; 18+ Verified
              </div>

              <div className="res-big">
                ${Math.round(finalPp).toLocaleString()}
                <span>/pp</span>
              </div>

              <div className="res-rows">
                <div className="res-row">
                  <span className="l">State / Jurisdiction</span>
                  <span className="v">{stateName}</span>
                </div>
                <div className="res-row">
                  <span className="l">Selected City</span>
                  <span className="v">{cityName}</span>
                </div>
                <div className="res-row">
                  <span className="l">Price Point Tier</span>
                  <span className="v">{luxLabels[lux]?.name}</span>
                </div>
                <div className="res-row">
                  <span className="l">Duration</span>
                  <span className="v">{durLabels[dur]}</span>
                </div>
                <div className="res-row">
                  <span className="l">Party Size</span>
                  <span className="v">{grpN} {grpN === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="res-row">
                  <span className="l">Total Discounts Applied</span>
                  <span className="v" style={{ color: totalDiscount > 0 ? '#7EC87A' : 'var(--muted)' }}>
                    {totalDiscount > 0 ? `-${Math.round(totalDiscount * 100)}%` : 'None'}
                  </span>
                </div>
                <div className="res-tot">
                  <span className="l">Total Group Investment</span>
                  <span className="v">${Math.round(groupTotal).toLocaleString()}</span>
                </div>
              </div>

              {savingsPerPerson > 0 && (
                <div className="res-sav">
                  ✦ Savings: ${Math.round(savingsPerPerson * grpN).toLocaleString()} ({Math.round(totalDiscount * 100)}% total discount applied)
                </div>
              )}

              <div className="qlock">
                <button className="save-btn" onClick={handleSave} type="button">
                  ⊙ Save Quote (+50 loyalty points)
                </button>

                <button
                  className="res-book-btn"
                  onClick={handleReserve}
                  type="button"
                  style={{ fontSize: '0.55rem', fontWeight: 700, padding: '0.9rem' }}
                >
                  ⚡ Reserve in {cityName}, {stateName} &rarr;
                </button>

                <div style={{ marginTop: '0.8rem' }}>
                  <div className="ql-t">✦ Ready to Reserve?</div>
                  <div className="ql-s">
                    All logistics, accommodations, and plant therapies are fully coordinated by our concierge team once reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
