import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from '@/app/components/Navbar';

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        redirect('/');
    }

    async function updateProject(formData: FormData) {
        'use server';

        const name = (formData.get('name') as string)?.trim();
        const code = (formData.get('code') as string)?.trim() || null;
        const client = (formData.get('client') as string)?.trim() || null;
        const year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
        const description = (formData.get('description') as string)?.trim() || null;

        await prisma.project.update({
            where: { id },
            data: {
                name,
                code,
                client,
                year,
                description,
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
                        Back to Project
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: '2.25rem' }}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-blue">Edit Project</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                            Edit Project Details
                        </h1>
                        <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.9rem' }}>
                            Update metadata for {project.name}
                        </p>
                    </div>

                    <form action={updateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">
                                    Project Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    name="name"
                                    defaultValue={project.name}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Project Code</label>
                                <input
                                    name="code"
                                    defaultValue={project.code || ''}
                                    className="form-input font-mono"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Client / Plant Name</label>
                                <input
                                    name="client"
                                    defaultValue={project.client || ''}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Commissioning Year</label>
                                <input
                                    name="year"
                                    type="number"
                                    defaultValue={project.year || ''}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Project Description & Scope</label>
                            <textarea
                                name="description"
                                defaultValue={project.description || ''}
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
