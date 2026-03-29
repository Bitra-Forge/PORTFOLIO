import { useState } from 'react';
import { useAuth } from '../../context';
import Loader from '../Loader';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    </div>
  );
};

export default ProtectedRoute;
