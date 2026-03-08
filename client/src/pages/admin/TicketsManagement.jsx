import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function TicketsManagement() {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['admin', 'tickets'],
    queryFn: () => api.get('/tickets').then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/tickets/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['admin', 'tickets']),
  });

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Manage Support Tickets</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
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
              <Link
                to={`/tickets/${ticket._id}`}
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
              >
                {ticket.subject}
              </Link>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                Tenant: {ticket.tenantId?.email || ticket.tenantId?.profile?.name || 'N/A'} - {ticket.category}
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
                {ticket.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ticket.status === 'open' && (
                <button
                  onClick={() => updateStatus.mutate({ id: ticket._id, status: 'in_progress' })}
                  disabled={updateStatus.isPending}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                  }}
                >
                  Start
                </button>
              )}
              {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                <button
                  onClick={() => updateStatus.mutate({ id: ticket._id, status: 'resolved' })}
                  disabled={updateStatus.isPending}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--color-success)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                  }}
                >
                  Resolve
                </button>
              )}
              <button
                onClick={() => updateStatus.mutate({ id: ticket._id, status: 'closed' })}
                disabled={updateStatus.isPending}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-text)',
                }}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No support tickets yet.</p>
      )}
    </div>
  );
}
