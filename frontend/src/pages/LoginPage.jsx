import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { dashboardPathForRole } from "../lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const auth = await login(form);
      navigate(location.state?.from || dashboardPathForRole(auth.user.role), {
        replace: true
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to WORKNEST</h1>
        <p>
          Use your registered account to open the correct dashboard automatically after login.
        </p>
        <div className="info-callout compact">
          <strong>Admin demo</strong>
          <span>admin@worknest.com / Admin@123</span>
        </div>
      </section>

      <section className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field field-span">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field field-span">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          {location.state?.from ? (
            <div className="notice-banner subtle">
              Sign in first to open <strong>{location.state.from}</strong>.
            </div>
          ) : null}

          {error ? <div className="error-banner">{error}</div> : null}

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            <Link to="/register" className="secondary-button">
              Create account
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
