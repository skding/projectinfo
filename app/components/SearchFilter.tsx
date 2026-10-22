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

    const currentQuery = searchParams.get('query')?.toString() || '';
    const currentYear = searchParams.get('year')?.toString() || '';

    return (
        <div
            className="glass-panel"
            style={{
                marginBottom: '2rem',
                padding: '0.875rem 1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                background: 'rgba(15, 23, 42, 0.6)',
            }}
        >
            <div style={{ flex: '1 1 320px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search projects by name, code, client, or equipment..."
                    className="form-input"
                    style={{
                        paddingLeft: '2.5rem',
                        paddingRight: currentQuery ? '2.5rem' : '1rem',
                        fontSize: '0.9rem',
                    }}
                    defaultValue={currentQuery}
                    onChange={(e) => debouncedSearch(e.target.value)}
                />
                <div
                    style={{
                        position: 'absolute',
                        left: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '0 0 auto' }}>
                <div style={{ position: 'relative', minWidth: '150px' }}>
                    <select
                        className="form-select"
                        style={{ fontSize: '0.9rem', padding: '0.75rem 1rem' }}
                        onChange={(e) => handleYearChange(e.target.value)}
                        value={currentYear}
                    >
                        <option value="">All Years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {(currentQuery || currentYear) && (
                    <button
                        type="button"
                        onClick={() => replace(pathname)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.825rem', color: '#f87171' }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
