import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';

function ChatWindow({ messages, isLoading, onSelectSuggestion, onRetry }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="chat-window">
      {isEmpty ? (
        <SuggestedQuestions onSelect={onSelectSuggestion} />
      ) : (
        <div className="chat-messages">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onRetry={msg.isError ? onRetry : undefined}
            />
          ))}

          {/* Typing indicator while API call is in flight */}
          {isLoading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
