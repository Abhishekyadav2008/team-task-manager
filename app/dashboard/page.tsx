'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks')
        ]);

        if (projectsRes.status === 401 || tasksRes.status === 401) {
          router.push('/login');
          return;
        }

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        setProjects(projectsData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="text-center" style={{ color: 'var(--primary-color)' }}>Loading...</div>
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your workspace</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </header>

      {/* Stats Summary */}
      <div className="flex gap-4 mb-8" style={{ flexWrap: 'wrap' }}>
        <div className="glass-panel w-full" style={{ flex: '1 1 200px', padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Projects</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{projects.length}</div>
        </div>
        <div className="glass-panel w-full" style={{ flex: '1 1 200px', padding: '1.5rem', borderLeft: '4px solid var(--text-secondary)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>To Do Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{todoTasks}</div>
        </div>
        <div className="glass-panel w-full" style={{ flex: '1 1 200px', padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>In Progress</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{inProgressTasks}</div>
        </div>
        <div className="glass-panel w-full" style={{ flex: '1 1 200px', padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Completed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{doneTasks}</div>
        </div>
      </div>

      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        {/* Projects List */}
        <div className="glass-panel w-full animate-fade-in" style={{ flex: '2 1 400px' }}>
          <div className="flex justify-between items-center mb-4">
            <h3>Your Projects</h3>
            <button onClick={() => {
              const name = prompt('Project Name:');
              if (name) {
                fetch('/api/projects', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name })
                }).then(() => window.location.reload());
              }
            }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              + New Project
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No projects yet. Create one to get started!</p>
            ) : (
              projects.map(project => (
                <Link href={`/projects/${project.id}`} key={project.id} style={{ display: 'block' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'var(--transition)' }} className="hover-bg">
                    <div className="flex justify-between items-center">
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</div>
                      <div className="badge badge-progress">{project._count.tasks} tasks</div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-panel w-full animate-fade-in delay-100" style={{ flex: '1 1 300px' }}>
          <h3 className="mb-4">Recent Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{task.title}</div>
                <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{task.project.name}</span>
                  <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No tasks assigned to you.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
