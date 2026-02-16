import { prisma } from '@/lib/prisma';
import { updateVersion } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function EditVersionPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const { id, itemId } = await params;
    const version = await prisma.projectVersion.findUnique({ where: { id: itemId } });

    if (!version) return <div>Version not found</div>;

    const updateAction = updateVersion.bind(null, itemId, id);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Edit Version</h1>
            <form action={updateAction} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Version Number</label>
                    <input name="versionNumber" defaultValue={version.versionNumber} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Link</label>
                    <input name="fileLink" defaultValue={version.fileLink} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Changelog</label>
                    <textarea name="changelog" defaultValue={version.changelog || ''} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Version</button>
            </form>
        </div>
    );
}
