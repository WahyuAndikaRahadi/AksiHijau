import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Leaf } from 'lucide-react';
import { useState } from 'react';

// Ganti dengan Base URL API Anda yang sebenarnya (misalnya, URL Vercel)
const API_BASE_URL = 'http://localhost:5000/auth'; // Contoh: 'https://aksi-hijau-api.vercel.app/auth'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Diubah dari 'name' menjadi 'username' agar sesuai dengan backend
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend Anda mengharapkan 'username', 'email', dan 'password'
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika status kode 4xx atau 5xx
        setError(data.error || 'Pendaftaran gagal. Coba lagi.');
        setLoading(false);
        return;
      }

      // Jika pendaftaran berhasil (status 201)
      setSuccess('Pendaftaran berhasil! Silakan login.');
      // Kosongkan form setelah berhasil
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

    } catch (err) {
      console.error('Error saat proses registrasi:', err);
      setError('Terjadi kesalahan jaringan atau server. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ... (Header dan Logo tetap sama) ... */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bergabung dengan AksiHijau
            </h2>
            <p className="text-gray-600">
              Buat akun dan mulai aksi nyata untuk bumi
            </p>
          </div>
          {/* --- Notifikasi Error/Success --- */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              {success}
            </div>
          )}
          {/* ------------------------------- */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Nama Pengguna"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="email@example.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Ulangi password"
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg font-semibold ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'
              }`}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:text-green-600 font-semibold transition-colors duration-300">
                Masuk
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;