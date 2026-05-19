import React, { useState } from 'react';

const CATEGORIES = ['All', 'AI & ML', 'Hybrid Cloud', 'Digital', 'Modernization'];

const SUGGESTIONS = [
  {
    icon: '🏢',
    text: 'What is IBM Consulting Advantage (ICA)?',
    category: 'All',
  },
  {
    icon: '☁️',
    text: 'What cloud services does IBM Consulting offer?',
    category: 'Hybrid Cloud',
  },
  {
    icon: '🤖',
    text: 'How does IBM help with AI integration?',
    category: 'AI & ML',
  },
  {
    icon: '🎨',
    text: 'What is Digital Product Design and Engineering?',
    category: 'Digital',
  },
  {
    icon: '⚙️',
    text: 'What does Application Modernization involve at IBM?',
    category: 'Modernization',
  },
  {
    icon: '📊',
    text: 'How does IBM Consulting approach data and analytics?',
    category: 'AI & ML',
  },
  {
    icon: '🌐',
    text: 'How does IBM support a hybrid cloud strategy?',
    category: 'Hybrid Cloud',
  },
  {
    icon: '🔒',
    text: 'What cybersecurity services does IBM Consulting offer?',
    category: 'All',
  },
];

function SuggestedQuestions({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? SUGGESTIONS
      : SUGGESTIONS.filter(s => s.category === activeCategory);

  return (
    <div className="welcome-screen">
      {/* Hero */}
      <div className="welcome-hero">
        <div className="welcome-logo">
          <span>IBM</span>
        </div>
        <h2 className="welcome-title">IBM Consulting AI Assistant</h2>
        <p className="welcome-sub">
          Ask me anything about IBM Consulting services — hybrid cloud,&nbsp;AI
          integration, digital engineering, and more.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-tab${activeCategory === cat ? ' active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Suggestion cards */}
      <div className="suggestion-grid">
        {filtered.map((s, i) => (
          <button key={i} onClick={() => onSelect(s.text)} className="suggestion-card">
            <span className="suggestion-icon">{s.icon}</span>
            <span className="suggestion-text">{s.text}</span>
          </button>
        ))}
      </div>

      <p className="welcome-footer">Bob-a-thon 2025 · IBM Consulting Internal Hackathon</p>
    </div>
  );
}

export default SuggestedQuestions;
