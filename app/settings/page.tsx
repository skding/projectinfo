import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) return redirect('/login');

    async function changePassword(formData: FormData) {
        'use server';

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            // Check handled by client or basic return
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
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Settings</h1>
            <form action={changePassword} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Change Password</h2>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Current Password</label>
                    <input name="currentPassword" type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>New Password</label>
                    <input name="newPassword" type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Confirm New Password</label>
                    <input name="confirmPassword" type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Password</button>
            </form>
        </div>
    );
}
