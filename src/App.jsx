import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Works from './pages/Works';
import Admin from './pages/Admin';
import Contact from './components/Contact';
import './index.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="glass animate-slide-down" style={{
      position: 'sticky',
      top: '1.5rem',
      margin: '0 2rem',
      padding: '1rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(5, 5, 5, 0.8)',
    }}>
      <Link to="/" style={{
        fontSize: '1.75rem',
        fontWeight: '900',
        color: 'var(--primary)',
        letterSpacing: '-0.05em'
      }}>BITRA</Link>
      <div style={{ display: 'flex', gap: '3rem' }}>
        <Link to="/" className="nav-link" style={{
          opacity: location.pathname === '/' ? 1 : 0.5,
          fontWeight: '600',
          fontSize: '0.95rem',
          color: 'var(--text-main)'
        }}>Works</Link>
      </div>
    </nav>
  );
};

const ProtectedAdmin = ({ onAdd }) => {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState('');

  if (!authorized) {
    return (
      <div className="glass animate-slide-up" style={{ maxWidth: '400px', margin: '10rem auto', padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Team Access</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          This area is restricted to BitraForge team members.
        </p>
        <input
          type="password"
          placeholder="Access Code"
          value={pass}
          onKeyDown={(e) => e.key === 'Enter' && (pass === 'bitra2026' ? setAuthorized(true) : alert('Invalid Code'))}
          onChange={(e) => setPass(e.target.value)}
          style={{
            width: '100%',
            padding: '0.9rem',
            marginBottom: '1rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={() => pass === 'bitra2026' ? setAuthorized(true) : alert('Invalid Code')}
          style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.9rem 2rem',
            borderRadius: '0.75rem',
            width: '100%',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(168, 85, 247, 0.2)'
          }}
        >
          Enter Portal
        </button>
      </div>
    );
  }

  return <Admin onAdd={onAdd} />;
};

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err.message);
      const saved = localStorage.getItem('bitra_projects');
      if (saved) setProjects(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

      if (error) throw error;
      setProjects(prev => [data[0], ...prev]);
      alert('Artifact deployed successfully to the cloud forge!');
    } catch (err) {
      console.error('Error adding project:', err.message);
      const newProj = { ...project, id: Date.now() };
      const updated = [newProj, ...projects];
      setProjects(updated);
      localStorage.setItem('bitra_projects', JSON.stringify(updated));
      alert('Cloud deployment failed. Saved to local terminal instead.');
    }
  };

  return (
    <Router>
      <Navbar />
      <main className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12rem' }}>
            <div className="animate-spin" style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(168, 85, 247, 0.1)',
              borderLeftColor: 'var(--primary)',
              borderRadius: '50%'
            }}></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Works projects={projects} />} />
            <Route path="/admin" element={<ProtectedAdmin onAdd={addProject} />} />
          </Routes>
        )}
        {location.pathname === '/' && <Contact />}
      </main>
    </Router>
  );
}

export default App;
