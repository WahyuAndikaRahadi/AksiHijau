import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AirQuality from './pages/AirQuality';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import News from './pages/News';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import WasteDetection from './pages/WasteDetection';
import CommunityEvents from './pages/CommunityEvents';
import AdminDashboard from './pages/dashboardAdmin';
import SocialCommunity from './pages/SocialCommunity';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import EcoBot from './pages/EcoBot';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

// Komponen baru untuk menangani layout dan kondisi hide
const AppContent = () => {
  const location = useLocation();  // useLocation sekarang di dalam Router
  const hideNavAndFooter = location.pathname === '/ai';  // Kondisi hide di /ai

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavAndFooter && <Navbar />}  {/* Navbar hanya tampil jika bukan /ai */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cam" element={<WasteDetection />} />
          <Route path="/ai" element={<EcoBot />} />
          <Route path="/community-events" element={<CommunityEvents />} />
          <Route path="/community-social" element={<SocialCommunity />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} /> 

        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}  {/* Footer hanya tampil jika bukan /ai */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/air-quality" element={<AirQuality />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cam" element={<WasteDetection />} />
            <Route path="/ai" element={<EcoBot />} />
            <Route path="/community-events" element={<CommunityEvents />} />
            <Route path="/community-social" element={<SocialCommunity />} />
            <Route path="/dashboard-admin" element={<AdminDashboard />} />
            
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} /> 

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
