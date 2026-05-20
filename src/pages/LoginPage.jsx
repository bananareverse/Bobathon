import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeOffIcon, SunIcon, MoonIcon } from '../components/Icons';

function getErrorMessage(err) {
  const msg = (err?.message || '').toLowerCase();
  if (msg.includes('invalid login') || msg.includes('invalid credentials'))
    return 'Invalid email or password.';
  if (msg.includes('email not confirmed'))
    return 'Please confirm your email address first. Check your inbox.';
  if (msg.includes('user already registered'))
    return 'This email is already registered — try signing in instead.';
  if (msg.includes('password should be') || msg.includes('weak password'))
    return 'Password must be at least 6 characters.';
  return err?.message || 'Something went wrong. Please try again.';
}

function LoginPage({ isDark, onToggleDark }) {
  const { signIn, signUp } = useAuth();

  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSuccess('Account created! Check your inbox to confirm your email, then sign in.');
        setMode('signin');
      } else {
        await signIn(email, password);
        // Auth state change in useAuth triggers re-render → app shows chat
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`app-root${isDark ? ' dark' : ''}`}>
      <div className="login-page">
        {/* Dark mode toggle (top right) */}
        <button
          onClick={onToggleDark}
          className="login-theme-btn"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </button>

        <div className="login-card">
          {/* Logo */}
          <div className="login-logo-wrap">
            <div className="login-logo">
              <span>IBM</span>
            </div>
          </div>

          {/* Title */}
          <div className="login-header">
            <h1 className="login-title">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="login-subtitle">
              {mode === 'signin'
                ? 'Sign in to your IBM Consulting AI account'
                : 'Join the Bob-a-thon AI assistant'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@ibm.com"
                disabled={loading}
                autoComplete="email"
                className="login-input"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="login-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="login-pw-toggle"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="login-error">{error}</p>}
            {/* Success */}
            {success && <p className="login-success">{success}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading
                ? <span className="login-spinner" />
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="login-toggle">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
              className="login-toggle-btn"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>

          <p className="login-footer">
            Bob-a-thon 2025 · IBM Consulting Internal Hackathon
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
