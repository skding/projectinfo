'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div
                style={{
                    width: '100%',
                    maxWidth: '1050px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'center',
                }}
            >
                {/* Left Side: Hero Branding & Portal Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.45)',
                            }}
                        >
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                        <div>
                            <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                                Industrial Control & SCADA Systems
                            </span>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                PROJECT <span style={{ color: '#60a5fa' }}>HUB</span>
                            </h1>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.1rem', color: 'var(--secondary)', lineHeight: 1.6, margin: 0 }}>
                        Centralized industrial automation records: track plant networks, PLC & SCADA equipment IPs, remote access tools, software credentials, and project releases.
                    </p>

                    {/* Feature highlights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div
                            className="glass-panel"
                            style={{
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#60a5fa',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                                    <line x1="6" y1="6" x2="6.01" y2="6" />
                                    <line x1="6" y1="18" x2="6.01" y2="18" />
                                </svg>
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Network & Equipment Directory</h4>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--secondary)' }}>
                                    Record PLCs, HMIs, SCADA servers, workstations, and IP configurations.
                                </p>
                            </div>
                        </div>

                        <div
                            className="glass-panel"
                            style={{
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#34d399',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 2l-2 2m-1-1l-3 3m5 0l-3-3m-3 3l-2 2m7-2l-2 2M3 13a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6z" />
                                </svg>
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Remote Access & Software Credentials</h4>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--secondary)' }}>
                                    Securely organize AnyDesk, VPNs, RDPs, and SCADA/PLC software accounts.
                                </p>
                            </div>
                        </div>

                        <div
                            className="glass-panel"
                            style={{
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#c084fc',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Project Releases & Version Logs</h4>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--secondary)' }}>
                                    Track project revisions, backup links, and engineer changelogs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Sign In Card */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        className="glass-panel"
                        style={{
                            padding: '2.5rem 2.25rem',
                            width: '100%',
                            maxWidth: '440px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.15)',
                        }}
                    >
                        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                                Engineer Sign In
                            </h2>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', margin: 0 }}>
                                Enter your credentials to access the project portal
                            </p>
                        </div>

                        {errorMessage && (
                            <div
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.35)',
                                    color: '#fca5a5',
                                    fontSize: '0.875rem',
                                    marginBottom: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form action={dispatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="form-label" htmlFor="email-input">
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="email-input"
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="engineer@company.com"
                                        className="form-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '0.85rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--muted)',
                                            pointerEvents: 'none',
                                            display: 'flex',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="form-label" htmlFor="password-input">
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password-input"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="form-input"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '0.85rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--muted)',
                                            pointerEvents: 'none',
                                            display: 'flex',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.85rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--secondary)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                        }}
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isPending}
                                style={{
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                {isPending ? (
                                    <>
                                        <svg
                                            style={{ animation: 'spin 1s linear infinite' }}
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    'Sign In to Dashboard'
                                )}
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: '1.75rem',
                                paddingTop: '1.25rem',
                                borderTop: '1px solid var(--glass-border)',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: 'var(--muted)',
                            }}
                        >
                            Default Administrator: <span style={{ color: '#93c5fd' }}>admin@example.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
