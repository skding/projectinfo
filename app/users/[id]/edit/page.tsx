import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { updateUser } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const { id } = await params;
    const targetUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!targetUser) return notFound();

    const updateUserAction = updateUser.bind(null, id);

    return (
        <div>
            {/* Top Navigation */}
            <Navbar user={session.user} currentPage="users" />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <Link
                        href="/users"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: 'var(--secondary)',
                            fontSize: '0.875rem',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to User Management
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: '2.25rem' }}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-purple">Account Management</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Edit User Profile
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Modify user details, permissions, or reset login password
                        </p>
                    </div>

                    <form action={updateUserAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                name="name"
                                defaultValue={targetUser.name || ''}
                                placeholder="e.g. John Doe"
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
                                defaultValue={targetUser.email}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Role</label>
                            <select name="role" defaultValue={targetUser.role} className="form-select">
                                <option value="USER">USER (Standard Engineer)</option>
                                <option value="ADMIN">ADMIN (Full System Administrator)</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Reset Password <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(Leave blank to keep current)</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter new password if changing"
                                className="form-input"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Save Changes
                            </button>
                            <Link href="/users" className="btn btn-secondary">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
