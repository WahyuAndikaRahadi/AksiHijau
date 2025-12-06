import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Droplet, 
  BookOpen, 
  Activity, 
  AlertTriangle,
  ShieldCheck, 
  Skull, 
  X, 
  Waves, 
  HeartPulse,
  Droplets, 
  ShowerHead, 
  Utensils, 
  Shirt, 
  RefreshCcw, 
  Info,
  ArrowRight,
  TrendingUp,
  Loader,
  Archive,
  PlusCircle, 
  Trash2, 
  Sparkles, 
  BarChart,
} from 'lucide-react';

// =============================
// SECTION 1: KUALITAS AIR
// (Tidak ada perubahan)
// =============================

const KualitasAirSection: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-16 px-4 w-full bg-gradient-to-b from-white to-cyan-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white border border-cyan-100 rounded-[2.5rem] p-8 lg:p-12 relative shadow-xl overflow-hidden"
      >
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-50 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-50 rounded-full filter blur-3xl opacity-50 translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* --- KONTEN KIRI (GAMBAR) --- */}
          <div className="relative w-full flex justify-center lg:justify-start pt-10 lg:pt-0 order-2 lg:order-1">
            <div className="relative w-full">
              {/* Container Gambar */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white group relative z-0">
                <img
                  src="./img/Water.jpg"
                  alt="Sungai Bersih vs Tercemar"
                  className="w-full h-full object-cover"
                />
                {/* Overlay Gradient Halus */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
              </div>

              {/* Floating Card (Status Air) */}
              <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-cyan-50 flex items-center gap-4 z-20 max-w-[260px]">
                <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0 text-blue-600">
                  <Waves className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Kualitas Air Sungai
                  </div>
                  <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-amber-500">Tercemar Sedang</span>
                    <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- KONTEN KANAN (TEKS) --- */}
          <div className="order-1 lg:order-2">
            {/* Badge Kategori */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-bold mb-6 shadow-sm backdrop-blur-sm">
              <Droplet className="w-4 h-4" />
              Kualitas Air
            </div>

            {/* Judul Utama */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Air Bersih untuk <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Masa Depan Sehat
              </span>
            </h2>

            {/* Deskripsi */}
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Air adalah sumber kehidupan, namun pencemaran industri dan limbah domestik mengancam ketersediaan air bersih. Setiap tetes yang kita selamatkan hari ini adalah investasi bagi generasi mendatang.
            </p>

            {/* Kotak Statistik */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-cyan-50/50 rounded-2xl p-6 border border-cyan-100">
                <div className="text-3xl font-bold text-cyan-700 mb-2">70%</div>
                <div className="text-sm text-cyan-800/80 font-medium">Sumber air tercemar</div>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl font-bold text-blue-700 mb-2">2.2M</div>
                <div className="text-sm text-blue-800/80 font-medium">Krisis air bersih</div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`
                group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg overflow-hidden
                ${showDetails ? 'bg-blue-600 hover:bg-blue-800' : 'bg-cyan-600 hover:bg-cyan-700'}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {showDetails ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                {showDetails ? 'Sembunyikan Detail' : 'Pelajari Dampaknya'}
              </span>
            </button>
          </div>
        </div>

        {/* --- PANEL DETAIL TAMBAHAN (EXPANDABLE) --- */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 48 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="bg-cyan-50/50 rounded-3xl p-8 md:p-10 border border-cyan-100">
                <h3 className="text-2xl font-bold text-cyan-900 mb-8 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  Dampak Pencemaran Air
                </h3>

                <div className="grid md:grid-cols-2 gap-12 mb-10">
                  {/* Jenis Pencemar */}
                  <div>
                    <h4 className="flex items-center text-lg font-bold text-red-600 mb-4">
                      <Skull className="w-5 h-5 mr-2" /> Jenis Pencemar Air
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Limbah industri (logam berat, bahan kimia berbahaya).</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Limbah domestik (deterjen, sampah plastik, air sabun).</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Limpasan pertanian (pupuk kimia, pestisida).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Dampak Lingkungan */}
                  <div>
                    <h4 className="flex items-center text-lg font-bold text-orange-600 mb-4">
                      <HeartPulse className="w-5 h-5 mr-2" /> Dampak Kesehatan & Ekosistem
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Penyebaran penyakit bawaan air (diare, tifus, kolera).</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Kematian biota air dan kerusakan terumbu karang.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Gangguan rantai makanan akibat akumulasi racun.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Solusi Berkelanjutan */}
                <div className="pt-6 border-t border-cyan-100">
                  <h4 className="flex items-center text-lg font-bold text-cyan-700 mb-6">
                    <ShieldCheck className="w-5 h-5 mr-2" /> Solusi Berkelanjutan
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Solusi 1 */}
                    <div className="bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm">
                      <h5 className="font-bold text-cyan-800 mb-2 text-sm">Pengolahan Limbah</h5>
                      <p className="text-xs text-cyan-700/80 leading-relaxed">
                        Dukung instalasi pengolahan air limbah (IPAL) di industri dan rumah tangga.
                      </p>
                    </div>
                    {/* Solusi 2 */}
                    <div className="bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm">
                      <h5 className="font-bold text-cyan-800 mb-2 text-sm">Hemat Air</h5>
                      <p className="text-xs text-cyan-700/80 leading-relaxed">
                        Gunakan air seperlunya, perbaiki keran bocor, dan gunakan teknologi hemat air.
                      </p>
                    </div>
                    {/* Solusi 3 */}
                    <div className="bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm">
                      <h5 className="font-bold text-cyan-800 mb-2 text-sm">Kurangi Plastik</h5>
                      <p className="text-xs text-cyan-700/80 leading-relaxed">
                        Hindari plastik sekali pakai yang sering berakhir mencemari sungai dan laut.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// =============================
// SECTION 2: WATER FOOTPRINT CALCULATOR
// =============================

// Konstanta API Gemini
const MODEL_NAME = "gemini-2.5-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// GANTI DENGAN KEY ANDA
const GEMINI_API_KEY = "AIzaSyBU_XwDdo1d10izloI1wGlukAjaXTruMzk"; 

interface VirtualActivity {
  id: number;
  name: string;
  liters: number; // Langsung liter yang diketik user
}

interface WaterData {
  showerMinutes: number;
  laundryLoads: number;
  dishMinutes: number;
  customVirtualActivities: VirtualActivity[]; 
}

// Komponen Input Dinamis untuk Jejak Air Virtual
const DynamicVirtualInput: React.FC<{
  activities: VirtualActivity[];
  setActivities: React.Dispatch<React.SetStateAction<VirtualActivity[]>>;
}> = ({ activities, setActivities }) => {
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityLiters, setNewActivityLiters] = useState(5); // Default 5 liter

  // 1. Array aman untuk rendering
  const safeActivities = Array.isArray(activities) ? activities : [];
  
  // 2. Logika untuk menonaktifkan tombol tambah
  const isAddDisabled = newActivityName.trim().length === 0 || newActivityLiters <= 0;


  const addActivity = () => {
    const name = newActivityName.trim();
    const liters = newActivityLiters;

    if (name && liters > 0) {
      // Menggunakan functional update untuk memastikan data lama tidak hilang
      setActivities((prevActivities) => {
        
        // Pastikan state sebelumnya adalah array
        const listToUpdate = Array.isArray(prevActivities) ? prevActivities : [];
        
        // Return array BARU yang berisi SEMUA item LAMA ditambah item BARU.
        return [
          ...listToUpdate, 
          {
            id: Date.now(),
            name: name,
            liters: liters,
          },
        ];
      });
      
      // Reset input setelah berhasil
      setNewActivityName('');
      setNewActivityLiters(5);
    }
  };

  const updateActivity = (id: number, field: 'name' | 'liters', value: string | number) => {
    // Tambahkan perlindungan pada 'activities' saat melakukan map
    const updatedActivities = safeActivities.map((activity) =>
        activity.id === id
          ? { ...activity, [field]: field === 'liters' ? parseInt(value as string) || 0 : value }
          : activity
      );
    setActivities(updatedActivities);
  };

  const removeActivity = (id: number) => {
    // Tambahkan perlindungan pada 'activities' saat melakukan filter
    const filteredActivities = safeActivities.filter((activity) => activity.id !== id);
    setActivities(filteredActivities);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-bold text-slate-700 flex items-center gap-2">
        <BarChart className="w-4 h-4 text-pink-500" />
        Input Jejak Air Tambahan (Perkiraan Liter)
      </h4>

      {/* Daftar Kegiatan yang Sudah Ada */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        <AnimatePresence>
          {/* Gunakan safeActivities yang dijamin berupa array */}
          {safeActivities.map((activity) => ( 
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 bg-white rounded-xl p-3 border border-pink-100 shadow-sm"
            >
              {/* Input Nama Kegiatan */}
              <input
                type="text"
                value={activity.name}
                onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                placeholder="Nama Kegiatan"
                className="w-1/2 p-1.5 text-sm font-medium text-slate-700 bg-transparent focus:ring-0 focus:outline-none"
              />
              
              {/* Input Liter */}
              <div className="flex items-center w-1/3 border-l border-pink-100 pl-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={activity.liters}
                  onChange={(e) => updateActivity(activity.id, 'liters', e.target.value)}
                  className="w-full p-1.5 text-sm font-mono text-pink-600 bg-transparent text-right focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-slate-400">L</span>
              </div>

              {/* Tombol Hapus */}
              <button
                onClick={() => removeActivity(activity.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Form Tambah Kegiatan Baru */}
      <div className="mt-4 pt-4 border-t border-pink-100 flex gap-2">
        <input
          type="text"
          placeholder="e.g. Cuci Motor"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          className="flex-grow p-2 rounded-xl border border-slate-200 text-sm focus:border-cyan-400 focus:ring-cyan-400"
        />
        <div className="flex items-center w-24 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="number"
            min="1"
            max="100"
            placeholder="Liter"
            value={newActivityLiters}
            // Pastikan nilai diubah menjadi integer yang valid, minimal 1
            onChange={(e) => setNewActivityLiters(parseInt(e.target.value) || 0)}
            className="w-full p-2 text-sm text-center bg-transparent focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-slate-400 pr-2">L</span>
        </div>
        <button
          onClick={addActivity}
          disabled={isAddDisabled} // Terapkan logika nonaktif
          className={`p-2 rounded-xl transition-all flex-shrink-0 ${
            isAddDisabled 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' // Tampilan nonaktif
              : 'bg-cyan-600 text-white hover:bg-cyan-700' // Tampilan aktif
          }`}
          title="Tambah Kegiatan"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- Komponen Input Interaktif yang DIMODIFIKASI ---
const CustomInputButtons: React.FC<{
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  colorClass: string;
}> = ({ value, min, max, onChange, colorClass }) => {
  
  const handleUpdate = (step: number) => {
    let newValue = value + step;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };
  
  // Fungsi baru untuk menangani input dari keyboard
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value);
    
    // Hanya update jika nilai bukan NaN
    if (!isNaN(rawValue)) {
      // Pastikan nilai tetap berada di dalam batas min/max
      const newValue = Math.max(min, Math.min(max, rawValue));
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Tombol -5 (Lompatan Besar) */}
      <button
        onClick={() => handleUpdate(-5)}
        disabled={value <= min}
        className={`p-2 rounded-xl text-white font-bold text-lg w-12 transition-all duration-150 shadow-md ${
          value <= min 
            ? 'bg-slate-300' 
            : `${colorClass.replace('-500', '-600')} hover:opacity-80`
        }`}
      >
        -5
      </button>

      {/* Tombol -1 (Lompatan Kecil) */}
      <button
        onClick={() => handleUpdate(-1)}
        disabled={value <= min}
        className={`p-2 rounded-xl text-white font-bold text-lg w-10 transition-all duration-150 shadow-md ${
          value <= min 
            ? 'bg-slate-300' 
            : `${colorClass} hover:opacity-80`
        }`}
      >
        -1
      </button>

      {/* INPUT ANGKA (Untuk bisa diketik) */}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        // Styling disesuaikan agar terlihat seperti div sebelumnya
        className={`flex-grow text-center text-3xl font-extrabold p-2 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 ${colorClass.replace('bg-', 'text-').replace('-500', '-700')} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Durasi Mandi"
      />

      {/* Tombol +1 (Lompatan Kecil) */}
      <button
        onClick={() => handleUpdate(1)}
        disabled={value >= max}
        className={`p-2 rounded-xl text-white font-bold text-lg w-10 transition-all duration-150 shadow-md ${
          value >= max 
            ? 'bg-slate-300' 
            : `${colorClass} hover:opacity-80`
        }`}
      >
        +1
      </button>

      {/* Tombol +5 (Lompatan Besar) */}
      <button
        onClick={() => handleUpdate(5)}
        disabled={value >= max}
        className={`p-2 rounded-xl text-white font-bold text-lg w-12 transition-all duration-150 shadow-md ${
          value >= max 
            ? 'bg-slate-300' 
            : `${colorClass.replace('-500', '-600')} hover:opacity-80`
        }`}
      >
        +5
      </button>
    </div>
  );
};

// --- Komponen Slider Sederhana ---
const CustomSlider = ({
    value,
    min,
    max,
    onChange,
    colorClass,
  }: {
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    colorClass: string;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="relative w-full h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          {/* Filled Track */}
          <div
            className={`h-full ${colorClass}`}
            style={{ width: `${percentage}%`, transition: 'width 0.1s ease-out' }}
          />
        </div>
        {/* Input Range (Invisible but clickable) */}
        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />
        {/* Custom Thumb handle */}
        <div
          className={`absolute h-5 w-5 bg-white border-2 rounded-full shadow-md z-10 pointer-events-none transition-all duration-100 ease-out flex items-center justify-center`}
          style={{ left: `calc(${percentage}% - 10px)` }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('-500', '-600')}`} />
        </div>
      </div>
    );
  };


const WaterFootprintCalculatorSection: React.FC = () => {
  // --- State ---
  const [data, setData] = useState<WaterData>({
    showerMinutes: 10,
    laundryLoads: 3,
    dishMinutes: 15,
    customVirtualActivities: [
        { id: 1, name: 'Beli Kopi Instan', liters: 140 }, 
        { id: 2, name: 'Cuci Motor', liters: 40 }, 
        { id: 3, name: 'Streaming 1 jam', liters: 15 }, 
    ],
  });

  const [totalLiters, setTotalLiters] = useState(0);
  const [breakdown, setBreakdown] = useState({ shower: 0, laundry: 0, dish: 0, virtual: 0 }); 
  const [statusColor, setStatusColor] = useState('from-blue-500 to-cyan-500');
  const [statusText, setStatusText] = useState('Normal');
  const [tipsLoading, setTipsLoading] = useState(false);
  const [geminiTips, setGeminiTips] = useState<string | null>(null);
  const [isTipsExpanded, setIsTipsExpanded] = useState(false); 


  // --- Konstanta ---
  const LITERS_PER_SHOWER_MINUTE = 12;
  const LITERS_PER_LAUNDRY_LOAD = 50;
  const LITERS_PER_DISH_MINUTE = 9;

  // --- Kalkulasi ---
  const calculateTotal = useCallback(() => {
    const dailyShower = data.showerMinutes * LITERS_PER_SHOWER_MINUTE;
    const dailyLaundry = (data.laundryLoads * LITERS_PER_LAUNDRY_LOAD) / 7;
    const dailyDish = data.dishMinutes * LITERS_PER_DISH_MINUTE;
    
    // Perlindungan saat melakukan reduce
    const totalCustomVirtual = (Array.isArray(data.customVirtualActivities) ? data.customVirtualActivities : []).reduce(
        (sum, activity) => sum + activity.liters, 0
    ); 

    const total = Math.round(dailyShower + dailyLaundry + dailyDish + totalCustomVirtual);

    setTotalLiters(total);
    setBreakdown({
      shower: dailyShower,
      laundry: dailyLaundry,
      dish: dailyDish,
      virtual: totalCustomVirtual, 
    });

    if (total < 500) {
      setStatusColor('from-emerald-400 to-green-600');
      setStatusText('Eco Warrior 🌱');
    } else if (total < 1500) {
      setStatusColor('from-cyan-400 to-blue-600');
      setStatusText('Wajar 💧');
    } else if (total < 3000) {
      setStatusColor('from-amber-400 to-orange-600');
      setStatusText('Boros ⚠️');
    } else {
      setStatusColor('from-red-500 to-rose-700');
      setStatusText('Kritis 🚨');
    }
  }, [data]);

  useEffect(() => {
    calculateTotal();
  }, [data, calculateTotal]);

  const handleChange = (key: keyof Omit<WaterData, 'customVirtualActivities'>, value: number) => {
    setData(prev => ({ ...prev, [key]: value }));
  };
  
  // Setter khusus untuk aktivitas virtual
  const setCustomVirtualActivities: React.Dispatch<React.SetStateAction<VirtualActivity[]>> = (updater) => {
      setData(prev => {
          const currentActivities = prev.customVirtualActivities;
          
          // Jika updater adalah fungsi (functional update)
          if (typeof updater === 'function') {
              // Panggil updater dengan state lama dan ambil nilai barunya
              const newActivities = updater(currentActivities);
              return { ...prev, customVirtualActivities: Array.isArray(newActivities) ? newActivities : [] };
          } 
          // Jika updater adalah nilai (value update)
          else {
              return { ...prev, customVirtualActivities: Array.isArray(updater) ? updater : [] };
          }
      });
  };

  // --- Fungsi Panggil Gemini API (Dengan Toggle Logic) ---
  const fetchGeminiTips = async () => {
    // 1. Jika sedang expanded, tutup (toggle)
    if (isTipsExpanded) {
        setIsTipsExpanded(false);
        return;
    }

    // 2. Jika collapsed, buka.
    setIsTipsExpanded(true); 

    // 3. Hanya fetch jika tips belum ada (geminiTips === null) 
    //    atau sedang loading karena data input baru
    if (geminiTips && !tipsLoading) {
      // Jika tips ada dan tidak sedang loading, tampilkan tips yang sudah ada (cached).
      return;
    }

    // Force fetch (old logic)
    setGeminiTips(null);
    setTipsLoading(true);

    // Perlindungan saat memanggil map/reduce untuk API prompt
    const safeVirtualActivities = Array.isArray(data.customVirtualActivities) ? data.customVirtualActivities : [];
  
    // Format kegiatan virtual untuk prompt Gemini
    const virtualSummary = safeVirtualActivities.map(a => `${a.name} (${a.liters} L)`).join(', ');
    
    // PROMPT BARU DENGAN INPUT VIRTUAL DINAMIS
    const prompt = `Saya telah menghitung jejak air harian saya. Rinciannya adalah: Mandi (${data.showerMinutes} menit), Laundry (${data.laundryLoads}x/minggu), Cuci Piring (${data.dishMinutes} menit), dan beberapa kegiatan harian/virtual lainnya: ${virtualSummary}. Total jejak air saya adalah ${totalLiters.toLocaleString()} Liter/hari. Berikan 5 tips yang sangat spesifik dan praktis (dalam format list: * [Tip]) dalam Bahasa Indonesia untuk mengurangi konsumsi air di kategori yang saya sebutkan, termasuk tips untuk mengurangi jejak air dari kegiatan virtual/tambahan seperti ${safeVirtualActivities[0]?.name || 'kegiatan virtual'}.`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    };

    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Coba baca error dari response body jika ada
        const errorBody = await response.json();
        console.error("API Error Body:", errorBody);
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody.error?.message || response.statusText}`);
      }

      const result = await response.json();
      
      const tips = result.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan tips dari Gemini.";

      setGeminiTips(tips);
    } catch (error) {
      console.error("Error fetching Gemini tips:", error);
      setGeminiTips(`Error: Terjadi kesalahan saat menghubungi server Gemini. Detail: ${(error as Error).message}.`);
    } finally {
      setTipsLoading(false);
    }
  };


  return (
    <section className="min-h-screen w-full bg-[#f8fafc] font-sans selection:bg-cyan-100 text-slate-800 pb-20">
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-cyan-100/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12 md:pt-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold"
          >
            <Droplets className="w-4 h-4 text-cyan-500 fill-cyan-500" /> Water Footprint Calculator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
          >
            Seberapa Besar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
              Jejak Airmu?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-lg mx-auto text-lg"
          >
            Hitung dampak tersembunyi gaya hidupmu terhadap penggunaan air bersih di bumi.
          </motion.p>
        </div>

        {/* ======================================================= */}
        {/* --- INPUT GRID (Hygiene, Household, Virtual) --- */}
        {/* ======================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN (7-span): Hygiene & Household --- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card: Hygiene */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-inner">
                  <ShowerHead strokeWidth={1.5} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Kebersihan Diri</h3>
                  <p className="text-slate-500 text-sm">Penggunaan air di kamar mandi</p>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-semibold text-slate-600">Durasi Mandi (Harian)</span>
                  <span className="text-xs font-medium text-slate-400">Menit</span>
                </div>
                
                <CustomInputButtons
                  min={1}
                  max={60}
                  value={data.showerMinutes}
                  onChange={(v) => handleChange('showerMinutes', v)}
                  colorClass="bg-cyan-500"
                />
              </div>
            </motion.div>

            {/* Card: Household */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <RefreshCcw strokeWidth={1.5} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Rumah Tangga</h3>
                  <p className="text-slate-500 text-sm">Mencuci baju & peralatan makan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Laundry */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <Shirt className="w-3 h-3" /> Laundry
                      </span>
                      <span className="text-[10px] text-slate-400">per minggu</span>
                    </div>
                    <div className="text-right flex items-baseline">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={data.laundryLoads}
                        onChange={(e) => handleChange('laundryLoads', parseInt(e.target.value) || 0)}
                        className="w-12 text-xl font-bold text-indigo-600 bg-transparent text-right border-0 border-b border-transparent focus:border-b focus:border-indigo-300 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] font-medium text-slate-400 ml-1">kali</span>
                    </div>
                  </div>
                  <CustomSlider
                    min={0}
                    max={15}
                    value={data.laundryLoads}
                    onChange={(v) => handleChange('laundryLoads', v)}
                    colorClass="bg-indigo-500"
                  />
                </div>

                {/* Dishes */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <Utensils className="w-3 h-3" /> Cuci Piring
                      </span>
                      <span className="text-[10px] text-slate-400">menit / hari</span>
                    </div>
                    <div className="text-right flex items-baseline">
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={data.dishMinutes}
                        onChange={(e) => handleChange('dishMinutes', parseInt(e.target.value) || 0)}
                        className="w-12 text-xl font-bold text-indigo-600 bg-transparent text-right border-0 border-b border-transparent focus:border-b focus:border-indigo-300 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] font-medium text-slate-400 ml-1">mnt</span>
                    </div>
                  </div>
                  <CustomSlider
                    min={0}
                    max={60}
                    value={data.dishMinutes}
                    onChange={(v) => handleChange('dishMinutes', v)}
                    colorClass="bg-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN (5-span): Virtual Consumption --- */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }} // Animasi dari kanan
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-300 h-full"
            >
              <div className="absolute top-0 right-0 bg-pink-100/80 backdrop-blur-sm px-4 py-1.5 rounded-bl-2xl border-b border-l border-pink-100">
                <span className="text-[10px] font-bold text-pink-600 tracking-wider uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Virtual Impact
                </span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shadow-inner">
                  <Archive strokeWidth={1.5} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Jejak Air Virtual Lainnya</h3>
                  <p className="text-slate-500 text-sm">Konsumsi air tersembunyi (virtual) dan kegiatan kustom</p>
                </div>
              </div>

              {/* Komponen Input Dinamis Ditempatkan di sini */}
              <div className="bg-white/60 rounded-2xl p-5 border border-pink-100/50">
                  <DynamicVirtualInput 
                    activities={data.customVirtualActivities}
                    setActivities={setCustomVirtualActivities}
                  />
                <div className="mt-4 flex gap-2 items-start text-xs text-slate-500 bg-pink-50 p-3 rounded-xl border border-pink-100">
                  <Info className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                  <p>
                    Masukkan perkiraan liter air yang kamu gunakan di luar hitungan otomatis. Ini bisa berupa kegiatan langsung (cuci motor) atau jejak air virtual (produksi kopi, beli baju baru, dll).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* --- FULL-WIDTH SECTION: Results and Tips --- */}
        {/* ======================================================= */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 text-center">
            Ringkasan Jejak Air Harian Anda
          </h2>
          
          <div className="max-w-3xl mx-auto">
            
            {/* Card: Results/Estimation */}
            <motion.div
              layout
              className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b ${statusColor} text-white shadow-2xl shadow-blue-200 transition-all duration-700`}
            >
              {/* Water Wave Pattern Background */}
              <div className="absolute inset-0 opacity-20">
                <Waves className="w-full h-full object-cover scale-[5] animate-spin-slow opacity-30" strokeWidth={0.5} />
              </div>

              {/* Glass Card Content */}
              <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[500px] bg-white/10 backdrop-blur-sm border-t border-white/20">
                <h3 className="text-white/80 font-semibold tracking-widest uppercase text-xs mb-8">
                  Estimasi Harian
                </h3>

                {/* Main Number */}
                <div className="relative mb-2">
                  <motion.div
                    key={totalLiters}
                    initial={{ scale: 0.8, filter: 'blur(4px)' }}
                    animate={{ scale: 1, filter: 'blur(0px)' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-7xl md:text-8xl font-black tracking-tighter"
                  >
                    {totalLiters.toLocaleString()}
                  </motion.div>
                  <span className="absolute -right-4 top-0 text-lg font-medium opacity-70">L</span>
                </div>
                <p className="text-white/90 text-sm font-medium mb-8">Liter Air / Hari</p>

                {/* Status Pill */}
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full mb-10 shadow-lg">
                  <span className="font-bold text-lg flex items-center gap-2">
                    {statusText}
                  </span>
                </div>

                {/* Breakdown Bar (Mini Chart) */}
                <div className="w-full space-y-3 mb-8">
                  <p className="text-xs font-semibold uppercase opacity-70 text-center">
                    Sumber Pemborosan
                  </p>
                  <div className="flex w-full h-4 bg-black/20 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(breakdown.shower / (totalLiters || 1)) * 100}%` }}
                      className="bg-cyan-200/90 h-full"
                      title="Mandi"
                    />
                    <div
                      style={{ width: `${(breakdown.laundry / (totalLiters || 1)) * 100}%` }}
                      className="bg-indigo-300/90 h-full"
                      title="Laundry"
                    />
                    <div
                      style={{ width: `${(breakdown.dish / (totalLiters || 1)) * 100}%` }}
                      className="bg-blue-300/90 h-full"
                      title="Cuci Piring"
                    />
                    <div
                      style={{ width: `${(breakdown.virtual / (totalLiters || 1)) * 100}%` }}
                      className="bg-pink-300/90 h-full" 
                      title="Virtual"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-medium opacity-80 px-1">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-200"></div>Mandi
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-300"></div>Rumah
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-pink-300"></div>Lainnya
                    </span>
                  </div>
                </div>

                {/* Galon Comparison */}
                <div className="w-full bg-black/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm">
                  <span className="text-xs font-medium opacity-80">Setara dengan</span>
                  <span className="font-bold text-xl">
                    {(totalLiters / 19).toFixed(1)}{' '}
                    <span className="text-xs font-normal opacity-70">Galon Air</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tips Section (Gemini AI Integration) */}
            <div className="mt-6"> 
              <button 
                onClick={fetchGeminiTips}
                disabled={tipsLoading}
                className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed 
                  ${isTipsExpanded ? 
                    'bg-sky-500 text-white border-2 hover:border-blue-700 border hover:bg-sky-600' : 
                    'border-2 border-dashed border-slate-300 text-slate-500 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                  }
                `}
              >
                {tipsLoading && isTipsExpanded ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-white" />
                    Memuat Tips Personal...
                  </>
                ) : isTipsExpanded ? (
                  <>
                    <X className="w-5 h-5" /> Sembunyikan Analisis
                  </>
                ) : (
                  <>
                    Lihat Tips Hemat Air Personal (Gemini AI)
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Gemini Tips Display - TELAH DIUBAH MENJADI TRANSPARAN/GLASS MORPHISM */}
              <AnimatePresence>
                {isTipsExpanded && ( 
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    // BARU: Desain Transparan/Glassmorphism
                    className="mt-4 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl text-sm border-2 border-cyan-300" 
                  >
                    {tipsLoading ? (
                      // BARU: Warna loading disesuaikan untuk latar terang
                      <div className="flex flex-col items-center justify-center h-24 text-slate-600">
                        <Loader className="w-6 h-6 animate-spin mb-2 text-cyan-600" />
                        <p className="text-xs">AI sedang menganalisis jejak air Anda...</p>
                      </div>
                    ) : (
                      <>
                        {/* BARU: Warna judul disesuaikan untuk latar terang */}
                        <h4 className="font-bold text-cyan-700 mb-4 flex items-center gap-2">
                            <Sparkles className='w-4 h-4' /> Analisis Gemini AI untuk Jejak Air {totalLiters.toLocaleString()} L
                        </h4>
                        {/* BARU: Warna teks dan style prose disesuaikan (dihapus prose-invert) */}
                        <div className='text-slate-700 space-y-4 prose prose-sm max-w-none'> 
                            <ReactMarkdown>{geminiTips || 'Gagal memuat tips. Silakan coba hitung ulang.'}</ReactMarkdown>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Style Injection untuk animasi blob */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        /* Custom styles for ReactMarkdown inside the dark panel */
        .prose :where(li) {
          margin-top: 0.25em; 
          margin-bottom: 0.25em;
          padding-left: 0; 
        }
        .prose :where(ul) {
          padding-left: 1.5em; 
        }
      `}</style>
    </section>
  );
};

// =============================
// WRAPPER PAGE: KUALITAS AIR
// =============================

const KualitasAir: React.FC = () => {
  return (
    <>
      <KualitasAirSection />
      <WaterFootprintCalculatorSection />
    </>
  );
};

export default KualitasAir;