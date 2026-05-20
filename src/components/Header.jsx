import React from 'react';
import { MenuIcon, SunIcon, MoonIcon } from './Icons';

function ShareExportIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}

function Header({ isDark, onToggleDark, isLoading, onMenuToggle, hasMessages, onExportShare }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Left: hamburger + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onMenuToggle}
            className="icon-btn sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={18} />
          </button>
          <div className="header-logo"><span>IBM</span></div>
          <div>
            <div className="header-title">IBM Consulting AI</div>
            <div className="header-subtitle">Bob-a-thon · Q&amp;A Assistant</div>
          </div>
        </div>

        {/* Right: status + export + dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="status-pill">
            <span className={`status-dot ${isLoading ? 'thinking' : ''}`} />
            <span>{isLoading ? 'Thinking…' : 'Online'}</span>
          </div>

          {hasMessages && (
            <button
              onClick={onExportShare}
              className="icon-btn"
              title="Export or share this conversation"
              aria-label="Export or share"
            >
              <ShareExportIcon size={16} />
            </button>
          )}

          <button
            onClick={onToggleDark}
            className="icon-btn"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
