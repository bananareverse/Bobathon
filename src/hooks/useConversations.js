import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useConversations(userId) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId]           = useState(null);
  const [loading, setLoading]             = useState(true);

  // ── Load from Supabase ──────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!userId) { setConversations([]); setLoading(false); return; }
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    setConversations(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // Auto-select most recent conversation on first load
  useEffect(() => {
    if (!loading && conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [loading, conversations, activeId]);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  async function create() {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title: 'New Chat' })
      .select()
      .single();
    if (error) throw error;
    setConversations(prev => [data, ...prev]);
    setActiveId(data.id);
    return data;
  }

  async function updateTitle(id, title) {
    await supabase.from('conversations').update({ title }).eq('id', id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }

  async function remove(id) {
    await supabase.from('conversations').delete().eq('id', id);
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id);
      // If we deleted the active one, switch to the next available
      if (activeId === id) {
        setActiveId(remaining[0]?.id ?? null);
      }
      return remaining;
    });
  }

  // Bumps updated_at so the conversation floats to the top of the list
  async function touch(id) {
    const now = new Date().toISOString();
    await supabase.from('conversations').update({ updated_at: now }).eq('id', id);
    setConversations(prev =>
      [...prev.map(c => c.id === id ? { ...c, updated_at: now } : c)]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    );
  }

  return { conversations, activeId, setActiveId, loading, create, updateTitle, remove, touch };
}
