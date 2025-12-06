import { motion } from 'framer-motion';
import { User, Mail, Shield, Zap, Clock, Loader2, AlertTriangle, Edit, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Ganti dengan Base URL API Anda yang sebenarnya
const API_BASE_URL = 'http://localhost:5000'; 

// Definisi Tipe untuk Data Profil Pengguna
interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  is_admin: boolean;
  eco_level: number;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '',
    newPassword: '', // State baru untuk password baru
    confirmNewPassword: '', // State baru untuk konfirmasi password
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const navigate = useNavigate();

  // Memuat data profil
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Sesi Habis', 'Anda perlu login kembali.', 'warning');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Gagal mengambil data profil. Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data: UserProfile = await response.json();
      setProfile(data);
      // Inisialisasi formData dengan data profil yang ada
      setFormData(prev => ({ 
          ...prev, 
          username: data.username, 
          email: data.email 
      }));
      
    } catch (err) {
      const e = err as Error;
      console.error('Error fetching profile:', e.message);
      setError('Gagal mengambil data profil. Silakan coba lagi.');
      Swal.fire({
        icon: 'error',
        title: 'Error Profil',
        text: e.message,
        confirmButtonColor: '#16a34a',
      });

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fungsi untuk update profil (termasuk password)
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Sesi Habis', 'Anda perlu login kembali.', 'warning');
      navigate('/login');
      setIsUpdating(false);
      return;
    }
    
    const { username, email, newPassword, confirmNewPassword } = formData;
    
    // Cek apakah ada perubahan pada username/email
    const isProfileChanged = username !== profile?.username || email !== profile?.email;
    const isPasswordChanged = newPassword.length > 0;

    if (!isProfileChanged && !isPasswordChanged) {
        Swal.fire('Info', 'Tidak ada perubahan yang terdeteksi.', 'info');
        setIsUpdating(false);
        setIsEditing(false);
        return;
    }

    // Validasi Password Baru (jika diisi)
    if (isPasswordChanged) {
        if (newPassword.length < 6) {
            setError('Password baru harus minimal 6 karakter.');
            setIsUpdating(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('Konfirmasi password baru tidak cocok.');
            setIsUpdating(false);
            return;
        }
    }
    
    // Validasi sederhana untuk username/email
    if (!username || !email) {
        setError('Username dan Email tidak boleh kosong.');
        setIsUpdating(false);
        return;
    }

    // Payload hanya sertakan newPassword jika diisi
    const payload = {
        username,
        email,
        // Kirim newPassword hanya jika ada perubahan
        newPassword: isPasswordChanged ? newPassword : undefined, 
    };

    try {
      // Kirim permintaan PUT ke endpoint update profile
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Gagal memperbarui profil. Status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const updatedData: UserProfile = await response.json();
      
      // Update state local dan reset form password
      setProfile(updatedData);
      setFormData({ 
          username: updatedData.username, 
          email: updatedData.email, 
          newPassword: '', 
          confirmNewPassword: '' 
      });
      setIsEditing(false); // Keluar dari mode edit

      Swal.fire('Berhasil!', 'Profil Anda berhasil diperbarui.', 'success');

    } catch (err) {
      const e = err as Error;
      console.error('Error updating profile:', e.message);
      setError('Gagal memperbarui profil. Coba periksa koneksi atau input Anda.');
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui',
        text: e.message,
        confirmButtonColor: '#16a34a',
      });
      
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handler perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk mereset form dan keluar dari mode edit
  const handleCancelEdit = () => {
    if (profile) {
      setFormData({ 
          username: profile.username, 
          email: profile.email,
          newPassword: '',
          confirmNewPassword: ''
      });
    }
    setError(null);
    setIsEditing(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <span className="text-lg text-gray-600">Memuat Profil...</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-8">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl shadow-lg">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600">{error || "Data profil tidak tersedia."}</p>
        </div>
      </div>
    );
  }
  
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center border-b pb-6 mb-6">
          <div className="relative p-3 bg-primary/10 rounded-full mb-4">
            <User className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? 'Edit Profil' : profile.username}
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID Pengguna: {profile.user_id}</p>
        </div>

        {/* Notifikasi Error saat Update */}
        {error && isEditing && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                <AlertTriangle className="inline w-4 h-4 mr-2" />
                {error}
            </div>
        )}

        {isEditing ? (
            // MODE EDIT
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* Edit Username */}
                <div className="space-y-1">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2" /> Username Baru
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition duration-150"
                        placeholder="Masukkan username baru"
                        required
                    />
                </div>

                {/* Edit Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2" /> Email Baru
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition duration-150"
                        placeholder="Masukkan email baru"
                        required
                    />
                </div>

                {/* New Password */}
                <div className="space-y-1">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2" /> Password Baru (Kosongkan jika tidak ingin diubah)
                    </label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition duration-150 pr-10"
                            placeholder="Minimal 6 karakter"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password (Hanya tampil jika New Password diisi) */}
                {formData.newPassword.length > 0 && (
                    <div className="space-y-1">
                        <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 flex items-center">
                            <Lock className="w-4 h-4 mr-2" /> Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                            <input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                value={formData.confirmNewPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition duration-150 pr-10"
                                placeholder="Ulangi password baru"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                aria-label={showConfirmNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                )}


                {/* Tombol Aksi Edit */}
                <div className="flex space-x-4 pt-4">
                    <motion.button
                        type="submit"
                        disabled={isUpdating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center py-3 text-white font-semibold rounded-xl shadow-lg transition duration-300 ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'}`}
                    >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={handleCancelEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-1/4 flex items-center justify-center py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>
            </form>
        ) : (
            // MODE TAMPIL
            <>
                <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-center space-x-4 p-4 border rounded-xl bg-green-50/50">
                        <Mail className="w-6 h-6 text-green-600" />
                        <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                        </div>
                    </div>
                    
                    {/* Status Admin */}
                    <div className="flex items-center space-x-4 p-4 border rounded-xl bg-blue-50/50">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <div>
                        <p className="text-sm font-medium text-gray-500">Akses</p>
                        <p className={`text-lg font-semibold ${profile.is_admin ? 'text-red-600' : 'text-green-700'}`}>
                            {profile.is_admin ? 'Administrator' : 'Pengguna Biasa'}
                        </p>
                        </div>
                    </div>

                    {/* Eco Level */}
                    <div className="flex items-center space-x-4 p-4 border rounded-xl bg-yellow-50/50">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        <div>
                        <p className="text-sm font-medium text-gray-500">Level Eco</p>
                        <p className="text-lg font-semibold text-gray-800">Level {profile.eco_level}</p>
                        </div>
                    </div>
                    
                    {/* Tanggal Daftar */}
                    <div className="flex items-center space-x-4 p-4 border rounded-xl bg-gray-50/50">
                        <Clock className="w-6 h-6 text-gray-500" />
                        <div>
                        <p className="text-sm font-medium text-gray-500">Tanggal Bergabung</p>
                        <p className="text-lg font-semibold text-gray-800">{formatDate(profile.created_at)}</p>
                        </div>
                    </div>

                </div>

                <motion.button
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 w-full py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profil
                </motion.button>
            </>
        )}

      </motion.div>
    </div>
  );
};

export default Profile;