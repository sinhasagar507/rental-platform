import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function SupportTickets() {
  const { user } = useAuth();
  const isTenant = user?.role === 'tenant';
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.get('/tickets').then((r) => r.data),
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/tickets', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      setShowForm(false);
      setSubject('');
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (subject.trim()) {
      createMutation.mutate({ subject: subject.trim(), category });
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Support Tickets</h1>

      {isTenant && (
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            marginBottom: '24px',
            padding: '10px 20px',
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {showForm ? 'Cancel' : 'New Ticket'}
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            marginBottom: '24px',
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            maxWidth: '500px',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            >
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            style={{
              padding: '10px 20px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
            }}
          >
            Create Ticket
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No support tickets yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              style={{
                padding: '20px',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div style={{ fontWeight: 600 }}>{ticket.subject}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                {ticket.status} - {ticket.category}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
