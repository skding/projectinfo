'use client';

import { useState } from 'react';
import CopyButton from './CopyButton';

export default function PasswordCell({ password }: { password?: string | null }) {
    const [revealed, setRevealed] = useState(false);

    if (!password) {
        return <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>-</span>;
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
                className="font-mono"
                style={{
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--glass-border)',
                    letterSpacing: revealed ? 'normal' : '2px',
                    color: revealed ? '#93c5fd' : '#94a3b8',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    userSelect: revealed ? 'all' : 'none'
                }}
            >
                {revealed ? password : '••••••••'}
            </span>
            <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                title={revealed ? 'Hide Password' : 'Show Password'}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                }}
            >
                {revealed ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
            <CopyButton text={password} title="Copy password" />
        </div>
    );
}
