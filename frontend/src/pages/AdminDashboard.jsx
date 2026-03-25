import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { ROLES } from "../lib/constants";
import { formatDate, formatDateTime, formatEnumLabel } from "../lib/utils";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      api.adminDashboard(token),
      api.adminUsers(token),
      api.adminBookings(token),
      api.adminJobs(token)
    ])
      .then(([dashboardData, usersData, bookingsData, jobsData]) => {
        if (!active) {
          return;
        }

        setDashboard(dashboardData);
        setUsers(usersData);
        setBookings(bookingsData);
        setJobs(jobsData);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load the admin dashboard.");
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

  const metrics = dashboard
    ? [
        {
          label: "Users",
          value: dashboard.totalUsers
        },
        {
          label: "Service bookings",
          value: dashboard.totalBookings
        },
        {
          label: "Construction jobs",
          value: dashboard.totalConstructionJobs
        },
        {
          label: "Open job posts",
          value: jobs.filter((job) => job.status === "OPEN" || job.status === "PARTIALLY_FILLED").length
        }
      ]
    : [];

  const roleMetrics = [
    {
      label: "Customers",
      value: users.filter((user) => user.role === ROLES.CUSTOMER).length
    },
    {
      label: "Workers",
      value: users.filter((user) => user.role === ROLES.WORKER).length
    },
    {
      label: "Contractors",
      value: users.filter((user) => user.role === ROLES.CONTRACTOR).length
    },
    {
      label: "Pending bookings",
      value: bookings.filter((booking) => booking.status === "PENDING").length
    }
  ];

  return (
    <div className="page-stack">
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Monitor platform growth, live demand, and user distribution.</h1>
          <p>Recent activity and platform totals are consolidated here from the admin endpoints.</p>
        </div>
      </section>

      {loading ? <div className="notice-banner">Loading admin overview...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      {dashboard ? <InfoGrid items={metrics} /> : null}
      {users.length ? <InfoGrid items={roleMetrics} /> : null}

      <div className="dashboard-grid">
        <SectionCard title="People on the platform" subtitle="User summaries across all registered roles.">
          {users.length === 0 ? (
            <div className="empty-state">No users available.</div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>City</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName}</td>
                      <td>{formatEnumLabel(user.role)}</td>
                      <td>{user.city}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent service bookings" subtitle="Latest customer bookings from the admin overview.">
          {dashboard?.recentBookings?.length ? (
            <div className="list-grid">
              {dashboard.recentBookings.map((booking) => (
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
                      <span>Customer</span>
                      <strong>{booking.customer?.fullName || "Unknown"}</strong>
                    </div>
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
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No recent service bookings available.</div>
          )}
        </SectionCard>

        <SectionCard title="Recent construction jobs" subtitle="Latest construction posts and their fill state.">
          {dashboard?.recentJobs?.length ? (
            <div className="list-grid">
              {dashboard.recentJobs.map((job) => (
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
                      <span>Contractor</span>
                      <strong>{job.contractor?.fullName || "Unknown"}</strong>
                    </div>
                    <div>
                      <span>Dates</span>
                      <strong>
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Crew</span>
                      <strong>
                        {job.workersAssigned} / {job.workersRequired}
                      </strong>
                    </div>
                  </div>
                  <p className="item-description">{job.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">No recent construction jobs available.</div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
