import { Link, NavLink } from "react-router-dom";
import { dashboardPathForRole, formatEnumLabel } from "../lib/utils";

function navClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Layout({ user, onLogout, notice, children }) {
  const dashboardPath = user ? dashboardPathForRole(user.role) : "/dashboard";

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">WN</span>
          <div>
            <strong>WORKNEST</strong>
            <p>Labour and home services marketplace</p>
          </div>
        </Link>

        <nav className="topnav">
          {!user ? (
            <>
              <NavLink to="/" className={navClassName}>
                Home
              </NavLink>
              <NavLink to="/login" className={navClassName}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClassName}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={navClassName}>
                Home
              </NavLink>
              <NavLink to={dashboardPath} className={navClassName}>
                Dashboard
              </NavLink>
              <div className="user-pill">
                <strong>{user.fullName}</strong>
                <span>{formatEnumLabel(user.role)}</span>
              </div>
              <button type="button" className="ghost-button" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main>
        {notice ? <div className="notice-banner">{notice}</div> : null}
        {children}
      </main>
    </div>
  );
}
