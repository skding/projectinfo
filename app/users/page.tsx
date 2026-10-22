import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import DeleteButton from '@/app/components/DeleteButton';
import { createUser, deleteUser } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const currentUserId = session.user.id;
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { uploadedFiles: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            {/* Top Navigation */}
            <Navbar user={session.user} currentPage="users" />

            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                }}
            >
                <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-purple">Access Control</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Team Directory</span>
                    </div>
                    <h1
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '-0.025em',
                            color: '#ffffff',
                            lineHeight: 1.2,
                            wordBreak: 'break-word',
                        }}
                    >
                        User Management
                    </h1>
                    <p style={{ color: 'var(--secondary)', margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
                        Manage engineering accounts, configure roles, and grant administrator permissions ({users.length} active users)
                    </p>
                </div>
            </div>

            {/* Layout: Add User Panel on Left/Top, User Table on Right/Bottom */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start',
                }}
            >
                {/* Add User Card */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(59, 130, 246, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#60a5fa',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                            Add New User
                        </h2>
                    </div>

                    <form action={createUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                name="name"
                                placeholder="e.g. Alex Johnson"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Email Address <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="e.g. alex@company.com"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Initial Password <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Minimum 6 characters"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Role</label>
                            <select name="role" className="form-select" defaultValue="USER">
                                <option value="USER">USER (Standard Engineer)</option>
                                <option value="ADMIN">ADMIN (Full System Administrator)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Create User Account
                        </button>
                    </form>
                </div>

                {/* Users Directory Table */}
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                            Existing Users ({users.length})
                        </h2>
                    </div>

                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Releases Uploaded</th>
                                    <th>Created Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const isSelf = u.id === currentUserId;
                                    const isAdmin = u.role === 'ADMIN';

                                    return (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 700,
                                                            color: 'white',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {(u.name || u.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: '#ffffff' }}>
                                                            {u.name || 'Unnamed User'}
                                                            {isSelf && (
                                                                <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-blue'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--secondary)' }}>
                                                {u._count.uploadedFiles} releases
                                            </td>
                                            <td style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>
                                                {new Date(u.createdAt).toISOString().split('T')[0]}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <Link
                                                        href={`/users/${u.id}/edit`}
                                                        className="btn btn-secondary btn-sm"
                                                        style={{ padding: '0.3rem 0.6rem' }}
                                                    >
                                                        Edit
                                                    </Link>
                                                    {!isSelf && (
                                                        <DeleteButton id={u.id} onDelete={deleteUser.bind(null, u.id)} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
