import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function NewEquipment({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    async function addEquipment(formData: FormData) {
        'use server';

        const name = formData.get('name') as string;
        const ipAddress = formData.get('ipAddress') as string;
        const type = formData.get('type') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        await prisma.equipment.create({
            data: {
                projectId: id,
                name,
                ipAddress,
                type,
                username,
                password,
            },
        });

        redirect(`/projects/${id}`);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add New Equipment</h1>
            <form action={addEquipment} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Device Name</label>
                    <input name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>IP Address</label>
                    <input name="ipAddress" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Type</label>
                    <select name="type" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}>
                        <option value="PLC">PLC</option>
                        <option value="HMI">HMI</option>
                        <option value="SCADA">SCADA</option>
                        <option value="WORKSTATION">Workstation</option>
                        <option value="SERVER">Server</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Username</label>
                    <input name="username" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Password</label>
                    <input name="password" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Equipment</button>
            </form>
        </div>
    );
}
