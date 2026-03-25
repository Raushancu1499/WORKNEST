import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/constants";
import {
  bookingStatusActions,
  createEmptyWorkerJobs,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatEnumLabel
} from "../lib/utils";

function buildProfileForm(profile, user) {
  return {
    skills: profile?.skills || [],
    experienceYears: profile?.experienceYears ?? "",
    preferredLocation: profile?.preferredLocation || user?.city || "",
    availability: profile?.availability || "Weekdays"
  };
}

export default function WorkerDashboard() {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState(SERVICE_CATEGORIES);
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(null, user));
  const [jobs, setJobs] = useState(createEmptyWorkerJobs());
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [jobsNotice, setJobsNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    async function loadDashboard() {
      try {
        const [resolvedCategories, resolvedProfile, resolvedJobs] = await Promise.all([
          api.serviceCategories(token).catch(() => SERVICE_CATEGORIES),
          api.workerProfile(token).catch((requestError) => {
            if ((requestError.message || "").includes("Worker profile not found")) {
              return null;
            }
            throw requestError;
          }),
          api.workerJobs(token)
            .then((data) => ({ needsProfile: false, data }))
            .catch((requestError) => {
              if ((requestError.message || "").includes("Create worker profile first")) {
                return {
                  needsProfile: true,
                  data: createEmptyWorkerJobs()
                };
              }
              throw requestError;
            })
        ]);

        if (!active) {
          return;
        }

        setCategories(resolvedCategories?.length ? resolvedCategories : SERVICE_CATEGORIES);
        setProfileForm(buildProfileForm(resolvedProfile, user));
        setJobs(resolvedJobs.data);
        setJobsNotice(
          resolvedJobs.needsProfile
            ? "Complete your worker profile to unlock matched bookings and construction jobs."
            : ""
        );
      } catch (requestError) {
        if (!active) {
          return;
        }

        setCategories(SERVICE_CATEGORIES);
        setProfileForm(buildProfileForm(null, user));
        setJobs(createEmptyWorkerJobs());
        setError(requestError.message || "Unable to load the worker dashboard.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [token, user]);

  async function refreshJobs() {
    try {
      const result = await api.workerJobs(token)
        .then((data) => ({ needsProfile: false, data }))
        .catch((requestError) => {
          if ((requestError.message || "").includes("Create worker profile first")) {
            return {
              needsProfile: true,
              data: createEmptyWorkerJobs()
            };
          }
          throw requestError;
        });

      setJobs(result.data);
      setJobsNotice(
        result.needsProfile
          ? "Complete your worker profile to unlock matched bookings and construction jobs."
          : ""
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to refresh worker jobs.");
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setMessage("");

    if (profileForm.skills.length === 0) {
      setSavingProfile(false);
      setError("Select at least one skill before saving the worker profile.");
      return;
    }

    try {
      const payload = {
        skills: profileForm.skills,
        experienceYears: Number(profileForm.experienceYears),
        preferredLocation: profileForm.preferredLocation,
        availability: profileForm.availability
      };

      const savedProfile = await api.updateWorkerProfile(payload, token);
      setProfileForm(buildProfileForm(savedProfile, user));
      setMessage("Worker profile saved.");
      await refreshJobs();
    } catch (requestError) {
      setError(requestError.message || "Unable to save the worker profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleServiceBookingAction(bookingId, action) {
    const nextActionKey = `booking-${bookingId}-${action}`;
    setActionKey(nextActionKey);
    setError("");
    setMessage("");

    try {
      if (action === "ACCEPT") {
        await api.acceptServiceBooking(bookingId, token);
      } else {
        await api.updateServiceBookingStatus(bookingId, action, token);
      }
      await refreshJobs();
      setMessage(
        action === "ACCEPT"
          ? "Service booking accepted."
          : `Booking marked as ${formatEnumLabel(action)}.`
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to update the service booking.");
    } finally {
      setActionKey("");
    }
  }

  async function handleConstructionAction(jobId) {
    const nextActionKey = `job-${jobId}`;
    setActionKey(nextActionKey);
    setError("");
    setMessage("");

    try {
      await api.acceptConstructionJob(jobId, token);
      await refreshJobs();
      setMessage("Construction job accepted.");
    } catch (requestError) {
      setError(requestError.message || "Unable to accept the construction job.");
    } finally {
      setActionKey("");
    }
  }

  const metrics = [
    {
      label: "Available service jobs",
      value: jobs.availableServiceBookings.length
    },
    {
      label: "Accepted service jobs",
      value: jobs.acceptedServiceBookings.length
    },
    {
      label: "Available construction jobs",
      value: jobs.availableConstructionJobs.length
    },
    {
      label: "Accepted construction jobs",
      value: jobs.acceptedConstructionJobs.length
    }
  ];

  return (
    <div className="page-stack">
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow">Worker dashboard</span>
          <h1>Maintain your profile and pick up matching work.</h1>
          <p>
            Service bookings and labour jobs are filtered from your skills and preferred location.
          </p>
        </div>
      </section>

      <InfoGrid items={metrics} />

      {error ? <div className="error-banner">{error}</div> : null}
      {message ? <div className="success-banner">{message}</div> : null}
      {jobsNotice ? <div className="notice-banner">{jobsNotice}</div> : null}

      <div className="dashboard-grid">
        <SectionCard
          title="Worker profile"
          subtitle="Keep your skill set and availability current for better matches."
        >
          <form className="form-grid" onSubmit={handleProfileSubmit}>
            <div className="field field-span">
              <label>Skills</label>
              <div className="checkbox-grid">
                {categories.map((category) => (
                  <label key={category} className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={profileForm.skills.includes(category)}
                      onChange={() =>
                        setProfileForm((current) => ({
                          ...current,
                          skills: current.skills.includes(category)
                            ? current.skills.filter((item) => item !== category)
                            : [...current.skills, category]
                        }))
                      }
                    />
                    <span>{formatEnumLabel(category)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="worker-years">Experience (years)</label>
              <input
                id="worker-years"
                type="number"
                min="0"
                value={profileForm.experienceYears}
                onChange={(event) =>
                  setProfileForm({ ...profileForm, experienceYears: event.target.value })
                }
                required
              />
            </div>

            <div className="field">
              <label htmlFor="worker-preferred-location">Preferred location</label>
              <input
                id="worker-preferred-location"
                value={profileForm.preferredLocation}
                onChange={(event) =>
                  setProfileForm({ ...profileForm, preferredLocation: event.target.value })
                }
                required
              />
            </div>

            <div className="field field-span">
              <label htmlFor="worker-availability-field">Availability</label>
              <input
                id="worker-availability-field"
                value={profileForm.availability}
                onChange={(event) =>
                  setProfileForm({ ...profileForm, availability: event.target.value })
                }
                required
              />
            </div>

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Available service bookings" subtitle="Requests that match your skills.">
          {loading ? (
            <div className="empty-state">Loading available service bookings...</div>
          ) : jobs.availableServiceBookings.length === 0 ? (
            <div className="empty-state">No matching service bookings are open right now.</div>
          ) : (
            <div className="list-grid">
              {jobs.availableServiceBookings.map((booking) => (
                <article key={booking.id} className="item-card">
                  <div className="item-card-header">
                    <div>
                      <h3>{formatEnumLabel(booking.serviceCategory)}</h3>
                      <p>{booking.location}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="detail-grid">
                    <div>
                      <span>Date</span>
                      <strong>{formatDate(booking.preferredDate)}</strong>
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{booking.customer?.fullName || "Unknown"}</strong>
                    </div>
                  </div>
                  <p className="item-description">{booking.description}</p>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="primary-button"
                      disabled={actionKey === `booking-${booking.id}-ACCEPT`}
                      onClick={() => handleServiceBookingAction(booking.id, "ACCEPT")}
                    >
                      {actionKey === `booking-${booking.id}-ACCEPT` ? "Accepting..." : "Accept booking"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Accepted service bookings" subtitle="Update jobs you have already taken.">
          {loading ? (
            <div className="empty-state">Loading accepted service bookings...</div>
          ) : jobs.acceptedServiceBookings.length === 0 ? (
            <div className="empty-state">You have not accepted any service bookings yet.</div>
          ) : (
            <div className="list-grid">
              {jobs.acceptedServiceBookings.map((booking) => (
                <article key={booking.id} className="item-card">
                  <div className="item-card-header">
                    <div>
                      <h3>{formatEnumLabel(booking.serviceCategory)}</h3>
                      <p>{booking.location}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="detail-grid">
                    <div>
                      <span>Preferred date</span>
                      <strong>{formatDate(booking.preferredDate)}</strong>
                    </div>
                    <div>
                      <span>Created</span>
                      <strong>{formatDateTime(booking.createdAt)}</strong>
                    </div>
                  </div>
                  <p className="item-description">{booking.description}</p>
                  <div className="item-actions">
                    {bookingStatusActions(booking.status).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="secondary-button"
                        disabled={actionKey === `booking-${booking.id}-${status}`}
                        onClick={() => handleServiceBookingAction(booking.id, status)}
                      >
                        {actionKey === `booking-${booking.id}-${status}`
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

        <SectionCard
          title="Available construction jobs"
          subtitle="Crew-based construction opportunities that match your profile."
        >
          {loading ? (
            <div className="empty-state">Loading available construction jobs...</div>
          ) : jobs.availableConstructionJobs.length === 0 ? (
            <div className="empty-state">No construction jobs match your profile right now.</div>
          ) : (
            <div className="list-grid">
              {jobs.availableConstructionJobs.map((job) => (
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
                      <span>Duration</span>
                      <strong>
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Daily wage</span>
                      <strong>{formatCurrency(job.dailyWage)}</strong>
                    </div>
                    <div>
                      <span>Crew status</span>
                      <strong>
                        {job.workersAssigned} / {job.workersRequired}
                      </strong>
                    </div>
                  </div>
                  <p className="item-description">{job.description}</p>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="primary-button"
                      disabled={actionKey === `job-${job.id}`}
                      onClick={() => handleConstructionAction(job.id)}
                    >
                      {actionKey === `job-${job.id}` ? "Accepting..." : "Accept job"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Accepted construction jobs" subtitle="Jobs already assigned to you.">
          {loading ? (
            <div className="empty-state">Loading accepted construction jobs...</div>
          ) : jobs.acceptedConstructionJobs.length === 0 ? (
            <div className="empty-state">You have not accepted any construction jobs yet.</div>
          ) : (
            <div className="list-grid">
              {jobs.acceptedConstructionJobs.map((job) => (
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
                      <span>Duration</span>
                      <strong>
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Daily wage</span>
                      <strong>{formatCurrency(job.dailyWage)}</strong>
                    </div>
                    <div>
                      <span>Contractor</span>
                      <strong>{job.contractor?.fullName || "Unknown"}</strong>
                    </div>
                  </div>
                  <p className="item-description">{job.description}</p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
