import React from 'react';

function TypingIndicator() {
  return (
    <div className="typing-row">
      <div className="msg-avatar" style={{ background: '#0062ff', boxShadow: '0 4px 16px rgba(0,98,255,0.35)' }}>
        <span style={{ fontSize: 10, fontWeight: 800 }}>IBM</span>
      </div>
      <div>
        <div className="msg-name">IBM Consulting AI</div>
        <div className="typing-bubble">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
