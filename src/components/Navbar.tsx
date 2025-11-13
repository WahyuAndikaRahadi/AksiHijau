import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Leaf className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-gray-800">AksiHijau</span>
          </Link>

          <motion.div
            className="hidden md:flex items-center space-x-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={link.path}
                  className={`text-gray-700 hover:text-primary transition-colors duration-300 font-medium ${
                    location.pathname === link.path ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-lg font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
