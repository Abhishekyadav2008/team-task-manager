import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Project<span style={{ color: 'var(--primary-color)' }}>X</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="btn btn-secondary">Login</Link>
          <Link href="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="text-center animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '999px', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            ✨ The Future of Project Management
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage work seamlessly,<br />deliver faster.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Empower your team with a beautiful, intuitive platform to create projects, assign tasks, and track progress effortlessly with role-based access control.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start for free
            </Link>
            <Link href="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Demo Dashboard
            </Link>
          </div>
          
          {/* Glassmorphic feature preview */}
          <div className="glass-panel mt-8 delay-200 animate-fade-in" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: 0 }}>
             <div className="text-center">
               <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Organize</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Unlimited Projects</p>
             </div>
             <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
             <div className="text-center">
               <h3 style={{ color: 'var(--secondary-color)', marginBottom: '0.25rem' }}>Track</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status & Deadlines</p>
             </div>
             <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
             <div className="text-center">
               <h3 style={{ color: 'var(--success)', marginBottom: '0.25rem' }}>Collaborate</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Role-based Access</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
