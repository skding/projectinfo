import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import LogoutButton from './components/LogoutButton';
import SearchFilter from './components/SearchFilter';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string; year?: string }> }) {
  const params = await searchParams;
  const query = params.query || '';
  const year = params.year ? parseInt(params.year) : undefined;

  // Fetch unique years for the filter dropdown
  const allProjects = await prisma.project.findMany({ select: { year: true } });
  const years = Array.from(new Set(allProjects.map(p => p.year).filter((y): y is number => y !== null))).sort((a, b) => b - a);

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
    include: { _count: { select: { equipment: true } } }
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <LogoutButton />
          <Link href="/settings" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Change Password</Link>
          <Link href="/projects/new" className="btn btn-primary">
            + New Project
          </Link>
        </div>
      </header>

      <SearchFilter years={years} />

      {projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>No projects found. Start by creating one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', transition: 'transform 0.2s' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--secondary)', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                  {project.client || 'No Client'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.85rem' }}>
                  <span>{project._count.equipment} Devices</span>
                  <span style={{ color: 'var(--accent)' }}>Active</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
