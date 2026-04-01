import { Link } from "react-router-dom";
import { dashboardPathForRole } from "../lib/utils";

const services = [
  {
    title: "Plumbing",
    body: "Book leak repairs, pipeline maintenance, fittings, and urgent household fixes."
  },
  {
    title: "Electrical",
    body: "Find electricians for wiring, installation, maintenance, and breakdown support."
  },
  {
    title: "Carpentry",
    body: "Handle furniture work, fittings, wood repairs, and finishing jobs with clarity."
  },
  {
    title: "Painting",
    body: "Organize interior and exterior painting work with date, location, and scope control."
  },
  {
    title: "Interior Services",
    body: "Coordinate fit-out, detailing, and finishing support for home improvement projects."
  },
  {
    title: "Cleaning",
    body: "Book recurring or one-time cleaning work through a trackable request workflow."
  }
];

const pillars = [
  {
    title: "Structured operations",
    body: "Every booking and labour requirement moves through a defined workflow instead of phone-call chaos."
  },
  {
    title: "Better job access",
    body: "Workers can discover relevant opportunities based on skills, location, and day-to-day availability."
  },
  {
    title: "Faster project planning",
    body: "Contractors can staff work in advance, monitor fill rates, and reduce last-minute labour gaps."
  }
];

const audiences = [
  {
    label: "Customers",
    headline: "Book home services with confidence",
    body:
      "Raise service requests, select preferred dates, and track progress from pending to completed without manual coordination."
  },
  {
    label: "Workers",
    headline: "Turn skills into steady work",
    body:
      "Maintain a professional profile, accept relevant jobs, and manage active assignments from one role-focused dashboard."
  },
  {
    label: "Contractors",
    headline: "Plan labour before site work begins",
    body:
      "Publish workforce demand with wages, dates, and worker counts to keep projects staffed and schedules visible."
  }
];

const workflow = [
  {
    title: "Raise a request or labour requirement",
    body:
      "Customers book services and contractors post workforce needs with the date, location, and job details already defined."
  },
  {
    title: "Match the right people faster",
    body:
      "Workers view opportunities aligned to their service category and preferred work area instead of searching blindly."
  },
  {
    title: "Track progress in one place",
    body:
      "Jobs move through status-based workflows so everyone can see what is pending, accepted, and completed."
  }
];

