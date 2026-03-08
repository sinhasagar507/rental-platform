import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: { street: '', city: '', state: '', zip: '', locationText: '' },
    price: { monthly: 0, deposit: 0 },
    propertyType: 'apartment',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    amenities: [],
    rules: [],
    gallery: [],
    availabilityTimeline: [],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');
  const [availStart, setAvailStart] = useState('');
  const [availEnd, setAvailEnd] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');

  const { data: listing } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title || '',
        description: listing.description || '',
        address: listing.address || { street: '', city: '', state: '', zip: '', locationText: '' },
        price: listing.price || { monthly: 0, deposit: 0 },
        propertyType: listing.propertyType || 'apartment',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        sqft: listing.sqft || 0,
        amenities: listing.amenities || [],
        rules: listing.rules || [],
        gallery: listing.gallery || [],
        availabilityTimeline: listing.availabilityTimeline || [],
      });
    }
  }, [listing]);

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEdit ? api.put(`/admin/listings/${id}`, data) : api.post('/admin/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'listings']);
      navigate('/admin/listings');
    },
  });

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setForm((f) => ({ ...f, amenities: [...f.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const addRule = () => {
    if (ruleInput.trim()) {
      setForm((f) => ({ ...f, rules: [...f.rules, ruleInput.trim()] }));
      setRuleInput('');
    }
  };

  const addAvailability = () => {
    if (availStart && availEnd) {
      setForm((f) => ({
        ...f,
        availabilityTimeline: [...f.availabilityTimeline, { startDate: availStart, endDate: availEnd, available: true }],
      }));
      setAvailStart('');
      setAvailEnd('');
    }
  };

  const addGallery = () => {
    if (galleryUrl.trim()) {
      setForm((f) => ({ ...f, gallery: [...f.gallery, galleryUrl.trim()] }));
      setGalleryUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const update = (path, value) => {
    setForm((f) => {
      const next = { ...f };
      if (path.includes('.')) {
        const [a, b] = path.split('.');
        next[a] = { ...next[a], [b]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin/listings" style={{ color: 'var(--color-text-muted)' }}>Back to Listings</Link>
      </div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>{isEdit ? 'Edit Listing' : 'Create Listing'}</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
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

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
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

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Address</label>
          <input
            placeholder="Street"
            value={form.address.street}
            onChange={(e) => update('address.street', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
              marginBottom: '8px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="City"
              value={form.address.city}
              onChange={(e) => update('address.city', e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              placeholder="State"
              value={form.address.state}
              onChange={(e) => update('address.state', e.target.value)}
              style={{
                width: '80px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              placeholder="Zip"
              value={form.address.zip}
              onChange={(e) => update('address.zip', e.target.value)}
              style={{
                width: '100px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <input
            placeholder="Location text (for search)"
            value={form.address.locationText}
            onChange={(e) => update('address.locationText', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
              marginTop: '8px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Monthly Rent</label>
            <input
              type="number"
              value={form.price.monthly || ''}
              onChange={(e) => update('price.monthly', Number(e.target.value) || 0)}
              required
              style={{
                width: '120px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Deposit</label>
            <input
              type="number"
              value={form.price.deposit || ''}
              onChange={(e) => update('price.deposit', Number(e.target.value) || 0)}
              style={{
                width: '120px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Bedrooms</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms || ''}
              onChange={(e) => update('bedrooms', Number(e.target.value) || 0)}
              style={{
                width: '80px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Bathrooms</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms || ''}
              onChange={(e) => update('bathrooms', Number(e.target.value) || 0)}
              style={{
                width: '80px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Sqft</label>
            <input
              type="number"
              min="0"
              value={form.sqft || ''}
              onChange={(e) => update('sqft', Number(e.target.value) || 0)}
              style={{
                width: '100px',
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Amenities</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              placeholder="Add amenity"
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button type="button" onClick={addAmenity} style={{ padding: '12px 20px', background: 'var(--color-surface-hover)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-text)' }}>
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {form.amenities.map((a, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  background: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                }}
              >
                {a}{' '}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, amenities: f.amenities.filter((_, j) => j !== i) }))}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Rules</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
              placeholder="Add rule"
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button type="button" onClick={addRule} style={{ padding: '12px 20px', background: 'var(--color-surface-hover)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-text)' }}>
              Add
            </button>
          </div>
          <ul style={{ listStyle: 'none' }}>
            {form.rules.map((r, i) => (
              <li key={i} style={{ padding: '4px 0' }}>
                - {r}{' '}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rules: f.rules.filter((_, j) => j !== i) }))}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Gallery URLs</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              value={galleryUrl}
              onChange={(e) => setGalleryUrl(e.target.value)}
              placeholder="Image URL"
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button type="button" onClick={addGallery} style={{ padding: '12px 20px', background: 'var(--color-surface-hover)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-text)' }}>
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {form.gallery.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }))}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Availability</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={availStart}
              onChange={(e) => setAvailStart(e.target.value)}
              style={{
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              type="date"
              value={availEnd}
              onChange={(e) => setAvailEnd(e.target.value)}
              style={{
                padding: '12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button type="button" onClick={addAvailability} style={{ padding: '12px 20px', background: 'var(--color-surface-hover)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-text)' }}>
              Add Slot
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {form.availabilityTimeline.map((slot, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  background: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                }}
              >
                {new Date(slot.startDate).toLocaleDateString()} - {new Date(slot.endDate).toLocaleDateString()}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, availabilityTimeline: f.availabilityTimeline.filter((_, j) => j !== i) }))}
                  style={{ marginLeft: '8px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            style={{
              padding: '12px 24px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <Link
            to="/admin/listings"
            style={{
              padding: '12px 24px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
