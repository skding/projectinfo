import { prisma } from '@/lib/prisma';
import { updateEquipment } from '@/lib/actions';

// Force dynamic since we use searchParams or just to be safe with data
export const dynamic = 'force-dynamic';

export default async function EditEquipmentPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const { id, itemId } = await params;
    const equipment = await prisma.equipment.findUnique({ where: { id: itemId } });

    if (!equipment) return <div>Equipment not found</div>;

    const updateAction = updateEquipment.bind(null, itemId, id);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Edit Equipment</h1>
            <form action={updateAction} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Name</label>
                    <input name="name" defaultValue={equipment.name} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>IP Address</label>
                    <input name="ipAddress" defaultValue={equipment.ipAddress || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Type</label>
                    <select name="type" defaultValue={equipment.type || 'PLC'} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}>
                        <option value="PLC">PLC</option>
                        <option value="HMI">HMI</option>
                        <option value="SCADA">SCADA</option>
                        <option value="WORKSTATION">Workstation</option>
                        <option value="SERVER">Server</option>
                        <option value="OTHERS">Others</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Username</label>
                    <input name="username" defaultValue={equipment.username || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Password</label>
                    <input name="password" defaultValue={equipment.password || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Equipment</button>
            </form>
        </div>
    );
}
