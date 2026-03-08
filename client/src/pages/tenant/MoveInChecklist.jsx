import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function MoveInChecklist() {
  const { leaseId } = useParams();
  const queryClient = useQueryClient();
  const [docType, setDocType] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [invItem, setInvItem] = useState('');
  const [invCondition, setInvCondition] = useState('');
  const [invNotes, setInvNotes] = useState('');

  const { data: lease, isLoading } = useQuery({
    queryKey: ['lease', leaseId],
    queryFn: () => api.get(`/leases/${leaseId}`).then((r) => r.data),
    enabled: !!leaseId,
  });

  const checklist = lease?.moveInChecklist || { documents: [], agreementConfirmed: false, inventoryList: [] };

  const uploadDoc = useMutation({
    mutationFn: (data) => api.post(`/leases/${leaseId}/checklist/documents`, data),
    onSuccess: () => queryClient.invalidateQueries(['lease', leaseId]),
  });

  const confirmAgreement = useMutation({
    mutationFn: () => api.put(`/leases/${leaseId}/checklist/agreement`, {}),
    onSuccess: () => queryClient.invalidateQueries(['lease', leaseId]),
  });

  const updateInventory = useMutation({
    mutationFn: (inventoryList) => api.put(`/leases/${leaseId}/checklist/inventory`, { inventoryList }),
    onSuccess: () => queryClient.invalidateQueries(['lease', leaseId]),
  });

  const addDoc = () => {
    if (docType && docUrl) {
      uploadDoc.mutate({ type: docType, url: docUrl });
      setDocType('');
      setDocUrl('');
    }
  };

  const addInventoryItem = () => {
    if (invItem) {
      const current = checklist.inventoryList || [];
      updateInventory.mutate([...current, { item: invItem, condition: invCondition, notes: invNotes }]);
      setInvItem('');
      setInvCondition('');
      setInvNotes('');
    }
  };

  const requestExtension = useMutation({
    mutationFn: (data) => api.post(`/leases/${leaseId}/extension`, data),
    onSuccess: () => queryClient.invalidateQueries(['lease', leaseId]),
  });

  const [extDate, setExtDate] = useState('');
  const [extReason, setExtReason] = useState('');

  const removeInventoryItem = (index) => {
    const current = checklist.inventoryList || [];
    updateInventory.mutate(current.filter((_, i) => i !== index));
  };

  if (isLoading || !lease) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  const allDone =
    checklist.documents?.length > 0 &&
    checklist.agreementConfirmed &&
    (checklist.inventoryList?.length || 0) > 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/tickets" style={{ color: 'var(--color-text-muted)' }}>Back</Link>
      </div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.75rem' }}>Move-in Checklist</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        {lease.listingId?.title} - {new Date(lease.startDate).toLocaleDateString()} to {new Date(lease.endDate).toLocaleDateString()}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '600px',
        }}
      >
        <section
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Document Uploads</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              placeholder="Type (e.g. ID, lease)"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 14px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              placeholder="Document URL"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 14px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={addDoc}
              disabled={uploadDoc.isPending}
              style={{
                padding: '10px 20px',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: 'white',
              }}
            >
              Add
            </button>
          </div>
          <ul style={{ listStyle: 'none' }}>
            {(checklist.documents || []).map((d, i) => (
              <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                {d.type}: <a href={d.url} target="_blank" rel="noreferrer">{d.url}</a>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Agreement Confirmation</h2>
          {checklist.agreementConfirmed ? (
            <p style={{ color: 'var(--color-success)' }}>Confirmed</p>
          ) : (
            <button
              onClick={() => confirmAgreement.mutate()}
              disabled={confirmAgreement.isPending}
              style={{
                padding: '10px 20px',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: 'white',
              }}
            >
              Confirm Agreement
            </button>
          )}
        </section>

        <section
          style={{
            padding: '24px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Inventory List</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              placeholder="Item"
              value={invItem}
              onChange={(e) => setInvItem(e.target.value)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 14px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              placeholder="Condition"
              value={invCondition}
              onChange={(e) => setInvCondition(e.target.value)}
              style={{
                width: '100px',
                padding: '10px 14px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <input
              placeholder="Notes"
              value={invNotes}
              onChange={(e) => setInvNotes(e.target.value)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 14px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={addInventoryItem}
              disabled={updateInventory.isPending}
              style={{
                padding: '10px 20px',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: 'white',
              }}
            >
              Add
            </button>
          </div>
          <ul style={{ listStyle: 'none' }}>
            {(checklist.inventoryList || []).map((inv, i) => (
              <li
                key={i}
                style={{
                  padding: '12px',
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{inv.item} - {inv.condition} {inv.notes && `(${inv.notes})`}</span>
                <button
                  onClick={() => removeInventoryItem(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>

        {allDone && (
          <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>Checklist complete. Lease is active.</p>
        )}

        {lease.status === 'active' || lease.status === 'extended' ? (
          <section
            style={{
              padding: '24px',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Request Stay Extension</h2>
            {lease.extensionRequest?.status === 'pending' ? (
              <p style={{ color: 'var(--color-warning)' }}>Extension request pending.</p>
            ) : lease.extensionRequest?.status === 'approved' ? (
              <p style={{ color: 'var(--color-success)' }}>Extension approved.</p>
            ) : lease.extensionRequest?.status === 'rejected' ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Extension was rejected.</p>
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>New end date</label>
                  <input
                    type="date"
                    value={extDate}
                    onChange={(e) => setExtDate(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Reason</label>
                  <input
                    value={extReason}
                    onChange={(e) => setExtReason(e.target.value)}
                    placeholder="Optional"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <button
                  onClick={() => extDate && requestExtension.mutate({ requestedEndDate: extDate, reason: extReason })}
                  disabled={requestExtension.isPending || !extDate}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                  }}
                >
                  Request Extension
                </button>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
