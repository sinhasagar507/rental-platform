import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const statusLabels = {
  requested: 'Requested',
  scheduled: 'Scheduled',
  visited: 'Visited',
  decision: 'Decision',
};

export default function MyVisits() {
  const queryClient = useQueryClient();

  const { data: visits = [], isLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: () => api.get('/visits').then((r) => r.data),
  });

  const markVisited = useMutation({
    mutationFn: (id) => api.put(`/visits/${id}`, { status: 'visited' }),
    onSuccess: () => queryClient.invalidateQueries(['visits']),
  });

  const setDecision = useMutation({
    mutationFn: ({ id, decision }) => api.put(`/visits/${id}/decision`, { decision }),
    onSuccess: () => queryClient.invalidateQueries(['visits']),
  });

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>My Visits</h1>

      {visits.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>
          No visit requests yet. <Link to="/listings">Browse listings</Link> and request a visit.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visits.map((visit) => {
            const listing = visit.listingId;
            const status = visit.status;
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
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <Link
                    to={`/listings/${listing?._id}`}
                    style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}
                  >
                    {listing?.title}
                  </Link>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                    {listing?.address?.city}, {listing?.address?.state} - ${listing?.price?.monthly?.toLocaleString()}/mo
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
                    {statusLabels[status] || status}
                  </span>
                  {visit.scheduledDate && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Scheduled: {new Date(visit.scheduledDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {status === 'scheduled' && (
                    <button
                      onClick={() => markVisited.mutate(visit._id)}
                      disabled={markVisited.isPending}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--color-accent)',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        color: 'white',
                      }}
                    >
                      Mark Visited
                    </button>
                  )}
                  {status === 'visited' && (
                    <>
                      <button
                        onClick={() => setDecision.mutate({ id: visit._id, decision: 'accepted' })}
                        disabled={setDecision.isPending}
                        style={{
                          padding: '8px 16px',
                          background: 'var(--color-success)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          color: 'white',
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setDecision.mutate({ id: visit._id, decision: 'rejected' })}
                        disabled={setDecision.isPending}
                        style={{
                          padding: '8px 16px',
                          background: 'var(--color-error)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          color: 'white',
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {status === 'decision' && (
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Decision: {visit.decision}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
