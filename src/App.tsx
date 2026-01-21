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
import { Admin } from './pages/Admin';
import { Volunteer } from './pages/Volunteer';
import { ReadStory } from './pages/ReadStory';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function ReadStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ReadStory storyId={id || null} onBack={() => navigate('/')} />;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // RESET SCROLL TO TOP ON EVERY NAVIGATION
  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/support" element={<Support />} />
          <Route path="/assemblymen" element={<Assemblymen />} />
          <Route path="/ongoing-projects" element={<OngoingProjects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/read-story/:id" element={<ReadStoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;