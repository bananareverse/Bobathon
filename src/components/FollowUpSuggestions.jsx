import React from 'react';
import { ChevronRightIcon } from './Icons';

/**
 * Clickable follow-up question chips shown below the last agent response.
 * Clicking sends that question immediately.
 */
function FollowUpSuggestions({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <div className="follow-ups" role="complementary" aria-label="Suggested follow-up questions">
      <p className="follow-ups-label">Suggested follow-ups</p>
      <div className="follow-ups-list">
        {suggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSelect(text)}
            className="follow-up-chip"
          >
            <span>{text}</span>
            <ChevronRightIcon size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default FollowUpSuggestions;
