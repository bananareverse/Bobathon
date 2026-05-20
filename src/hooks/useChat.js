import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

// ── API Configuration ─────────────────────────────────────────────────────────
export const API_URL = 'https://api-placeholder.com/ask';
// ─────────────────────────────────────────────────────────────────────────────

// ══ Follow-up suggestion engine ═══════════════════════════════════════════════
const TOPIC_FOLLOWUPS = {
  ica: [
    'How does IBM Consulting Advantage speed up delivery timelines?',
    'Which AI capabilities are built into the ICA platform?',
    'How do IBM consultants apply ICA during client engagements?',
  ],
  cloud: [
    'What is IBM\'s hybrid cloud migration methodology?',
    'How does Red Hat OpenShift fit into IBM\'s cloud strategy?',
    'Which industries benefit most from IBM\'s cloud services?',
  ],
  ai: [
    'How does IBM\'s watsonx platform support enterprise AI adoption?',
    'What is IBM\'s approach to responsible AI and governance?',
    'How does IBM help organizations scale AI from pilot to production?',
  ],
  digital: [
    'What design methodologies does IBM Consulting use?',
    'How does IBM approach human-centered design at enterprise scale?',
    'What is IBM\'s process for digital product engineering?',
  ],
  modernization: [
    'What is IBM\'s approach to mainframe modernization?',
    'How long does a typical application modernization engagement take?',
    'What are the biggest risks in legacy system migration?',
  ],
  security: [
    'What cybersecurity frameworks does IBM Consulting recommend?',
    'How does IBM help implement zero-trust security architecture?',
    'What does IBM\'s incident response planning look like?',
  ],
  default: [
    'What other IBM Consulting services are available?',
    'How does IBM Consulting approach digital transformation?',
    'What industries does IBM Consulting specialize in?',
  ],
};

function detectTopic(text) {
  const t = text.toLowerCase();
  if (/\b(ica|consulting advantage)\b/.test(t))                        return 'ica';
  if (/\b(cloud|hybrid|openshift|kubernetes|aws|azure)\b/.test(t))    return 'cloud';
  if (/\b(ai|watson|artificial intelligence|machine learning|llm)\b/.test(t)) return 'ai';
  if (/\b(digital|design|engineering|ux|product)\b/.test(t))          return 'digital';
  if (/\b(modernization|legacy|mainframe|migration)\b/.test(t))       return 'modernization';
  if (/\b(security|cyber|risk|compliance|soc)\b/.test(t))             return 'security';
  return 'default';
}

async function generateFollowUps(question, answer) {
  // Try to get contextual follow-ups from the real API
  try {
    const { data } = await axios.post(API_URL, {
      question:
        `Based on this Q&A, suggest exactly 3 concise follow-up questions (output only the questions, one per line, no numbers or bullets):\nQ: ${question}\nA: ${answer.slice(0, 500)}`,
    });
    const lines = (data?.answer || '')
      .split('\n')
      .map(l => l.replace(/^[\d\.\-\*\)]+\s*/, '').trim())
      .filter(l => l.length > 8 && l.includes('?'))
      .slice(0, 3);
    if (lines.length >= 2) return lines;
  } catch (_) { /* API unavailable — use fallback */ }

  // Smart fallback: topic detection
  const topic = detectTopic(question + ' ' + answer);
  return TOPIC_FOLLOWUPS[topic] ?? TOPIC_FOLLOWUPS.default;
}
// ══════════════════════════════════════════════════════════════════════════════

let idCounter = 0;
const nextId = () => ++idCounter;

function localMsg(role, text, extra = {}) {
  return { id: nextId(), role, text, timestamp: Date.now(), ...extra };
}

async function saveMessage(convId, role, content) {
  if (!convId) return null;
  const { data } = await supabase
    .from('messages')
    .insert({ conversation_id: convId, role, content })
    .select('id')
    .single();
  return data?.id ?? null;
}

