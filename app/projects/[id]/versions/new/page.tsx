import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/auth';

export default async function NewVersion({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    async function addVersion(formData: FormData) {
        'use server';

        const versionNumber = formData.get('versionNumber') as string;
        const changelog = formData.get('changelog') as string;
        const fileLink = formData.get('fileLink') as string;
        const session = await auth();

        if (!session?.user?.id) {
            redirect('/login');
        }
        const user = { id: session.user.id };

        await prisma.projectVersion.create({
            data: {
                projectId: id,
                versionNumber,
                changelog,
                fileLink,
                uploadedById: user.id
            },
        });

        redirect(`/projects/${id}`);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add New Version</h1>
            <form action={addVersion} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Version Number</label>
                    <input name="versionNumber" placeholder="e.g. v1.0.2" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>OneDrive Link</label>
                    <input name="fileLink" type="url" placeholder="https://onedrive.live.com/..." required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Changelog</label>
                    <textarea name="changelog" rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Version</button>
            </form>
        </div>
    );
}
