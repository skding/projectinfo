'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        // In Next.js, redirect() throws an error that should be caught and re-thrown
        // to let the framework handle the actual redirection.
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

export async function deleteProject(id: string) {
    // Delete related items in proper order
    await prisma.equipment.deleteMany({ where: { projectId: id } });
    await prisma.remoteAccess.deleteMany({ where: { projectId: id } });
    await prisma.projectVersion.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });
    revalidatePath('/');
    redirect('/');
}

// User Management Actions
export async function createUser(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = formData.get('password') as string;
    const name = (formData.get('name') as string)?.trim() || null;
    const role = (formData.get('role') as string) || 'USER';

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error('A user with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
            role,
        },
    });

    revalidatePath('/users');
    redirect('/users');
}

export async function updateUser(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const name = (formData.get('name') as string)?.trim() || null;
    const role = (formData.get('role') as string) || 'USER';
    const newPassword = (formData.get('password') as string)?.trim();

    const updateData: {
        email?: string;
        name?: string | null;
        role?: string;
        passwordHash?: string;
    } = {
        email,
        name,
        role,
    };

    if (newPassword && newPassword.length > 0) {
        updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/users');
    redirect('/users');
}

export async function deleteUser(id: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    // Prevent deleting self
    if (session.user.id === id) {
        throw new Error('You cannot delete your own account.');
    }

    // Nullify or handle references before deletion if needed
    await prisma.projectVersion.deleteMany({ where: { uploadedById: id } });
    await prisma.user.delete({ where: { id } });

    revalidatePath('/users');
}

