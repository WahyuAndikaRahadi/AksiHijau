import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Leaf } from 'lucide-react';
import { useState } from 'react';

// Ganti dengan Base URL API Anda yang sebenarnya (misalnya, URL Vercel)
const API_BASE_URL = 'http://localhost:5000/auth'; // Contoh: 'https://aksi-hijau-api.vercel.app/auth'

const Login = () => {
  // Hook useNavigate untuk pengalihan
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal masuk. Cek kembali email dan password Anda.');
        setLoading(false);
        return;
      }

      // --- Logika Login Berhasil dan Pengalihan ---
      const { token, user } = data;
      
      // 1. Simpan Token
      localStorage.setItem('token', token);
      
      // 2. SIMPAN DATA USER LENGKAP ke localStorage
      // Ini penting agar Navbar bisa mengambil 'username'
      localStorage.setItem('currentUser', JSON.stringify(user)); 
      
      setSuccess('Login berhasil! Mengalihkan...');
      
      console.log('Login Sukses, Token Disimpan:', token);
      
      // 3. Lakukan pengalihan kondisional
      if (user?.is_admin) {
        // Jika admin, arahkan ke halaman admin
        navigate('/dashboard-admin');
      } else {
        // Jika user biasa, arahkan ke halaman utama
        navigate('/');
      }

    } catch (err) {
      console.error('Error saat proses login:', err);
      setError('Terjadi kesalahan jaringan atau server. Coba lagi nanti.');
    } finally {
      // Set loading menjadi false (meskipun navigasi sudah terjadi)
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
          {/* Header dan Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-600">
              Masuk ke akun AksiHijau Anda
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
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
              transition={{ delay: 0.2, duration: 0.5 }}
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
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-green-600 transition-colors duration-300">
                Lupa password?
              </a>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg font-semibold ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'
              }`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary hover:text-green-600 font-semibold transition-colors duration-300">
                Daftar sekarang
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-gray-600 mt-6"
        >
          Dengan masuk, Anda menyetujui{' '}
          <a href="#" className="text-primary hover:underline">
            Syarat & Ketentuan
          </a>{' '}
          kami
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;