import { Leaf, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-gray-800">AksiHijau</span>
            </div>
            <p className="text-gray-600 mb-4">
              Gerakan digital untuk edukasi perubahan iklim dan aksi nyata menyelamatkan bumi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors duration-300">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">© 2025 AksiHijau. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
