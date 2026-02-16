'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function deleteEquipment(id: string, projectId: string) {
    await prisma.equipment.delete({ where: { id } });
    revalidatePath(`/projects/${projectId}`);
}

export async function updateEquipment(id: string, projectId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const ipAddress = formData.get('ipAddress') as string;
    const type = formData.get('type') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    await prisma.equipment.update({
        where: { id },
        data: { name, ipAddress, type, username, password }
    });

    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
}

export async function deleteRemoteAccess(id: string, projectId: string) {
    await prisma.remoteAccess.delete({ where: { id } });
    revalidatePath(`/projects/${projectId}`);
}

export async function updateRemoteAccess(id: string, projectId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const remoteId = formData.get('remoteId') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const notes = formData.get('notes') as string;

    await prisma.remoteAccess.update({
        where: { id },
        data: { name, type, remoteId, username, password, notes }
    });

    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
}

export async function deleteVersion(id: string, projectId: string) {
    await prisma.projectVersion.delete({ where: { id } });
    revalidatePath(`/projects/${projectId}`);
}

export async function updateVersion(id: string, projectId: string, formData: FormData) {
    const versionNumber = formData.get('versionNumber') as string;
    const fileLink = formData.get('fileLink') as string;
    const changelog = formData.get('changelog') as string;

    await prisma.projectVersion.update({
        where: { id },
        data: { versionNumber, fileLink, changelog }
    });

    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
}
