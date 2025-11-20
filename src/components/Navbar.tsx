import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User as UserIcon, ChevronDown, BookOpen, Newspaper } from 'lucide-react'; 
import { useState, useEffect, useCallback } from 'react';
import {motion} from 'framer-motion'

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  // State untuk dropdown 'Insight'
  const [isInsightDropdownOpen, setIsInsightDropdownOpen] = useState(false); 
  // State untuk dropdown 'Community'
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false); 
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('User');

  // Navigasi Statis
  const baseNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    // DROPDOWN BARU: WAWASAN / INSIGHT
    { 
      label: 'Artikel', 
      isDropdown: true,
      id: 'insight', // ID untuk identifikasi dropdown
      path: '/wawasan', 
      dropdownLinks: [
        { path: '/news', label: 'News & Update', icon: Newspaper }, // Tambahkan ikon untuk visual
        { path: '/blog', label: 'Blog & Artikel', icon: BookOpen }, 
      ] 
    },
    // DROPDOWN LAMA: COMMUNITY
    { 
      label: 'Community', 
      isDropdown: true,
      id: 'community', // ID untuk identifikasi dropdown
      path: '/community', 
      dropdownLinks: [
        { path: '/community-events', label: 'Community Events' },
        { path: '/community-social', label: 'Social Community' },
      ] 
    },
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
        setIsAdmin(user.is_admin === true); 
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
    checkAuthStatus();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuthStatus]);

  // Efek Perubahan Rute & Reset Menu/Dropdown
  useEffect(() => {
    setIsMenuOpen(false);
    // Tutup dropdown spesifik berdasarkan rute saat berpindah
    const isInsightRoute = baseNavLinks
      .find(link => link.id === 'insight')?.dropdownLinks.some(subLink => location.pathname === subLink.path);
    const isCommunityRoute = baseNavLinks
      .find(link => link.id === 'community')?.dropdownLinks.some(subLink => location.pathname === subLink.path || location.pathname === '/dashboard-admin');
    
    // Hanya tutup dropdown jika rute TIDAK termasuk dalam dropdown tersebut
    if (!isInsightRoute) setIsInsightDropdownOpen(false);
    if (!isCommunityRoute) setIsCommunityDropdownOpen(false);
    
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);
  
  // Menutup dropdown saat klik di luar (HANYA DESKTOP)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const buttons = [
            document.getElementById('insight-dropdown-button'),
            document.getElementById('community-dropdown-button')
        ];
        const menus = [
            document.getElementById('insight-dropdown-menu'),
            document.getElementById('community-dropdown-menu')
        ];

        if (window.innerWidth >= 768) { 
            let clickInsideAnyDropdown = false;
            
            // Cek jika klik berada di dalam tombol atau menu dropdown mana pun
            buttons.forEach((button, index) => {
                if (
                    (button && button.contains(event.target as Node)) ||
                    (menus[index] && menus[index]!.contains(event.target as Node))
                ) {
                    clickInsideAnyDropdown = true;
                }
            });

            // Jika klik di luar semua dropdown, tutup semua
            if (!clickInsideAnyDropdown) {
                setIsInsightDropdownOpen(false);
                setIsCommunityDropdownOpen(false);
            }
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fungsi untuk mengecek apakah rute saat ini aktif di dalam dropdown tertentu
  const isDropdownActive = (id: 'insight' | 'community') => {
    const links = baseNavLinks.find(link => link.id === id)?.dropdownLinks || [];
    const isBaseActive = links.some(subLink => location.pathname === subLink.path);

    if (id === 'community' && isAdmin && location.pathname === '/dashboard-admin') {
        return true; // Admin Dashboard juga membuat Community aktif
    }
    return isBaseActive;
  }


  // Tentukan daftar tautan lengkap (termasuk Admin jika ada)
  const finalNavLinks = baseNavLinks.map(link => {
    if (link.isDropdown && link.id === 'community') {
      let updatedDropdownLinks = [...link.dropdownLinks];

      if (isAdmin) {
        updatedDropdownLinks.unshift({ 
          path: '/dashboard-admin', 
          label: 'Admin Dashboard', 
          isAdmin: true,
          icon: UserIcon // Menggunakan UserIcon sebagai ikon admin
        });
      }

      return { ...link, dropdownLinks: updatedDropdownLinks };
    }
    return link;
  });
  
  // Fungsi untuk mendapatkan state dropdown berdasarkan ID
  const getDropdownState = (id: 'insight' | 'community') => {
      return id === 'insight' ? isInsightDropdownOpen : isCommunityDropdownOpen;
  }

  // Fungsi untuk toggle state dropdown berdasarkan ID
  const toggleDropdown = (id: 'insight' | 'community') => {
      if (id === 'insight') {
          setIsInsightDropdownOpen(prev => !prev);
          setIsCommunityDropdownOpen(false); // Tutup dropdown lain
      } else {
          setIsCommunityDropdownOpen(prev => !prev);
          setIsInsightDropdownOpen(false); // Tutup dropdown lain
      }
  }


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
              // Jika ini adalah link Dropdown (Insight atau Community)
              if (link.isDropdown && link.id) {
                const isActive = isDropdownActive(link.id as 'insight' | 'community');
                const isOpen = getDropdownState(link.id as 'insight' | 'community');

                return (
                  <div 
                    key={link.label}
                    className="relative"
                  >
                    <button
                      id={`${link.id}-dropdown-button`}
                      onClick={() => toggleDropdown(link.id as 'insight' | 'community')}
                      className={`flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-300 font-medium ${
                        isActive || isOpen ? 'text-primary' : ''
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                      {(isActive) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all" />
                      )}
                    </button>
                    
                    {/* Isi Dropdown */}
                    <motion.div
                      id={`${link.id}-dropdown-menu`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
                      style={{ pointerEvents: isOpen ? 'auto' : 'none' }} 
                    >
                      {link.dropdownLinks.map(subLink => {
                          // Menggunakan ikon dari subLink atau default UserIcon jika Admin
                          const IconComponent = subLink.icon || (subLink.isAdmin ? UserIcon : null); 
                          
                          return (
                            <Link
                              key={subLink.path}
                              to={subLink.path}
                              className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 
                                ${subLink.isAdmin 
                                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold' 
                                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}
                                ${location.pathname === subLink.path 
                                  ? (subLink.isAdmin ? 'bg-red-100 text-red-700 font-bold' : 'bg-primary/10 text-primary font-semibold') 
                                  : ''}
                              `}
                              onClick={() => {
                                  // Tutup kedua dropdown setelah klik link di desktop
                                  setIsInsightDropdownOpen(false);
                                  setIsCommunityDropdownOpen(false);
                              }} 
                            >
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                <span>{subLink.label}</span>
                            </Link>
                          );
                      })}
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
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all"
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
             // Jika ini adalah link Dropdown
             if (link.isDropdown && link.id) {
              const isActive = isDropdownActive(link.id as 'insight' | 'community');
              const isOpen = getDropdownState(link.id as 'insight' | 'community');
              
              return (
                <div key={link.label} className="w-full">
                  {/* Klik di mobile untuk toggle dropdown */}
                  <button
                    onClick={() => toggleDropdown(link.id as 'insight' | 'community')} 
                    className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive || isOpen
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {/* Isi Dropdown Mobile */}
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 pt-1' : 'max-h-0'}`}>
                    {link.dropdownLinks.map(subLink => {
                       const IconComponent = subLink.icon || (subLink.isAdmin ? UserIcon : null); 
                       
                       return (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className={`flex items-center space-x-3 py-2 pl-8 pr-3 text-sm rounded-md transition-colors duration-200 
                            ${subLink.isAdmin 
                              ? 'text-red-700 bg-red-50 hover:bg-red-100 font-bold' 
                              : 'text-gray-600 hover:bg-gray-100'}
                            ${location.pathname === subLink.path 
                              ? (subLink.isAdmin ? 'bg-red-100 text-red-700 font-bold' : 'bg-primary/20 text-primary font-semibold') 
                              : ''}
                          `}
                          // Tutup menu mobile dan semua dropdown saat link diklik
                          onClick={() => { 
                            setIsMenuOpen(false); 
                            setIsInsightDropdownOpen(false);
                            setIsCommunityDropdownOpen(false);
                          }} 
                        >
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          <span>{subLink.label}</span>
                        </Link>
                       );
                    })}
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