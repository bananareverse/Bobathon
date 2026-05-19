import React from 'react';

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function Header({ isDark, onToggleDark, onClearChat, isLoading, hasMessages }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-logo">
            <span>IBM</span>
          </div>
          <div>
            <div className="header-title">IBM Consulting AI</div>
            <div className="header-subtitle">Bob-a-thon · Q&amp;A Assistant</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Status */}
          <div className="status-pill">
            <span className={`status-dot ${isLoading ? 'thinking' : ''}`} />
            <span style={{ display: 'none' }} className="sm-show">
              {isLoading ? 'Thinking…' : 'Online'}
            </span>
            <span>{isLoading ? 'Thinking…' : 'Online'}</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="icon-btn"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Clear chat */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              disabled={isLoading}
              className="text-btn"
              title="Clear conversation"
            >
              <TrashIcon />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
