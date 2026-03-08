import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then((r) => r.data),
  });

  const requestVisit = useMutation({
    mutationFn: () => api.post('/visits', { listingId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      queryClient.invalidateQueries(['shortlist']);
      navigate('/visits');
    },
  });

  const addToShortlist = useMutation({
    mutationFn: (listingIds) => api.put('/shortlists', { listingIds }),
    onSuccess: () => queryClient.invalidateQueries(['shortlist']),
  });

  const { data: shortlist } = useQuery({
    queryKey: ['shortlist'],
    queryFn: () => api.get('/shortlists').then((r) => r.data),
    enabled: !!user,
  });

  const inShortlist = shortlist?.listingIds?.some((lid) => lid._id === id || lid === id);

  if (isLoading || !listing) {
    return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;
  }

  const handleAddToShortlist = () => {
    const current = shortlist?.listingIds?.map((l) => (typeof l === 'object' ? l._id : l)) || [];
    if (current.includes(id)) return;
    const updated = [...current, id].slice(-10);
    addToShortlist.mutate(updated);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{listing.title}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {listing.address?.street}, {listing.address?.city}, {listing.address?.state} {listing.address?.zip}
        </p>
      </div>

      {listing.gallery?.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {listing.gallery.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${listing.title} ${i + 1}`}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: 'var(--radius)',
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            height: '300px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            marginBottom: '24px',
          }}
        >
          No images
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span
          style={{
            padding: '8px 16px',
            background: 'var(--color-accent)',
            borderRadius: 'var(--radius)',
            fontWeight: 600,
          }}
        >
          ${listing.price?.monthly?.toLocaleString()}/mo
        </span>
        <span style={{ padding: '8px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius)' }}>
          Deposit: ${listing.price?.deposit?.toLocaleString() || 0}
        </span>
        <span style={{ padding: '8px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius)' }}>
          {listing.bedrooms} bed, {listing.bathrooms} bath
        </span>
        {listing.sqft > 0 && (
          <span style={{ padding: '8px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius)' }}>
            {listing.sqft} sqft
          </span>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Description</h2>
        <p style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>{listing.description || 'No description.'}</p>
      </div>

      {listing.amenities?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Amenities</h2>
          <ul style={{ listStyle: 'none' }}>
            {listing.amenities.map((a, i) => (
              <li key={i} style={{ padding: '4px 0', color: 'var(--color-text-muted)' }}>
                - {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.rules?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Rules</h2>
          <ul style={{ listStyle: 'none' }}>
            {listing.rules.map((r, i) => (
              <li key={i} style={{ padding: '4px 0', color: 'var(--color-text-muted)' }}>
                - {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.availabilityTimeline?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Availability</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {listing.availabilityTimeline.map((slot, i) => (
              <span
                key={i}
                style={{
                  padding: '8px 12px',
                  background: slot.available ? 'var(--color-success)' : 'var(--color-surface)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                }}
              >
                {new Date(slot.startDate).toLocaleDateString()} - {new Date(slot.endDate).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'tenant' && listing.status === 'published' && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => requestVisit.mutate()}
            disabled={requestVisit.isPending}
            style={{
              padding: '12px 24px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {requestVisit.isPending ? 'Requesting...' : 'Request Visit'}
          </button>
          <button
            onClick={handleAddToShortlist}
            disabled={inShortlist || addToShortlist.isPending}
            style={{
              padding: '12px 24px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
            }}
          >
            {inShortlist ? 'In Shortlist' : 'Add to Shortlist'}
          </button>
          <button
            onClick={() => navigate(`/compare?ids=${id}`)}
            style={{
              padding: '12px 24px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
            }}
          >
            Compare
          </button>
        </div>
      )}
    </div>
  );
}
