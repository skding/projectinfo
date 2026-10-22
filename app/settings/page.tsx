import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) return redirect('/login');

    async function changePassword(formData: FormData) {
        'use server';

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        const session = await auth();
        if (!session?.user?.email) return;

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return;

        const passwordsMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordsMatch) {
            console.error("Incorrect current password");
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: user.email },
            data: { passwordHash: hashedPassword },
        });

        await signOut({ redirectTo: '/login' });
    }

    return (
        <div>
            <Navbar user={session.user} currentPage="settings" />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <Link
                        href="/"
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
                        Back to Dashboard
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: '2.25rem' }}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-blue">Account Security</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Security & Password
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Update your credentials for <strong style={{ color: 'var(--foreground)' }}>{session.user.email}</strong>
                        </p>
                    </div>

                    <form action={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">Current Password</label>
                            <input
                                name="currentPassword"
                                type="password"
                                required
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">New Password</label>
                            <input
                                name="newPassword"
                                type="password"
                                required
                                minLength={6}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Confirm New Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                            Update Password & Sign In Again
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