export function useChat({ conversationId, onTitleUpdate, onTouch }) {
  const [messages, setMessages]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUps, setFollowUps]   = useState([]);

  const lastQuestionRef = useRef(null);
  const isFirstMsgRef   = useRef(true);
  const stopRef         = useRef(false);

  // ── Load messages when conversation switches ────────────────────────────────
  useEffect(() => {
    if (!conversationId) { setMessages([]); setFollowUps([]); isFirstMsgRef.current = true; return; }

    setMessages([]); setFollowUps([]); isFirstMsgRef.current = true;

    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data?.length) {
          setMessages(data.map(m => ({
            id: m.id, role: m.role, text: m.content,
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

  // ── Core request (shared by sendQuestion & regenerate) ─────────────────────
  const doRequest = useCallback(async (question, cid, addUserMsg) => {
    setFollowUps([]);

    if (addUserMsg) {
      setMessages(prev => [...prev, localMsg('user', question)]);
      setIsLoading(true);
      await saveMessage(cid, 'user', question);

      if (isFirstMsgRef.current) {
        isFirstMsgRef.current = false;
        const title = question.length > 38 ? question.slice(0, 35) + '…' : question;
        onTitleUpdate?.(cid, title);
      }
    } else {
      setIsLoading(true);
    }

    try {
      const { data } = await axios.post(API_URL, { question });
      const answer   = data?.answer ?? 'No answer received from the server.';
      setIsLoading(false);

      const agentId = nextId();
      setMessages(prev => [...prev, { id: agentId, role: 'agent', text: '', timestamp: Date.now(), isStreaming: true }]);
      const finalText = await streamText(answer, agentId);

      await saveMessage(cid, 'agent', answer);
      onTouch?.(cid);

      // Generate follow-up suggestions (non-blocking)
      generateFollowUps(question, finalText || answer).then(setFollowUps);
    } catch (err) {
      setIsLoading(false);
      const errText = err.response?.data?.message
        || 'Unable to reach IBM Consulting AI. Please check your connection and try again.';
      setMessages(prev => [...prev, localMsg('agent', errText, { isError: true })]);
    }
  }, [streamText, onTitleUpdate, onTouch]);

  // ── Public API ─────────────────────────────────────────────────────────────
  const sendQuestion = useCallback(async (question, overrideConvId) => {
    if (!question.trim() || isLoading || isStreaming) return;
    const cid = overrideConvId ?? conversationId;
    if (!cid) return;
    setMessages(prev => prev.filter(m => !m.isError));
    lastQuestionRef.current = question;
    await doRequest(question, cid, true);
  }, [isLoading, isStreaming, conversationId, doRequest]);

  const regenerate = useCallback(async () => {
    if (!lastQuestionRef.current || isLoading || isStreaming || !conversationId) return;

    // Remove last agent message from state + Supabase
    let supabaseId = null;
    setMessages(prev => {
      const idx = [...prev].reverse().findIndex(m => m.role === 'agent' && !m.isError);
      if (idx === -1) return prev;
      const actual = prev.length - 1 - idx;
      supabaseId = typeof prev[actual]?.id === 'string' ? prev[actual].id : null;
      return prev.filter((_, i) => i !== actual);
    });
    if (supabaseId) supabase.from('messages').delete().eq('id', supabaseId).then(() => {});

    await doRequest(lastQuestionRef.current, conversationId, false);
  }, [isLoading, isStreaming, conversationId, doRequest]);

  const retry = useCallback(() => {
    if (lastQuestionRef.current) sendQuestion(lastQuestionRef.current);
  }, [sendQuestion]);

  const clearLocalMessages = useCallback(() => {
    stopRef.current = true;
    setMessages([]); setFollowUps([]);
    setIsLoading(false); setIsStreaming(false);
    lastQuestionRef.current = null; isFirstMsgRef.current = true;
  }, []);

  return { messages, isLoading, isStreaming, followUps, sendQuestion, regenerate, retry, clearLocalMessages };
}
