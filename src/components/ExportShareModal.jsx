import React, { useState, useEffect } from 'react';
import { CloseIcon, CopyIcon, CheckIcon } from './Icons';
import { supabase } from '../lib/supabase';

// ── Format helpers ─────────────────────────────────────────────────────────────
function toMarkdown(messages, title) {
  const ts = new Date().toLocaleString();
  const header = `# ${title || 'IBM Consulting AI Chat'}\n\n> Exported ${ts}\n\n---\n\n`;
  const body = messages.map(m => {
    const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const who  = m.role === 'user' ? '**You**' : '**IBM Consulting AI**';
    return `${who} *(${time})*\n\n${m.text}`;
  }).join('\n\n---\n\n');
  return header + body + '\n';
}

function toPlainText(messages, title) {
  const ts = new Date().toLocaleString();
  const sep = '-'.repeat(48);
  const header = `${title || 'IBM Consulting AI Chat'}\nExported: ${ts}\n${'='.repeat(48)}\n\n`;
  const body = messages.map(m => {
    const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const who  = m.role === 'user' ? 'You' : 'IBM Consulting AI';
    return `[${who}] ${time}\n${m.text}`;
  }).join(`\n\n${sep}\n\n`);
  return header + body + '\n';
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ─────────────────────────────────────────────────────────────
function ExportShareModal({ conversationId, conversationTitle, messages, onClose }) {
  const [isPublic, setIsPublic]     = useState(false);
  const [slug, setSlug]             = useState(null);
  const [toggleLoading, setToggle]  = useState(false);
  const [copied, setCopied]         = useState('');  // 'all' | 'url' | ''

  // Load current share state
  useEffect(() => {
    if (!conversationId) return;
    supabase
      .from('conversations')
      .select('is_public, public_slug')
      .eq('id', conversationId)
      .single()
      .then(({ data }) => {
        if (data) { setIsPublic(data.is_public); setSlug(data.public_slug); }
      });
  }, [conversationId]);

  const shareUrl = slug ? `${window.location.origin}/share/${slug}` : null;

  async function handleTogglePublic() {
    setToggle(true);
    try {
      if (isPublic) {
        await supabase.from('conversations').update({ is_public: false, public_slug: null }).eq('id', conversationId);
        setIsPublic(false); setSlug(null);
      } else {
        const newSlug = Math.random().toString(36).slice(2, 10);
        await supabase.from('conversations').update({ is_public: true, public_slug: newSlug }).eq('id', conversationId);
        setIsPublic(true); setSlug(newSlug);
      }
    } finally { setToggle(false); }
  }

  async function copy(text, key) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  const safeTitle = (conversationTitle || 'chat').replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-head">
          <h2 className="modal-title">Export &amp; Share</h2>
          <button onClick={onClose} className="modal-close"><CloseIcon size={16} /></button>
        </div>

        {/* ── Export section ── */}
        <div className="modal-section">
          <p className="modal-section-title">📥 Export conversation</p>
          <div className="export-btns">
            <button className="export-btn" onClick={() => copy(toMarkdown(messages, conversationTitle), 'all')}>
              {copied === 'all' ? <><CheckIcon size={13}/> Copied!</> : <><CopyIcon size={13}/> Copy all</>}
            </button>
            <button className="export-btn" onClick={() => download(toMarkdown(messages, conversationTitle), `${safeTitle}.md`, 'text/markdown')}>
              ↓ Markdown
            </button>
            <button className="export-btn" onClick={() => download(toPlainText(messages, conversationTitle), `${safeTitle}.txt`, 'text/plain')}>
              ↓ Plain text
            </button>
          </div>
          <p className="modal-hint">{messages.length} message{messages.length !== 1 ? 's' : ''} in this conversation</p>
        </div>

        <div className="modal-divider" />

        {/* ── Share section ── */}
        <div className="modal-section">
          <p className="modal-section-title">🔗 Share link</p>

          <div className="share-toggle-row">
            <div>
              <p className="share-toggle-label">Public access</p>
              <p className="share-toggle-sub">Anyone with the link can read this conversation</p>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={toggleLoading}
              className={`toggle-switch ${isPublic ? 'on' : ''}`}
              aria-checked={isPublic}
              role="switch"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {isPublic && shareUrl && (
            <div className="share-url-row">
              <input readOnly value={shareUrl} className="share-url-input" onClick={e => e.target.select()} />
              <button
                className={`export-btn ${copied === 'url' ? 'done' : ''}`}
                onClick={() => copy(shareUrl, 'url')}
              >
                {copied === 'url' ? <><CheckIcon size={13}/> Copied</> : <><CopyIcon size={13}/> Copy</>}
              </button>
            </div>
          )}

          {!isPublic && (
            <p className="modal-hint">Enable public access to generate a shareable link.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportShareModal;
