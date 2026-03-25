import { Link } from "react-router-dom";
import { dashboardPathForRole } from "../lib/utils";

const platformHighlights = [
  {
    title: "Trusted Home Services",
    summary:
      "Book plumbing, electrical, carpentry, painting, interior, and cleaning support from one organized platform."
  },
  {
    title: "Construction Workforce Planning",
    summary:
      "Contractors can post labour demand in advance, track staffing progress, and reduce last-minute hiring delays."
  },
  {
    title: "Role-Based Operations",
    summary:
      "Customers, workers, contractors, and admins all get focused workspaces built around their daily tasks."
  }
];

const serviceCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Interior Services",
  "Cleaning"
];

const workflowSteps = [
  {
    title: "Customers raise requests",
    body:
      "Choose a service, set the preferred date and location, and track the request from pending to completion."
  },
  {
    title: "Workers accept matching jobs",
    body:
      "Workers maintain their skills and location preferences so they see relevant opportunities first."
  },
  {
    title: "Contractors fill labour demand",
    body:
      "Construction jobs can be posted with daily wage, worker count, and schedule for better project planning."
  }
];

const trustPoints = [
  "Structured booking and hiring workflows",
  "Clear status visibility for every job",
  "Professional worker profiles and role dashboards",
  "Built for both home services and construction staffing"
];

export default function LandingPage({ user }) {
  const primaryPath = user ? dashboardPathForRole(user.role) : "/register";
  const primaryLabel = user ? "Open dashboard" : "Get started";

  return (
    <div className="page-stack">
      <section className="hero-panel company-hero">
        <div className="hero-copy">
          <span className="eyebrow">Smart Labour + Home Services Platform</span>
          <h1>Hire verified service professionals and organize construction labour from one workspace.</h1>
          <p>
            WORKNEST brings homeowners, skilled workers, and contractors together in a single digital marketplace
            built for faster booking, structured job tracking, and better workforce coordination.
          </p>

          <div className="hero-actions">
            <Link to={primaryPath} className="primary-button">
              {primaryLabel}
            </Link>
            {!user ? (
              <Link to="/login" className="secondary-button">
                Sign in
              </Link>
            ) : null}
          </div>

          <div className="hero-stat-row">
            <article className="stat-block">
              <strong>Home Services</strong>
              <span>Request, assign, and complete household jobs with clean workflow visibility.</span>
            </article>
            <article className="stat-block">
              <strong>Construction Hiring</strong>
              <span>Post labour requirements early and staff projects with the right crew.</span>
            </article>
          </div>
        </div>

        <div className="hero-side">
          <div className="showcase-card">
            <span className="eyebrow">Why WORKNEST</span>
            <h2>Built for real service operations, not just listings.</h2>
            <p>
              Every request moves through a trackable status flow so customers, workers, and contractors stay aligned
              from booking to completion.
            </p>
          </div>

          <div className="mini-metrics">
            {platformHighlights.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-copy">
          <span className="eyebrow">Service Coverage</span>
          <h2>From emergency repairs to planned labour hiring, WORKNEST covers both immediate needs and project staffing.</h2>
          <p>
            The platform is designed for everyday household service requests as well as advance labour planning for
            construction work. That makes it useful to homeowners, independent workers, and site supervisors in the
            same ecosystem.
          </p>
        </div>

        <div className="service-grid">
          {serviceCategories.map((service) => (
            <article key={service} className="service-tile">
              <span className="service-dot" />
              <strong>{service}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="role-grid">
        <article className="role-card featured-role">
          <span className="eyebrow">For Customers</span>
          <h2>Book home services with clarity.</h2>
          <p>
            Customers can raise requests, select dates and locations, monitor job status, and manage completed work
            without relying on manual calling and follow-up.
          </p>
        </article>

        <article className="role-card featured-role">
          <span className="eyebrow">For Workers</span>
          <h2>Find work that matches your skills.</h2>
          <p>
            Skilled professionals and labour workers can maintain profiles, accept relevant opportunities, and view
            upcoming assignments in one place.
          </p>
        </article>

        <article className="role-card featured-role">
          <span className="eyebrow">For Contractors</span>
          <h2>Plan crews before the work starts.</h2>
          <p>
            Contractors can publish labour requirements with wage, dates, and worker count to reduce project delays
            and improve workforce visibility.
          </p>
        </article>
      </section>

      <section className="section-band split-band">
        <div className="workflow-panel">
          <span className="eyebrow">How It Works</span>
          <h2>A structured flow for every participant.</h2>
          <div className="workflow-list">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="workflow-item">
                <div className="workflow-index">0{index + 1}</div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="trust-panel">
          <span className="eyebrow">Operational Benefits</span>
          <h2>Designed to reduce manual coordination.</h2>
          <div className="trust-list">
            {trustPoints.map((point) => (
              <div key={point} className="trust-item">
                <span className="trust-check">•</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div>
          <span className="eyebrow">Start with WORKNEST</span>
          <h2>Move from phone-based coordination to a cleaner digital workflow.</h2>
          <p>
            Create an account to explore role-based dashboards for customers, workers, and contractors.
          </p>
        </div>
        <div className="hero-actions">
          <Link to={primaryPath} className="primary-button">
            {primaryLabel}
          </Link>
          {!user ? (
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
