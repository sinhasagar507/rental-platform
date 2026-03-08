import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function MyLeases() {
  const { data: leases = [], isLoading } = useQuery({
    queryKey: ['my-leases'],
    queryFn: () => api.get('/leases').then((r) => r.data),
  });

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>My Leases</h1>

      {leases.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>
          No leases yet. Complete a visit and get approved to receive a lease.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leases.map((lease) => (
            <div
              key={lease._id}
              style={{
                padding: '20px',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{lease.listingId?.title}</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                  {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '4px 10px',
                    background: 'var(--color-surface-hover)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                  }}
                >
                  {lease.status}
                </span>
              </div>
              <Link
                to={`/checklist/${lease._id}`}
                style={{
                  padding: '10px 20px',
                  background: 'var(--color-accent)',
                  borderRadius: 'var(--radius)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Move-in Checklist
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
