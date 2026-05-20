import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useDarkMode } from '../hooks/useDarkMode';
import MessageBubble from '../components/MessageBubble';
import { SunIcon, MoonIcon } from '../components/Icons';

/**
 * Public read-only view of a shared conversation.
 * Accessible at /share/:slug — no auth required.
 */
function SharePage({ slug }) {
  const { isDark, toggle } = useDarkMode();
  const [conv, setConv]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      const { data: convData, error: convErr } = await supabase
        .from('conversations')
        .select('*')
        .eq('public_slug', slug)
        .eq('is_public', true)
        .single();

      if (convErr || !convData) {
        setError('This conversation is not available. It may have been made private or deleted.');
        setLoading(false);
        return;
      }

      setConv(convData);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convData.id)
        .order('created_at', { ascending: true });

      setMessages((msgs || []).map(m => ({
        id:        m.id,
        role:      m.role,
        text:      m.content,
        timestamp: new Date(m.created_at).getTime(),
      })));
      setLoading(false);
    }
    load();
  }, [slug]);

  return (
    <div className={`app-root${isDark ? ' dark' : ''}`} style={{ height: '100%' }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="header-logo"><span>IBM</span></div>
            <div>
              <div className="header-title">IBM Consulting AI</div>
              <div className="header-subtitle">Shared conversation</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {conv && (
              <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}>
                🔗 Public
              </span>
            )}
            <button onClick={toggle} className="icon-btn" title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="chat-window" style={{ flex: 1 }}>
        {loading ? (
          <div className="loading-screen">
            <div className="loading-logo"><span>IBM</span></div>
            <p className="loading-text">Loading conversation…</p>
          </div>
        ) : error ? (
          <div className="loading-screen">
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>Not available</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '340px', textAlign: 'center' }}>{error}</p>
            <a href="/" style={{ marginTop: '20px', fontSize: '13px', color: 'var(--ibm-blue)', textDecoration: 'underline' }}>
              Go to IBM Consulting AI →
            </a>
          </div>
        ) : (
          <div className="chat-messages">
            {/* Conversation title */}
            {conv?.title && conv.title !== 'New Chat' && (
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{conv.title}</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {new Date(conv.created_at).toLocaleDateString([], { dateStyle: 'medium' })} · {messages.length} messages
                </p>
              </div>
            )}

            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '24px 0 8px', borderTop: '1px solid var(--border)', marginTop: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Shared via{' '}
                <a href="/" style={{ color: 'var(--ibm-blue)', fontWeight: 600, textDecoration: 'none' }}>IBM Consulting AI</a>
                {' '}· Bob-a-thon 2025
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SharePage;
