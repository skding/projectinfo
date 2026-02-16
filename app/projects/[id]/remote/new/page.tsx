import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function NewRemoteAccess({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    async function addRemote(formData: FormData) {
        'use server';

        const name = formData.get('name') as string;
        const type = formData.get('type') as string;
        const remoteId = formData.get('remoteId') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const notes = formData.get('notes') as string;

        await prisma.remoteAccess.create({
            data: {
                projectId: id,
                name,
                type,
                remoteId,
                username,
                password,
                notes,
            },
        });

        redirect(`/projects/${id}`);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add Remote Access</h1>
            <form action={addRemote} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Name</label>
                    <input name="name" required placeholder="e.g. Main Server Anydesk" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Type</label>
                    <select name="type" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}>
                        <option value="AnyDesk">AnyDesk</option>
                        <option value="TeamViewer">TeamViewer</option>
                        <option value="VPN">VPN</option>
                        <option value="RDP">RDP</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>ID / Address</label>
                    <input name="remoteId" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Username</label>
                    <input name="username" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Password</label>
                    <input name="password" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Notes</label>
                    <textarea name="notes" rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Remote Access</button>
            </form>
        </div>
    );
}
