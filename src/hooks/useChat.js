import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

// ── API Configuration ─────────────────────────────────────────────────────────
// Change this URL to point to your real backend when ready.
export const API_URL = 'https://api-placeholder.com/ask';
// ─────────────────────────────────────────────────────────────────────────────

let idCounter = 0;
const nextId = () => ++idCounter;

function localMsg(role, text, extra = {}) {
  return { id: nextId(), role, text, timestamp: Date.now(), ...extra };
}

/**
 * @param {object} opts
 * @param {string|null}   opts.conversationId  – active conversation (drives message loading)
 * @param {function}      opts.onTitleUpdate   – (convId, title) called once on first message
 * @param {function}      opts.onTouch         – (convId) called after each exchange to bump updated_at
 */
export function useChat({ conversationId, onTitleUpdate, onTouch }) {
  const [messages, setMessages]       = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [isStreaming, setIsStreaming]  = useState(false);
  const lastQuestionRef  = useRef(null);
  const isFirstMsgRef    = useRef(true);
  const stopRef          = useRef(false);

  // ── Load messages when conversation changes ─────────────────────────────────
  useEffect(() => {
    if (!conversationId) { setMessages([]); isFirstMsgRef.current = true; return; }

    setMessages([]);
    isFirstMsgRef.current = true;

    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data?.length) {
          setMessages(data.map(m => ({
            id:        m.id,
            role:      m.role,
            text:      m.content,
            timestamp: new Date(m.created_at).getTime(),
          })));
          isFirstMsgRef.current = false;
        }
      });
  }, [conversationId]);

  // ── Streaming helper ────────────────────────────────────────────────────────
  const streamText = useCallback(async (fullText, msgId) => {
    stopRef.current = false;
    setIsStreaming(true);
    const tokens = fullText.split(/(\s+)/);
    let current = '';
    for (const token of tokens) {
      if (stopRef.current) break;
      current += token;
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: current } : m));
      await new Promise(r => setTimeout(r, token.trim().length ? 18 + Math.random() * 28 : 4));
    }
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m));
    setIsStreaming(false);
    return current;
  }, []);

  // ── Save a single message to Supabase ──────────────────────────────────────
  async function saveMessage(convId, role, content) {
    if (!convId) return;
    await supabase.from('messages').insert({ conversation_id: convId, role, content });
  }

  // ── Send question ──────────────────────────────────────────────────────────
  // `overrideConvId` lets App.jsx pass a freshly created conversation id before
  // React state has propagated (avoids stale-closure issues on first message).
  const sendQuestion = useCallback(async (question, overrideConvId) => {
    if (!question.trim() || isLoading || isStreaming) return;
    const cid = overrideConvId ?? conversationId;
    if (!cid) return;

    setMessages(prev => prev.filter(m => !m.isError));
    lastQuestionRef.current = question;

    // User bubble
    setMessages(prev => [...prev, localMsg('user', question)]);
    setIsLoading(true);
    await saveMessage(cid, 'user', question);

    // Auto-title from first question
    if (isFirstMsgRef.current) {
      isFirstMsgRef.current = false;
      const title = question.length > 38 ? question.slice(0, 35) + '…' : question;
      onTitleUpdate?.(cid, title);
    }

    try {
      const { data } = await axios.post(API_URL, { question });
      const answer   = data?.answer ?? 'No answer received from the server.';
      setIsLoading(false);

      // Agent placeholder → stream text in
      const agentId = nextId();
      setMessages(prev => [...prev, { id: agentId, role: 'agent', text: '', timestamp: Date.now(), isStreaming: true }]);
      await streamText(answer, agentId);

      // Persist final answer + bump conversation timestamp
      await saveMessage(cid, 'agent', answer);
      onTouch?.(cid);
    } catch (err) {
      setIsLoading(false);
      const errText = err.response?.data?.message
        || 'Unable to reach IBM Consulting AI. Please check your connection and try again.';
      setMessages(prev => [...prev, localMsg('agent', errText, { isError: true })]);
    }
  }, [isLoading, isStreaming, conversationId, streamText, onTitleUpdate, onTouch]);

  const retry = useCallback(() => {
    if (lastQuestionRef.current) sendQuestion(lastQuestionRef.current);
  }, [sendQuestion]);

  const clearLocalMessages = useCallback(() => {
    stopRef.current = true;
    setMessages([]);
    setIsLoading(false);
    setIsStreaming(false);
    lastQuestionRef.current = null;
    isFirstMsgRef.current   = true;
  }, []);

  return { messages, isLoading, isStreaming, sendQuestion, retry, clearLocalMessages };
}
