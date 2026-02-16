import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/app/components/DeleteButton';
import { deleteEquipment, deleteRemoteAccess, deleteVersion } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            equipment: true,
            remoteAccess: true,
            versions: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } }
        }
    });

    if (!project) return notFound();

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginTop: '0.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>{project.name}</h1>
                        <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
                            {project.code && <span style={{ marginRight: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{project.code}</span>}
                            {project.year && <span style={{ marginRight: '1rem' }}>{project.year}</span>}
                            {project.client}
                        </p>
                    </div>
                    <Link href={`/projects/${project.id}/edit`} className="btn" style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>Edit Project</Link>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Network Configuration</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem 0' }}>Name</th>
                            <th style={{ padding: '1rem 0' }}>IP Address</th>
                            <th style={{ padding: '1rem 0' }}>Type</th>
                            <th style={{ padding: '1rem 0' }}>Username</th>
                            <th style={{ padding: '1rem 0' }}>Password</th>
                            <th style={{ padding: '1rem 0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.equipment.map(eq => (
                            <tr key={eq.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem 0' }}>{eq.name}</td>
                                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{eq.ipAddress}</td>
                                <td style={{ padding: '1rem 0' }}>{eq.type}</td>
                                <td style={{ padding: '1rem 0' }}>{eq.username}</td>
                                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{eq.password}</td>
                                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                                    <Link href={`/projects/${project.id}/equipment/${eq.id}/edit`} className="btn" style={{ background: 'var(--secondary)', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Edit</Link>
                                    <DeleteButton id={eq.id} onDelete={deleteEquipment.bind(null, eq.id, project.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link href={`/projects/${project.id}/equipment/new`} className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                    + Add Equipment
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Remote Access</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem 0' }}>Name</th>
                            <th style={{ padding: '1rem 0' }}>Type</th>
                            <th style={{ padding: '1rem 0' }}>ID / Address</th>
                            <th style={{ padding: '1rem 0' }}>Username</th>
                            <th style={{ padding: '1rem 0' }}>Password</th>
                            <th style={{ padding: '1rem 0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.remoteAccess.map(ra => (
                            <tr key={ra.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem 0' }}>{ra.name}</td>
                                <td style={{ padding: '1rem 0' }}>{ra.type}</td>
                                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{ra.remoteId}</td>
                                <td style={{ padding: '1rem 0' }}>{ra.username}</td>
                                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{ra.password}</td>
                                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                                    <Link href={`/projects/${project.id}/remote/${ra.id}/edit`} className="btn" style={{ background: 'var(--secondary)', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Edit</Link>
                                    <DeleteButton id={ra.id} onDelete={deleteRemoteAccess.bind(null, ra.id, project.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link href={`/projects/${project.id}/remote/new`} className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                    + Add Remote Access
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Version History</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem 0' }}>Version</th>
                            <th style={{ padding: '1rem 0' }}>Date</th>
                            <th style={{ padding: '1rem 0' }}>Uploaded By</th>
                            <th style={{ padding: '1rem 0', width: '40%' }}>Changelog</th>
                            <th style={{ padding: '1rem 0' }}>Action</th>
                            <th style={{ padding: '1rem 0' }}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.versions.map(v => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{v.versionNumber}</td>
                                <td style={{ padding: '1rem 0' }}>{new Date(v.createdAt).toISOString().split('T')[0]}</td>
                                <td style={{ padding: '1rem 0' }}>{v.uploadedBy?.name || 'Unknown'}</td>
                                <td style={{ padding: '1rem 0', whiteSpace: 'pre-wrap' }}>{v.changelog || '-'}</td>
                                <td style={{ padding: '1rem 0' }}>
                                    <a href={v.fileLink} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'var(--secondary)', fontSize: '0.8rem' }}>Open Link</a>
                                </td>
                                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                                    <Link href={`/projects/${project.id}/versions/${v.id}/edit`} className="btn" style={{ background: 'var(--secondary)', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Edit</Link>
                                    <DeleteButton id={v.id} onDelete={deleteVersion.bind(null, v.id, project.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link href={`/projects/${project.id}/versions/new`} className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                    + Upload New Version
                </Link>
            </div>
        </div>
    );
}
