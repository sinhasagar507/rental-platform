import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import ListingCard from '../../components/common/ListingCard';

export default function Shortlist() {
  const queryClient = useQueryClient();

  const { data: shortlist, isLoading } = useQuery({
    queryKey: ['shortlist'],
    queryFn: () => api.get('/shortlists').then((r) => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (listingIds) => api.put('/shortlists', { listingIds }),
    onSuccess: () => queryClient.invalidateQueries(['shortlist']),
  });

  const remove = (id) => {
    const current = shortlist?.listingIds?.map((l) => (typeof l === 'object' ? l._id : l)) || [];
    removeMutation.mutate(current.filter((lid) => lid !== id));
  };

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  const listings = shortlist?.listingIds || [];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Shortlist</h1>

      {listings.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>
          Your shortlist is empty. <Link to="/listings">Browse listings</Link> and add properties to compare.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <Link
              to={`/compare?ids=${listings.map((l) => (typeof l === 'object' ? l._id : l)).join(',')}`}
              style={{
                padding: '10px 20px',
                background: 'var(--color-accent)',
                borderRadius: 'var(--radius)',
                color: 'white',
                fontWeight: 600,
                display: 'inline-block',
              }}
            >
              Compare Properties
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {listings.map((listing) => {
              const item = typeof listing === 'object' ? listing : { _id: listing };
              return (
                <div key={item._id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => remove(item._id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      zIndex: 1,
                      padding: '6px 12px',
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      color: 'white',
                      fontSize: '0.875rem',
                    }}
                  >
                    Remove
                  </button>
                  <ListingCard listing={item} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