function FooterLink({ to, children }) {
  if (to.startsWith("#")) {
    return (
      <a href={to} className="footer-link">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className="footer-link">
      {children}
    </Link>
  );
}

export default function LandingPage({ user }) {
  const primaryPath = user ? dashboardPathForRole(user.role) : "/register";
  const primaryLabel = user ? "Open dashboard" : "Create account";
  const footerColumns = [
    {
      title: "Platform",
      items: [
        { label: "Home service booking", to: "#service-marketplace" },
        { label: "Construction labour hiring", to: "#how-it-works" },
        { label: "Role-based dashboards", to: primaryPath }
      ]
    },
    {
      title: "Users",
      items: [
        { label: "Customers", to: "#customers" },
        { label: "Workers", to: "#workers" },
        { label: "Contractors", to: "#contractors" }
      ]
    },
    {
      title: "Operations",
      items: [
        { label: "Request tracking", to: "#operations-snapshot" },
        { label: "Job acceptance", to: "#how-it-works" },
        { label: "Project staffing", to: "#business-value" }
      ]
    }
  ];

  return (
    <div className="page-stack">
      <section className="hero-panel premium-hero">
        <div className="hero-copy">
          <span className="eyebrow">Smart Labour + Home Services Marketplace</span>
          <h1>One platform for home service booking, skilled labour discovery, and construction workforce planning.</h1>
          <p>
            WORKNEST helps homeowners, service professionals, and contractors move from scattered phone-based
            coordination to a cleaner digital workflow with bookings, job acceptance, and project staffing in one place.
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
              <strong>Homeowners</strong>
              <span>Book trusted household services with date, location, and job tracking built in.</span>
            </article>
            <article className="stat-block">
              <strong>Workers</strong>
              <span>Discover nearby jobs that match skills, category, and working area.</span>
            </article>
            <article className="stat-block">
              <strong>Contractors</strong>
              <span>Post labour demand in advance and watch crew allocation progress clearly.</span>
            </article>
          </div>
        </div>

        <div className="premium-board" id="operations-snapshot">
          <div className="board-header">
            <span className="eyebrow board-eyebrow">Operations Snapshot</span>
            <h2>Designed for the way real service work actually moves.</h2>
          </div>

          <div className="board-columns">
            <article className="board-column">
              <span className="board-label">Pending</span>
              <div className="board-ticket">
                <strong>Kitchen sink repair</strong>
                <p>Banashankari - Plumbing</p>
              </div>
              <div className="board-ticket">
                <strong>Wall painting crew</strong>
                <p>Whitefield - 3 workers needed</p>
              </div>
            </article>

            <article className="board-column">
              <span className="board-label">Accepted</span>
              <div className="board-ticket">
                <strong>Electrical fitting</strong>
                <p>Indiranagar - Assigned worker</p>
              </div>
              <div className="board-ticket">
                <strong>Masonry support</strong>
                <p>Yelahanka - Crew partially filled</p>
              </div>
            </article>

            <article className="board-column">
              <span className="board-label">Completed</span>
              <div className="board-ticket">
                <strong>Deep cleaning visit</strong>
                <p>Jayanagar - Closed successfully</p>
              </div>
              <div className="board-ticket">
                <strong>Carpentry finishing</strong>
                <p>HSR Layout - Delivered on schedule</p>
              </div>
            </article>
          </div>

          <div className="board-summary">
            <div>
              <strong>Clear workflows</strong>
              <span>Track status instead of chasing updates manually.</span>
            </div>
            <div>
              <strong>One operational layer</strong>
              <span>Home services and labour hiring, under one product.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip">
        {pillars.map((item) => (
          <article key={item.title} className="signal-card">
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="section-band service-band" id="service-marketplace">
        <div className="section-copy">
          <span className="eyebrow">Service Marketplace</span>
          <h2>From urgent household repairs to scheduled maintenance, customers can book services with more control.</h2>
          <p>
            WORKNEST covers the service categories people search for most often, while giving workers and contractors
            the structure needed to manage requests, assignments, and job history professionally.
          </p>
        </div>

        <div className="service-grid premium-service-grid">
          {services.map((service) => (
            <article key={service.title} className="service-tile">
              <span className="service-dot" />
              <div>
                <strong>{service.title}</strong>
                <p>{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="role-grid premium-role-grid">
        {audiences.map((item) => (
            <article key={item.label} className="role-card featured-role" id={item.label.toLowerCase()}>
            <span className="eyebrow">{item.label}</span>
            <h2>{item.headline}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="section-band split-band dark-band" id="how-it-works">
        <div className="workflow-panel dark-panel">
          <span className="eyebrow dark-eyebrow">How It Works</span>
          <h2>Simple flows for complex real-world coordination.</h2>
          <div className="workflow-list">
            {workflow.map((step, index) => (
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

        <div className="trust-panel dark-support-panel" id="business-value">
          <span className="eyebrow dark-eyebrow">Business Value</span>
          <h2>Why this model matters</h2>
          <div className="trust-list">
            <div className="trust-item">
              <span className="trust-check" />
              <p>Reduces manual back-and-forth between customers, workers, and contractors.</p>
            </div>
            <div className="trust-item">
              <span className="trust-check" />
              <p>Improves job access for workers through better discovery and structured status visibility.</p>
            </div>
            <div className="trust-item">
              <span className="trust-check" />
              <p>Supports project planning with advance labour hiring instead of same-day crew searching.</p>
            </div>
            <div className="trust-item">
              <span className="trust-check" />
              <p>Creates a more professional digital layer for service coordination and construction staffing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip premium-cta">
        <div>
          <span className="eyebrow">Start With WORKNEST</span>
          <h2>Bring bookings, labour hiring, and job tracking into one operational system.</h2>
          <p>Create an account to explore the marketplace as a customer, worker, or contractor.</p>
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

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="eyebrow">WORKNEST</span>
          <h2>Digital coordination for labour hiring and home services.</h2>
          <p>
            Built to simplify service booking, improve worker access to jobs, and help contractors manage labour demand
            with more visibility.
          </p>
        </div>

        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <strong>{column.title}</strong>
              {column.items.map((item) => (
                <FooterLink key={item.label} to={item.to}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
