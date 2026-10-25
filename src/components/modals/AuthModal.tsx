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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, isNewSignup: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest',
        email: firebaseUser.email || '',
        tier: isAdmin ? 't2' : 'free',
        role: isAdmin ? 'admin' : 'user',
        points: 500,
      };

      // Save/update user profile in Firestore
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: userObj.email,
          displayName: userObj.name,
          role: userObj.role,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }

      onAuthSuccess(userObj, isSignup);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

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

        try {
          await setDoc(doc(db, 'users', 'admin-jeremy'), {
            email: adminUser.email,
            displayName: adminUser.name,
            role: 'admin',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'users/admin-jeremy');
        }

        onAuthSuccess(adminUser, false);
        onClose();
        return;
      }

      let userObj: User;

      if (isSignup) {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(res.user, { displayName: name.trim() });
        }
        userObj = {
          uid: res.user.uid,
          name: name.trim() || email.split('@')[0],
          email: res.user.email || email.trim(),
          tier: 'free',
          role: 'user',
          points: 500,
        };

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

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setIsSignup(false);
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  };

  return (
    <div id="auth-modal" className="portal show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}>
      <div className="gp-box" style={{ maxWidth: '440px', padding: '2rem', borderRadius: '24px', background: '#141414', border: '1px solid rgba(201,168,76,0.3)', position: 'relative' }}>
        <button
          onClick={onClose}
          type="button"
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1rem', cursor: 'pointer' }}
        >
          &#x2715;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
          <div className="gp-logo">Sanctuary</div>
          <div style={{ fontSize: '0.44rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {isSignup ? 'Create Your Account & Begin Tutorial' : 'Welcome Back & Sign In'}
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', padding: '0.25rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.03)' }}>
          <button
            type="button"
            onClick={() => { setIsSignup(false); setError(null); }}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '999px',
              border: 'none',
              background: !isSignup ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(139,196,192,0.12))' : 'transparent',
              color: !isSignup ? '#fff' : 'var(--muted)',
              fontSize: '0.48rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignup(true); setError(null); }}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '999px',
              border: 'none',
              background: isSignup ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(139,196,192,0.12))' : 'transparent',
              color: isSignup ? '#fff' : 'var(--muted)',
              fontSize: '0.48rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.75rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '0.52rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1rem' }}>&#127760;</span> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '0.8rem 0 1rem', opacity: 0.4 }}>
          <div style={{ flex: 1, height: '1px', background: '#fff' }} />
          <span style={{ fontSize: '0.42rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>or email</span>
          <div style={{ flex: 1, height: '1px', background: '#fff' }} />
        </div>

        {error && (
          <div style={{ color: '#e74c3c', fontSize: '0.52rem', marginBottom: '0.8rem', padding: '0.4rem', background: 'rgba(231,76,60,0.1)', borderRadius: '6px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth}>
          {isSignup && (
            <div style={{ marginBottom: '0.7rem' }}>
              <label className="clbl">Full Name</label>
              <input
                type="text"
                required
                className="bk-inp"
                placeholder="e.g. Jeremy Urpman"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: '0.7rem' }}>
            <label className="clbl">Email Address</label>
            <input
              type="email"
              required
              className="bk-inp"
              placeholder="e.g. Jeremy.urpman@gocsps.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="clbl">Password</label>
            <input
              type="password"
              required
              className="bk-inp"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bk-next"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Authenticating...' : isSignup ? 'Sign Up & Start Tutorial \u2192' : 'Sign In to Sanctuary \u2192'}
          </button>
        </form>

        {/* Quick Admin Login helper */}
        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillAdminCredentials}
            style={{
              background: 'transparent',
              border: '1px dashed rgba(224,85,85,0.4)',
              color: '#e05555',
              fontSize: '0.44rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              cursor: 'pointer',
            }}
          >
            &#128737; Fill Admin Login (Jeremy.urpman@gocsps.com)
          </button>
        </div>
      </div>
    </div>
  );
};
