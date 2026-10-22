import { prisma } from '@/lib/prisma';
import { updateEquipment } from '@/lib/actions';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function EditEquipmentPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const session = await auth();
    const { id, itemId } = await params;
    const equipment = await prisma.equipment.findUnique({ where: { id: itemId } });

    if (!equipment) return <div>Equipment not found</div>;

    const updateAction = updateEquipment.bind(null, itemId, id);

    return (
        <div>
            <Navbar user={session?.user} currentPage="project" />

            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <Link
                        href={`/projects/${id}`}
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
                        Back to Project
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: '2.25rem' }}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-blue">Hardware Configuration</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Edit Equipment Details
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Update device credentials and IP assignment for {equipment.name}
                        </p>
                    </div>

                    <form action={updateAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">
                                    Device Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    name="name"
                                    defaultValue={equipment.name}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Device Type</label>
                                <select name="type" defaultValue={equipment.type || 'PLC'} className="form-select">
                                    <option value="PLC">PLC (Programmable Logic Controller)</option>
                                    <option value="HMI">HMI (Human Machine Interface Panel)</option>
                                    <option value="SCADA">SCADA Server / Workstation</option>
                                    <option value="HISTORIAN">Historian / Database Server</option>
                                    <option value="SWITCH_ROUTER">Managed Switch / Gateway / Router</option>
                                    <option value="VFD_DRIVE">VFD / Inverter / Servo Drive</option>
                                    <option value="SERVER">Server</option>
                                    <option value="WORKSTATION">Engineering Workstation</option>
                                    <option value="OTHER">Other Device</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">IP Address</label>
                            <input
                                name="ipAddress"
                                defaultValue={equipment.ipAddress || ''}
                                className="form-input font-mono"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    name="username"
                                    defaultValue={equipment.username || ''}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input
                                    name="password"
                                    type="text"
                                    defaultValue={equipment.password || ''}
                                    className="form-input font-mono"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Save Changes
                            </button>
                            <Link href={`/projects/${id}`} className="btn btn-secondary">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
