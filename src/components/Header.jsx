import React from 'react';
import { MenuIcon, SunIcon, MoonIcon } from './Icons';

function Header({ isDark, onToggleDark, isLoading, onMenuToggle }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Left: menu + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onMenuToggle}
            className="icon-btn sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={18} />
          </button>
          <div className="header-logo">
            <span>IBM</span>
          </div>
          <div>
            <div className="header-title">IBM Consulting AI</div>
            <div className="header-subtitle">Bob-a-thon · Q&amp;A Assistant</div>
          </div>
        </div>

        {/* Right: status + dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="status-pill">
            <span className={`status-dot ${isLoading ? 'thinking' : ''}`} />
            <span>{isLoading ? 'Thinking…' : 'Online'}</span>
          </div>

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
