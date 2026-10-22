import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export default async function NewVersion({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true }
    });

    async function addVersion(formData: FormData) {
        'use server';

        const versionNumber = (formData.get('versionNumber') as string)?.trim();
        const changelog = (formData.get('changelog') as string)?.trim() || null;
        const fileLink = (formData.get('fileLink') as string)?.trim();
        const session = await auth();

        if (!session?.user?.id) {
            redirect('/login');
        }

        await prisma.projectVersion.create({
            data: {
                projectId: id,
                versionNumber,
                changelog,
                fileLink,
                uploadedById: session.user.id
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
                            <span className="badge badge-purple">Release Control</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Upload Project Release
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Record a new PLC/SCADA engineering backup, cloud file link, and changelog
                        </p>
                    </div>

                    <form action={addVersion} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">
                                Version Identifier <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="versionNumber"
                                placeholder="e.g. v1.2.0, or Rev-C_FAT_Complete"
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
                                placeholder="https://onedrive.live.com/... or Google Drive link"
                                required
                                className="form-input font-mono"
                            />
                        </div>

                        <div>
                            <label className="form-label">Release Changelog & Modifications</label>
                            <textarea
                                name="changelog"
                                rows={4}
                                placeholder="Describe logic adjustments, new SCADA screens, alarm setpoints, or bug fixes..."
                                className="form-textarea"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Save Version Package
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
