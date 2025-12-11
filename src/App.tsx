import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // 👈 Import useState dan useEffect
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AirQuality from './pages/AirQuality';
import SoilHealth from './pages/SoilHealth';
import WaterQuality from './pages/WaterQuality';
import Home from './pages/Home';
import About from './pages/About';
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
import Profile from './pages/Profile';
import FirstLoadAnimation from './components/FirstLoadAnimation'; // 👈 Import FirstLoadAnimation
import NotFound from './pages/NotFound';

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

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/ai' || location.pathname === '/cam'; 

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/air-quality" element={<AirQuality />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/water-quality" element={<WaterQuality />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cam" element={<WasteDetection />} />
          <Route path="/ai" element={<EcoBot />} />
          <Route path="/community-events" element={<CommunityEvents />} />
          <Route path="/community-social" element={<SocialCommunity />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} /> 
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      {isLoading ? (
        <FirstLoadAnimation /> 
      ) : (
        <AppContent />
      )}
    </Router>
  );
}

export default App;