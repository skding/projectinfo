'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-4rem' }}>
            <form action={dispatch} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h1 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Login</h1>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Email</label>
                    <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Password</label>
                    <input type="password" name="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                {errorMessage && <p style={{ color: 'red', fontSize: '0.9rem' }}>{errorMessage}</p>}
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </div>
    );
}
