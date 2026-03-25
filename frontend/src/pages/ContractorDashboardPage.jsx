import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/constants";

const initialForm = {
  workType: "PLUMBING",
  workersRequired: 1,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  location: "",
  dailyWage: 750,
  description: ""
};

export default function ContractorDashboardPage({ auth }) {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    const [profileResponse, myJobs] = await Promise.all([
      api.contractorProfile(auth.token),
      api.contractorJobs(auth.token)
    ]);
    setProfile(profileResponse);
    setJobs(myJobs);
  }

  useEffect(() => {
    loadDashboard().catch((err) => setError(err.message));
  }, []);

  async function createJob(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.createConstructionJob(
        {
          ...form,
          workersRequired: Number(form.workersRequired),
          dailyWage: Number(form.dailyWage)
        },
        auth.token
      );
      setMessage("Construction labour requirement posted.");
      setForm(initialForm);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    setError("");
    setMessage("");
    try {
      await api.updateConstructionJobStatus(id, status, auth.token);
      setMessage(`Construction job moved to ${status}.`);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Contractor Dashboard</span>
          <h1>{profile?.companyName || auth.user.fullName}</h1>
          <p>Post labour demand, review accepted workers, and monitor project staffing progress.</p>
        </div>
        <InfoGrid
          items={[
            { label: "Posted jobs", value: jobs.length },
            { label: "Open or partial", value: jobs.filter((job) => job.status !== "COMPLETED" && job.status !== "CANCELLED").length },
            { label: "Completed", value: jobs.filter((job) => job.status === "COMPLETED").length }
          ]}
        />
      </section>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      <div className="dashboard-grid">
        <SectionCard
          title="Post Labour Requirement"
          subtitle="Create construction jobs with dates, wage, and worker count."
        >
          <form className="form-grid" onSubmit={createJob}>
            <label>
              Work type
              <select value={form.workType} onChange={(event) => setForm({ ...form, workType: event.target.value })}>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Workers required
              <input
                type="number"
                min="1"
                value={form.workersRequired}
                onChange={(event) => setForm({ ...form, workersRequired: event.target.value })}
                required
              />
            </label>

            <label>
              Start date
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                required
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                required
              />
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                required
              />
            </label>

            <label>
              Daily wage
              <input
                type="number"
                min="1"
                value={form.dailyWage}
                onChange={(event) => setForm({ ...form, dailyWage: event.target.value })}
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
              />
            </label>

            <button className="primary-button" type="submit">
              Publish job
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Posted Jobs" subtitle="Track staffing and close jobs when work is done.">
          <div className="stack-list">
            {jobs.length === 0 ? <p className="muted-text">No jobs posted yet.</p> : null}
            {jobs.map((job) => (
              <article key={job.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{job.workType}</h3>
                    <p>{job.location}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p>{job.description}</p>
                <div className="meta-row">
                  <span>{job.startDate} to {job.endDate}</span>
                  <span>Workers: {job.workersAssigned}/{job.workersRequired}</span>
                  <span>INR {job.dailyWage}/day</span>
                </div>
                <div className="tag-row">
                  {(job.assignedWorkers || []).map((worker) => (
                    <span key={worker.id} className="inline-tag">
                      {worker.fullName}
                    </span>
                  ))}
                </div>
                <div className="action-row">
                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" ? (
                    <button type="button" className="ghost-button" onClick={() => updateStatus(job.id, "COMPLETED")}>
                      Mark completed
                    </button>
                  ) : null}
                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" ? (
                    <button type="button" className="ghost-button" onClick={() => updateStatus(job.id, "CANCELLED")}>
                      Cancel
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
