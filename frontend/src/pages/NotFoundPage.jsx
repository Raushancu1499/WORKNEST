import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="form-card narrow-card">
      <span className="eyebrow">404</span>
      <h1>That route does not exist.</h1>
      <p>The page was not found, or the URL does not belong to the current frontend flow.</p>
      <div className="button-row">
        <Link to="/" className="primary-button">
          Go home
        </Link>
      </div>
    </section>
  );
}
