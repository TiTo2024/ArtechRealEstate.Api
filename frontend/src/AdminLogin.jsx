import { useEffect, useState } from 'react';
import api from './Api/axiosInstance';

export default function AdminLogin({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/Auth/session')
      .then(({ data }) => onAuthenticated(data))
      .catch(() => setChecking(false));
  }, [onAuthenticated]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/Auth/login', { email, password });
      onAuthenticated(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return <main className="admin-login-page"><p className="admin-login-status">Checking session…</p></main>;
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand motion-fade-in" aria-label="Artech Real Estate">
        <a className="admin-login-home" href="/" aria-label="Return to the Artech website">
          <span>A</span>
          <strong>Artech Real Estate</strong>
        </a>
        <div>
          <p>Management workspace</p>
          <h1>Property decisions,<br />clearly managed.</h1>
        </div>
        <small>Authorized personnel only</small>
      </section>

      <section className="admin-login-panel motion-rise-in">
        <form onSubmit={submit}>
          <p className="eyebrow dark">Admin access</p>
          <h2>Welcome back</h2>
          <p className="admin-login-copy">Sign in to manage projects, units, and property media.</p>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@company.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p className="admin-login-error" role="alert">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
