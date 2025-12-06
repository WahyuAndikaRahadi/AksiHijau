import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Leaf, Eye, EyeOff } from "lucide-react"; // Tambahkan Eye dan EyeOff
import { useState } from "react";
import Swal from "sweetalert2"; // Tambahkan import SweetAlert2

// Ganti dengan Base URL API Anda yang sebenarnya (misalnya, URL Vercel)
const API_BASE_URL = "http://localhost:5000/auth"; // Contoh: 'https://aksi-hijau-api.vercel.app/auth'

const Login = () => {
  // Hook useNavigate untuk pengalihan
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            data.error || "Gagal masuk. Cek kembali email dan password Anda.",
          confirmButtonColor: "#16a34a",
        });
        setLoading(false);
        return;
      }

      // --- Logika Login Berhasil dan Pengalihan ---
      const { token, user } = data;

      // 1. Simpan Token
      localStorage.setItem("token", token);

      // 2. SIMPAN DATA USER LENGKAP ke localStorage
      // Ini penting agar Navbar bisa mengambil 'username'
      localStorage.setItem("currentUser", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Login berhasil! Mengalihkan...",
        confirmButtonColor: "#16a34a",
        timer: 1500,
        showConfirmButton: false,
      });

      console.log("Login Sukses, Token Disimpan:", token);

      // 3. Lakukan pengalihan kondisional setelah Swal
      setTimeout(() => {
        if (user?.is_admin) {
          // Jika admin, arahkan ke halaman admin
          navigate("/dashboard-admin");
        } else {
          // Jika user biasa, arahkan ke halaman utama
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Error saat proses login:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan jaringan atau server. Coba lagi nanti.",
        confirmButtonColor: "#16a34a",
      });
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
              <img
                src="/public/img/logo.png" // Ganti dengan URL/path gambar logo kamu
                alt="Logo Aksi Hijau"
                className="w-24 h-24 text-primary group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-600">Masuk ke akun Aksi Hijau Anda</p>
          </div>
          {/* --- Notifikasi Error/Success dihapus karena menggunakan Swal --- */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                {/* Ikon Kunci di Kiri */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  // Tipe input dinamis
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />

                {/* Ikon Mata di Kanan (Toggle Button) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary focus:outline-none"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
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
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ingat saya
                </label>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-green-600"
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-green-600 font-semibold transition-colors duration-300"
              >
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
          Dengan masuk, Anda menyetujui{" "}
          <a href="#" className="text-primary hover:underline">
            Syarat & Ketentuan
          </a>{" "}
          kami
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
