import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const { data: listings = [] } = useQuery({
    queryKey: ['admin', 'listings'],
    queryFn: () => api.get('/admin/listings').then((r) => r.data),
  });

  const { data: visits = [] } = useQuery({
    queryKey: ['admin', 'visits'],
    queryFn: () => api.get('/visits').then((r) => r.data),
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['admin', 'tickets'],
    queryFn: () => api.get('/tickets').then((r) => r.data),
  });

  const draftCount = listings.filter((l) => l.status === 'draft').length;
  const reviewCount = listings.filter((l) => l.status === 'review').length;
  const publishedCount = listings.filter((l) => l.status === 'published').length;
  const pendingVisits = visits.filter((v) => v.status === 'requested').length;
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Admin Dashboard</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <Link
          to="/admin/listings"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>{listings.length}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Listings</div>
        </Link>
        <Link
          to="/admin/listings"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{draftCount}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Draft</div>
        </Link>
        <Link
          to="/admin/listings"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>{reviewCount}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>In Review</div>
        </Link>
        <Link
          to="/admin/listings"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>{publishedCount}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Published</div>
        </Link>
        <Link
          to="/admin/visits"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{pendingVisits}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Visits</div>
        </Link>
        <Link
          to="/admin/tickets"
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{openTickets}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Open Tickets</div>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link
          to="/admin/listings/new"
          style={{
            padding: '12px 24px',
            background: 'var(--color-accent)',
            borderRadius: 'var(--radius)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Create Listing
        </Link>
        <Link
          to="/admin/visits"
          style={{
            padding: '12px 24px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        >
          Manage Visits
        </Link>
        <Link
          to="/admin/tickets"
          style={{
            padding: '12px 24px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        >
          Manage Tickets
        </Link>
        <Link
          to="/admin/leases"
          style={{
            padding: '12px 24px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        >
          Manage Leases
        </Link>
      </div>
    </div>
  );
}
