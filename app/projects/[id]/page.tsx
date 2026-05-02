'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(p => setProjectId(p.id));
  }, [params]);

  useEffect(() => {
    if (!projectId) return;

    async function fetchData() {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          // The projects api returns a list, let's filter for now or we could create a single GET route
          fetch('/api/projects'),
          fetch(`/api/tasks?projectId=${projectId}`)
        ]);

        const projectsData = await projectRes.json();
        const p = projectsData.find((proj: any) => proj.id === projectId);
        setProject(p);
        
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch project data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  const handleCreateTask = async () => {
    const title = prompt('Task Title:');
    if (!title) return;
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, projectId })
    });
    
    // Refresh tasks
    const tasksRes = await fetch(`/api/tasks?projectId=${projectId}`);
    setTasks(await tasksRes.json());
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="text-center" style={{ color: 'var(--primary-color)' }}>Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <Link href="/dashboard" className="btn btn-primary mt-4">Back to Dashboard</Link>
      </div>
    );
  }

  const columns = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            &larr; Back
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{project.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{project.description || 'Manage your tasks here'}</p>
          </div>
        </div>
        <button onClick={handleCreateTask} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          + New Task
        </button>
      </header>

      {/* Kanban Board */}
      <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(status => (
          <div key={status} className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '1rem', background: 'rgba(30, 41, 59, 0.4)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.1rem' }}>
                {status.replace('_', ' ')}
              </h3>
              <span className={`badge badge-${status.toLowerCase().replace('_', '-')}`}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '200px' }}>
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{task.title}</div>
                  {task.description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {task.description}
                    </div>
                  )}
                  
                  {/* Status controls */}
                  <div className="flex gap-2 mt-4">
                    {status !== 'TODO' && (
                      <button onClick={() => handleUpdateStatus(task.id, status === 'DONE' ? 'IN_PROGRESS' : 'TODO')} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                        &larr; Move Back
                      </button>
                    )}
                    {status !== 'DONE' && (
                      <button onClick={() => handleUpdateStatus(task.id, status === 'TODO' ? 'IN_PROGRESS' : 'DONE')} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: 'auto' }}>
                        Move Forward &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem', border: '1px dashed var(--glass-border)', borderRadius: '8px' }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
