import React, { useState, useRef } from 'react';
import { SendIcon, SpinnerIcon } from './Icons';

const MAX_CHARS = 2000;

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
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
              isLoading   ? 'IBM Consulting AI is thinking…' :
              isStreaming ? 'AI is responding…' :
              'Ask about IBM Consulting services…'
            }
            className="input-textarea"
          />
          {len > MAX_CHARS * 0.6 && (
            <span className={`char-counter ${charClass}`}>{len}/{MAX_CHARS}</span>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!canSend}
          className="send-btn"
          aria-label="Send message"
        >
          {busy ? <SpinnerIcon size={17} /> : <SendIcon size={17} />}
        </button>
      </div>

      <p className="input-hint">
        <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> new line
      </p>
    </div>
  );
}

export default InputArea;
