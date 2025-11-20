import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
// Import komponen Blog yang baru
import BlogList from './pages/BlogList'; // Pastikan path sesuai
import BlogPost from './pages/BlogPost'; // Pastikan path sesuai

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cam" element={<WasteDetection />} />
            <Route path="/community-events" element={<CommunityEvents />} />
            <Route path="/community-social" element={<SocialCommunity />} />
            <Route path="/dashboard-admin" element={<AdminDashboard />} />
            
            {/* RUTE BLOG BARU */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} /> 
            {/* Menggunakan :slug untuk URL yang lebih SEO friendly */}

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;