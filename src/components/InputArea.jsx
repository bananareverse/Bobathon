import React, { useState, useRef } from 'react';

const MAX_CHARS = 2000;

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function InputArea({ onSend, isLoading, isStreaming }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  const busy = isLoading || isStreaming;

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function handleChange(e) {
    if (e.target.value.length > MAX_CHARS) return;
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
  }

  const len = text.length;
  const charClass = len > MAX_CHARS * 0.9 ? 'over' : len > MAX_CHARS * 0.72 ? 'warn' : '';
  const canSend = text.trim().length > 0 && !busy;

  return (
    <div className="input-area">
      <div className="input-inner">
        <div className="input-wrapper">
          <textarea
            ref={ref}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={busy}
            rows={1}
            placeholder={
              isLoading
                ? 'IBM Consulting AI is thinking…'
                : isStreaming
                ? 'AI is responding…'
                : 'Ask about IBM Consulting services…'
            }
            className="input-textarea"
          />
          {len > MAX_CHARS * 0.6 && (
            <span className={`char-counter ${charClass}`}>
              {len}/{MAX_CHARS}
            </span>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!canSend}
          className="send-btn"
          aria-label="Send message"
        >
          {busy ? <SpinnerIcon /> : <SendIcon />}
        </button>
      </div>

      <p className="input-hint">
        <kbd>Enter</kbd> to send &nbsp;&middot;&nbsp; <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

export default InputArea;
