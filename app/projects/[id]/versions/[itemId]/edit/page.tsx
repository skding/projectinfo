import { prisma } from '@/lib/prisma';
import { updateVersion } from '@/lib/actions';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function EditVersionPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
    const session = await auth();
    const { id, itemId } = await params;
    const version = await prisma.projectVersion.findUnique({ where: { id: itemId } });

    if (!version) return <div>Version not found</div>;

    const updateAction = updateVersion.bind(null, itemId, id);

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
                            <span className="badge badge-purple">Release Control</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Edit Version Package
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Update version number, storage link, or changelog details
                        </p>
                    </div>

                    <form action={updateAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">
                                Version Identifier <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="versionNumber"
                                defaultValue={version.versionNumber}
                                required
                                className="form-input font-mono"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Cloud Backup / File Link <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="fileLink"
                                type="url"
                                defaultValue={version.fileLink}
                                required
                                className="form-input font-mono"
                            />
                        </div>

                        <div>
                            <label className="form-label">Release Changelog & Modifications</label>
                            <textarea
                                name="changelog"
                                defaultValue={version.changelog || ''}
                                rows={4}
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
