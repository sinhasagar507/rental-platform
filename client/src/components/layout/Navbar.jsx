import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'landlord';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <Link
        to="/listings"
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text)',
        }}
      >
        Rental Platform
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/listings" style={{ color: 'var(--color-text-muted)' }}>
          Listings
        </Link>
        <Link to="/visits" style={{ color: 'var(--color-text-muted)' }}>
          My Visits
        </Link>
        <Link to="/shortlist" style={{ color: 'var(--color-text-muted)' }}>
          Shortlist
        </Link>
        <Link to="/compare" style={{ color: 'var(--color-text-muted)' }}>
          Compare
        </Link>
        <Link to="/leases" style={{ color: 'var(--color-text-muted)' }}>
          My Leases
        </Link>
        <Link to="/tickets" style={{ color: 'var(--color-text-muted)' }}>
          Support
        </Link>

        {isAdmin && (
          <>
            <Link to="/admin" style={{ color: 'var(--color-accent)' }}>
              Admin
            </Link>
            <Link to="/admin/listings" style={{ color: 'var(--color-text-muted)' }}>
              Listings
            </Link>
            <Link to="/admin/visits" style={{ color: 'var(--color-text-muted)' }}>
              Visits
            </Link>
            <Link to="/admin/tickets" style={{ color: 'var(--color-text-muted)' }}>
              Tickets
            </Link>
            <Link to="/admin/leases" style={{ color: 'var(--color-text-muted)' }}>
              Leases
            </Link>
          </>
        )}

        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {user?.profile?.name || user?.email}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
