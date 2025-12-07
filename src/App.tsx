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
// Import komponen loading dan 404
import FirstLoadAnimation from './components/FirstLoadAnimation'; // 👈 Import FirstLoadAnimation
import NotFound from './pages/NotFound';

// --- ScrollToTop Component ---
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

// --- AppContent Component (Komponen Utama Aplikasi setelah Loading) ---
const AppContent = () => {
  const location = useLocation();
  // Perbarui kondisi hide: sembunyikan jika path adalah '/ai' ATAU '/cam'
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
          
          {/* Rute Not Found (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

// --- Main App Component ---
function App() {
  // 1. State untuk mengontrol status loading
  const [isLoading, setIsLoading] = useState(true);

  // 2. Efek untuk menghilangkan loading setelah durasi tertentu
  useEffect(() => {
    // Atur timer selama 5000ms (5 detik) sesuai permintaan Anda.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); 

    // Cleanup: Membersihkan timer jika komponen di-unmount
    return () => clearTimeout(timer);
  }, []); // Array dependensi kosong: hanya dijalankan sekali saat komponen di-mount

  return (
    <Router>
      <ScrollToTop />
      
      {/* 3. Conditional Rendering */}
      {isLoading ? (
        // Tampilkan animasi loading saat isLoading = true
        <FirstLoadAnimation /> 
      ) : (
        // Tampilkan konten utama aplikasi saat isLoading = false
        <AppContent />
      )}
    </Router>
  );
}

export default App;