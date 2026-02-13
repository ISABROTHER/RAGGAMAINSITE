// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Assemblymen } from './pages/Assemblymen';
import { OngoingProjects } from './pages/OngoingProjects';
import { Appointments } from './pages/Appointments';
import { Support } from './pages/Support';
import { Achievements } from './pages/Achievements';
import { Issues } from './pages/Issues';
import { Events } from './pages/Events';
import { Polls } from './pages/Polls';
import { Volunteer } from './pages/Volunteer';
import { ReadStory } from './pages/ReadStory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

function ReadStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ReadStory storyId={id || null} onBack={() => navigate('/')} />;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Robust Scroll To Top on Route Change
  useEffect(() => {
    // Force immediate scroll to top without animation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Secondary check to ensure it sticks after layout updates
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    const page = path.substring(1).split('/')[0];
    return page || 'home';
  };

  const handleNavigate = (page: string, param?: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (param) {
      navigate(`/${page}/${param}`);
    } else {
      navigate(`/${page}`);
    }
  };

  const hideChrome = ['/login', '/register', '/dashboard', '/admin'].some(p => location.pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideChrome && <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/support" element={<Support />} />
          <Route path="/assemblymen" element={<Assemblymen />} />
          <Route path="/projects" element={<OngoingProjects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/read-story/:id" element={<ReadStoryPage />} />
          <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
          <Route path="/register" element={<Register onNavigate={handleNavigate} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

export default App;