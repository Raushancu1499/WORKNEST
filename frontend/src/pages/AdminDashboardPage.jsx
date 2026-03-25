import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";

export default function AdminDashboardPage({ auth }) {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.adminDashboard(auth.token),
      api.adminUsers(auth.token),
      api.adminBookings(auth.token),
      api.adminJobs(auth.token)
    ])
      .then(([dashboardResponse, usersResponse, bookingsResponse, jobsResponse]) => {
        setDashboard(dashboardResponse);
        setUsers(usersResponse);
        setBookings(bookingsResponse);
        setJobs(jobsResponse);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>System overview</h1>
          <p>Monitor registrations, service bookings, and labour hiring activity across WORKNEST.</p>
        </div>
        <InfoGrid
          items={[
            { label: "Users", value: dashboard?.totalUsers ?? 0 },
            { label: "Bookings", value: dashboard?.totalBookings ?? 0 },
            { label: "Construction jobs", value: dashboard?.totalConstructionJobs ?? 0 }
          ]}
        />
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="dashboard-grid">
        <SectionCard title="Registered Users" subtitle="Read-only monitoring of platform accounts.">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Service Requests" subtitle="Current booking lifecycle across customers and workers.">
          <div className="stack-list">
            {bookings.map((booking) => (
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
                  <span>{booking.assignedWorker?.fullName || "Unassigned"}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Construction Jobs" subtitle="Read-only staffing overview for contractor posts.">
          <div className="stack-list">
            {jobs.map((job) => (
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
                  <span>{job.workersAssigned}/{job.workersRequired} workers</span>
                  <span>{job.startDate} to {job.endDate}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
