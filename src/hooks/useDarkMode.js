import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('ibm-qa-theme');
      if (saved) return saved === 'dark';
    } catch (_) {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ibm-qa-theme', isDark ? 'dark' : 'light');
    } catch (_) {}
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
}
