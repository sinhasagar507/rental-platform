import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  const imageUrl = listing.gallery?.[0] || 'https://placehold.co/400x250/1a1a1a/666?text=No+Image';

  return (
    <Link
      to={`/listings/${listing._id}`}
      style={{
        display: 'block',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div
        style={{
          height: '200px',
          background: `url(${imageUrl}) center/cover`,
        }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{listing.title}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '8px' }}>
          {listing.address?.city}, {listing.address?.state}
        </p>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-accent)' }}>
          ${listing.price?.monthly?.toLocaleString()}/mo
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {listing.bedrooms} bed, {listing.bathrooms} bath
        </p>
      </div>
    </Link>
  );
}
