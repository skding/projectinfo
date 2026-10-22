import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';
import DeleteButton from '@/app/components/DeleteButton';
import PasswordCell from '@/app/components/PasswordCell';
import CopyButton from '@/app/components/CopyButton';
import { deleteEquipment, deleteRemoteAccess, deleteVersion, deleteProject } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            equipment: { orderBy: { name: 'asc' } },
            remoteAccess: { orderBy: { createdAt: 'desc' } },
            versions: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } }
        }
    });

    if (!project) return notFound();

    // Helper for category badge
    const getTypeBadgeClass = (type: string) => {
        const lower = (type || '').toLowerCase();
        if (lower.includes('software') || lower.includes('scada') || lower.includes('plc') || lower.includes('database')) {
            return 'badge-purple';
        }
        if (lower.includes('anydesk') || lower.includes('teamviewer')) {
            return 'badge-amber';
        }
        if (lower.includes('vpn') || lower.includes('rdp') || lower.includes('ssh')) {
            return 'badge-cyan';
        }
        return 'badge-blue';
    };

    return (
        <div>
            {/* Top Navigation */}
            <Navbar user={session?.user} currentPage="project" />

            {/* Breadcrumb & Navigation */}
            <div style={{ marginBottom: '1.25rem' }}>
                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--secondary)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Project Header - Protected against title overlap on Full HD or any window size */}
            <div
                className="glass-panel"
                style={{
                    padding: '1.75rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                }}
            >
                <div style={{ flex: '1 1 400px', minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {project.code && (
                            <span className="badge badge-blue font-mono" style={{ fontSize: '0.8rem' }}>
                                {project.code}
                            </span>
                        )}
                        {project.year && (
                            <span className="badge badge-slate" style={{ fontSize: '0.8rem' }}>
                                Year: {project.year}
                            </span>
                        )}
                        <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                            ● Active Project
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: '2.25rem',
                            fontWeight: 800,
                            margin: '0.25rem 0 0.5rem 0',
                            color: '#ffffff',
                            lineHeight: 1.25,
                            wordBreak: 'break-word',
                        }}
                    >
                        {project.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--secondary)', fontSize: '0.95rem' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                            <path d="M7 10h10M7 14h10M7 18h6" />
                        </svg>
                        <span>Client: <strong style={{ color: 'var(--foreground)' }}>{project.client || 'Internal Project / Unspecified'}</strong></span>
                    </div>

                    {project.description && (
                        <p style={{ color: 'var(--secondary)', margin: '0.875rem 0 0 0', fontSize: '0.925rem', lineHeight: 1.6, maxWidth: '900px' }}>
                            {project.description}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Link href={`/projects/${project.id}/edit`} className="btn btn-secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Details
                    </Link>
                    <DeleteButton id={project.id} onDelete={deleteProject.bind(null, project.id)} />
                </div>
            </div>

            {/* Section 1: Network & Equipment Configuration */}
            <div className="glass-panel" style={{ padding: '1.75rem 2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                            Network & Equipment Configuration
                        </h2>
                        <p style={{ color: 'var(--secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                            Hardware devices, PLCs, HMIs, and server network addresses ({project.equipment.length} registered)
                        </p>
                    </div>
                    <Link href={`/projects/${project.id}/equipment/new`} className="btn btn-primary btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Equipment
                    </Link>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Device Name</th>
                                <th>IP Address</th>
                                <th>Device Type</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.equipment.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                        No network equipment recorded yet. Click &quot;Add Equipment&quot; to configure PLCs, HMIs, or servers.
                                    </td>
                                </tr>
                            ) : (
                                project.equipment.map((eq) => (
                                    <tr key={eq.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                                            {eq.name}
                                        </td>
                                        <td>
                                            {eq.ipAddress ? (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <span className="font-mono" style={{ color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                                        {eq.ipAddress}
                                                    </span>
                                                    <CopyButton text={eq.ipAddress} title="Copy IP address" />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge badge-slate">
                                                {eq.type || 'DEVICE'}
                                            </span>
                                        </td>
                                        <td>
                                            {eq.username ? (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>{eq.username}</span>
                                                    <CopyButton text={eq.username} title="Copy username" />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <PasswordCell password={eq.password} />
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <Link
                                                    href={`/projects/${project.id}/equipment/${eq.id}/edit`}
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ padding: '0.3rem 0.6rem' }}
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteButton id={eq.id} onDelete={deleteEquipment.bind(null, eq.id, project.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 2: Remote Access & Software Credentials (Requirement 3) */}
            <div className="glass-panel" style={{ padding: '1.75rem 2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                                Remote Access & Software Credentials
                            </h2>
                            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                                Credentials Vault
                            </span>
                        </div>
                        <p style={{ color: 'var(--secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                            Manage remote desktop tools (AnyDesk, TeamViewer, VPN, RDP) and engineering software accounts (SCADA, PLC, Database, Web Portals)
                        </p>
                    </div>
                    <Link href={`/projects/${project.id}/remote/new`} className="btn btn-primary btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Remote / Software Credential
                    </Link>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name / Software</th>
                                <th>Category / Type</th>
                                <th>ID / Host / Software Version</th>
                                <th>Username / Account</th>
                                <th>Password / Key</th>
                                <th>Notes / License</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.remoteAccess.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                        No remote connections or software credentials recorded. Click &quot;Add Remote / Software Credential&quot; to add AnyDesk or software logins.
                                    </td>
                                </tr>
                            ) : (
                                project.remoteAccess.map((ra) => (
                                    <tr key={ra.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                                            {ra.name}
                                        </td>
                                        <td>
                                            <span className={`badge ${getTypeBadgeClass(ra.type)}`}>
                                                {ra.type}
                                            </span>
                                        </td>
                                        <td>
                                            {ra.remoteId ? (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <span className="font-mono" style={{ color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {ra.remoteId}
                                                    </span>
                                                    <CopyButton text={ra.remoteId} title="Copy ID/Address" />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            {ra.username ? (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: 'var(--foreground)' }}>{ra.username}</span>
                                                    <CopyButton text={ra.username} title="Copy username" />
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <PasswordCell password={ra.password} />
                                        </td>
                                        <td>
                                            {ra.notes ? (
                                                <span style={{ color: 'var(--secondary)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }} title={ra.notes}>
                                                    {ra.notes}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <Link
                                                    href={`/projects/${project.id}/remote/${ra.id}/edit`}
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ padding: '0.3rem 0.6rem' }}
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteButton id={ra.id} onDelete={deleteRemoteAccess.bind(null, ra.id, project.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 3: Version History & Cloud Backups */}
            <div className="glass-panel" style={{ padding: '1.75rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                            Version History & Release Archive
                        </h2>
                        <p style={{ color: 'var(--secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                            Project revisions, engineering backups, and changelog records ({project.versions.length} versions)
                        </p>
                    </div>
                    <Link href={`/projects/${project.id}/versions/new`} className="btn btn-primary btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Upload New Version
                    </Link>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Release Date</th>
                                <th>Uploaded By</th>
                                <th style={{ width: '38%' }}>Changelog</th>
                                <th>Backup Link</th>
                                <th style={{ textAlign: 'right' }}>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.versions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                        No versions recorded yet. Click &quot;Upload New Version&quot; to attach backup links and changelogs.
                                    </td>
                                </tr>
                            ) : (
                                project.versions.map((v) => (
                                    <tr key={v.id}>
                                        <td>
                                            <span className="badge badge-purple font-mono" style={{ fontSize: '0.85rem' }}>
                                                {v.versionNumber}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                                            {new Date(v.createdAt).toISOString().split('T')[0]}
                                        </td>
                                        <td style={{ color: 'var(--foreground)' }}>
                                            {v.uploadedBy?.name || v.uploadedBy?.email?.split('@')[0] || 'Engineer'}
                                        </td>
                                        <td style={{ color: 'var(--secondary)', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                                            {v.changelog || '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <a
                                                    href={v.fileLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ padding: '0.3rem 0.75rem', color: '#60a5fa' }}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                    Open Link
                                                </a>
                                                <CopyButton text={v.fileLink} title="Copy link" />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <Link
                                                    href={`/projects/${project.id}/versions/${v.id}/edit`}
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ padding: '0.3rem 0.6rem' }}
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteButton id={v.id} onDelete={deleteVersion.bind(null, v.id, project.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
