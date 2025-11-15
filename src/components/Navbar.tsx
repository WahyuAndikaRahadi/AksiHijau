import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'; 
import { useState, useEffect, useCallback } from 'react';
import {motion} from 'framer-motion'

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  // isDropdownOpen kini digunakan untuk desktop DAN mobile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State untuk hak akses admin
  const [userName, setUserName] = useState('User');

  // Navigasi Statis
  const baseNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { 
      label: 'Community', 
      isDropdown: true,
      path: '/community', // Path umum, tidak digunakan untuk Link, hanya untuk identifikasi
      dropdownLinks: [
        { path: '/community-events', label: 'Community Events' },
        { path: '/community-social', label: 'Social Community' },
      ] 
    },
    { path: '/news', 'label': 'News' },
    { path: '/contact', label: 'Contact' },
  ];
  
  // Fungsi untuk memeriksa status login dari localStorage
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('currentUser'); 
    
    if (token) {
      setIsAuthenticated(true);
      try {
        const user = userString ? JSON.parse(userString) : {};
        
        // Cek status Admin
        setIsAdmin(user.is_admin === true); 
        
        // Ambil Username
        setUserName(user.username || user.email?.split('@')[0] || 'User');
      } catch (e) {
        setUserName('User');
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName('User');
    }
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName('User');
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Efek Scroll
  useEffect(() => {
    checkAuthStatus(); // Panggil saat mount
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuthStatus]);

  // Efek Perubahan Rute & Reset Menu/Dropdown
  useEffect(() => {
    setIsMenuOpen(false);
    // Tutup dropdown HANYA jika rute berpindah ke luar dari dropdown itu sendiri
    if (!baseNavLinks.find(link => link.isDropdown)?.dropdownLinks.some(subLink => location.pathname === subLink.path || location.pathname === '/dashboard-admin')) {
         setIsDropdownOpen(false);
    }
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);
  
  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownButton = document.getElementById('community-dropdown-button');
      const dropdownMenu = document.getElementById('community-dropdown-menu');
      
      // Jika yang diklik bukan tombol atau menu dropdown, tutup dropdown
      if (
        isDropdownOpen &&
        dropdownButton &&
        dropdownMenu &&
        !dropdownButton.contains(event.target as Node) &&
        !dropdownMenu.contains(event.target as Node)
      ) {
        // Hanya tutup di desktop
        if (window.innerWidth >= 768) { 
            setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  // Tentukan apakah salah satu link di dalam dropdown Community aktif (termasuk Admin Dashboard)
  const isCommunityActive = baseNavLinks
    .find(link => link.isDropdown)?.dropdownLinks
    .some(subLink => location.pathname === subLink.path || location.pathname === '/dashboard-admin');


  // Tentukan daftar tautan lengkap (termasuk Admin jika ada)
  // LOGIKA BARU: ADMIN DASHBOARD DIMASUKKAN KE DALAM DROPDOWN COMMUNITY
  const finalNavLinks = baseNavLinks.map(link => {
    // Cari objek Community (dropdown)
    if (link.isDropdown && link.label === 'Community') {
      let updatedDropdownLinks = [...link.dropdownLinks];

      // Jika user adalah Admin, tambahkan link Admin Dashboard
      if (isAdmin) {
        // Tambahkan link Admin Dashboard di posisi pertama dropdown
        updatedDropdownLinks.unshift({ 
          path: '/dashboard-admin', 
          label: 'Admin Dashboard', 
          isAdmin: true // Flag untuk styling khusus
        });
      }

      // Kembalikan objek link Community yang sudah diperbarui
      return {
        ...link,
        dropdownLinks: updatedDropdownLinks
      };
    }
    return link; // Kembalikan link lainnya apa adanya
  });

  // --- Komponen Aksi Desktop (Login/Register atau Nama/Logout) ---
  const DesktopActions = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Link 
            to="/profile"
            className="flex items-center space-x-2 text-gray-700 font-medium border border-gray-200 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-gray-50"
          >
            <UserIcon className="w-5 h-5 text-primary" />
            <span>Hi, {userName}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:shadow-lg font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-primary text-primary rounded-xl hover:bg-green-50 transition-all duration-300 hover:shadow-lg font-medium"
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
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 lg:px-16 md:px-4 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/30 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Leaf className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-gray-800">AksiHijau</span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {finalNavLinks.map((link) => {
              // Jika ini adalah link Dropdown (Community)
              if (link.isDropdown) {
                return (
                  <div 
                    key={link.label}
                    className="relative"
                  >
                    <button
                      id="community-dropdown-button"
                      onClick={() => setIsDropdownOpen(prev => !prev)} // Toggle dengan klik
                      className={`flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-300 font-medium ${
                        isCommunityActive || isDropdownOpen ? 'text-primary' : ''
                      }`}
                      aria-expanded={isDropdownOpen}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                      {(isCommunityActive) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all" />
                      )}
                    </button>
                    
                    {/* Isi Dropdown */}
                    <motion.div
                      id="community-dropdown-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={isDropdownOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden ${isDropdownOpen ? 'block' : 'hidden'}`}
                      // Hanya matikan event pointer jika tertutup untuk mencegah interaksi tak sengaja
                      style={{ pointerEvents: isDropdownOpen ? 'auto' : 'none' }} 
                    >
                      {link.dropdownLinks.map(subLink => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200 
                            ${subLink.isAdmin 
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold' 
                              : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}
                            ${location.pathname === subLink.path 
                              ? (subLink.isAdmin ? 'bg-red-100 text-red-700 font-bold' : 'bg-primary/10 text-primary font-semibold') 
                              : ''}
                          `}
                          // Tutup dropdown setelah klik link
                          onClick={() => setIsDropdownOpen(false)} 
                        >
                            {subLink.isAdmin}
                            <span>{subLink.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  </div>
                );
              }

              // Jika ini adalah link reguler
              return (
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
              );
            })}
          </div>

          {/* Tombol Aksi (Desktop) */}
          <div className="hidden md:flex items-center">
            <DesktopActions />
          </div>

          {/* Tombol Toggle Mobile */}
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

      {/* Navigasi Mobile */}
      <div 
        className={`md:hidden overflow-y-auto transition-all duration-500 ease-in-out bg-white ${
            isMenuOpen 
                ? 'max-h-[80vh] opacity-100 border-t border-gray-100 shadow-xl'
                : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-2 p-4">
          {finalNavLinks.map((link) => {
             // Jika ini adalah link Dropdown (Community)
             if (link.isDropdown) {
              return (
                <div key={link.label} className="w-full">
                  {/* Klik di mobile untuk toggle dropdown */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isCommunityActive || isDropdownOpen
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {/* Isi Dropdown Mobile */}
                  <div className={`transition-all duration-300 overflow-hidden ${isDropdownOpen ? 'max-h-40 pt-1' : 'max-h-0'}`}>
                    {link.dropdownLinks.map(subLink => (
                      <Link
                        key={subLink.path}
                        to={subLink.path}
                        className={`flex items-center space-x-2 py-2 pl-8 pr-3 text-sm rounded-md transition-colors duration-200 
                          ${subLink.isAdmin 
                            ? 'text-red-700 bg-red-50 hover:bg-red-100 font-bold' 
                            : 'text-gray-600 hover:bg-gray-100'}
                          ${location.pathname === subLink.path 
                            ? (subLink.isAdmin ? 'bg-red-100 text-red-700 font-bold' : 'bg-primary/20 text-primary font-semibold') 
                            : ''}
                        `}
                        // Tutup menu mobile dan dropdown saat link diklik
                        onClick={() => { setIsMenuOpen(false); setIsDropdownOpen(false); }} 
                      >
                        {subLink.isAdmin}
                        <span>{subLink.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            // Jika ini adalah link reguler
            return (
              <div key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 text-center ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              </div>
            );
          })}

          {/* Tombol Aksi (Mobile) */}
          <div className="pt-2 border-t mt-2 flex flex-col space-y-2">
            {isAuthenticated ? (
                <>
                    <Link 
                        to="/profile"
                        className="flex items-center justify-center py-2 text-base font-semibold text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                    >
                         <UserIcon className="w-5 h-5 text-primary mr-2" />
                         Hi, {userName}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-center py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link
                      to="/login"
                      className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-green-50 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;