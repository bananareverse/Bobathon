import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import FollowUpSuggestions from './FollowUpSuggestions';

function ChatWindow({ messages, isLoading, isStreaming, followUps, onSelectSuggestion, onRetry, onRegenerate }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, followUps]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="chat-window">
      {isEmpty ? (
        <SuggestedQuestions onSelect={onSelectSuggestion} />
      ) : (
        <div className="chat-messages">
          {messages.map((msg, i) => {
            const isLastAgent =
              msg.role === 'agent' && i === messages.length - 1 && !isLoading && !isStreaming && !msg.isError;

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                onRetry={msg.isError ? onRetry : undefined}
                onRegenerate={isLastAgent ? onRegenerate : undefined}
              />
            );
          })}

          {/* Typing indicator while API is responding */}
          {isLoading && <TypingIndicator />}

          {/* Suggested follow-up questions */}
          {!isLoading && !isStreaming && followUps?.length > 0 && (
            <FollowUpSuggestions suggestions={followUps} onSelect={onSelectSuggestion} />
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
