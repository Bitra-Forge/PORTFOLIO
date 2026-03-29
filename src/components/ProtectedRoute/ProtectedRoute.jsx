import { useState } from 'react';
import { useAuth } from '../../context';
import Loader from '../Loader';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading, signIn, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'magic'

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setError(error.message || 'Failed to send magic link');
    } else {
      setMessage('Check your email for the login link!');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return (
      <div className="protected-authenticated">
        {children}
      </div>
    );
  }

  return (
    <div className="protected-container glass animate-slide-up">
      <h2 className="protected-title">Team Access</h2>
      <p className="protected-description">
        This area is restricted to BitraForge team members.
      </p>

      {error && <p className="protected-error">{error}</p>}
      {message && <p className="protected-success">{message}</p>}

      <div className="protected-tabs">
        <button
          type="button"
          className={`protected-tab ${authMode === 'password' ? 'active' : ''}`}
          onClick={() => setAuthMode('password')}
        >
          Password
        </button>
        <button
          type="button"
          className={`protected-tab ${authMode === 'magic' ? 'active' : ''}`}
          onClick={() => setAuthMode('magic')}
        >
          Magic Link
        </button>
      </div>

      {authMode === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="protected-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="protected-input"
            aria-label="Email"
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="protected-input"
            aria-label="Password"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="protected-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Enter Portal'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLinkLogin} className="protected-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="protected-input"
            aria-label="Email"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="protected-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProtectedRoute;
