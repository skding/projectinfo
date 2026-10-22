'use client';

import { logout } from '@/lib/auth-actions';
import { useTransition } from 'react';

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            onClick={() => {
                startTransition(async () => {
                    await logout();
                });
            }}
            disabled={isPending}
            className="btn btn-danger btn-sm"
            style={{
                fontSize: '0.825rem',
                padding: '0.45rem 0.85rem',
            }}
            title="Sign out of system"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
        </button>
    );
}
