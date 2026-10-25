import React, { useState } from 'react';
import { User, Booking, PriceBreakdown } from '../../types';
import { BOOKED_DAYS, PROMO_CODES, STATES_DATA, DESTINATIONS } from '../../data/mockData';
import { db } from '../../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { generateItineraryPDF } from '../../utils/pdfGenerator';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destName: string;
  perPersonPrice: string;
  user: User | null;
  bpBalance: number;
  hotelName?: string;
  hotelPhone?: string;
  stateName?: string;
  cityName?: string;
  onBookingComplete: (newBooking: Booking, amountNum: number, usedBanking: boolean) => void;
  onOpenWaitlist: (date: Date) => void;
  onOpenMyRetreats: (tab?: string) => void;
  onShowToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  destName,
  perPersonPrice,
  user,
  bpBalance,
  hotelName: propHotelName,
  hotelPhone: propHotelPhone,
  stateName: propStateName,
  cityName: propCityName,
  onBookingComplete,
  onOpenWaitlist,
  onOpenMyRetreats,
  onShowToast,
}) => {
  const [step, setStep] = useState(1);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [checkin, setCheckin] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [checkout, setCheckout] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 8);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Step 2 form
  const [firstName, setFirstName] = useState(user ? user.name.split(' ')[0] : 'Demo');
  const [lastName, setLastName] = useState(user ? user.name.split(' ').slice(1).join(' ') : 'Guest');
  const [email, setEmail] = useState(user ? user.email : 'demo@sanctuary.com');
  const [phone, setPhone] = useState('+1 (555) 382-9912');
  const [guestCount, setGuestCount] = useState(2);
  const [accommodation, setAccommodation] = useState('Oceanfront Wailea Suite');
  const [cannabisProgram, setCannabisProgram] = useState('Full THC & CBD Holistic');
  const [notes, setNotes] = useState('Deep relaxation, sleep restoration, couples lomilomi alignment.');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Step 4 Payment
  const [payMode, setPayMode] = useState<'full' | 'split'>('full');
  const [payMethod, setPayMethod] = useState<'card' | 'banking' | 'paypal' | 'apple'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242  4242  4242  4242');
  const [cardExp, setCardExp] = useState('08 / 28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('DEMO GUEST');

  // Split payment state
  const [splitGuests, setSplitGuests] = useState<Array<{ name: string; paid: boolean; card: string }>>([
    { name: 'Demo (Lead)', paid: false, card: '' },
    { name: 'Guest 2', paid: false, card: '' },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  React.useEffect(() => {
    if (user && isOpen) {
      const parts = user.name.trim().split(' ');
      setFirstName(parts[0] || 'Guest');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setCardName(user.name.toUpperCase());
    }
  }, [user, isOpen]);

  // Resolve establishment hotel name and telephone number
  let resolvedHotelName = propHotelName;
  let resolvedHotelPhone = propHotelPhone;
  let resolvedState = propStateName || '';
  let resolvedCity = propCityName || '';

  if (!resolvedHotelName || !resolvedHotelPhone) {
    // Search STATES_DATA
    for (const state of STATES_DATA) {
      for (const city of state.cities) {
        if (
          destName.toLowerCase().includes(city.cityName.toLowerCase()) ||
          destName.toLowerCase().includes(state.stateName.toLowerCase()) ||
          city.cityName.toLowerCase().includes(destName.toLowerCase())
        ) {
          resolvedHotelName = city.hotelName;
          resolvedHotelPhone = city.hotelPhone;
          resolvedState = state.stateName;
          resolvedCity = city.cityName;
          break;
        }
      }
      if (resolvedHotelName) break;
    }

    if (!resolvedHotelName) {
      // Search DESTINATIONS
      const match = DESTINATIONS.find(
        (d) => d.name.toLowerCase() === destName.toLowerCase() || destName.toLowerCase().includes(d.name.toLowerCase())
      );
      if (match) {
        resolvedHotelName = match.hotelName || 'Luxury Sanctuary Villa & Spa';
        resolvedHotelPhone = match.hotelPhone || '(928) 282-2900';
      } else {
        resolvedHotelName = 'Enchantment Resort & Mii Amo Spa';
        resolvedHotelPhone = '(928) 282-2900';
      }
    }
  }

  if (!isOpen) return null;

  const rawPpNumber = parseFloat(perPersonPrice.replace(/[^0-9.]/g, '')) || 480 * 3.2 * 2.5 * 0.95; // default fallback
  const subtotal = rawPpNumber * guestCount;
  const discountAmt = subtotal * promoDiscount;
  const finalTotal = subtotal - discountAmt;

  // Itemized breakdown calculations: Hotel, Transportation, Activities, Concierge, Taxes
  const calcHotel = Math.round(finalTotal * 0.52);
  const calcTransport = Math.round(finalTotal * 0.14);
  const calcActivities = Math.round(finalTotal * 0.18);
  const calcConcierge = Math.round(finalTotal * 0.08);
  const calcTaxes = Math.round(finalTotal - (calcHotel + calcTransport + calcActivities + calcConcierge));

  const priceBreakdown: PriceBreakdown = {
    hotel: calcHotel,
    transportation: calcTransport,
    activities: calcActivities,
    concierge: calcConcierge,
    taxes: calcTaxes,
    total: Math.round(finalTotal),
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePickDate = (d: Date) => {
    const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    picked.setHours(0, 0, 0, 0);

    if (!checkin || (checkin && checkout)) {
      setCheckin(picked);
      setCheckout(null);
      onShowToast(`Check-In set to ${picked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Now click your Check-Out day.`);
    } else if (checkin && !checkout) {
      if (picked.getTime() <= checkin.getTime()) {
        setCheckin(picked);
        setCheckout(null);
        onShowToast(`Check-In changed to ${picked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`);
      } else {
        setCheckout(picked);
        const nights = Math.max(1, Math.round((picked.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
        onShowToast(`Dates confirmed: ${nights} Nights (${checkin.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${picked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}).`);
      }
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoDiscount(PROMO_CODES[code]);
      setPromoMsg(`✓ ${Math.round(PROMO_CODES[code] * 100)}% off applied!`);
      onShowToast(`✦ Promo code ${code} applied!`);
    } else {
      setPromoMsg('✗ Invalid promo code');
    }
  };

  const initSplitGuests = (count: number) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        name: i === 0 ? `${firstName} (Lead)` : `Guest ${i + 1}`,
        paid: false,
        card: '',
      });
    }
    setSplitGuests(arr);
  };

  const handlePaySplitGuest = (idx: number) => {
    const updated = [...splitGuests];
    updated[idx].paid = true;
    setSplitGuests(updated);
    onShowToast(`✓ Payment received for ${updated[idx].name}`);

    // If all paid
    if (updated.every((g) => g.paid)) {
      setTimeout(() => {
        completeBooking('Split Payment');
      }, 1000);
    }
  };

  const completeBooking = (methodUsed: string) => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      const destCode = (destName || 'MAU').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
      const dateCode = checkin
        ? `${checkin.getFullYear()}${String(checkin.getMonth() + 1).padStart(2, '0')}${String(checkin.getDate()).padStart(2, '0')}`
        : '20260512';
      const planId = `SAN-${destCode}-${dateCode}-${guestCount}P`;

      const nightsCount = checkin && checkout
        ? Math.max(1, Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)))
        : 5;

      const newBk: Booking = {
        id: 'BK-' + Date.now(),
        planId,
        dest: destName || 'Maui, Hawaii',
        state: resolvedState,
        city: resolvedCity,
        checkin: checkin?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'May 12, 2026',
        checkout: checkout?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'May 17, 2026',
        nights: nightsCount,
        guests: guestCount,
        leadGuest: `${firstName} ${lastName}`,
        email,
        phone,
        accommodation,
        hotelName: resolvedHotelName || 'Enchantment Resort & Mii Amo Spa',
        hotelPhone: resolvedHotelPhone || '(928) 282-2900',
        cannabisProgram,
        amountPaid: '$' + Math.round(finalTotal).toLocaleString(),
        paymentMethod: methodUsed,
        status: 'Upcoming',
        specialist: 'Dr. Kaimana Kahale',
        venue: resolvedHotelName || `${destName || 'Maui'} Luxury Sanctuary`,
        breakdown: priceBreakdown,
        adminCalledAndBooked: false,
      };

      // Write to Firestore if connected
      if (db) {
        try {
          const bookingDoc = doc(collection(db, 'retreat_bookings'), newBk.id);
          await setDoc(bookingDoc, {
            ...newBk,
            userId: user?.uid || 'guest',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Firestore booking write notice:', e);
        }
      }

      setConfirmedBooking(newBk);
      setStep(5);
      onBookingComplete(newBk, finalTotal, payMethod === 'banking');
      onShowToast(`✦ Retreat reserved! Plan ${planId} generated. Our concierge will call ${newBk.hotelName} to confirm.`);
    }, 1800);
  };

  const handleCardInput = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1  ').trim();
    setCardNumber(formatted);
  };

  const handleExpInput = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length > 2) {
      setCardExp(raw.substring(0, 2) + ' / ' + raw.substring(2));
    } else {
      setCardExp(raw);
    }
  };

  // Calendar rendering
  const renderCalendar = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookedList = BOOKED_DAYS[calMonth] || [12, 19];

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bk-day empty" />);
    }

    const checkinTime = checkin ? new Date(checkin.getFullYear(), checkin.getMonth(), checkin.getDate()).getTime() : null;
    const checkoutTime = checkout ? new Date(checkout.getFullYear(), checkout.getMonth(), checkout.getDate()).getTime() : null;

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(calYear, calMonth, d);
      dt.setHours(0, 0, 0, 0);
      const isPast = dt.getTime() < today.getTime();
      const isBooked = bookedList.includes(d);
      let cls = 'bk-day';

      const isCheckin = checkinTime !== null && dt.getTime() === checkinTime;
      const isCheckout = checkoutTime !== null && dt.getTime() === checkoutTime;
      const inRange = checkinTime !== null && checkoutTime !== null && dt.getTime() > checkinTime && dt.getTime() < checkoutTime;

      if (isPast) {
        cls += ' past';
      } else if (isBooked) {
        cls += ' booked';
      } else {
        cls += ' avail';
        if (isCheckin || isCheckout) cls += ' sel';
        else if (inRange) cls += ' range';
      }

      cells.push(
        <div
          key={`day-${d}`}
          className={cls}
          style={{ cursor: isPast ? 'not-allowed' : 'pointer' }}
          onClick={() => {
            if (isPast) {
              onShowToast('This date is in the past. Please select an upcoming date.');
              return;
            }
            if (isBooked) {
              onOpenWaitlist(dt);
            } else {
              handlePickDate(dt);
            }
          }}
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-corner" onClick={onClose} type="button">
        ✕
      </button>

      <div className="bkw" onClick={(e) => e.stopPropagation()}>
        <div className="bk-header">
          <div className="bk-logo">Sanctuary · Retreat Reservation</div>
          <button className="bk-back" style={{ padding: '0.3rem 0.8rem', fontSize: '0.45rem' }} onClick={onClose}>
            ✕ Cancel
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bk-steps">
          {[1, 2, 3, 4, 5].map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`bk-step ${step === s ? 'active' : step > s ? 'done' : ''}`}
                onClick={() => {
                  if (s < step && step !== 5) setStep(s);
                }}
                style={{ cursor: s < step && step !== 5 ? 'pointer' : 'default' }}
              >
                <div className="bk-snum">{step > s ? '✓' : s}</div>
                <span>
                  {s === 1
                    ? 'Dates'
                    : s === 2
                    ? 'Guests'
                    : s === 3
                    ? 'Review'
                    : s === 4
                    ? 'Payment'
                    : 'Confirmed'}
                </span>
              </div>
              {idx < 4 && <div className={`bk-line ${step > s ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: DATES */}
        {step === 1 && (
          <div className="bk-panel">
            <div className="bk-stitle">Step 1 of 5 · Choose Your Retreat Window</div>

            <div className="bk-dest-row">
              <div>
                <div style={{ fontSize: '0.4rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Destination
                </div>
                <div className="bk-dest-name">{destName || 'Maui, Hawaii'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.4rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'right' }}>
                  Estimated Rate
                </div>
                <div className="bk-dest-price">${Math.round(rawPpNumber).toLocaleString()}/pp</div>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="cp-btn"
                onClick={() => {
                  const d1 = new Date();
                  d1.setDate(d1.getDate() + 3);
                  d1.setHours(0, 0, 0, 0);
                  const d2 = new Date(d1);
                  d2.setDate(d2.getDate() + 3);
                  setCheckin(d1);
                  setCheckout(d2);
                  setCalMonth(d1.getMonth());
                  setCalYear(d1.getFullYear());
                  onShowToast('✦ Preset: 3-Night Weekend Retreat selected.');
                }}
                style={{ fontSize: '0.44rem', padding: '0.35rem 0.75rem' }}
              >
                ⚡ 3 Nights Weekend
              </button>
              <button
                type="button"
                className="cp-btn"
                onClick={() => {
                  const d1 = new Date();
                  d1.setDate(d1.getDate() + 4);
                  d1.setHours(0, 0, 0, 0);
                  const d2 = new Date(d1);
                  d2.setDate(d2.getDate() + 5);
                  setCheckin(d1);
                  setCheckout(d2);
                  setCalMonth(d1.getMonth());
                  setCalYear(d1.getFullYear());
                  onShowToast('✦ Preset: 5-Night Wellness Immersion selected.');
                }}
                style={{ fontSize: '0.44rem', padding: '0.35rem 0.75rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
              >
                ★ 5 Nights (Recommended)
              </button>
              <button
                type="button"
                className="cp-btn"
                onClick={() => {
                  const d1 = new Date();
                  d1.setDate(d1.getDate() + 5);
                  d1.setHours(0, 0, 0, 0);
                  const d2 = new Date(d1);
                  d2.setDate(d2.getDate() + 7);
                  setCheckin(d1);
                  setCheckout(d2);
                  setCalMonth(d1.getMonth());
                  setCalYear(d1.getFullYear());
                  onShowToast('✦ Preset: 7-Night Sacred Immersion selected.');
                }}
                style={{ fontSize: '0.44rem', padding: '0.35rem 0.75rem' }}
              >
                🌿 7 Nights Full Retreat
              </button>
            </div>

            <div className="bk-chips">
              <div className="bk-chip">
                <div className="bk-chip-l">Check-In Date</div>
                <input
                  type="date"
                  value={checkin ? checkin.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const parts = e.target.value.split('-');
                      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                      d.setHours(0, 0, 0, 0);
                      setCheckin(d);
                      setCalMonth(d.getMonth());
                      setCalYear(d.getFullYear());
                      if (checkout && checkout <= d) {
                        const nextD = new Date(d);
                        nextD.setDate(nextD.getDate() + 5);
                        setCheckout(nextD);
                      }
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold)',
                    fontFamily: 'inherit',
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    paddingTop: '0.2rem',
                  }}
                />
              </div>
              <div className="bk-chip">
                <div className="bk-chip-l">Check-Out Date</div>
                <input
                  type="date"
                  value={checkout ? checkout.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const parts = e.target.value.split('-');
                      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                      d.setHours(0, 0, 0, 0);
                      setCheckout(d);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold)',
                    fontFamily: 'inherit',
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    paddingTop: '0.2rem',
                  }}
                />
              </div>
              <div className="bk-chip">
                <div className="bk-chip-l">Duration</div>
                <div className="bk-chip-v" style={{ marginTop: '0.25rem' }}>
                  {checkin && checkout
                    ? `${Math.max(1, Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)))} Nights`
                    : 'Select dates'}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bk-cal">
              <div className="bk-cal-hdr">
                <button
                  className="bk-cal-nav"
                  type="button"
                  onClick={() => {
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear(calYear - 1);
                    } else {
                      setCalMonth(calMonth - 1);
                    }
                  }}
                >
                  ◀
                </button>
                <div className="bk-cal-title">
                  {months[calMonth]} {calYear}
                </div>
                <button
                  className="bk-cal-nav"
                  type="button"
                  onClick={() => {
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear(calYear + 1);
                    } else {
                      setCalMonth(calMonth + 1);
                    }
                  }}
                >
                  ▶
                </button>
              </div>

              <div className="bk-cal-g">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="bk-dh">{d}</div>
                ))}
                {renderCalendar()}
              </div>

              <div className="bk-cal-legend">
                <div className="bk-leg">
                  <div className="bk-leg-dot avail" />
                  <span>Available</span>
                </div>
                <div className="bk-leg">
                  <div className="bk-leg-dot booked" />
                  <span>Booked (Click for Waitlist)</span>
                </div>
                <div className="bk-leg">
                  <div className="bk-leg-dot sel" />
                  <span>Selected</span>
                </div>
              </div>
            </div>

            <div className="bk-btns">
              <button
                className="bk-next"
                type="button"
                onClick={() => {
                  if (!checkin || !checkout) {
                    onShowToast('⚠️ Please select both check-in and check-out dates.');
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue to Guest Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUEST DETAILS */}
        {step === 2 && (
          <div className="bk-panel">
            <div className="bk-stitle">Step 2 of 5 · Guest Details &amp; Intentions</div>

            <div className="bk-2col">
              <div className="bk-field">
                <label className="bk-label">First Name</label>
                <input
                  className="bk-inp"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Last Name</label>
                <input
                  className="bk-inp"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="bk-2col">
              <div className="bk-field">
                <label className="bk-label">Email Address</label>
                <input
                  className="bk-inp"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Direct Phone / WhatsApp</label>
                <input
                  className="bk-inp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="bk-2col">
              <div className="bk-field">
                <label className="bk-label">Number of Guests</label>
                <select
                  className="bk-sel"
                  value={guestCount}
                  onChange={(e) => {
                    const c = parseInt(e.target.value) || 1;
                    setGuestCount(c);
                    initSplitGuests(c);
                  }}
                >
                  <option value={1}>1 Solo Guest</option>
                  <option value={2}>2 Guests (Couple / Duo)</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={8}>8 Guests</option>
                </select>
              </div>

              <div className="bk-field">
                <label className="bk-label">Accommodation Preference</label>
                <select
                  className="bk-sel"
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                >
                  <option value="Oceanfront Wailea Suite">Wailea Oceanfront Villa</option>
                  <option value="Private Garden Casita">Private Botanical Casita</option>
                  <option value="Presidential Penthouse Sanctuary">Presidential Penthouse Sanctuary</option>
                </select>
              </div>
            </div>

            <div className="bk-field">
              <label className="bk-label">Cannabis Wellness Modality</label>
              <select
                className="bk-sel"
                value={cannabisProgram}
                onChange={(e) => setCannabisProgram(e.target.value)}
              >
                <option value="Full THC & CBD Holistic">Full THC &amp; CBD Holistic (Custom Strain Consult)</option>
                <option value="CBD & Non-Psychoactive Only">CBD, CBG &amp; Non-Psychoactive Cannabinoids Only</option>
                <option value="Microdosing Somatic Program">Microdosing &amp; Somatic Healing Protocol</option>
                <option value="Wellness & Herbal Rituals Only">Herbal Infusions &amp; Traditional Rituals (Zero Cannabis)</option>
              </select>
            </div>

            <div className="bk-field">
              <label className="bk-label">Healing Intentions &amp; Dietary Requirements</label>
              <input
                className="bk-inp"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., vegan diet, nervous system recovery, sound bath preference..."
              />
            </div>

            <div className="bk-btns">
              <button className="bk-back" onClick={() => setStep(1)} type="button">
                ← Back to Dates
              </button>
              <button
                className="bk-next"
                onClick={() => {
                  if (!firstName || !email) {
                    onShowToast('⚠️ Please enter your name and email.');
                    return;
                  }
                  setStep(3);
                }}
                type="button"
              >
                Review Sanctuary Plan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="bk-panel">
            <div className="bk-stitle">Step 3 of 5 · Itinerary &amp; Agreement</div>

            <div style={{ background: 'var(--d3)', border: '1px solid rgba(201,168,76,0.1)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.2rem' }}>
              <div className="bk-rrow">
                <span className="l">Destination</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{destName || 'Maui, Hawaii'}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Dates</span>
                <span>
                  {checkin?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —{' '}
                  {checkout?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="bk-rrow">
                <span className="l">Party Size</span>
                <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Lead Guest</span>
                <span>{firstName} {lastName} ({email})</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Accommodation</span>
                <span>{accommodation}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Cannabis Plan</span>
                <span style={{ color: 'var(--gold)' }}>{cannabisProgram}</span>
              </div>
              <div className="bk-rtot">
                <span className="l">Total Estimate</span>
                <span className="v">${Math.round(subtotal).toLocaleString()}</span>
              </div>
            </div>

            {/* Establishment Hotel & Direct Phone for Admin to call */}
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', padding: '1.1rem', borderRadius: '12px', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.42rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem', fontWeight: 600 }}>
                🏨 Establishment Hotel To Be Booked
              </div>
              <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600, fontFamily: "'Cormorant Garamond', serif" }}>
                {resolvedHotelName}
              </div>
              <div style={{ fontSize: '0.52rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                Establishment Telephone: <strong style={{ color: 'var(--gold)' }}>{resolvedHotelPhone}</strong>
              </div>
              <div style={{ fontSize: '0.44rem', color: 'var(--cream)', opacity: 0.7, marginTop: '0.3rem' }}>
                * Our dedicated team will directly call this hotel to lock in your reservation upon booking.
              </div>
            </div>

            {/* Itemized Price Breakdown */}
            <div style={{ background: 'var(--d3)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.1rem', borderRadius: '12px', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.45rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.7rem', fontWeight: 600 }}>
                Full Itemized Price Breakdown
              </div>
              <div className="bk-rrow">
                <span className="l">🏨 Luxury Hotel &amp; Villa Accommodation</span>
                <span>${priceBreakdown.hotel.toLocaleString()}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">🚗 Private Chauffeur &amp; Airport Transportation</span>
                <span>${priceBreakdown.transportation.toLocaleString()}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">🌿 Somatic Healing &amp; Plant Activities</span>
                <span>${priceBreakdown.activities.toLocaleString()}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">🛎️ Dedicated Concierge &amp; Sommelier</span>
                <span>${priceBreakdown.concierge.toLocaleString()}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">🏛️ Statutory Taxes &amp; Occupancy Surcharges</span>
                <span>${priceBreakdown.taxes.toLocaleString()}</span>
              </div>
              <div className="bk-rtot" style={{ borderTop: '1px solid rgba(201,168,76,0.3)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                <span className="l" style={{ color: '#fff' }}>Total Escrow Guaranteed</span>
                <span className="v">${priceBreakdown.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.52rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  style={{ accentColor: 'var(--gold)', marginTop: '0.15rem' }}
                />
                <span>
                  I verify that all attendees are 18+ (21+ where adult-use statutory laws apply). I accept Sanctuary’s encrypted escrow policies and terms of holistic care.
                </span>
              </label>
            </div>

            <div className="bk-btns">
              <button className="bk-back" onClick={() => setStep(2)} type="button">
                ← Back to Details
              </button>
              <button
                className="bk-next"
                onClick={() => {
                  if (!termsAgreed) {
                    onShowToast('⚠️ Please agree to terms to proceed to payment.');
                    return;
                  }
                  initSplitGuests(guestCount);
                  setStep(4);
                }}
                type="button"
              >
                Proceed to Secure Escrow Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step === 4 && (
          <div className="bk-panel" style={{ position: 'relative' }}>
            <div className="bk-stitle">Step 4 of 5 · Secure Escrow Payment</div>

            {/* Full vs Split Toggle */}
            <div style={{ display: 'flex', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.4rem' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: payMode === 'full' ? 'rgba(201,168,76,0.18)' : 'transparent',
                  color: payMode === 'full' ? 'var(--gold)' : 'var(--muted)',
                  border: 'none',
                  fontSize: '0.48rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
                onClick={() => setPayMode('full')}
              >
                Full Single Payment
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: payMode === 'split' ? 'rgba(201,168,76,0.18)' : 'transparent',
                  color: payMode === 'split' ? 'var(--gold)' : 'var(--muted)',
                  border: 'none',
                  fontSize: '0.48rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
                onClick={() => setPayMode('split')}
              >
                Split With Group ({guestCount} Guests)
              </button>
            </div>

            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <input
                className="bk-inp"
                style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="PROMO CODE (E.G. SANCTUARY15)"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '999px',
                  color: 'var(--gold)',
                  padding: '0 1rem',
                  fontSize: '0.48rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Apply
              </button>
            </div>
            {promoMsg && (
              <div style={{ fontSize: '0.48rem', color: promoDiscount > 0 ? '#7EC87A' : '#e74c3c', marginBottom: '0.8rem' }}>
                {promoMsg}
              </div>
            )}

            {/* FULL PAYMENT MODE */}
            {payMode === 'full' ? (
              <div className="pay-grid">
                <div>
                  {/* Payment Tabs */}
                  <div className="pay-tabs">
                    <button
                      className={`pay-tab ${payMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPayMethod('card')}
                      type="button"
                    >
                      <span className="pay-tab-ic">💳</span>
                      <span className="pay-tab-lbl">Credit Card</span>
                    </button>
                    <button
                      className={`pay-tab ${payMethod === 'banking' ? 'active' : ''}`}
                      onClick={() => setPayMethod('banking')}
                      type="button"
                    >
                      <span className="pay-tab-ic">🏛</span>
                      <span className="pay-tab-lbl">Banking Escrow</span>
                    </button>
                    <button
                      className={`pay-tab ${payMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setPayMethod('paypal')}
                      type="button"
                    >
                      <span className="pay-tab-ic">🅿</span>
                      <span className="pay-tab-lbl">PayPal</span>
                    </button>
                    <button
                      className={`pay-tab ${payMethod === 'apple' ? 'active' : ''}`}
                      onClick={() => setPayMethod('apple')}
                      type="button"
                    >
                      <span className="pay-tab-ic">🍏</span>
                      <span className="pay-tab-lbl">Apple Pay</span>
                    </button>
                  </div>

                  {/* Card Tab */}
                  {payMethod === 'card' && (
                    <div>
                      {/* Interactive Card Preview */}
                      <div className="card-prev">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                          <span style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                            Sanctuary Platinum Escrow
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                            {cardNumber.startsWith('4') ? 'VISA' : cardNumber.startsWith('5') ? 'MC' : 'AMEX'}
                          </span>
                        </div>
                        <div className="cp-num">{cardNumber || '••••  ••••  ••••  ••••'}</div>
                        <div className="cp-bot">
                          <div>
                            <div className="cp-lbl">Cardholder</div>
                            <div className="cp-val">{cardName || 'GUEST NAME'}</div>
                          </div>
                          <div>
                            <div className="cp-lbl">Expires</div>
                            <div className="cp-val">{cardExp || 'MM / YY'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bk-field">
                        <label className="bk-label">Card Number</label>
                        <input
                          className="bk-inp"
                          value={cardNumber}
                          onChange={(e) => handleCardInput(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="bk-2col">
                        <div className="bk-field">
                          <label className="bk-label">Cardholder Name</label>
                          <input
                            className="bk-inp"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          />
                        </div>
                        <div className="bk-field">
                          <label className="bk-label">Expiration (MM/YY)</label>
                          <input
                            className="bk-inp"
                            value={cardExp}
                            onChange={(e) => handleExpInput(e.target.value)}
                            placeholder="MM / YY"
                          />
                        </div>
                      </div>
                      <div className="bk-field">
                        <label className="bk-label">CVV Security Code</label>
                        <input
                          className="bk-inp"
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  )}

                  {/* Banking Tab */}
                  {payMethod === 'banking' && (
                    <div style={{ background: 'var(--d3)', border: '1px solid rgba(39,174,96,0.2)', padding: '1.4rem', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.5rem', color: 'var(--bank)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        🏛 Direct Escrow Settlement
                      </div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', color: '#fff', marginBottom: '0.6rem' }}>
                        Sanctuary Escrow Account
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.54rem', color: 'var(--muted)' }}>Available Balance</span>
                        <span style={{ fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif', color: 'var(--bank)' }}>
                          ${bpBalance.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                        <span style={{ fontSize: '0.54rem', color: 'var(--muted)' }}>Payment Amount</span>
                        <span style={{ fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif', color: '#fff' }}>
                          ${Math.round(finalTotal).toLocaleString()}
                        </span>
                      </div>
                      {bpBalance < finalTotal && (
                        <div style={{ color: '#e74c3c', fontSize: '0.46rem', marginTop: '0.5rem' }}>
                          ⚠️ Current balance is below payment amount. Deposit funds via the Banking Portal or use Credit Card.
                        </div>
                      )}
                    </div>
                  )}

                  {/* PayPal / Apple */}
                  {(payMethod === 'paypal' || payMethod === 'apple') && (
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--d3)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>
                        {payMethod === 'paypal' ? '🅿️' : '🍏'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.4rem' }}>
                        Authorize with {payMethod === 'paypal' ? 'PayPal Express' : 'Apple Pay'}
                      </div>
                      <p style={{ fontSize: '0.48rem', color: 'var(--muted)' }}>
                        Biometric authorization and tokenized AES-256 escrow hold will be generated upon confirmation.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Order Summary */}
                <div className="pay-sum">
                  <div className="pay-sum-t">Order Summary</div>
                  <div className="pay-srow">
                    <span className="l">{destName}</span>
                    <span className="v">${Math.round(rawPpNumber).toLocaleString()}/pp</span>
                  </div>
                  <div className="pay-srow">
                    <span className="l">Guests</span>
                    <span className="v">{guestCount}</span>
                  </div>
                  <div className="pay-srow">
                    <span className="l">Subtotal</span>
                    <span className="v">${Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="pay-srow">
                      <span className="l" style={{ color: '#7EC87A' }}>
                        Promo ({Math.round(promoDiscount * 100)}%)
                      </span>
                      <span className="v" style={{ color: '#7EC87A' }}>
                        -${Math.round(discountAmt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Price Breakdown in Summary */}
                  <div style={{ margin: '0.8rem 0', padding: '0.6rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.42rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Itemized Breakdown
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                      <span>🏨 Hotel / Villa</span>
                      <span style={{ color: '#fff' }}>${priceBreakdown.hotel.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                      <span>🚗 Chauffeur</span>
                      <span style={{ color: '#fff' }}>${priceBreakdown.transportation.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                      <span>🌿 Activities</span>
                      <span style={{ color: '#fff' }}>${priceBreakdown.activities.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                      <span>🛎️ Concierge</span>
                      <span style={{ color: '#fff' }}>${priceBreakdown.concierge.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: 'var(--muted)' }}>
                      <span>🏛️ Taxes &amp; Fees</span>
                      <span style={{ color: '#fff' }}>${priceBreakdown.taxes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pay-stot">
                    <span className="l">Total Escrow Hold</span>
                    <span className="v">${Math.round(finalTotal).toLocaleString()}</span>
                  </div>

                  <div style={{ fontSize: '0.46rem', color: 'var(--cream)', opacity: 0.8, margin: '0.4rem 0 0.8rem', textAlign: 'center' }}>
                    Hotel to be booked: <strong>{resolvedHotelName}</strong> ({resolvedHotelPhone})
                  </div>

                  <button
                    className="pay-now"
                    type="button"
                    onClick={() => {
                      if (payMethod === 'banking' && bpBalance < finalTotal) {
                        onShowToast('⚠️ Insufficient banking balance. Please choose another method.');
                        return;
                      }
                      completeBooking(payMethod === 'card' ? 'Credit Card' : payMethod === 'banking' ? 'Banking Escrow' : payMethod);
                    }}
                  >
                    Confirm &amp; Fund Escrow (${Math.round(finalTotal).toLocaleString()})
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem', fontSize: '0.42rem', color: 'rgba(255,255,255,0.4)' }}>
                    <span>🔒 AES-256 Escrow</span>
                    <span>✓ 100% Refundable</span>
                  </div>
                </div>
              </div>
            ) : (
              /* SPLIT PAYMENT MODE */
              <div>
                <div style={{ background: 'var(--d3)', padding: '1rem 1.2rem', borderRadius: '12px', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.54rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Each Guest Investment
                    </span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>
                      ${Math.round(finalTotal / guestCount).toLocaleString()}/guest
                    </span>
                  </div>
                  <div style={{ fontSize: '0.46rem', color: 'var(--muted)' }}>
                    Share payment links with your group. The retreat will automatically confirm as soon as all guest shares are funded.
                  </div>
                </div>

                {splitGuests.map((guest, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#141414',
                      border: `1px solid ${guest.paid ? 'rgba(90,158,82,0.4)' : 'rgba(201,168,76,0.2)'}`,
                      borderRadius: '12px',
                      padding: '1.1rem 1.2rem',
                      marginBottom: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#fff' }}>{guest.name}</span>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--gold)' }}>
                        ${Math.round(finalTotal / guestCount).toLocaleString()}
                      </span>
                    </div>

                    {guest.paid ? (
                      <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(90,158,82,0.08)', border: '1px solid rgba(90,158,82,0.2)', borderRadius: '6px', color: '#7EC87A', fontSize: '0.48rem' }}>
                        ✓ Paid via Escrow Hold
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                          <input
                            className="bk-inp"
                            style={{ margin: 0 }}
                            placeholder="Card Number (4242...)"
                          />
                          <input
                            className="bk-inp"
                            style={{ margin: 0, width: '90px' }}
                            placeholder="MM/YY"
                          />
                          <input
                            className="bk-inp"
                            style={{ margin: 0, width: '70px' }}
                            placeholder="CVV"
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="bk-next"
                            style={{ padding: '0.55rem', fontSize: '0.46rem' }}
                            onClick={() => handlePaySplitGuest(idx)}
                          >
                            Pay ${Math.round(finalTotal / guestCount).toLocaleString()} for {guest.name}
                          </button>
                          <button
                            type="button"
                            className="bk-back"
                            style={{ padding: '0.55rem', fontSize: '0.44rem' }}
                            onClick={() => onShowToast(`✉️ Invite & payment link dispatched to ${guest.name}`)}
                          >
                            ✉ Send Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Spinner Overlay */}
            {isProcessing && (
              <div className="pay-proc">
                <div className="pay-spin" />
                <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  Securing Escrow &amp; Generating Sanctuary Plan...
                </div>
              </div>
            )}

            <div className="bk-btns" style={{ marginTop: '1.4rem' }}>
              <button className="bk-back" onClick={() => setStep(3)} type="button">
                ← Back to Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && confirmedBooking && (
          <div className="bk-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🎉</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 200, color: '#fff', marginBottom: '0.3rem' }}>
              Retreat Reserved!
            </h2>
            <p style={{ fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
              Your sanctuary awaits. Dr. Kaimana Kahale will reach out within 24 hours to finalize your itinerary.
            </p>

            <div style={{ marginBottom: '1.4rem' }}>
              <div className="bk-plan-chip">{confirmedBooking.planId}</div>
            </div>

            <div style={{ background: 'var(--d3)', border: '1px solid rgba(201,168,76,0.14)', borderRadius: '12px', padding: '1.2rem', textAlign: 'left', maxWidth: '520px', margin: '0 auto 1.4rem' }}>
              <div className="bk-rrow">
                <span className="l">Destination</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{confirmedBooking.dest}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Dates</span>
                <span>{confirmedBooking.checkin} — {confirmedBooking.checkout} ({confirmedBooking.nights} Nights)</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Lead Guest</span>
                <span>{confirmedBooking.leadGuest}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Amount Funded</span>
                <span style={{ color: '#7EC87A', fontWeight: 600 }}>{confirmedBooking.amountPaid} via {confirmedBooking.paymentMethod}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Hotel Establishment</span>
                <span style={{ color: '#fff' }}>{confirmedBooking.hotelName}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Establishment Phone</span>
                <span style={{ color: 'var(--gold)' }}>{confirmedBooking.hotelPhone}</span>
              </div>
              <div className="bk-rrow">
                <span className="l">Concierge</span>
                <span style={{ color: 'var(--gold)' }}>{confirmedBooking.specialist} (Lomilomi Master)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '8px', padding: '0.7rem 1rem', fontSize: '0.52rem', color: 'var(--gold)', maxWidth: '520px', margin: '0 auto 1.4rem' }}>
              💌 Booking confirmation &amp; itinerary details sent to {confirmedBooking.email} · ✦ +500 loyalty points awarded
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              <button
                type="button"
                className="bk-next"
                style={{
                  background: 'linear-gradient(135deg, var(--gold), #A8803A)',
                  color: '#0a0a0a',
                  fontWeight: 700,
                  fontSize: '0.55rem',
                  padding: '0.85rem 1.6rem',
                  maxWidth: '320px',
                }}
                onClick={() => {
                  try {
                    generateItineraryPDF(confirmedBooking);
                    onShowToast('✓ Downloaded full retreat itinerary PDF!');
                  } catch (err) {
                    console.error(err);
                    onShowToast('Error generating PDF file.');
                  }
                }}
              >
                ⬇ Download Itinerary PDF
              </button>
            </div>

            <div className="bk-btns" style={{ justifyContent: 'center' }}>
              <button
                className="bk-next"
                style={{ maxWidth: '240px' }}
                onClick={() => {
                  onClose();
                  onOpenMyRetreats('bookings');
                }}
                type="button"
              >
                View in My Retreats →
              </button>
              <button
                className="bk-back"
                onClick={onClose}
                type="button"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
