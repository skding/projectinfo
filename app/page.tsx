import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import Navbar from './components/Navbar';
import SearchFilter from './components/SearchFilter';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string; year?: string }> }) {
    const session = await auth();
    const params = await searchParams;
    const query = params.query || '';
    const year = params.year ? parseInt(params.year) : undefined;

    // Fetch unique years for filter dropdown
    const allProjects = await prisma.project.findMany({ select: { year: true } });
    const years = Array.from(new Set(allProjects.map(p => p.year).filter((y): y is number => y !== null))).sort((a, b) => b - a);

    // Fetch dashboard projects
    const projects = await prisma.project.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { code: { contains: query, mode: 'insensitive' } },
                        { client: { contains: query, mode: 'insensitive' } },
                    ]
                },
                year ? { year } : {}
            ]
        },
        orderBy: { updatedAt: 'desc' },
        include: {
            _count: {
                select: {
                    equipment: true,
                    remoteAccess: true,
                    versions: true,
                }
            }
        }
    });

    // Overview KPIs
    const [totalEquipment, totalRemote, totalVersions] = await Promise.all([
        prisma.equipment.count(),
        prisma.remoteAccess.count(),
        prisma.projectVersion.count(),
    ]);

    return (
        <div>
            {/* Top Navigation */}
            <Navbar user={session?.user} currentPage="dashboard" />

            {/* Dashboard Header - Designed to NEVER overlap on Full HD or any resolution */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                }}
            >
                <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-blue">Engineering Hub</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Full HD Console</span>
                    </div>
                    <h1
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '-0.025em',
                            color: '#ffffff',
                            lineHeight: 1.2,
                            wordBreak: 'break-word',
                        }}
                    >
                        Operations Dashboard
                    </h1>
                    <p style={{ color: 'var(--secondary)', margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
                        Managing {projects.length} active automation & SCADA projects across facilities
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Link href="/projects/new" className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Project
                    </Link>
                </div>
            </div>

            {/* KPI Cards Row - Optimized for Full HD (1920x1080) wide viewport */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2rem',
                }}
            >
                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '10px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#60a5fa',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Total Projects
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                            {allProjects.length}
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '10px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#34d399',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                            <line x1="6" y1="6" x2="6.01" y2="6" />
                            <line x1="6" y1="18" x2="6.01" y2="18" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Network Devices
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                            {totalEquipment}
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '10px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fbbf24',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-1-1l-3 3m5 0l-3-3m-3 3l-2 2m7-2l-2 2M3 13a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Remote & Software
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                            {totalRemote}
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '10px',
                            background: 'rgba(139, 92, 246, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#c084fc',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Version Releases
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                            {totalVersions}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Year Filter */}
            <SearchFilter years={years} />

            {/* Projects Grid - Designed for Full HD: 4 columns on 1920x1080 screens */}
            {projects.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            color: 'var(--secondary)',
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>No Projects Found</h3>
                    <p style={{ color: 'var(--secondary)', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
                        {query || year ? 'No projects match your search criteria. Try clearing the filters.' : 'Get started by creating your first automation project.'}
                    </p>
                    <Link href="/projects/new" className="btn btn-primary">
                        + Create First Project
                    </Link>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {projects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                            <div
                                className="glass-panel-interactive"
                                style={{
                                    padding: '1.5rem',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '14px',
                                    position: 'relative',
                                }}
                            >
                                {/* Top Meta Row: Code, Year, Active Badge */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {project.code ? (
                                            <span className="badge badge-blue font-mono" style={{ fontSize: '0.725rem' }}>
                                                {project.code}
                                            </span>
                                        ) : (
                                            <span className="badge badge-slate" style={{ fontSize: '0.725rem' }}>
                                                NO CODE
                                            </span>
                                        )}
                                        {project.year && (
                                            <span className="badge badge-slate" style={{ fontSize: '0.725rem' }}>
                                                {project.year}
                                            </span>
                                        )}
                                    </div>
                                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                                        ● Active
                                    </span>
                                </div>

                                {/* Project Name - Protected against overlap */}
                                <h3
                                    style={{
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        lineHeight: 1.35,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        minHeight: '2.7rem',
                                        wordBreak: 'break-word',
                                    }}
                                    title={project.name}
                                >
                                    {project.name}
                                </h3>

                                {/* Client */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                                        <path d="M7 10h10M7 14h10M7 18h6" />
                                    </svg>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {project.client || 'Client Not Specified'}
                                    </span>
                                </div>

                                {/* Description snippet */}
                                {project.description && (
                                    <p
                                        style={{
                                            color: 'var(--muted)',
                                            fontSize: '0.825rem',
                                            lineHeight: 1.45,
                                            margin: '0 0 1.25rem 0',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {project.description}
                                    </p>
                                )}

                                {/* Card Footer: Stats & Arrow */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 'auto',
                                        paddingTop: '0.875rem',
                                        borderTop: '1px solid var(--glass-border)',
                                        fontSize: '0.825rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span title="Configured Equipment" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#93c5fd' }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="2" width="20" height="8" rx="2" />
                                                <rect x="2" y="14" width="20" height="8" rx="2" />
                                            </svg>
                                            {project._count.equipment} Devices
                                        </span>
                                        <span title="Remote & Software Credentials" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fcd34d' }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 2l-2 2m-1-1l-3 3" />
                                                <circle cx="7" cy="17" r="4" />
                                            </svg>
                                            {project._count.remoteAccess} Access
                                        </span>
                                        {project._count.versions > 0 && (
                                            <span title="Versions" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c084fc' }}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="16 18 22 12 16 6" />
                                                </svg>
                                                {project._count.versions} Ver
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        Open →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
