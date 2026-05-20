import React, { useState } from 'react';
import { useAuth }          from './hooks/useAuth';
import { useDarkMode }      from './hooks/useDarkMode';
import { useConversations } from './hooks/useConversations';
import { useChat }          from './hooks/useChat';
import Header               from './components/Header';
import Sidebar              from './components/Sidebar';
import ChatWindow           from './components/ChatWindow';
import InputArea            from './components/InputArea';
import LoginPage            from './pages/LoginPage';

// ── Loading splash ─────────────────────────────────────────────────────────────
function LoadingScreen({ isDark }) {
  return (
    <div className={`app-root${isDark ? ' dark' : ''}`}>
      <div className="loading-screen">
        <div className="loading-logo"><span>IBM</span></div>
        <p className="loading-text">Loading…</p>
      </div>
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────────────────────
function ChatApp({ user, signOut, isDark, onToggleDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const conv = useConversations(user.id);

  const { messages, isLoading, isStreaming, sendQuestion, retry } = useChat({
    conversationId: conv.activeId,
    onTitleUpdate:  (cid, title) => conv.updateTitle(cid, title),
    onTouch:        (cid)        => conv.touch(cid),
  });

  async function handleSend(question) {
    let cid = conv.activeId;
    // If no conversation exists yet, create one on the fly
    if (!cid) {
      const newConv = await conv.create();
      cid = newConv.id;
    }
    sendQuestion(question, cid);
  }

  function handleNewChat() {
    conv.create().catch(console.error);
    setSidebarOpen(false);
  }

  function handleSelect(id) {
    conv.setActiveId(id);
    setSidebarOpen(false);
  }

  return (
    <div className={`app-root${isDark ? ' dark' : ''}`}>
      <Header
        isDark={isDark}
        onToggleDark={onToggleDark}
        isLoading={isLoading}
        onMenuToggle={() => setSidebarOpen(o => !o)}
      />

      <div className="app-body">
        <Sidebar
          conversations={conv.conversations}
          activeId={conv.activeId}
          onSelect={handleSelect}
          onNewChat={handleNewChat}
          onDelete={conv.remove}
          user={user}
          onSignOut={signOut}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="app-main">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSelectSuggestion={handleSend}
            onRetry={retry}
          />
          <InputArea
            onSend={handleSend}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
        </main>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { isDark, toggle: toggleDark } = useDarkMode();

  if (loading) return <LoadingScreen isDark={isDark} />;

  if (!user) {
    return (
      <LoginPage
        isDark={isDark}
        onToggleDark={toggleDark}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    );
  }

  return (
    <ChatApp
      user={user}
      signOut={signOut}
      isDark={isDark}
      onToggleDark={toggleDark}
    />
  );
}
