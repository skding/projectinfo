import Link from 'next/link';
import LogoutButton from './LogoutButton';

interface NavbarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
    currentPage?: 'dashboard' | 'users' | 'settings' | 'project';
}

export default function Navbar({ user, currentPage = 'dashboard' }: NavbarProps) {
    const isAdmin = user?.role === 'ADMIN';

    return (
        <header
            className="glass-panel"
            style={{
                padding: '0.875rem 1.75rem',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.75)',
            }}
        >
            {/* Brand Logo & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
                            PROJECT <span style={{ color: '#60a5fa' }}>HUB</span>
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Industrial Engineering Portal
                        </div>
                    </div>
                </Link>

                {/* Main Navigation Links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                    <Link
                        href="/"
                        className="btn btn-sm"
                        style={{
                            background: currentPage === 'dashboard' ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                            color: currentPage === 'dashboard' ? '#60a5fa' : 'var(--secondary)',
                            border: currentPage === 'dashboard' ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
                            fontWeight: currentPage === 'dashboard' ? 600 : 500,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/users"
                        className="btn btn-sm"
                        style={{
                            background: currentPage === 'users' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                            color: currentPage === 'users' ? '#c084fc' : 'var(--secondary)',
                            border: currentPage === 'users' ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                            fontWeight: currentPage === 'users' ? 600 : 500,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Users
                        {isAdmin && (
                            <span style={{ fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.3)', color: '#e9d5ff', padding: '1px 5px', borderRadius: '4px' }}>
                                Admin
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/settings"
                        className="btn btn-sm"
                        style={{
                            background: currentPage === 'settings' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: currentPage === 'settings' ? '#ffffff' : 'var(--secondary)',
                            border: currentPage === 'settings' ? '1px solid var(--glass-border)' : '1px solid transparent',
                            fontWeight: currentPage === 'settings' ? 600 : 500,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                    </Link>
                </nav>
            </div>

            {/* User Profile and Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
                {user && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--glass-border)',
                        }}
                    >
                        <div
                            style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'white',
                            }}
                        >
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--foreground)' }}>
                                {user.name || user.email?.split('@')[0]}
                            </span>
                        </div>
                        <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                            {user.role || 'USER'}
                        </span>
                    </div>
                )}

                <Link href="/projects/new" className="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Project
                </Link>

                <LogoutButton />
            </div>
        </header>
    );
}
