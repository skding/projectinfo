import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export default async function NewRemoteAccess({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true }
    });

    async function addRemote(formData: FormData) {
        'use server';

        const name = (formData.get('name') as string)?.trim();
        const type = formData.get('type') as string;
        const remoteId = (formData.get('remoteId') as string)?.trim() || null;
        const username = (formData.get('username') as string)?.trim() || null;
        const password = (formData.get('password') as string)?.trim() || null;
        const notes = (formData.get('notes') as string)?.trim() || null;

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
                            <span className="badge badge-amber">Credentials Vault</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Add Remote Access or Software Credential
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Record remote tools (AnyDesk, VPN, RDP) or software accounts (SCADA, PLC, Database)
                        </p>
                    </div>

                    <form action={addRemote} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">
                                Credential / Software / Item Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="name"
                                required
                                placeholder="e.g. Schneider Citect SCADA 2018, or Main Server AnyDesk"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Category & Type <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select name="type" className="form-select" defaultValue="Software / Application">
                                <optgroup label="Software & Applications">
                                    <option value="Software / Application">Software / Application</option>
                                    <option value="SCADA / HMI Software">SCADA / HMI Software (Citect, Wonderware, Ignition, WinCC)</option>
                                    <option value="PLC / Engineering Tool">PLC / Engineering Tool (TIA Portal, Studio 5000)</option>
                                    <option value="Database / SQL">Database / SQL (PostgreSQL, SQL Server, MySQL)</option>
                                    <option value="Web Portal / Cloud">Web Portal / Cloud Dashboard</option>
                                    <option value="OPC / Middleware">OPC / Middleware (Kepware, Matrikon)</option>
                                </optgroup>
                                <optgroup label="Remote Connectivity">
                                    <option value="AnyDesk">AnyDesk</option>
                                    <option value="TeamViewer">TeamViewer</option>
                                    <option value="VPN">VPN Connection</option>
                                    <option value="RDP">Remote Desktop (RDP)</option>
                                    <option value="SSH / VNC">SSH / VNC</option>
                                    <option value="Other">Other Connection</option>
                                </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Remote ID / Address / Software Version / URL
                            </label>
                            <input
                                name="remoteId"
                                placeholder="e.g. 987 654 321, or v2023 R2, or https://192.168.1.100:8443"
                                className="form-input font-mono"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', display: 'block' }}>
                                For remote tools: enter connection ID or gateway. For software: enter version, station, or URL.
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Username / Account</label>
                                <input
                                    name="username"
                                    placeholder="e.g. Administrator, engineer, operator"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password / Key / Passcode</label>
                                <input
                                    name="password"
                                    type="text"
                                    placeholder="e.g. Plant2024!"
                                    className="form-input font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Notes & Instructions</label>
                            <textarea
                                name="notes"
                                rows={3}
                                placeholder="e.g. License dongle plugged into Station 02. Read-only permissions."
                                className="form-textarea"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Save Credential
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
