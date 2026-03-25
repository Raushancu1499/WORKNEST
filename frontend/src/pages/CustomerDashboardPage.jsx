import { useEffect, useState } from "react";
import InfoGrid from "../components/InfoGrid";
import SectionCard from "../components/SectionCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";

function emptyBookingForm(categories) {
  return {
    serviceCategory: categories[0] || "PLUMBING",
    preferredDate: new Date().toISOString().slice(0, 10),
    location: "",
    description: ""
  };
}

export default function CustomerDashboardPage({ auth }) {
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyBookingForm([]));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    const [serviceCategories, myBookings] = await Promise.all([
      api.serviceCategories(auth.token),
      api.myServiceBookings(auth.token)
    ]);
    setCategories(serviceCategories);
    setBookings(myBookings);
    setForm((current) => ({
      ...emptyBookingForm(serviceCategories),
      ...current,
      serviceCategory: current.serviceCategory || serviceCategories[0] || "PLUMBING"
    }));
  }

  useEffect(() => {
    loadDashboard().catch((err) => setError(err.message));
  }, []);

  async function handleCreateBooking(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createServiceBooking(form, auth.token);
      setMessage("Service booking created.");
      setForm(emptyBookingForm(categories));
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusUpdate(id, status) {
    setError("");
    setMessage("");
    try {
      await api.updateServiceBookingStatus(id, status, auth.token);
      setMessage(`Booking moved to ${status}.`);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const completedCount = bookings.filter((booking) => booking.status === "COMPLETED").length;

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Customer Dashboard</span>
          <h1>{auth.user.fullName}</h1>
          <p>Book home services, review job status, and keep household work organized.</p>
        </div>
        <InfoGrid
          items={[
            { label: "Total bookings", value: bookings.length },
            { label: "Pending", value: pendingCount },
            { label: "Completed", value: completedCount }
          ]}
        />
      </section>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      <div className="dashboard-grid">
        <SectionCard title="Request a Service" subtitle="Create a new booking with category, date, and location.">
          <form className="form-grid" onSubmit={handleCreateBooking}>
            <label>
              Service category
              <select
                value={form.serviceCategory}
                onChange={(event) => setForm({ ...form, serviceCategory: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Preferred date
              <input
                type="date"
                value={form.preferredDate}
                onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
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
              Work details
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
              />
            </label>

            <button className="primary-button" type="submit">
              Submit booking
            </button>
          </form>
        </SectionCard>

        <SectionCard title="My Bookings" subtitle="Track requests from pending to completed.">
          <div className="stack-list">
            {bookings.length === 0 ? <p className="muted-text">No bookings yet.</p> : null}
            {bookings.map((booking) => (
              <article key={booking.id} className="list-card">
                <div className="list-head">
                  <div>
                    <h3>{booking.serviceCategory}</h3>
                    <p>{booking.location}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <p>{booking.description}</p>
                <div className="meta-row">
                  <span>Date: {booking.preferredDate}</span>
                  <span>Worker: {booking.assignedWorker?.fullName || "Not assigned yet"}</span>
                </div>
                <div className="action-row">
                  {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === "ACCEPTED" && (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                    >
                      Mark completed
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
