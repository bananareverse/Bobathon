import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// ── API Configuration ─────────────────────────────────────────────────────────
// Change this URL to point to your real backend when ready.
export const API_URL = 'https://api-placeholder.com/ask';
// ─────────────────────────────────────────────────────────────────────────────

let idCounter = 0;
const nextId = () => ++idCounter;

function createMsg(role, text, extra = {}) {
  return { id: nextId(), role, text, timestamp: Date.now(), ...extra };
}

export function useChat() {
  const [messages, setMessages]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastQuestionRef = useRef(null);
  const stopRef         = useRef(false);

  // Reveals fullText into a message word-by-word (streaming simulation)
  const streamText = useCallback(async (fullText, msgId) => {
    stopRef.current = false;
    setIsStreaming(true);

    // Split preserving whitespace tokens so spacing is natural
    const tokens = fullText.split(/(\s+)/);
    let current = '';

    for (const token of tokens) {
      if (stopRef.current) break;
      current += token;
      setMessages(prev =>
        prev.map(m => m.id === msgId ? { ...m, text: current } : m)
      );
      // Pause slightly longer on visible words, very brief on whitespace
      const delay = token.trim().length > 0 ? 18 + Math.random() * 28 : 4;
      await new Promise(r => setTimeout(r, delay));
    }

    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m)
    );
    setIsStreaming(false);
  }, []);

  const sendQuestion = useCallback(async (question) => {
    if (!question.trim() || isLoading || isStreaming) return;

    // Remove any previous error messages
    setMessages(prev => prev.filter(m => !m.isError));
    lastQuestionRef.current = question;

    setMessages(prev => [...prev, createMsg('user', question)]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(API_URL, { question });
      const answer = data?.answer ?? 'No answer was returned from the server.';

      setIsLoading(false);

      // Add agent message placeholder, then stream text into it
      const agentId = nextId();
      setMessages(prev => [
        ...prev,
        { id: agentId, role: 'agent', text: '', timestamp: Date.now(), isStreaming: true },
      ]);
      await streamText(answer, agentId);
    } catch (err) {
      setIsLoading(false);
      const errText =
        err.response?.data?.message ||
        'Unable to reach the IBM Consulting AI right now. Please check your connection and try again.';
      setMessages(prev => [...prev, createMsg('agent', errText, { isError: true })]);
    }
  }, [isLoading, isStreaming, streamText]);

  const retry = useCallback(() => {
    if (lastQuestionRef.current) sendQuestion(lastQuestionRef.current);
  }, [sendQuestion]);

  const clearChat = useCallback(() => {
    stopRef.current = true;   // abort any in-progress stream
    setMessages([]);
    setIsLoading(false);
    setIsStreaming(false);
    lastQuestionRef.current = null;
  }, []);

  return { messages, isLoading, isStreaming, sendQuestion, retry, clearChat };
}
