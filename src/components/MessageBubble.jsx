import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
  );
}

function MessageBubble({ message, onRetry }) {
  const isUser   = message.role === 'user';
  const [copied, setCopied]   = useState(false);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  }

  function toggleFeedback(value) {
    setFeedback(prev => prev === value ? null : value);
  }

  return (
    <div className={`msg-row ${isUser ? 'user' : 'agent'}`}>
      {/* Avatar */}
      <div className="msg-avatar">
        {isUser ? <UserIcon /> : <span>IBM</span>}
      </div>

      <div className="msg-content">
        <div className="msg-name">{isUser ? 'You' : 'IBM Consulting AI'}</div>

        {/* Bubble */}
        <div className={`msg-bubble${message.isError ? ' error' : ''}`}>
          {isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
          ) : message.isStreaming && !message.text ? (
            /* Typing dots while first words load */
            <div className="typing-dots">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            /* Markdown for agent responses */
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
              {message.isStreaming && <span className="streaming-cursor" />}
            </div>
          )}

          {/* Retry button on errors */}
          {message.isError && onRetry && (
            <button onClick={onRetry} className="retry-btn">
              <RetryIcon /> Try again
            </button>
          )}
        </div>

        {/* Message actions (visible on row hover) */}
        {!message.isStreaming && message.text && !message.isError && (
          <div className="msg-actions">
            <button
              onClick={handleCopy}
              className={`action-btn ${copied ? 'done' : ''}`}
              title="Copy"
            >
              {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
            </button>

            {/* Feedback only on agent messages */}
            {!isUser && (
              <>
                <button
                  onClick={() => toggleFeedback('up')}
                  className={`action-btn ${feedback === 'up' ? 'active' : ''}`}
                  title="Helpful"
                >
                  👍
                </button>
                <button
                  onClick={() => toggleFeedback('down')}
                  className={`action-btn ${feedback === 'down' ? 'active' : ''}`}
                  title="Not helpful"
                >
                  👎
                </button>
              </>
            )}
          </div>
        )}

        <div className="msg-time">{formattedTime}</div>
      </div>
    </div>
  );
}

export default MessageBubble;
