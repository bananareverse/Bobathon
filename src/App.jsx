import React from 'react';
import { useChat } from './hooks/useChat';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';

function App() {
  const { messages, isLoading, isStreaming, sendQuestion, retry, clearChat } = useChat();
  const { isDark, toggle: toggleDark } = useDarkMode();

  return (
    <div className={`app-root${isDark ? ' dark' : ''}`}>
      <Header
        isDark={isDark}
        onToggleDark={toggleDark}
        onClearChat={clearChat}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSelectSuggestion={sendQuestion}
        onRetry={retry}
      />

      <InputArea
        onSend={sendQuestion}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
    </div>
  );
}

export default App;
