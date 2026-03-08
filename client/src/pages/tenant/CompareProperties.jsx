import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function CompareProperties() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', 'compare', ids.join(',')],
    queryFn: () => api.get(`/listings/compare?ids=${ids.join(',')}`).then((r) => r.data),
    enabled: ids.length > 0,
  });

  if (ids.length === 0) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Compare Properties</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Select 2-3 properties from your <Link to="/shortlist">shortlist</Link> to compare.
        </p>
      </div>
    );
  }

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price', format: (v) => v?.monthly && `$${v.monthly.toLocaleString()}/mo` },
    { key: 'deposit', label: 'Deposit', format: (v, l) => l?.price?.deposit && `$${l.price.deposit.toLocaleString()}` },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'bathrooms', label: 'Bathrooms' },
    { key: 'sqft', label: 'Sqft' },
    { key: 'address', label: 'Location', format: (v) => v && `${v.city}, ${v.state}` },
    { key: 'amenities', label: 'Amenities', format: (v) => Array.isArray(v) ? v.join(', ') : '' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Compare Properties</h1>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--color-border)',
                  background: 'var(--color-surface-hover)',
                }}
              >
                Feature
              </th>
              {listings.map((listing) => (
                <th
                  key={listing._id}
                  style={{
                    padding: '16px',
                    minWidth: '200px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <Link to={`/listings/${listing._id}`} style={{ color: 'var(--color-accent)' }}>
                    {listing.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(({ key, label, format }) => (
              <tr key={key}>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {label}
                </td>
                {listings.map((listing) => {
                  const val = key === 'address' ? listing.address : key === 'price' || key === 'deposit' ? listing.price : listing[key];
                  const display = format ? format(val, listing) : val;
                  return (
                    <td
                      key={listing._id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      {display ?? '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
