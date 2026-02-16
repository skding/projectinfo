'use client';

import { useTransition } from 'react';

export default function DeleteButton({ id, onDelete }: { id: string, onDelete: (id: string) => Promise<void> }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this item?')) {
            startTransition(async () => {
                await onDelete(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="btn btn-danger"
            style={{
                background: 'rgba(255, 59, 48, 0.2)',
                color: '#ff453a',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                marginLeft: '0.5rem'
            }}
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
