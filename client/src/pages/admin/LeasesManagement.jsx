import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../api/client';

export default function LeasesManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    listingId: '',
    tenantId: '',
    visitRequestId: '',
    startDate: '',
    endDate: '',
  });

  const { data: leases = [], isLoading } = useQuery({
    queryKey: ['admin', 'leases'],
    queryFn: () => api.get('/admin/leases').then((r) => r.data),
  });

  const { data: visits = [] } = useQuery({
    queryKey: ['admin', 'visits'],
    queryFn: () => api.get('/visits').then((r) => r.data),
  });

  const createLease = useMutation({
    mutationFn: (data) => api.post('/admin/leases', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'leases']);
      setShowForm(false);
      setForm({ listingId: '', tenantId: '', visitRequestId: '', startDate: '', endDate: '' });
    },
  });

  const reviewExtension = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/leases/${id}/extension`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['admin', 'leases']),
  });

  const acceptedVisits = visits.filter((v) => v.status === 'decision' && v.decision === 'accepted');

  const handleCreate = (e) => {
    e.preventDefault();
    if (form.listingId && form.tenantId && form.startDate && form.endDate) {
      createLease.mutate(form);
    }
  };

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Manage Leases</h1>

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
        {showForm ? 'Cancel' : 'Create Lease'}
      </button>

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
            <label style={{ display: 'block', marginBottom: '8px' }}>Listing ID</label>
            <input
              value={form.listingId}
              onChange={(e) => setForm((f) => ({ ...f, listingId: e.target.value }))}
              required
              placeholder="MongoDB ObjectId"
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
            <label style={{ display: 'block', marginBottom: '8px' }}>Tenant ID</label>
            <input
              value={form.tenantId}
              onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
              required
              placeholder="MongoDB ObjectId"
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
            <label style={{ display: 'block', marginBottom: '8px' }}>Visit Request ID (optional)</label>
            <input
              value={form.visitRequestId}
              onChange={(e) => setForm((f) => ({ ...f, visitRequestId: e.target.value }))}
              placeholder="MongoDB ObjectId"
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
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
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
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
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
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Quick fill from accepted visits: {acceptedVisits.map((v) => (
              <button
                key={v._id}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    listingId: v.listingId?._id || v.listingId,
                    tenantId: v.tenantId?._id || v.tenantId,
                    visitRequestId: v._id,
                  }))
                }
                style={{
                  marginRight: '8px',
                  padding: '4px 8px',
                  background: 'var(--color-surface-hover)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {v.listingId?.title}
              </button>
            ))}
          </p>
          <button
            type="submit"
            disabled={createLease.isPending}
            style={{
              padding: '10px 20px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
            }}
          >
            Create Lease
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leases.map((lease) => (
          <div
            key={lease._id}
            style={{
              padding: '20px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontWeight: 600 }}>{lease.listingId?.title}</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              Tenant: {lease.tenantId?.email || lease.tenantId?.profile?.name || 'N/A'}
            </p>
            <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
              {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()} ({lease.status})
            </p>
            {lease.extensionRequest?.status === 'pending' && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--color-warning)' }}>
                  Extension requested: {new Date(lease.extensionRequest.requestedEndDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => reviewExtension.mutate({ id: lease._id, status: 'approved' })}
                  disabled={reviewExtension.isPending}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--color-success)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                    fontSize: '0.875rem',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => reviewExtension.mutate({ id: lease._id, status: 'rejected' })}
                  disabled={reviewExtension.isPending}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--color-error)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                    fontSize: '0.875rem',
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {leases.length === 0 && !showForm && (
        <p style={{ color: 'var(--color-text-muted)' }}>No leases yet.</p>
      )}
    </div>
  );
}
