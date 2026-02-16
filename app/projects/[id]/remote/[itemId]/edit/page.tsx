import { prisma } from '@/lib/prisma';
import { updateRemoteAccess } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function EditRemoteAccessPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const { id, itemId } = await params;
    const remote = await prisma.remoteAccess.findUnique({ where: { id: itemId } });

    if (!remote) return <div>Remote Access not found</div>;

    const updateAction = updateRemoteAccess.bind(null, itemId, id);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Edit Remote Access</h1>
            <form action={updateAction} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Name</label>
                    <input name="name" defaultValue={remote.name} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Type</label>
                    <select name="type" defaultValue={remote.type} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}>
                        <option value="AnyDesk">AnyDesk</option>
                        <option value="TeamViewer">TeamViewer</option>
                        <option value="VPN">VPN</option>
                        <option value="RDP">RDP</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>ID / Address</label>
                    <input name="remoteId" defaultValue={remote.remoteId || ''} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Username</label>
                    <input name="username" defaultValue={remote.username || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Password</label>
                    <input name="password" defaultValue={remote.password || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Notes</label>
                    <textarea name="notes" defaultValue={remote.notes || ''} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Remote Access</button>
            </form>
        </div>
    );
}
