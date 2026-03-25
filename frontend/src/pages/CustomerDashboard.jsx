import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";
import { SERVICE_CATEGORIES } from "../lib/constants";
import {
  bookingStatusActions,
  formatDate,
  formatDateTime,
  formatEnumLabel,
  todayString
} from "../lib/utils";

export default function CustomerDashboard() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    serviceCategory: SERVICE_CATEGORIES[0],
    preferredDate: todayString(),
    location: user?.city || "",
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

    api.myServiceBookings(token)
      .then((data) => {
        if (active) {
          setBookings(data);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load your bookings.");
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

  async function handleCreateBooking(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const createdBooking = await api.createServiceBooking(form, token);
      setBookings((current) => [createdBooking, ...current]);
      setForm((current) => ({
        ...current,
        preferredDate: todayString(),
        description: ""
      }));
      setMessage("Service booking created successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to create the booking.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusUpdate(bookingId, status) {
    const nextActionKey = `${bookingId}-${status}`;
    setActionKey(nextActionKey);
    setError("");
    setMessage("");

    try {
      const updatedBooking = await api.updateServiceBookingStatus(bookingId, status, token);
      setBookings((current) =>
        current.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      );
      setMessage(`Booking marked as ${formatEnumLabel(status)}.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update the booking status.");
    } finally {
      setActionKey("");
    }
  }

  const metrics = [
    {
      label: "Total bookings",
      value: bookings.length
    },
    {
      label: "Pending",
      value: bookings.filter((booking) => booking.status === "PENDING").length
    },
    {
      label: "Accepted",
      value: bookings.filter((booking) => booking.status === "ACCEPTED").length
    },
    {
      label: "Completed",
      value: bookings.filter((booking) => booking.status === "COMPLETED").length
    }
  ];

  return (
    <div className="page-stack">
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow">Customer dashboard</span>
          <h1>Manage your home-service requests.</h1>
          <p>
            Create bookings, review worker assignments, and close jobs once the work is finished.
          </p>
        </div>
      </section>

      <InfoGrid items={metrics} />

      {error ? <div className="error-banner">{error}</div> : null}
      {message ? <div className="success-banner">{message}</div> : null}

      <div className="dashboard-grid">
        <SectionCard
          title="Create a service booking"
          subtitle="Submit a new request for your city or preferred site."
        >
          <form className="form-grid" onSubmit={handleCreateBooking}>
            <div className="field">
              <label htmlFor="customer-category">Service category</label>
              <select
                id="customer-category"
                value={form.serviceCategory}
                onChange={(event) => setForm({ ...form, serviceCategory: event.target.value })}
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatEnumLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="customer-date">Preferred date</label>
              <input
                id="customer-date"
                type="date"
                value={form.preferredDate}
                onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
                min={todayString()}
                required
              />
            </div>

            <div className="field field-span">
              <label htmlFor="customer-location">Location</label>
              <input
                id="customer-location"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                placeholder="Site or locality"
                required
              />
            </div>

            <div className="field field-span">
              <label htmlFor="customer-description">Description</label>
              <textarea
                id="customer-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows="4"
                placeholder="Describe the work needed"
                required
              />
            </div>

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? "Submitting..." : "Create booking"}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="My bookings"
          subtitle="Track status, assigned worker details, and completion dates."
        >
          {loading ? (
            <div className="empty-state">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">No bookings yet. Create your first request to get started.</div>
          ) : (
            <div className="list-grid">
              {bookings.map((booking) => (
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

                  {booking.assignedWorker ? (
                    <div className="info-callout compact">
                      <strong>Assigned worker</strong>
                      <span>
                        {booking.assignedWorker.fullName} · {booking.assignedWorker.phone}
                      </span>
                    </div>
                  ) : null}

                  <div className="item-actions">
                    {bookingStatusActions(booking.status).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="secondary-button"
                        disabled={actionKey === `${booking.id}-${status}`}
                        onClick={() => handleStatusUpdate(booking.id, status)}
                      >
                        {actionKey === `${booking.id}-${status}`
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
