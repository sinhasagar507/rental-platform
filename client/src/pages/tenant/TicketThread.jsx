import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

function MessageItem({ message, ticketId, onReply, depth = 0 }) {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent.trim(), message._id);
      setReplying(false);
      setReplyContent('');
    }
  };

  return (
    <div
      style={{
        marginLeft: depth * 24,
        marginBottom: '12px',
        padding: '12px',
        background: depth ? 'var(--color-bg)' : 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 600 }}>
          {message.senderId?.profile?.name || message.senderId?.email || 'User'}
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>
      <p style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{message.content}</p>
      <button
        onClick={() => setReplying(!replying)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        {replying ? 'Cancel' : 'Reply'}
      </button>
      {replying && (
        <div style={{ marginTop: '12px' }}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
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
          <button
            onClick={handleReply}
            disabled={!replyContent.trim()}
            style={{
              padding: '8px 16px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
            }}
          >
            Send Reply
          </button>
        </div>
      )}
      {(message.replies || []).map((r) => (
        <MessageItem key={r._id} message={r} ticketId={ticketId} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function TicketThread() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => api.get(`/tickets/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['ticket-messages', id],
    queryFn: () => api.get(`/tickets/${id}/messages`).then((r) => r.data),
    enabled: !!id,
  });

  const addMessage = useMutation({
    mutationFn: ({ content, parentMessageId }) =>
      api.post(`/tickets/${id}/messages`, { content, parentMessageId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-messages', id]);
      queryClient.invalidateQueries(['ticket', id]);
      setNewMessage('');
    },
  });

  const handleReply = (content, parentMessageId) => {
    addMessage.mutate({ content, parentMessageId });
  };

  if (isLoading || !ticket) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/tickets" style={{ color: 'var(--color-text-muted)' }}>Back to Tickets</Link>
      </div>
      <h1 style={{ marginBottom: '8px', fontSize: '1.75rem' }}>{ticket.subject}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        {ticket.status} - {ticket.category}
      </p>

      <div
        style={{
          padding: '24px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Messages</h2>
        {messagesLoading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg._id}
              message={msg}
              ticketId={id}
              onReply={(content, parentId) => addMessage.mutate({ content, parentMessageId: parentId })}
              depth={0}
            />
          ))
        )}

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Add a message..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}
          />
          <button
            onClick={() => addMessage.mutate({ content: newMessage })}
            disabled={addMessage.isPending || !newMessage.trim()}
            style={{
              padding: '10px 20px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: 'white',
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
