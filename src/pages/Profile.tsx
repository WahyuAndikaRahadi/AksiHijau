import { motion } from 'framer-motion';
import { User, Mail, Shield, Zap, Award, Loader2, AlertTriangle, Edit, Save, X, Lock, Eye, EyeOff, LucideIcon, Calendar, TrendingUp } from 'lucide-react'; 
import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:5000'; 

interface Badge {
  badge_id: number;
  badge_name: string;
  description: string;
  required_level: number;
  awarded_at: string;
}

interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  is_admin: boolean;
  eco_level: number;
  created_at: string;
}

interface ProfileData {
  user: UserProfile;
  badges: Badge[];
}

interface ProfileStatCardProps {
    Icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
    bgColor: string;
}

const ProfileStatCard = ({ Icon, label, value, color, bgColor }: ProfileStatCardProps) => (
    <div className={`p-4 rounded-xl shadow-sm flex items-center space-x-4 ${bgColor} transition duration-150 hover:shadow-md border border-gray-100`}>
        <div className={`p-2 rounded-lg ${color} ${bgColor.replace('50', '200')} bg-opacity-70`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className={`text-md font-semibold ${color.replace('700', '900')}`}>{value}</p>
        </div>
    </div>
);

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '',
    newPassword: '', 
    confirmNewPassword: '', 
    currentPassword: '', 
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const navigate = useNavigate();

  const getTopBadgeName = (): string => {
      if (badges.length > 0) {
          const sortedBadges = [...badges].sort((a, b) => b.required_level - a.required_level);
          return sortedBadges[0].badge_name;
      }
      return "Eco Warrior Pemula"; 
  };

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

      const data: ProfileData = await response.json(); 
      setProfile(data.user);
      setBadges(data.badges);
      setFormData(prev => ({ 
          ...prev, 
          username: data.user.username, 
          email: data.user.email,
          currentPassword: '', 
          newPassword: '',
          confirmNewPassword: '',
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

  const handleUpdateProfileData = async () => {
    const token = localStorage.getItem('token');
    const { username, email } = formData;
    
    if (!profile) return;

    if (username === profile.username && email === profile.email) {
        return; 
    }

    const payload = { username, email };

    try {
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
        throw new Error(errorData.error || `Gagal memperbarui data dasar. Status: ${response.status}`);
      }
      
      const updatedData: UserProfile = await response.json();
      setProfile(prev => prev ? { ...prev, username: updatedData.username, email: updatedData.email } : null);
      setFormData(prev => ({ ...prev, username: updatedData.username, email: updatedData.email }));

      return true;

    } catch (err) {
      const e = err as Error;
      throw new Error(e.message);
    }
  };

  const handleUpdatePassword = async () => {
    const token = localStorage.getItem('token');
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword.length === 0) {
        return; 
    }

    if (newPassword.length < 6) {
        throw new Error('Password baru harus minimal 6 karakter.');
    }
    if (newPassword !== confirmNewPassword) {
        throw new Error('Konfirmasi password baru tidak cocok.');
    }
    if (!currentPassword) {
        throw new Error('Password saat ini harus diisi untuk mengubah password.');
    }

    const payload = { currentPassword, newPassword };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Gagal memperbarui password. Status: ${response.status}`);
        }
        
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
        return true;

    } catch (err) {
        const e = err as Error;
        throw new Error(e.message);
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const isProfileChanged = formData.username !== profile?.username || formData.email !== profile?.email;
    const isPasswordChanged = formData.newPassword.length > 0;
    
    if (!isProfileChanged && !isPasswordChanged) {
        Swal.fire('Info', 'Tidak ada perubahan yang terdeteksi.', 'info');
        setIsUpdating(false);
        setIsEditing(false);
        return;
    }

    const updatePromises: Promise<any>[] = [];
    
    if (isProfileChanged) {
        updatePromises.push(handleUpdateProfileData());
    }

    if (isPasswordChanged) {
        updatePromises.push(handleUpdatePassword());
    }

    try {
        await Promise.all(updatePromises);

        setIsEditing(false);
        Swal.fire('Berhasil!', 'Profil Anda berhasil diperbarui.', 'success');
        fetchProfile(); 

    } catch (err) {
        const e = err as Error;
        console.error('Error during save:', e.message);
        setError(e.message);
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({ 
          username: profile.username, 
          email: profile.email,
          newPassword: '',
          confirmNewPassword: '',
          currentPassword: '',
      });
    }
    setError(null);
    setIsEditing(false);
    setShowCurrentPassword(false);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-xl border-t-4 border-primary"
      >
        
        <div className="flex items-center space-x-6 pb-6 mb-8 border-b border-gray-100">
          <div className="relative p-5 bg-primary/10 rounded-full shadow-lg">
            <User className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                {isEditing ? 'Kelola Akun' : profile.username}
            </h1>
            {profile.is_admin && (
                <span className="mt-1 mb-2 text-md font-semibold text-red-600 flex items-center bg-red-100 px-3 py-1 rounded-full w-fit">
                    <Shield className="w-4 h-4 mr-2" /> Administrator
                </span>
            )}
            {!isEditing && <p className="text-gray-500 mt-1 flex items-center"><Mail className="w-4 h-4 mr-2"/> {profile.email}</p>}
          </div>
        </div>

        {error && isEditing && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" 
                role="alert"
            >
                <AlertTriangle className="inline w-4 h-4 mr-2" />
                {error}
            </motion.div>
        )}

        {isEditing ? (
            <form onSubmit={handleSaveChanges} className="space-y-8">
                
                <div className="space-y-4 p-5 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center"><Edit className="w-5 h-5 mr-2 text-primary"/> Edit Detail Akun</h3>

                    <div className="space-y-1">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
                            Username
                        </label>
                        <motion.input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200 shadow-inner hover:border-primary/50"
                            placeholder="Masukkan username baru"
                            required
                            whileFocus={{ scale: 1.01 }}
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                            Email
                        </label>
                        <motion.input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200 shadow-inner hover:border-primary/50"
                            placeholder="Masukkan email baru"
                            required
                            whileFocus={{ scale: 1.01 }}
                        />
                    </div>
                </div>

                <div className="space-y-4 p-5 border border-gray-200 rounded-xl shadow-inner bg-red-50/50">
                    <h3 className="text-xl font-bold text-red-700 flex items-center"><Lock className="w-5 h-5 mr-2"/> Ubah Password</h3>
                    <p className="text-sm text-gray-600 -mt-2">Isi kolom di bawah HANYA jika Anda ingin mengubah password Anda. Perlu password saat ini untuk konfirmasi.</p>
                
                    <div className="space-y-1">
                        <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center">
                             Password Saat Ini (Wajib jika ingin ubah password)
                        </label>
                        <div className="relative">
                            <motion.input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 pr-10 shadow-inner"
                                placeholder="Masukkan password Anda saat ini"
                                whileFocus={{ scale: 1.01 }}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500 transition"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label={showCurrentPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 flex items-center">
                             Password Baru (Min 6 Karakter)
                        </label>
                        <div className="relative">
                            <motion.input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 pr-10 shadow-inner"
                                placeholder="Masukkan password baru"
                                whileFocus={{ scale: 1.01 }}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500 transition"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {formData.newPassword.length > 0 && (
                        <div className="space-y-1">
                            <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 flex items-center">
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <motion.input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-200 pr-10 shadow-inner"
                                    placeholder="Ulangi password baru"
                                    required
                                    whileFocus={{ scale: 1.01 }}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500 transition"
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    aria-label={showConfirmNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>


                <div className="flex space-x-4 pt-4">
                    <motion.button
                        type="submit"
                        disabled={isUpdating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center py-3 text-white font-semibold rounded-lg shadow-lg transition duration-300 ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'}`}
                    >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={handleCancelEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-1/4 flex items-center justify-center py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition duration-300"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>
            </form>
        ) : (
            <div>
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    
                    <div className="w-full md:w-1/3 space-y-4">
                        <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-2 flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-500"/> Level & Pencapaian Kunci</h3>

                        <ProfileStatCard 
                            Icon={TrendingUp} 
                            label="Level Eco" 
                            value={`Lv. ${profile.eco_level}`} 
                            color="text-yellow-700" 
                            bgColor="bg-yellow-50" 
                        />

                        <ProfileStatCard 
                            Icon={Calendar} 
                            label="Bergabung Sejak" 
                            value={formatDate(profile.created_at)} 
                            color="text-indigo-700" 
                            bgColor="bg-indigo-50" 
                        />

                        <ProfileStatCard 
                            Icon={Award} 
                            label="Badge Tertinggi Saat Ini" 
                            value={getTopBadgeName()} 
                            color="text-red-700" 
                            bgColor="bg-red-50" 
                        />
                    </div>

                    <div className="w-full md:w-2/3 space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4 flex items-center"><User className="w-4 h-4 mr-2 text-primary"/> Detail Akun</h3>
                        
                        <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p className="text-xl font-bold text-gray-800">{profile.username}</p>
                        </div>

                        <div className="p-4 border border-primary/50 rounded-lg bg-primary/10 shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-medium text-gray-600">Alamat Email</p>
                            <p className="text-xl font-bold text-primary">{profile.email}</p>
                        </div>

                        <motion.button
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                        >
                            <Edit className="w-5 h-5 mr-2" />
                            Ubah Informasi Profil & Password
                        </motion.button>
                    </div>
                </div>

                <div className="pt-6">
                    <h3 className="text-2xl font-extrabold text-gray-900 border-b pb-3 mb-6 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-primary"/> Semua Badge ({badges.length})
                    </h3>
                    
                    <div className={`flex flex-wrap gap-4`}> 
                        {badges.length > 0 ? (
                            badges.map(badge => (
                                <motion.div 
                                    key={badge.badge_id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * badge.required_level }}
                                    className="p-4 border-l-4 border-primary bg-white rounded-xl shadow-md hover:shadow-lg transition flex-grow w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]"
                                >
                                    <p className="font-extrabold text-lg text-green-700 flex justify-between items-center mb-1">
                                        {badge.badge_name}
                                        <span className="text-sm font-bold text-white bg-green-500 px-3 py-0.5 rounded-full">Lv. {badge.required_level}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">Diperoleh pada: {formatDate(badge.awarded_at)}</p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-4 bg-gray-100 rounded-lg text-center w-full">
                                <p className="text-sm text-gray-500">Ayo mulai kontribusi! Belum ada badge yang diperoleh.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

      </motion.div>
    </div>
  );
};

export default Profile;