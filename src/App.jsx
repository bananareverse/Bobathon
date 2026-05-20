import React, { useState } from 'react';
import { useAuth }          from './hooks/useAuth';
import { useDarkMode }      from './hooks/useDarkMode';
import { useConversations } from './hooks/useConversations';
import { useChat }          from './hooks/useChat';
import Header               from './components/Header';
import Sidebar              from './components/Sidebar';
import ChatWindow           from './components/ChatWindow';
import InputArea            from './components/InputArea';
import ExportShareModal     from './components/ExportShareModal';
import LoginPage            from './pages/LoginPage';
import SharePage            from './pages/SharePage';

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

// ── Main authenticated app ─────────────────────────────────────────────────────
function ChatApp({ user, signOut, isDark, onToggleDark }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [showExport,  setShowExport]    = useState(false);

  const conv = useConversations(user.id);

  const { messages, isLoading, isStreaming, followUps, sendQuestion, regenerate, retry } = useChat({
    conversationId: conv.activeId,
    onTitleUpdate:  (cid, title) => conv.updateTitle(cid, title),
    onTouch:        (cid)        => conv.touch(cid),
  });

  async function handleSend(question) {
    let cid = conv.activeId;
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

  const activeConv = conv.conversations.find(c => c.id === conv.activeId);

  return (
    <div className={`app-root${isDark ? ' dark' : ''}`}>
      <Header
        isDark={isDark}
        onToggleDark={onToggleDark}
        isLoading={isLoading}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        hasMessages={messages.length > 0}
        onExportShare={() => setShowExport(true)}
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
            isStreaming={isStreaming}
            followUps={followUps}
            onSelectSuggestion={handleSend}
            onRetry={retry}
            onRegenerate={regenerate}
          />
          <InputArea
            onSend={handleSend}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
        </main>
      </div>

      {/* Export / Share modal */}
      {showExport && conv.activeId && (
        <ExportShareModal
          conversationId={conv.activeId}
          conversationTitle={activeConv?.title}
          messages={messages}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

// ── Root — handles share routing + auth gate ───────────────────────────────────
export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();

  // Simple SPA routing: /share/:slug renders the public share page
  const path = window.location.pathname;
  if (path.startsWith('/share/')) {
    const slug = path.slice(7).replace(/\/$/, '');
    return <SharePage slug={slug} />;
  }

  const { user, loading, signOut } = useAuth();

  if (loading) return <LoadingScreen isDark={isDark} />;

  if (!user) {
    return <LoginPage isDark={isDark} onToggleDark={toggleDark} />;
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
