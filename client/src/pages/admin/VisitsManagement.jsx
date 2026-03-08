import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function VisitsManagement() {
  const queryClient = useQueryClient();

  const { data: visits = [], isLoading } = useQuery({
    queryKey: ['admin', 'visits'],
    queryFn: () => api.get('/visits').then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, scheduledDate }) =>
      api.put(`/visits/${id}`, { status, scheduledDate }),
    onSuccess: () => queryClient.invalidateQueries(['admin', 'visits']),
  });

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Manage Visits</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {visits.map((visit) => {
          const listing = visit.listingId;
          const tenant = visit.tenantId;
          return (
            <div
              key={visit._id}
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
                <Link to={`/listings/${listing?._id}`} style={{ fontWeight: 600 }}>
                  {listing?.title}
                </Link>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                  Tenant: {tenant?.email || tenant?.profile?.name || 'N/A'}
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
                  {visit.status}
                </span>
              </div>
              {visit.status === 'requested' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    id={`date-${visit._id}`}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`date-${visit._id}`);
                      const scheduledDate = input?.value;
                      if (scheduledDate) {
                        updateMutation.mutate({ id: visit._id, status: 'scheduled', scheduledDate });
                      }
                    }}
                    disabled={updateMutation.isPending}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--color-accent)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      color: 'white',
                    }}
                  >
                    Schedule Visit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visits.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No visit requests yet.</p>
      )}
    </div>
  );
}
