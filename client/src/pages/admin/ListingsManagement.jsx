import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const statusColors = {
  draft: 'var(--color-text-muted)',
  review: 'var(--color-warning)',
  published: 'var(--color-success)',
};

export default function ListingsManagement() {
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['admin', 'listings'],
    queryFn: () => api.get('/admin/listings').then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/listings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['admin', 'listings']),
  });

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Manage Listings</h1>
        <Link
          to="/admin/listings/new"
          style={{
            padding: '10px 20px',
            background: 'var(--color-accent)',
            borderRadius: 'var(--radius)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Create Listing
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listings.map((listing) => (
          <div
            key={listing._id}
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
              <Link to={`/listings/${listing._id}`} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {listing.title}
              </Link>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                {listing.address?.city}, {listing.address?.state} - ${listing.price?.monthly?.toLocaleString()}/mo
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  background: statusColors[listing.status] || 'var(--color-surface-hover)',
                  color: 'white',
                }}
              >
                {listing.status}
              </span>
              <Link
                to={`/admin/listings/${listing._id}/edit`}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                }}
              >
                Edit
              </Link>
              {listing.status === 'draft' && (
                <button
                  onClick={() => updateStatus.mutate({ id: listing._id, status: 'review' })}
                  disabled={updateStatus.isPending}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--color-warning)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                  }}
                >
                  Submit for Review
                </button>
              )}
              {listing.status === 'review' && (
                <>
                  <button
                    onClick={() => updateStatus.mutate({ id: listing._id, status: 'published' })}
                    disabled={updateStatus.isPending}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--color-success)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      color: 'white',
                    }}
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => updateStatus.mutate({ id: listing._id, status: 'draft' })}
                    disabled={updateStatus.isPending}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--color-surface-hover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--color-text)',
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No listings yet. Create one to get started.</p>
      )}
    </div>
  );
}
