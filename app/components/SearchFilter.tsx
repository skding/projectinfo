'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function SearchFilter({ years }: { years: number[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleYearChange = (year: string) => {
        const params = new URLSearchParams(searchParams);
        if (year) {
            params.set('year', year);
        } else {
            params.delete('year');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const debouncedSearch = (term: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            handleSearch(term);
        }, 300);
    };

    return (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="Search projects by name, code, or client..."
                style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                }}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => debouncedSearch(e.target.value)}
            />
            <select
                style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    width: '150px'
                }}
                onChange={(e) => handleYearChange(e.target.value)}
                defaultValue={searchParams.get('year')?.toString()}
            >
                <option value="">All Years</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
}
