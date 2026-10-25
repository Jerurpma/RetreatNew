import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../../firebase';
import { User } from '../../types';
import { ADMIN_CREDENTIALS } from '../../data/mockData';

interface AuthPageProps {
  onAuthSuccess: (user: User, isNewSignup: boolean) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(true); // Default to Sign Up for new visitors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fast fill for Admin login test
  const handleFillAdmin = () => {
    setIsSignup(false);
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await signInWithPopup(auth, googleProvider);
      const firebaseUser = res.user;

      const isAdmin =
        firebaseUser.email?.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();

      const userObj: User = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Sanctuary Guest',
        email: firebaseUser.email || '',
        tier: isAdmin ? 't2' : 'free',
        role: isAdmin ? 'admin' : 'user',
        points: 500,
      };

      if (db) {
        try {
          await setDoc(
            doc(db, 'users', firebaseUser.uid),
            {
              email: userObj.email,
              displayName: userObj.name,
              role: userObj.role,
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      }

      onAuthSuccess(userObj, true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google authentication could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check admin credentials
      const isAdminLogin =
        email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === ADMIN_CREDENTIALS.password;

      if (isAdminLogin) {
        const adminUser: User = {
          uid: 'admin-jeremy',
          name: ADMIN_CREDENTIALS.displayName,
          email: ADMIN_CREDENTIALS.email,
          tier: 't2',
          role: 'admin',
          points: 5000,
        };

        if (db) {
          try {
            await setDoc(
              doc(db, 'users', 'admin-jeremy'),
              {
                email: adminUser.email,
                displayName: adminUser.name,
                role: 'admin',
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'users/admin-jeremy');
          }
        }

        onAuthSuccess(adminUser, false);
        return;
      }

      let userObj: User;

      if (isSignup) {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(res.user, { displayName: name.trim() });

        userObj = {
          uid: res.user.uid,
          name: name.trim(),
          email: res.user.email || email.trim(),
          tier: 'free',
          role: 'user',
          points: 500,
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', res.user.uid), {
              email: userObj.email,
              displayName: userObj.name,
              role: 'user',
              createdAt: new Date().toISOString(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${res.user.uid}`);
          }
        }

        onAuthSuccess(userObj, true);
      } else {
        const res = await signInWithEmailAndPassword(auth, email.trim(), password);
        const isAdmin = res.user.email?.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();

        userObj = {
          uid: res.user.uid,
          name: res.user.displayName || email.split('@')[0],
          email: res.user.email || email.trim(),
          tier: isAdmin ? 't2' : 'free',
          role: isAdmin ? 'admin' : 'user',
          points: 500,
        };

        onAuthSuccess(userObj, false);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || '';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Please verify your credentials or sign up.');
      } else if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please click "Sign In" above.');
      } else if (msg.includes('weak-password')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg || 'Authentication could not be completed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, #161a18 0%, #080808 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(12px)',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.9rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#fff',
              fontWeight: 300,
            }}
          >
            Sanctuary
          </span>
          <span
            style={{
              fontSize: '0.45rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              borderLeft: '1px solid rgba(201,168,76,0.3)',
              paddingLeft: '0.8rem',
            }}
          >
            Sacred Plant Medicine &amp; Luxury Retreats &middot; 18+
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.44rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(139,196,192,0.3)',
              color: 'var(--teal)',
              background: 'rgba(139,196,192,0.06)',
            }}
          >
            &#128737; 100% Legal &amp; Medical Reciprocity
          </span>
          <span
            style={{
              fontSize: '0.44rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(201,168,76,0.4)',
              color: 'var(--gold)',
              background: 'rgba(201,168,76,0.08)',
            }}
          >
            Members Portal Access
          </span>
        </div>
      </header>

      {/* Main Content: Split Hero Banner & Auth Card */}
      <div
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Left Column: Sanctuary Introduction & What Awaits */}
        <div>
          <div
            style={{
              fontSize: '0.48rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.9rem',
              fontWeight: 600,
            }}
          >
            &#10022; Step Through The Veil
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              lineHeight: '1.1',
              fontWeight: 200,
              color: '#fff',
              margin: '0 0 1.4rem',
            }}
          >
            Where Healing Becomes <em>Ritual</em>.
          </h1>

          <p
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.85',
              marginBottom: '2rem',
              maxWidth: '520px',
            }}
          >
            Sign up below to access our curated collection of verified cannabis-friendly retreats.
            Once you register, our interactive guided tutorial will walk you through picking your
            state and city, reviewing transparent itemized prices, and how our concierge team
            personally calls and confirms your luxury hotel booking.
          </p>

          {/* Pillars List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: '490px' }}>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '1rem 1.2rem',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: '#7EC87A' }}>&#127807;</span>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
                  100% Legal &amp; Medical Jurisdictions
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                  Every destination clearly displays whether it is 100% legal adult-use or requires a medical card, with 38-state reciprocity support.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '1rem 1.2rem',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>&#127961;</span>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
                  Pick Any US State &amp; City
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                  Select from Arizona (Sedona, Scottsdale), California (Palm Springs, Big Sur), Hawaii (Wailea), Nevada, and Colorado with verified 5-star hotel partners.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '1rem 1.2rem',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: 'var(--teal)' }}>&#128222;</span>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
                  Personal Concierge Fulfillment
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                  Once you reserve, our admin team calls the establishment telephone number directly to lock in your suite, private transfers, and curated plant rituals.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Authentication Box */}
        <div
          style={{
            background: 'linear-gradient(145deg, #161616, #0d0d0d)',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: '26px',
            padding: '2.4rem',
            boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.08)',
            position: 'relative',
          }}
        >
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
            <div
              style={{
                fontSize: '0.45rem',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.4rem',
                fontWeight: 600,
              }}
            >
              Member Registration &middot; Sanctuary Portal
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '2rem',
                color: '#fff',
                fontWeight: 300,
                margin: 0,
              }}
            >
              {isSignup ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
              {isSignup
                ? 'Sign up to unlock all retreats and begin the guided walkthrough.'
                : 'Sign in to access your retreats, escrow balances, and bookings.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: '999px',
              padding: '0.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '999px',
                border: 'none',
                background: isSignup
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.35), rgba(139,196,192,0.2))'
                  : 'transparent',
                color: isSignup ? '#fff' : 'var(--muted)',
                fontSize: '0.52rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '999px',
                border: 'none',
                background: !isSignup
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.35), rgba(139,196,192,0.2))'
                  : 'transparent',
                color: !isSignup ? '#fff' : 'var(--muted)',
                fontSize: '0.52rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              padding: '0.85rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '0.54rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: '1.2rem',
              transition: 'background 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>&#127760;</span> Continue with Google
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              margin: '1.2rem 0',
              opacity: 0.35,
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#fff' }} />
            <span style={{ fontSize: '0.44rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', background: '#fff' }} />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: '#ff6b6b',
                background: 'rgba(255,107,107,0.12)',
                border: '1px solid rgba(255,107,107,0.3)',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                fontSize: '0.54rem',
                marginBottom: '1.2rem',
                lineHeight: '1.5',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth}>
            {isSignup && (
              <div style={{ marginBottom: '1rem' }}>
                <label className="clbl" style={{ fontSize: '0.46rem', letterSpacing: '0.14em' }}>
                  Full Legal Name (18+)
                </label>
                <input
                  type="text"
                  required
                  className="bk-inp"
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ fontSize: '0.65rem' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label className="clbl" style={{ fontSize: '0.46rem', letterSpacing: '0.14em' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="bk-inp"
                placeholder="e.g. maya@sanctuary.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontSize: '0.65rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="clbl" style={{ fontSize: '0.46rem', letterSpacing: '0.14em' }}>
                  Password
                </label>
                {!isSignup && (
                  <span
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    style={{
                      fontSize: '0.44rem',
                      color: 'var(--gold)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Forgot?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                className="bk-inp"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize: '0.65rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bk-next"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '0.56rem',
                letterSpacing: '0.16em',
                fontWeight: 700,
              }}
            >
              {loading
                ? 'Processing...'
                : isSignup
                ? 'Sign Up & Launch Tutorial \u2192'
                : 'Sign In to Sanctuary \u2192'}
            </button>
          </form>

          {/* Quick Admin Credential Button */}
          <div
            style={{
              marginTop: '1.6rem',
              paddingTop: '1.2rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <div style={{ fontSize: '0.42rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Admin Fulfillment Access
            </div>
            <button
              type="button"
              onClick={handleFillAdmin}
              style={{
                background: 'rgba(224,85,85,0.08)',
                border: '1px dashed rgba(224,85,85,0.4)',
                color: '#ff7b7b',
                fontSize: '0.46rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>&#128737;</span> Auto-Fill Admin Login ({ADMIN_CREDENTIALS.email})
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Footer Note */}
      <footer
        style={{
          padding: '1.4rem 2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          fontSize: '0.48rem',
          color: 'var(--muted)',
        }}
      >
        Sanctuary Concierge &middot; Strict 18+ Adult-Use Compliance &middot; Protected with AES-256 Escrow Vaulting
      </footer>
    </div>
  );
};
