import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export default async function NewEquipment({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true }
    });

    async function addEquipment(formData: FormData) {
        'use server';

        const name = (formData.get('name') as string)?.trim();
        const ipAddress = (formData.get('ipAddress') as string)?.trim() || null;
        const type = formData.get('type') as string;
        const username = (formData.get('username') as string)?.trim() || null;
        const password = (formData.get('password') as string)?.trim() || null;

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
                        Back to {project?.name || 'Project'}
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: '2.25rem' }}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-blue">Hardware & Network</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Add Network Equipment
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Configure PLC, HMI, SCADA server, or workstation network information
                        </p>
                    </div>

                    <form action={addEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">
                                    Device Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    name="name"
                                    required
                                    placeholder="e.g. PLC-01 (Siemens S7-1500)"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Device Type</label>
                                <select name="type" className="form-select" defaultValue="PLC">
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
                                placeholder="e.g. 192.168.1.10"
                                className="form-input font-mono"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    name="username"
                                    placeholder="e.g. admin"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input
                                    name="password"
                                    type="text"
                                    placeholder="e.g. Pass123!"
                                    className="form-input font-mono"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Add Equipment
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
