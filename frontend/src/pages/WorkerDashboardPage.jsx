import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/constants";

const defaultProfile = {
  skills: [],
  experienceYears: 0,
  preferredLocation: "",
  availability: "Weekdays"
};

export default function WorkerDashboardPage({ auth, onAuthChange }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [jobs, setJobs] = useState({
    availableServiceBookings: [],
    acceptedServiceBookings: [],
    availableConstructionJobs: [],
    acceptedConstructionJobs: []
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    const [profileResponse, jobsResponse] = await Promise.all([
      api.workerProfile(auth.token),
      api.workerJobs(auth.token)
    ]);
    setProfile({
      skills: profileResponse.skills || [],
      experienceYears: profileResponse.experienceYears || 0,
      preferredLocation: profileResponse.preferredLocation || auth.user.city,
      availability: profileResponse.availability || "Weekdays"
    });
    setJobs(jobsResponse);
  }

  useEffect(() => {
    loadDashboard().catch((err) => setError(err.message));
  }, []);

  function toggleSkill(skill) {
    setProfile((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((entry) => entry !== skill)
        : [...current.skills, skill]
    }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.updateWorkerProfile(
        {
          ...profile,
          experienceYears: Number(profile.experienceYears)
        },
        auth.token
      );
      setMessage("Worker profile updated.");
      onAuthChange(auth);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function acceptServiceBooking(id) {
    setError("");
    setMessage("");
    try {
      await api.acceptServiceBooking(id, auth.token);
      setMessage("Service booking accepted.");
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function completeServiceBooking(id) {
    setError("");
    setMessage("");
    try {
      await api.updateServiceBookingStatus(id, "COMPLETED", auth.token);
      setMessage("Service booking marked completed.");
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function acceptConstructionJob(id) {
    setError("");
    setMessage("");
    try {
      await api.acceptConstructionJob(id, auth.token);
      setMessage("Construction job accepted.");
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Worker Dashboard</span>
          <h1>{auth.user.fullName}</h1>
          <p>Keep your profile current, accept relevant jobs, and monitor your active work queue.</p>
        </div>
        <InfoGrid
          items={[
            { label: "Open service jobs", value: jobs.availableServiceBookings.length },
            { label: "Accepted service jobs", value: jobs.acceptedServiceBookings.length },
            { label: "Accepted construction jobs", value: jobs.acceptedConstructionJobs.length }
          ]}
        />
      </section>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      <div className="dashboard-grid">
        <SectionCard title="Profile" subtitle="Define your skills, working area, and availability for matching.">
          <form className="form-grid" onSubmit={saveProfile}>
            <div>
              <label>Skills</label>
              <div className="chip-row">
                {SERVICE_CATEGORIES.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={profile.skills.includes(skill) ? "chip active-chip" : "chip"}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <label>
              Experience (years)
              <input
                type="number"
                min="0"
                value={profile.experienceYears}
                onChange={(event) => setProfile({ ...profile, experienceYears: event.target.value })}
              />
            </label>

            <label>
              Preferred location
              <input
                value={profile.preferredLocation}
                onChange={(event) => setProfile({ ...profile, preferredLocation: event.target.value })}
              />
            </label>

            <label>
              Availability
              <input
                value={profile.availability}
                onChange={(event) => setProfile({ ...profile, availability: event.target.value })}
              />
            </label>

            <button className="primary-button" type="submit">
              Save profile
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Available Home Service Jobs" subtitle="Accept service requests that match your skills.">
          <div className="stack-list">
            {jobs.availableServiceBookings.length === 0 ? <p className="muted-text">No open service jobs.</p> : null}
            {jobs.availableServiceBookings.map((booking) => (
              <article key={booking.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{booking.serviceCategory}</h3>
                    <p>{booking.customer?.fullName}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <p>{booking.description}</p>
                <div className="meta-row">
                  <span>{booking.location}</span>
                  <span>{booking.preferredDate}</span>
                </div>
                <button type="button" className="ghost-button" onClick={() => acceptServiceBooking(booking.id)}>
                  Accept booking
                </button>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Accepted Service Jobs" subtitle="Track assigned home-service work and close completed jobs.">
          <div className="stack-list">
            {jobs.acceptedServiceBookings.length === 0 ? (
              <p className="muted-text">No accepted service jobs yet.</p>
            ) : null}
            {jobs.acceptedServiceBookings.map((booking) => (
              <article key={booking.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{booking.serviceCategory}</h3>
                    <p>{booking.customer?.fullName}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="meta-row">
                  <span>{booking.location}</span>
                  <span>{booking.preferredDate}</span>
                </div>
                {booking.status === "ACCEPTED" ? (
                  <button type="button" className="ghost-button" onClick={() => completeServiceBooking(booking.id)}>
                    Mark completed
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Available Construction Jobs" subtitle="Review contractor labour demand near your working zone.">
          <div className="stack-list">
            {jobs.availableConstructionJobs.length === 0 ? (
              <p className="muted-text">No open construction jobs.</p>
            ) : null}
            {jobs.availableConstructionJobs.map((job) => (
              <article key={job.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{job.workType}</h3>
                    <p>{job.contractor?.fullName}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p>{job.description}</p>
                <div className="meta-row">
                  <span>{job.location}</span>
                  <span>{job.startDate} to {job.endDate}</span>
                  <span>INR {job.dailyWage}/day</span>
                </div>
                <button type="button" className="ghost-button" onClick={() => acceptConstructionJob(job.id)}>
                  Accept job
                </button>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="My Construction Jobs" subtitle="Monitor jobs you already joined.">
          <div className="stack-list">
            {jobs.acceptedConstructionJobs.length === 0 ? (
              <p className="muted-text">No accepted construction jobs yet.</p>
            ) : null}
            {jobs.acceptedConstructionJobs.map((job) => (
              <article key={job.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{job.workType}</h3>
                    <p>{job.contractor?.fullName}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="meta-row">
                  <span>{job.location}</span>
                  <span>{job.startDate} to {job.endDate}</span>
                  <span>Assigned workers: {job.workersAssigned}/{job.workersRequired}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
