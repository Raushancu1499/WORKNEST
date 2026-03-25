import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/constants";
import {
  constructionStatusActions,
  formatCurrency,
  formatDate,
  formatEnumLabel,
  nextWeekString,
  todayString
} from "../lib/utils";

export default function ContractorDashboard() {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState(SERVICE_CATEGORIES);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    workType: SERVICE_CATEGORIES[0],
    workersRequired: "4",
    startDate: todayString(),
    endDate: nextWeekString(),
    location: user?.city || "",
    dailyWage: "750",
    description: ""
  });

  useEffect(() => {
    if (user?.city) {
      setForm((current) => ({
        ...current,
        location: current.location || user.city
      }));
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      api.serviceCategories(token).catch(() => SERVICE_CATEGORIES),
      api.contractorProfile(token),
      api.contractorJobs(token)
    ])
      .then(([resolvedCategories, resolvedProfile, resolvedJobs]) => {
        if (!active) {
          return;
        }

        setCategories(resolvedCategories?.length ? resolvedCategories : SERVICE_CATEGORIES);
        setProfile(resolvedProfile);
        setJobs(resolvedJobs);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load the contractor dashboard.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleCreateJob(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        workType: form.workType,
        workersRequired: Number(form.workersRequired),
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        dailyWage: Number(form.dailyWage),
        description: form.description
      };

      const createdJob = await api.createConstructionJob(payload, token);
      setJobs((current) => [createdJob, ...current]);
      setForm((current) => ({
        ...current,
        startDate: todayString(),
        endDate: nextWeekString(),
        description: ""
      }));
      setMessage("Construction job posted.");
    } catch (requestError) {
      setError(requestError.message || "Unable to create the construction job.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStatus(jobId, status) {
    const nextActionKey = `${jobId}-${status}`;
    setActionKey(nextActionKey);
    setError("");
    setMessage("");

    try {
      const updatedJob = await api.updateConstructionJobStatus(jobId, status, token);
      setJobs((current) => current.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setMessage(`Construction job marked as ${formatEnumLabel(status)}.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update the construction job.");
    } finally {
      setActionKey("");
    }
  }

  const metrics = [
    {
      label: "Posted jobs",
      value: jobs.length
    },
    {
      label: "Open or filling",
      value: jobs.filter((job) => job.status === "OPEN" || job.status === "PARTIALLY_FILLED").length
    },
    {
      label: "Filled",
      value: jobs.filter((job) => job.status === "FILLED").length
    },
    {
      label: "Completed",
      value: jobs.filter((job) => job.status === "COMPLETED").length
    }
  ];

  return (
    <div className="page-stack">
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow">Contractor dashboard</span>
          <h1>Post labour demand and monitor your active sites.</h1>
          <p>Track fill rate, assigned workers, and status transitions for each construction job.</p>
        </div>
      </section>

      <InfoGrid items={metrics} />

      {error ? <div className="error-banner">{error}</div> : null}
      {message ? <div className="success-banner">{message}</div> : null}

      <div className="dashboard-grid">
        <SectionCard title="Contractor profile" subtitle="Business details loaded from registration.">
          {loading ? (
            <div className="empty-state">Loading contractor profile...</div>
          ) : profile ? (
            <div className="detail-grid profile-grid">
              <div>
                <span>Company</span>
                <strong>{profile.companyName || "Not provided"}</strong>
              </div>
              <div>
                <span>Focus</span>
                <strong>{profile.businessFocus || "Not provided"}</strong>
              </div>
              <div>
                <span>Primary contact</span>
                <strong>{profile.user?.fullName || "Unknown"}</strong>
              </div>
              <div>
                <span>City</span>
                <strong>{profile.user?.city || "Unknown"}</strong>
              </div>
            </div>
          ) : (
            <div className="empty-state">No contractor profile was returned.</div>
          )}
        </SectionCard>

        <SectionCard
          title="Post a construction job"
          subtitle="Create a new requirement for crews, wages, dates, and site details."
        >
          <form className="form-grid" onSubmit={handleCreateJob}>
            <div className="field">
              <label htmlFor="job-type">Work type</label>
              <select
                id="job-type"
                value={form.workType}
                onChange={(event) => setForm({ ...form, workType: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatEnumLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="job-workers">Workers required</label>
              <input
                id="job-workers"
                type="number"
                min="1"
                value={form.workersRequired}
                onChange={(event) => setForm({ ...form, workersRequired: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="job-start">Start date</label>
              <input
                id="job-start"
                type="date"
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                min={todayString()}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="job-end">End date</label>
              <input
                id="job-end"
                type="date"
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                min={form.startDate}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="job-location">Location</label>
              <input
                id="job-location"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="job-wage">Daily wage</label>
              <input
                id="job-wage"
                type="number"
                min="1"
                value={form.dailyWage}
                onChange={(event) => setForm({ ...form, dailyWage: event.target.value })}
                required
              />
            </div>

            <div className="field field-span">
              <label htmlFor="job-description">Description</label>
              <textarea
                id="job-description"
                rows="4"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Describe the site, expected output, or shift details"
                required
              />
            </div>

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? "Posting..." : "Post construction job"}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="My posted jobs" subtitle="Review fill rate, assigned workers, and status.">
          {loading ? (
            <div className="empty-state">Loading posted jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">No construction jobs posted yet.</div>
          ) : (
            <div className="list-grid">
              {jobs.map((job) => (
                <article key={job.id} className="item-card">
                  <div className="item-card-header">
                    <div>
                      <h3>{formatEnumLabel(job.workType)}</h3>
                      <p>{job.location}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="detail-grid">
                    <div>
                      <span>Dates</span>
                      <strong>
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Daily wage</span>
                      <strong>{formatCurrency(job.dailyWage)}</strong>
                    </div>
                    <div>
                      <span>Crew</span>
                      <strong>
                        {job.workersAssigned} / {job.workersRequired}
                      </strong>
                    </div>
                  </div>
                  <p className="item-description">{job.description}</p>
                  {job.assignedWorkers?.length ? (
                    <div className="chip-row">
                      {job.assignedWorkers.map((worker) => (
                        <span key={worker.id} className="chip">
                          {worker.fullName}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="item-actions">
                    {constructionStatusActions(job.status).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="secondary-button"
                        disabled={actionKey === `${job.id}-${status}`}
                        onClick={() => handleUpdateStatus(job.id, status)}
                      >
                        {actionKey === `${job.id}-${status}`
                          ? "Updating..."
                          : `Mark ${formatEnumLabel(status)}`}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
