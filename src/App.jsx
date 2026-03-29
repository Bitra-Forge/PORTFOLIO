import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context';
import { ToastProvider, useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import SkipLink from './components/SkipLink';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Lazy load pages for code splitting
const Works = lazy(() => import('./pages/Works'));
const Blog = lazy(() => import('./pages/Blog'));
const Admin = lazy(() => import('./pages/Admin'));
const Contact = lazy(() => import('./components/Contact'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ minHeight: '50vh' }}>
    <Loader />
  </div>
);

// Wrapper component to handle location-based rendering
const AppContent = ({ projects, loading, addProject }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (loading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary fallbackMessage="Failed to load page content. Please refresh and try again.">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Works projects={projects} />} />
          <Route path="/blog" element={<Blog />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin onAdd={addProject} />
              </ProtectedRoute>
            } 
          />
        </Routes>
        {isHomePage && (
          <>
            <Skills />
            <Experience />
            <Contact />
          </>
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

// Main app logic with toast notifications
const AppWithToast = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
      // Fallback to localStorage
      const saved = localStorage.getItem('bitra_projects');
      if (saved) {
        try {
          setProjects(JSON.parse(saved));
        } catch (parseErr) {
          console.error('Error parsing localStorage data:', parseErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addProject = useCallback(async (project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

      if (error) throw error;
      setProjects(prev => [data[0], ...prev]);
      toast.success('Artifact deployed successfully to the cloud forge!');
    } catch (err) {
      console.error('Error adding project:', err.message);
      // Fallback to localStorage
      const newProj = { ...project, id: Date.now() };
      setProjects(prev => {
        const updated = [newProj, ...prev];
        localStorage.setItem('bitra_projects', JSON.stringify(updated));
        return updated;
      });
      toast.info('Saved locally. Cloud sync will retry on next load.');
    }
  }, [toast]);

  return (
    <Router>
      <SEO />
      <SkipLink targetId="main-content" />
      <Navbar />
      <main id="main-content" className="container main-content" role="main">
        <AppContent 
          projects={projects} 
          loading={loading} 
          addProject={addProject} 
        />
      </main>
    </Router>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <AppWithToast />
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
