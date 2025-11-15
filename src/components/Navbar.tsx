import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react'; 
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/news', 'label': 'News' },
    { path: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Leaf className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-gray-800">AksiHijau</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.path}>
                <Link
                  to={link.path}
                  className={`text-gray-700 hover:text-primary transition-colors duration-300 font-medium relative group ${
                    location.pathname === link.path ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all"
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Tombol Aksi (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Tombol Login Desktop: Disamakan dengan gaya mobile (Border Primary) */}
            <Link
              to="/login"
              className="px-4 py-2 border border-primary text-primary rounded-xl hover:bg-green-50 transition-all duration-300 hover:shadow-lg font-medium"
            >
              Login
            </Link>
            {/* Tombol Register (Hijau/Primary) */}
            <Link
              to="/register"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-lg font-medium"
            >
              Register
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-primary p-2 focus:outline-none transition-transform duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 transform rotate-90" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden overflow-y-auto transition-all duration-500 ease-in-out bg-white ${
            isMenuOpen 
                ? 'max-h-[50vh] opacity-100 border-t border-gray-100 shadow-xl'
                : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-2 p-4">
          {navLinks.map((link) => (
            <div key={link.path}>
              <Link
                to={link.path}
                className={`block py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 text-center ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            </div>
          ))}

          <div className="pt-2 border-t mt-2 flex flex-col space-y-2">
            {/* Tombol Login Mobile (Border Primary) */}
            <Link
              to="/login"
              className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              Login
            </Link>
            {/* Tombol Register Mobile (Hijau/Primary) */}
            <Link
              to="/register"
              className="block w-full text-center py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;