import React, { useState, useEffect, useCallback } from 'react';
import {
  TierType,
  User,
  Quote,
  Booking,
  WaitlistEntry,
  Transaction,
  Review,
  EmailNotification,
  Partner,
  StatePlace,
  CityDestination,
} from './types';
import {
  DESTINATIONS,
  STATES_DATA,
  INITIAL_USER,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_EMAILS,
  INITIAL_WAITLISTS,
  INITIAL_QUOTES,
  INITIAL_PARTNERS,
  BASE_PRICES,
} from './data/mockData';

import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DestinationGallery } from './components/DestinationGallery';
import { QuoteCalculator } from './components/QuoteCalculator';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

// Pages
import { ReviewsPage } from './components/pages/ReviewsPage';
import { PartnerPage } from './components/pages/PartnerPage';
import { AuthPage } from './components/pages/AuthPage';
import { AdminPage } from './components/pages/AdminPage';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingTutorialModal } from './components/modals/OnboardingTutorialModal';
import { CitySelectorModal } from './components/modals/CitySelectorModal';
import { MyRetreatsModal } from './components/modals/MyRetreatsModal';
import { BankingPortalModal } from './components/modals/BankingPortalModal';
import { BookingModal } from './components/modals/BookingModal';
import { WaitlistModal } from './components/modals/WaitlistModal';
import { EmailCenterModal } from './components/modals/EmailCenterModal';
import { AdminPortalModal } from './components/modals/AdminPortalModal';

