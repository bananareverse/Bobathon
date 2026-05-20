/**
 * Minimalist SVG icon library — 24×24 viewBox, strokeWidth 1.5
 * All icons are purely decorative (aria-hidden="true" by default).
 */

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function PlusIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M12 5v14M5 12h14"/></svg>;
}

export function TrashIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
}

export function SignOutIcon({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

export function MenuIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}

export function CloseIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

export function ChatIcon({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}

export function SendIcon({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}

export function CopyIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
}

export function CheckIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><polyline points="20 6 9 17 4 12"/></svg>;
}

export function ThumbUpIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>;
}

export function ThumbDownIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>;
}

export function RefreshIcon({ size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>;
}

export function EyeIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

export function EyeOffIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>;
}

export function UserIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

export function SunIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}

export function MoonIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
}

export function SpinnerIcon({ size = 17 }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export function ChevronRightIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}><polyline points="9 18 15 12 9 6"/></svg>;
}
