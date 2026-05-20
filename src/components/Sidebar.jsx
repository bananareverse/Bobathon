import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChatIcon, SignOutIcon, UserIcon } from './Icons';

/** Returns a short human-readable relative time label */
function relTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'Just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7)   return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function Sidebar({ conversations, activeId, onSelect, onNewChat, onDelete, user, onSignOut, isOpen, onClose }) {
  const [hovered, setHovered]       = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  function handleDelete(e, id) {
    e.stopPropagation();
    if (confirmDel === id) {
      onDelete(id);
      setConfirmDel(null);
    } else {
      setConfirmDel(id);
      setTimeout(() => setConfirmDel(null), 2500);
    }
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo"><span>IBM</span></div>
            <span className="sidebar-brand-text">Consulting AI</span>
          </div>
          <button onClick={onClose} className="sidebar-close-btn" title="Close menu">
            ×
          </button>
        </div>

        {/* New Chat */}
        <div className="sidebar-new">
          <button onClick={onNewChat} className="new-chat-btn">
            <PlusIcon size={15} />
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <nav className="sidebar-nav">
          {conversations.length === 0 ? (
            <p className="sidebar-empty">No conversations yet</p>
          ) : (
            conversations.map(conv => {
              const isActive = conv.id === activeId;
              return (
                <div
                  key={conv.id}
                  className={`sidebar-item${isActive ? ' active' : ''}`}
                  onClick={() => onSelect(conv.id)}
                  onMouseEnter={() => setHovered(conv.id)}
                  onMouseLeave={() => { setHovered(null); setConfirmDel(null); }}
                >
                  <ChatIcon size={14} />
                  <div className="sidebar-item-body">
                    <span className="sidebar-item-title">{conv.title}</span>
                    <span className="sidebar-item-time">{relTime(conv.updated_at)}</span>
                  </div>
                  {/* Delete button — show on hover */}
                  {(hovered === conv.id || confirmDel === conv.id) && (
                    <button
                      className={`sidebar-del-btn${confirmDel === conv.id ? ' confirm' : ''}`}
                      onClick={e => handleDelete(e, conv.id)}
                      title={confirmDel === conv.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <TrashIcon size={13} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* User section */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={onSignOut} className="signout-btn" title="Sign out">
            <SignOutIcon size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