export const App: React.FC = () => {
  // Page Navigation State ('home' | 'reviews' | 'partners' | 'admin')
  const [currentPage, setCurrentPage] = useState<'home' | 'reviews' | 'partners' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('review')) return 'reviews';
      if (hash.includes('partner')) return 'partners';
      if (hash.includes('admin')) return 'admin';
    }
    return 'home';
  });

  const navigateTo = useCallback((page: 'home' | 'reviews' | 'partners' | 'admin') => {
    setCurrentPage(page);
    if (page === 'reviews') {
      window.location.hash = '/reviews';
    } else if (page === 'partners') {
      window.location.hash = '/partners';
    } else if (page === 'admin') {
      window.location.hash = '/admin';
    } else {
      window.location.hash = '/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser back / forward navigation via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('review')) {
        setCurrentPage('reviews');
      } else if (hash.includes('partner')) {
        setCurrentPage('partners');
      } else if (hash.includes('admin')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global User State: null by default (unauthenticated gate - users must sign up/in first)
  const [user, setUser] = useState<User | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>(INITIAL_WAITLISTS);
  const [bpBalance, setBpBalance] = useState<number>(18450.0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [emails, setEmails] = useState<EmailNotification[]>(INITIAL_EMAILS);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);

  // Selected destination & City for Quote Calculator and Booking
  const [selectedDest, setSelectedDest] = useState<string>('Maui');
  const [selectedState, setSelectedState] = useState<StatePlace | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityDestination | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isMyRetreatsOpen, setIsMyRetreatsOpen] = useState(false);
  const [myRetreatsInitialTab, setMyRetreatsInitialTab] = useState<string>('quotes');
  const [isBankingOpen, setIsBankingOpen] = useState(false);
  const [isEmailCenterOpen, setIsEmailCenterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDest, setBookingDest] = useState<string>('Maui, Hawaii');
  const [bookingPrice, setBookingPrice] = useState<string>(`$${BASE_PRICES['Maui'] || 480}`);
  const [bookingHotel, setBookingHotel] = useState<string>('Four Seasons Resort Wailea');
  const [bookingPhone, setBookingPhone] = useState<string>('(808) 874-8000');
  const [bookingState, setBookingState] = useState<string>('Hawaii');
  const [bookingCity, setBookingCity] = useState<string>('Maui (Wailea)');

  // Waitlist Modal
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistDest, setWaitlistDest] = useState<string>('Maui, Hawaii');
  const [waitlistDate, setWaitlistDate] = useState<Date | null>(new Date('2026-05-14'));

  // Global Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isAdmin = fbUser.email?.toLowerCase() === 'jeremy.urpman@gocsps.com';
        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sanctuary Guest',
          email: fbUser.email || '',
          tier: 't2',
          role: isAdmin ? 'admin' : 'user',
          points: 500,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore bookings if available
  useEffect(() => {
    if (!db) return;
    try {
      const unsub = onSnapshot(collection(db, 'retreat_bookings'), (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Booking[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          // Merge with initial bookings without duplicate IDs
          setBookings((prev) => {
            const map = new Map<string, Booking>();
            prev.forEach((b) => map.set(b.id, b));
            loaded.forEach((b) => map.set(b.id, b));
            return Array.from(map.values());
          });
        }
      });
      return () => unsub();
    } catch (err) {
      console.warn('Firestore snapshot listener warning:', err);
    }
  }, []);

  // Compute dynamic average rating from all reviews
  const avgRatingStr = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.stars || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  // User-isolated content: users only see their own quotes, bookings, and waitlists
  const userBookings = React.useMemo(() => {
    if (!user) return [];
    return bookings.filter(
      (b) =>
        b.userId === user.uid ||
        (user.email && b.email?.toLowerCase() === user.email.toLowerCase())
    );
  }, [bookings, user]);

  const userQuotes = React.useMemo(() => {
    if (!user) return [];
    return quotes.filter(
      (q) =>
        q.userId === user.uid ||
        (user.email && q.userEmail?.toLowerCase() === user.email.toLowerCase())
    );
  }, [quotes, user]);

  const userWaitlists = React.useMemo(() => {
    if (!user) return [];
    return waitlists.filter(
      (w) => user.email && w.email?.toLowerCase() === user.email.toLowerCase()
    );
  }, [waitlists, user]);

  // Keyboard shortcut listener (Esc to close, Ctrl+Shift+A for Admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAuthOpen(false);
        setIsTutorialOpen(false);
        setIsCitySelectorOpen(false);
        setIsMyRetreatsOpen(false);
        setIsBankingOpen(false);
        setIsEmailCenterOpen(false);
        setIsAdminOpen(false);
        setIsBookingOpen(false);
        setIsWaitlistOpen(false);
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectStateForCalculation = (state: StatePlace) => {
    setSelectedState(state);
    const firstCity = state.cities[0];
    if (firstCity) {
      setSelectedCity(firstCity);
      setSelectedDest(firstCity.cityName);
      setBookingState(state.stateName);
      setBookingCity(firstCity.cityName);
      setBookingDest(`${firstCity.cityName}, ${state.stateName}`);
    }
    scrollToSection('calc-sec');
    showToast(`✦ ${state.stateName} selected. Pick your city and price point below.`);
  };

  const handleOpenBookingWithDetails = (details: {
    state: string;
    city: string;
    pricePoint: string;
    pricePerPerson: string;
  }) => {
    setBookingState(details.state);
    setBookingCity(details.city);
    setBookingDest(`${details.city}, ${details.state}`);
    setBookingPrice(details.pricePerPerson);
    setIsBookingOpen(true);
    showToast(`✦ Reserving ${details.city}, ${details.state} (${details.pricePoint})`);
  };

  const handleSelectCity = (city: CityDestination) => {
    setSelectedCity(city);
    setSelectedDest(city.cityName);
    setBookingDest(`${city.cityName}, ${city.stateName}`);
    setBookingHotel(city.hotelName);
    setBookingPhone(city.hotelPhone);
    setBookingState(city.stateName);
    setBookingCity(city.cityName);
    setBookingPrice(`$${city.basePrice}`);
    setIsCitySelectorOpen(false);
    setIsBookingOpen(true);
    showToast(`✦ Selected ${city.cityName}, ${city.stateName}`);
  };

  const handleOpenBooking = () => {
    const baseP = BASE_PRICES[selectedDest] || 480;
    setBookingDest(selectedDest);
    setBookingPrice(`$${baseP}`);
    setIsBookingOpen(true);
  };

  const handleSaveQuote = (quoteData: {
    dest: string;
    pp: string;
    tot: string;
    lux: string;
    dur: string;
    grp: string;
  }) => {
    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      dest: quoteData.dest,
      pp: quoteData.pp,
      tot: quoteData.tot,
      lux: quoteData.lux,
      dur: quoteData.dur,
      grp: quoteData.grp,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pts: 50,
      userId: user?.uid,
      userEmail: user?.email,
    };
    setQuotes((prev) => [newQuote, ...prev]);
    if (user) {
      setUser({ ...user, points: user.points + 50 });
    }
    showToast(`Quote saved for ${quoteData.dest}! +50 Sanctuary Loyalty Points earned.`);
  };

  const handleAddFunds = (amt: number) => {
    setBpBalance((prev) => prev + amt);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      desc: `Instant Account Deposit — Bank / Card Transfer`,
      date: 'Just now',
      amt,
      type: 'in',
      status: 'Cleared',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`$${amt.toLocaleString()} successfully deposited to your Sanctuary Escrow Account.`);
  };

  const handlePayRetreat = (amt: number) => {
    if (bpBalance < amt) {
      alert('Insufficient available escrow balance. Please add funds first.');
      return;
    }
    setBpBalance((prev) => prev - amt);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      desc: `Escrow Hold for Retreat Reservation`,
      date: 'Just now',
      amt,
      type: 'out',
      status: 'Escrow Secured',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`$${amt.toLocaleString()} securely held in Escrow.`);
  };

  const handleRedeemLoyalty = () => {
    if (!user || user.points < 100) {
      alert('You need at least 100 loyalty points to redeem.');
      return;
    }
    const cashValue = Math.floor(user.points / 100);
    const ptsRedeemed = cashValue * 100;
    setUser({ ...user, points: user.points - ptsRedeemed });
    setBpBalance((prev) => prev + cashValue);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      desc: `Loyalty Points Cash Redemption (${ptsRedeemed.toLocaleString()} pts)`,
      date: 'Just now',
      amt: cashValue,
      type: 'in',
      status: 'Credited',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Converted ${ptsRedeemed.toLocaleString()} points into $${cashValue} escrow credit!`);
  };

  const handleBookingComplete = (newBooking: Booking, amountNum: number, usedBanking: boolean) => {
    setBookings((prev) => [newBooking, ...prev]);
    if (usedBanking) {
      setBpBalance((prev) => Math.max(0, prev - amountNum));
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        desc: `Escrow Hold for Retreat Plan ${newBooking.planId}`,
        date: 'Just now',
        amt: amountNum,
        type: 'out',
        status: 'Escrow Secured',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
    showToast(`Retreat Confirmed! Confirmation Plan ID: ${newBooking.planId}`);
  };

  const handleUpdateBookingStatus = (bookingId: string, called: boolean) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, adminCalledAndBooked: called } : b))
    );
    showToast(`Booking ${bookingId} marked as ${called ? 'Hotel Called & Booked' : 'Pending Call'}.`);
  };

  const handleOpenWaitlistFromCalendar = (date: Date) => {
    setWaitlistDest(bookingDest);
    setWaitlistDate(date);
    setIsBookingOpen(false);
    setIsWaitlistOpen(true);
  };

  const handleJoinWaitlist = (newEntry: WaitlistEntry) => {
    setWaitlists((prev) => [newEntry, ...prev]);
    showToast(`Waitlist confirmed for ${newEntry.dest}! You are in Position #${newEntry.position}.`);
  };

  const handleAddReview = async (newRev: Review) => {
    setReviews((prev) => [newRev, ...prev]);
    if (user) {
      setUser({ ...user, points: user.points + 100 });
    }
    if (db) {
      try {
        await setDoc(doc(db, 'reviews', newRev.id), {
          ...newRev,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore review notice:', err);
      }
    }
    showToast(`Verified review posted! Average rating updated to ${(
      ([...reviews, newRev].reduce((acc, r) => acc + (r.stars || 5), 0) / (reviews.length + 1)).toFixed(1)
    )}★`);
  };

  const handleHelpfulReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  const handleAddPartner = (newPartner: Partner) => {
    setPartners((prev) => [newPartner, ...prev]);
    const monthlyFee = newPartner.plan === 'yearly' ? 500 : 50;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      desc: `Partner Portal Subscription — ${newPartner.name} (${newPartner.plan})`,
      date: 'Just now',
      amt: monthlyFee,
      type: 'in',
      status: 'Credited',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Partner profile published! Welcome to the Sanctuary Healer Network.`);
  };

  const handleSignOut = async () => {
    if (auth) {
      try {
        await auth.signOut();
      } catch (e) {
        console.warn('Signout notice:', e);
      }
    }
    setUser(null);
    showToast('Signed out of Sanctuary.');
  };

  // User Gate: Users must sign up / sign in before getting access to the site
  if (!user) {
    return (
      <div className="sanctuary-app">
        <AuthPage
          onAuthSuccess={(authedUser) => {
            setUser(authedUser);
            // Automatically launch tutorial to run them through how to book and how it works
            setIsTutorialOpen(true);
            showToast(`Welcome to Sanctuary, ${authedUser.name}! Welcome to the guided tutorial.`);
          }}
        />

        {/* Guided Tutorial Modal */}
        <OnboardingTutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
          onExploreDestinations={() => {
            setIsTutorialOpen(false);
            if (currentPage !== 'home') {
              navigateTo('home');
              setTimeout(() => scrollToSection('dest-sec'), 100);
            } else {
              scrollToSection('dest-sec');
            }
          }}
        />

        {toastMsg && <div className="toast show">{toastMsg}</div>}
      </div>
    );
  }

  return (
    <div className="sanctuary-app">
      {/* Navigation Header */}
      <Navbar
        user={user}
        currentPage={currentPage}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onNavigate={navigateTo}
        onOpenAdminPortal={() => navigateTo('admin')}
        onOpenMyRetreats={(initialTab?: string) => {
          setMyRetreatsInitialTab(initialTab || 'quotes');
          setIsMyRetreatsOpen(true);
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* DEDICATED SEPARATE PAGES */}
      {currentPage === 'home' && (
        <main>
          {/* Main Hero Banner with Transitions & Dynamic Avg Rating */}
          <Hero
            onExplore={() => scrollToSection('dest-sec')}
            avgRating={avgRatingStr}
            onOpenReviews={() => navigateTo('reviews')}
          />

          {/* 100% Legal vs Medical Marijuana States Directory */}
          <DestinationGallery
            onSelectCity={handleSelectCity}
            onSelectState={handleSelectStateForCalculation}
            onOpenStateModal={(state) => {
              setSelectedState(state);
              setIsCitySelectorOpen(true);
            }}
          />

          {/* Interactive Quote Studio Calculator */}
          <QuoteCalculator
            destinations={DESTINATIONS}
            curTier="free"
            user={user}
            selectedDestName={selectedDest}
            selectedStateName={selectedState?.stateName || 'Arizona'}
            selectedCityName={selectedCity?.cityName || 'Sedona'}
            onSelectDestName={(name) => setSelectedDest(name)}
            onSelectStateAndCity={(sName, cName) => {
              const matchState = STATES_DATA.find((s) => s.stateName === sName);
              if (matchState) {
                setSelectedState(matchState);
                const matchCity = matchState.cities.find((c) => c.cityName === cName);
                if (matchCity) setSelectedCity(matchCity);
              }
            }}
            onSaveQuote={handleSaveQuote}
            onOpenBooking={handleOpenBooking}
            onOpenBookingWithDetails={handleOpenBookingWithDetails}
            onSetTier={() => {}}
          />
        </main>
      )}

      {currentPage === 'reviews' && (
        <ReviewsPage
          reviews={reviews}
          destinations={DESTINATIONS}
          user={user}
          onNavigateHome={() => navigateTo('home')}
          onAddReview={handleAddReview}
          onHelpful={handleHelpfulReview}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {currentPage === 'partners' && (
        <PartnerPage
          partners={partners}
          user={user}
          onNavigateHome={() => navigateTo('home')}
          onAddPartner={handleAddPartner}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {currentPage === 'admin' && (
        <AdminPage
          user={user}
          bookings={bookings}
          waitlists={waitlists}
          transactions={transactions}
          onNavigateHome={() => navigateTo('home')}
          onOpenFinance={() => setIsBankingOpen(true)}
          onUpdateBookingStatus={handleUpdateBookingStatus}
        />
      )}

      {/* Footer on all pages for seamless site-wide navigation */}
      <Footer
        onScrollTo={(id) => {
          if (currentPage !== 'home') {
            navigateTo('home');
            setTimeout(() => scrollToSection(id), 100);
          } else {
            scrollToSection(id);
          }
        }}
        onNavigate={navigateTo}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenAdmin={() => {
          if (user?.role === 'admin' || user?.email?.toLowerCase() === 'jeremy.urpman@gocsps.com') {
            navigateTo('admin');
          } else {
            showToast('Admin login required (Jeremy.urpman@gocsps.com)');
          }
        }}
      />

      {/* Floating Concierge Chat Widget */}
      <ChatWidget />

      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="toast show">
          {toastMsg}
        </div>
      )}

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authedUser, isNewSignup) => {
          setUser(authedUser);
          setIsAuthOpen(false);
          if (isNewSignup) {
            setIsTutorialOpen(true);
          }
          showToast(`Welcome to Sanctuary, ${authedUser.name}!`);
        }}
      />

      <OnboardingTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onExploreDestinations={() => {
          setIsTutorialOpen(false);
          if (currentPage !== 'home') {
            navigateTo('home');
            setTimeout(() => scrollToSection('dest-sec'), 100);
          } else {
            scrollToSection('dest-sec');
          }
        }}
      />

      <CitySelectorModal
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        statePlace={selectedState}
        onSelectCity={handleSelectCity}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        waitlists={waitlists}
        transactions={transactions}
        onOpenFinance={() => {
          setIsAdminOpen(false);
          setIsBankingOpen(true);
        }}
        onUpdateBookingStatus={handleUpdateBookingStatus}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        destName={bookingDest}
        perPersonPrice={bookingPrice}
        hotelName={bookingHotel}
        hotelPhone={bookingPhone}
        stateName={bookingState}
        cityName={bookingCity}
        user={user}
        bpBalance={bpBalance}
        onBookingComplete={handleBookingComplete}
        onOpenWaitlist={handleOpenWaitlistFromCalendar}
        onOpenMyRetreats={(tab?: string) => {
          setIsBookingOpen(false);
          setMyRetreatsInitialTab(tab || 'quotes');
          setIsMyRetreatsOpen(true);
        }}
        onShowToast={showToast}
      />

      <MyRetreatsModal
        isOpen={isMyRetreatsOpen}
        onClose={() => setIsMyRetreatsOpen(false)}
        initialTab={myRetreatsInitialTab}
        user={user}
        quotes={userQuotes}
        bookings={userBookings}
        waitlists={userWaitlists}
        bpBalance={bpBalance}
        onLoadQuote={(dest) => {
          setSelectedDest(dest);
          setIsMyRetreatsOpen(false);
          if (currentPage !== 'home') {
            navigateTo('home');
            setTimeout(() => scrollToSection('calc-sec'), 100);
          } else {
            scrollToSection('calc-sec');
          }
        }}
        onDeleteQuote={(id) => setQuotes((prev) => prev.filter((q) => q.id !== id))}
        onOpenBanking={() => {
          setIsMyRetreatsOpen(false);
          setIsBankingOpen(true);
        }}
        onOpenReviews={() => {
          setIsMyRetreatsOpen(false);
          navigateTo('reviews');
        }}
        onShowToast={showToast}
      />

      <BankingPortalModal
        isOpen={isBankingOpen}
        onClose={() => setIsBankingOpen(false)}
        user={user}
        balance={bpBalance}
        transactions={transactions}
        onAddFunds={handleAddFunds}
        onPayRetreat={handlePayRetreat}
        onRedeemLoyalty={handleRedeemLoyalty}
        onShowToast={showToast}
      />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        selectedDate={waitlistDate}
        destName={waitlistDest}
        onJoinWaitlist={handleJoinWaitlist}
        onOpenMyRetreats={(tab?: string) => {
          setIsWaitlistOpen(false);
          setMyRetreatsInitialTab(tab || 'waitlist');
          setIsMyRetreatsOpen(true);
        }}
      />

      <EmailCenterModal
        isOpen={isEmailCenterOpen}
        onClose={() => setIsEmailCenterOpen(false)}
        emails={emails}
        onSendEmail={(newEm) => setEmails((prev) => [newEm, ...prev])}
      />
    </div>
  );
};
