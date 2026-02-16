import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        redirect('/');
    }

    async function updateProject(formData: FormData) {
        'use server';

        const name = formData.get('name') as string;
        const code = formData.get('code') as string;
        const client = formData.get('client') as string;
        const year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
        const description = formData.get('description') as string;

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
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Edit Project</h1>
            <form action={updateProject} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Project Name</label>
                        <input name="name" defaultValue={project.name} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Project Code</label>
                        <input name="code" defaultValue={project.code || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Client</label>
                        <input name="client" defaultValue={project.client || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Year</label>
                        <input name="year" type="number" defaultValue={project.year || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Description</label>
                    <textarea name="description" defaultValue={project.description || ''} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <a href={`/projects/${id}`} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</a>
                </div>
            </form>
        </div>
    );
}
