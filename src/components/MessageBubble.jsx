import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon, CheckIcon, ThumbUpIcon, ThumbDownIcon, RefreshIcon, UserIcon } from './Icons';

function MessageBubble({ message, onRetry }) {
  const isUser = message.role === 'user';
  const [copied, setCopied]     = useState(false);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  }

  return (
    <div className={`msg-row ${isUser ? 'user' : 'agent'}`}>
      {/* Avatar */}
      <div className="msg-avatar">
        {isUser ? <UserIcon size={13} /> : <span>IBM</span>}
      </div>

      <div className="msg-content">
        <div className="msg-name">{isUser ? 'You' : 'IBM Consulting AI'}</div>

        {/* Bubble */}
        <div className={`msg-bubble${message.isError ? ' error' : ''}`}>
          {isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
          ) : message.isStreaming && !message.text ? (
            /* Typing dots shown before first word arrives */
            <div className="typing-dots">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
              {message.isStreaming && <span className="streaming-cursor" />}
            </div>
          )}

          {message.isError && onRetry && (
            <button onClick={onRetry} className="retry-btn">
              <RefreshIcon size={12} /> Try again
            </button>
          )}
        </div>

        {/* Hover actions */}
        {!message.isStreaming && message.text && !message.isError && (
          <div className="msg-actions">
            <button
              onClick={handleCopy}
              className={`action-btn ${copied ? 'done' : ''}`}
              title="Copy"
            >
              {copied ? <><CheckIcon size={12} /> Copied</> : <><CopyIcon size={12} /> Copy</>}
            </button>

            {!isUser && (
              <>
                <button
                  onClick={() => setFeedback(f => f === 'up' ? null : 'up')}
                  className={`action-btn${feedback === 'up' ? ' active' : ''}`}
                  title="Helpful"
                >
                  <ThumbUpIcon size={12} />
                </button>
                <button
                  onClick={() => setFeedback(f => f === 'down' ? null : 'down')}
                  className={`action-btn${feedback === 'down' ? ' active' : ''}`}
                  title="Not helpful"
                >
                  <ThumbDownIcon size={12} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="msg-time">{time}</div>
      </div>
    </div>
  );
}

export default MessageBubble;
