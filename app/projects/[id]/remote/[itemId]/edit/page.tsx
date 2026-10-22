import { prisma } from '@/lib/prisma';
import { updateRemoteAccess } from '@/lib/actions';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function EditRemoteAccessPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const session = await auth();
    const { id, itemId } = await params;
    const remote = await prisma.remoteAccess.findUnique({ where: { id: itemId } });

    if (!remote) return <div>Remote Access / Software Credential not found</div>;

    const updateAction = updateRemoteAccess.bind(null, itemId, id);

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
                            <span className="badge badge-amber">Credentials Vault</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Edit Remote Access or Software Credential
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Update configuration details for {remote.name}
                        </p>
                    </div>

                    <form action={updateAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">
                                Credential / Software / Item Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="name"
                                defaultValue={remote.name}
                                required
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Category & Type <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select name="type" defaultValue={remote.type} className="form-select">
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
                                defaultValue={remote.remoteId || ''}
                                placeholder="e.g. 987 654 321, or v2023 R2, or https://192.168.1.100:8443"
                                className="form-input font-mono"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Username / Account</label>
                                <input
                                    name="username"
                                    defaultValue={remote.username || ''}
                                    placeholder="Username"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password / Key / Passcode</label>
                                <input
                                    name="password"
                                    type="text"
                                    defaultValue={remote.password || ''}
                                    placeholder="Password"
                                    className="form-input font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Notes & Instructions</label>
                            <textarea
                                name="notes"
                                defaultValue={remote.notes || ''}
                                rows={3}
                                className="form-textarea"
                            />
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
