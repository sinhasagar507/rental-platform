import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import ListingCard from '../../components/common/ListingCard';

export default function BrowseListings() {
  const [location, setLocation] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [moveInDate, setMoveInDate] = useState('');

  const params = new URLSearchParams();
  params.set('status', 'published');
  if (location) params.set('location', location);
  if (minBudget) params.set('minBudget', minBudget);
  if (maxBudget) params.set('maxBudget', maxBudget);
  if (moveInDate) params.set('moveInDate', moveInDate);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', params.toString()],
    queryFn: () => api.get(`/listings?${params}`).then((r) => r.data),
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Browse Listings</h1>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
          padding: '20px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <input
          type="text"
          placeholder="Location (city, zip, area)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            flex: '1 1 200px',
            padding: '10px 14px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        />
        <input
          type="number"
          placeholder="Min budget"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          style={{
            width: '120px',
            padding: '10px 14px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        />
        <input
          type="number"
          placeholder="Max budget"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          style={{
            width: '120px',
            padding: '10px 14px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        />
        <input
          type="date"
          placeholder="Move-in date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          style={{
            width: '160px',
            padding: '10px 14px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No listings found. Try adjusting your filters.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
