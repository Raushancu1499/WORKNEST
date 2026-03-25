import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { NON_ADMIN_ROLES, SERVICE_CATEGORIES } from "../lib/constants";
import { dashboardPathForRole, formatEnumLabel } from "../lib/utils";

const roleCopy = {
  CUSTOMER: "Create and track home service bookings.",
  WORKER: "List your skills and receive matched labour and service jobs.",
  CONTRACTOR: "Set up your business profile and post construction crew requests."
};

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  city: "",
  role: "CUSTOMER",
  skills: [],
  experienceYears: "",
  preferredLocation: "",
  availability: "Weekdays",
  companyName: "",
  businessFocus: ""
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleSkill(skill) {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill]
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (form.role === "WORKER" && form.skills.length === 0) {
      setSubmitting(false);
      setError("Select at least one skill for the worker profile.");
      return;
    }

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        role: form.role,
        ...(form.role === "WORKER"
          ? {
              skills: form.skills,
              experienceYears: Number(form.experienceYears),
              preferredLocation: form.preferredLocation || form.city,
              availability: form.availability
            }
          : {}),
        ...(form.role === "CONTRACTOR"
          ? {
              companyName: form.companyName,
              businessFocus: form.businessFocus
            }
          : {})
      };

      const auth = await register(payload);
      navigate(dashboardPathForRole(auth.user.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to create the account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <span className="eyebrow">New account</span>
        <h1>Create your WORKNEST profile</h1>
        <p>{roleCopy[form.role]}</p>
      </section>

      <section className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-role">Role</label>
            <select
              id="register-role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              {NON_ADMIN_ROLES.map((role) => (
                <option key={role} value={role}>
                  {formatEnumLabel(role)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-phone">Phone</label>
            <input
              id="register-phone"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="Primary contact number"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="register-city">City</label>
            <input
              id="register-city"
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              placeholder="Your base city"
              required
            />
          </div>

          {form.role === "WORKER" ? (
            <>
              <div className="field field-span">
                <label>Skills</label>
                <div className="checkbox-grid">
                  {SERVICE_CATEGORIES.map((skill) => (
                    <label key={skill} className="checkbox-pill">
                      <input
                        type="checkbox"
                        checked={form.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />
                      <span>{formatEnumLabel(skill)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="worker-experience">Experience (years)</label>
                <input
                  id="worker-experience"
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={(event) => setForm({ ...form, experienceYears: event.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="worker-location">Preferred location</label>
                <input
                  id="worker-location"
                  value={form.preferredLocation}
                  onChange={(event) => setForm({ ...form, preferredLocation: event.target.value })}
                  placeholder="Defaults to your city"
                  required
                />
              </div>

              <div className="field field-span">
                <label htmlFor="worker-availability">Availability</label>
                <input
                  id="worker-availability"
                  value={form.availability}
                  onChange={(event) => setForm({ ...form, availability: event.target.value })}
                  placeholder="Weekdays, weekends, evenings..."
                  required
                />
              </div>
            </>
          ) : null}

          {form.role === "CONTRACTOR" ? (
            <>
              <div className="field">
                <label htmlFor="contractor-company">Company name</label>
                <input
                  id="contractor-company"
                  value={form.companyName}
                  onChange={(event) => setForm({ ...form, companyName: event.target.value })}
                  placeholder="Your business name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="contractor-focus">Business focus</label>
                <input
                  id="contractor-focus"
                  value={form.businessFocus}
                  onChange={(event) => setForm({ ...form, businessFocus: event.target.value })}
                  placeholder="Residential interiors, civil works..."
                  required
                />
              </div>
            </>
          ) : null}

          {error ? <div className="error-banner">{error}</div> : null}

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </button>
            <Link to="/login" className="secondary-button">
              I already have an account
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
