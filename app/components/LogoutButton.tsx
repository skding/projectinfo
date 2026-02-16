'use client';

import { logout } from '@/lib/auth-actions';

export default function LogoutButton() {
    return (
        <button
            onClick={() => logout()}
            className="btn"
            style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', border: '1px solid rgba(255, 59, 48, 0.3)' }}
        >
            Logout
        </button>
    );
}
