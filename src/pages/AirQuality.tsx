import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Icon untuk Weather Dashboard
  CloudSun, Droplets, Wind, Thermometer, Sun, CloudRain, Navigation, Eye, MapPin, 
  // Icon untuk Air Quality
  BookOpen, Activity, AlertTriangle, HeartPulse, Zap, Leaf, ShieldCheck, Sparkles 
} from 'lucide-react';


// ==========================================
// 1. WEATHER DASHBOARD COMPONENT (INDONESIA)
// ==========================================
const WeatherDashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Variabel animasi untuk background blobs
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-10 px-4 w-full max-w-7xl mx-auto font-sans">
       {/* Header Section */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-10 ml-2">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Kondisi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Atmosfer</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Pantauan cuaca real-time kawasan industri.</p>
          </div>
          
          {/* Live Indicator */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mt-4 md:mt-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-600">Data Langsung</span>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === LEFT: MAIN WEATHER CARD (Span 7 columns) === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative overflow-hidden rounded-[3rem] text-white shadow-2xl shadow-blue-200/50 min-h-[400px] flex flex-col justify-between p-10 group"
        >
          {/* Dynamic Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 z-0"></div>
          <motion.div variants={blobVariants} animate="animate" className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-cyan-300 rounded-full blur-[100px] mix-blend-overlay"></motion.div>
          <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-blue-400 rounded-full blur-[80px] mix-blend-overlay"></motion.div>
          
          {/* Glass Overlay Texture */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-0"></div>

          {/* Content Top */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full flex items-center gap-2 transition-transform group-hover:scale-105">
              <MapPin className="w-4 h-4 text-white" /> 
              <span className="font-medium tracking-wide text-sm">Jakarta Industrial Estate</span>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold tracking-tighter">{formattedTime}</div>
              <div className="text-blue-100 font-medium text-sm mt-1">{formattedDate}</div>
            </div>
          </div>

          {/* Content Center/Bottom */}
          <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between mt-8">
            <div>
              <div className="flex items-start">
                <span className="text-[10rem] leading-none font-black tracking-tighter drop-shadow-lg">32</span>
                <span className="text-6xl font-light text-blue-200 mt-4">°</span>
              </div>
              <div className="text-3xl font-medium text-white/90 ml-2">Cerah Berawan</div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="mb-4 md:mb-0"
            >
              <CloudSun className="w-48 h-48 text-yellow-300 drop-shadow-2xl" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>


        {/* === RIGHT: GRID DETAILS (Span 5 columns) === */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Kelembaban Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                   <Droplets className="w-6 h-6" />
                 </div>
                 {/* TERJEMAHAN: HUMID -> KELEMBABAN */}
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Kelembaban</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">65</span><span className="text-xl text-slate-400 font-medium">%</span>
                 {/* Progress Bar Visual */}
                 <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '65%' }} className="h-full bg-blue-500 rounded-full" />
                 </div>
               </div>
            </motion.div>

            {/* Angin Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-lg flex flex-col justify-between relative overflow-hidden"
            >
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500 blur-3xl opacity-20"></div>

               <div className="flex justify-between items-start relative z-10">
                 <div className="p-3 bg-white/10 rounded-2xl">
                   <Wind className="w-6 h-6" />
                 </div>
                 {/* TERJEMAHAN: WIND -> ANGIN */}
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Angin</span>
               </div>
               <div className="mt-4 relative z-10">
                 <span className="text-4xl font-bold">12</span> <span className="text-sm text-slate-400">km/j</span>
                 <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Navigation className="w-3 h-3 rotate-45" /> Arah Tenggara
                 </div>
               </div>
            </motion.div>

            {/* UV Index Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                   <Sun className="w-6 h-6" />
                 </div>
                 {/* TERJEMAHAN: UV INDEX -> INDEKS UV */}
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Indeks UV</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">8</span>
                 {/* TERJEMAHAN: HIGH -> TINGGI */}
                 <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase">Tinggi</span>
                 <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                 </div>
               </div>
            </motion.div>

            {/* Visibility Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                   <Eye className="w-6 h-6" />
                 </div>
                 {/* TERJEMAHAN: VISIB -> JARAK PANDANG */}
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Jarak Pandang</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">4.2</span> <span className="text-sm text-slate-400">km</span>
                 <p className="mt-2 text-xs text-slate-500">Jarak pandang baik untuk operasional.</p>
               </div>
            </motion.div>

        </div>
      </div>

      {/* === BOTTOM: FORECAST STRIP === */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-700 mb-4 px-2">Prediksi 4 Hari Kedepan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { day: 'Besok', icon: CloudRain, temp: '29°', label: 'Hujan Ringan', color: 'bg-blue-500' },
             { day: 'Rabu', icon: CloudSun, temp: '31°', label: 'Berawan', color: 'bg-yellow-500' },
             { day: 'Kamis', icon: Sun, temp: '33°', label: 'Cerah', color: 'bg-orange-500' },
             { day: 'Jumat', icon: Wind, temp: '30°', label: 'Berangin', color: 'bg-cyan-500' },
           ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 * idx }}
                 whileHover={{ scale: 1.02 }}
                 className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
               >
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${item.color}/30`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs font-bold uppercase">{item.day}</div>
                        <div className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">{item.label}</div>
                      </div>
                   </div>
                   <div className="text-2xl font-bold text-slate-800">{item.temp}</div>
               </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};


// ==========================================
// 2. AIR QUALITY COMPONENT (ORIGINAL)
// ==========================================
const AirQuality: React.FC = () => {
  // State untuk mengontrol visibilitas detail
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-12 px-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-cyan-50 border border-cyan-100 rounded-[2rem] p-8 lg:p-12 overflow-hidden relative shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* --- KONTEN KIRI (TEKS) --- */}
          <div className="z-10 relative">
            {/* Badge Kualitas Udara */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-cyan-200 text-cyan-700 text-sm font-bold mb-6 shadow-sm backdrop-blur-sm">
              <Wind className="w-4 h-4" />
              Kualitas Udara Industri
            </div>

            {/* Judul Utama */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e4a6b] mb-6 leading-tight">
              Kendalikan Emisi untuk Langit{' '}
              <span className="text-cyan-500">Biru</span>
            </h2>

            {/* Deskripsi - DIUBAH KE KONTEKS PABRIK */}
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Aktivitas industri yang tidak terkontrol menjadi penyumbang utama pencemaran udara global. Asap cerobong yang mengandung Sulfur Dioksida (SO2) dan partikel debu tidak hanya merusak lingkungan, tetapi juga mengancam kesehatan warga di sekitar kawasan industri.
            </p>

            {/* Kotak Statistik - DIUBAH DATANYA */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100">
                <div className="text-3xl font-bold text-[#0e4a6b] mb-1">50%</div>
                <div className="text-sm text-slate-500 font-medium">Emisi dari Industri</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100">
                <div className="text-3xl font-bold text-[#0e4a6b] mb-1">High</div>
                <div className="text-sm text-slate-500 font-medium">Resiko ISPA</div>
              </div>
            </div>

            {/* Tombol Pelajari Lebih Lanjut */}
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={`text-white rounded-full px-8 py-4 font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-200/50 hover:scale-105 active:scale-95 ${showDetails ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'}`}
            >
              <BookOpen className="w-5 h-5" />
              {showDetails ? 'Sembunyikan Detail' : 'Pelajari Dampaknya'}
            </button>
          </div>

          {/* --- KONTEN KANAN (GAMBAR) --- */}
          <div className="relative w-full flex justify-center lg:justify-end pt-10 lg:pt-0"> 
            <div className="relative w-full">
                {/* Container Gambar */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white group relative z-0">
                    <img
                        src="./img/Polusi-Udara-Industri.jpg"
                        alt="Polusi Udara Industri Pabrik"
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Floating Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 bg-white p-3 md:p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-cyan-100 flex items-center gap-3 md:gap-4 max-w-[200px] md:max-w-[240px] z-20"
                >
                    <div className="p-2 md:p-2.5 bg-cyan-50 rounded-lg flex-shrink-0">
                        <Activity className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            Status Kawasan
                        </div>
                        <div className="text-xs md:text-sm font-bold text-orange-600 whitespace-nowrap flex items-center gap-2">
                            Tidak Sehat (PM2.5)
                            <span className="flex gap-0.5 items-end h-3">
                                <span className="w-0.5 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                                <span className="w-0.5 h-3 bg-orange-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-0.5 h-1.5 bg-orange-400 rounded-full animate-pulse delay-150"></span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
          </div>
        </div>

        {/* --- PANEL DETAIL TAMBAHAN (EXPANDABLE) --- */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 40 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl p-8 border border-cyan-100 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0e4a6b] mb-6 border-b border-cyan-100 pb-4">
                  Analisis Dampak Polusi Industri
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Sumber Polusi - DIUBAH KE PABRIK */}
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-rose-600 mb-3">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Pemicu Utama
                    </h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Pembakaran batu bara pembangkit listrik</li>
                      <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Proses manufaktur kimia dan semen</li>
                      <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Kebocoran gas industri (Metana/SO2)</li>
                      <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Debu operasional alat berat & konstruksi</li>
                    </ul>
                  </div>

                  {/* Efek Kesehatan */}
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-orange-600 mb-3">
                      <HeartPulse className="w-5 h-5 mr-2" /> Risiko Kesehatan
                    </h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Infeksi Saluran Pernapasan Akut (ISPA)</li>
                      <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Iritasi mata dan kulit akibat paparan zat kimia</li>
                      <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Risiko kanker paru-paru jangka panjang</li>
                      <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Keracunan logam berat (Timbal/Merkuri)</li>
                    </ul>
                  </div>
                </div>

                {/* Solusi Nyata Cards - DIUBAH KE SOLUSI INDUSTRI */}
                <div className="pt-6 border-t border-cyan-50">
                  <h4 className="flex items-center text-lg font-semibold text-cyan-700 mb-4">
                    <Sparkles className="w-5 h-5 mr-2" /> Langkah Penanggulangan
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Card 1 - Teknologi Filter */}
                    <div className="bg-cyan-50/50 rounded-xl p-4 border border-cyan-100">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-3 text-cyan-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Filtrasi Udara</h5>
                      <p className="text-xs text-slate-600">Pemasangan teknologi penyaring asap (Scrubber) pada cerobong.</p>
                    </div>
                    {/* Card 2 - Energi */}
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-amber-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Transisi Energi</h5>
                      <p className="text-xs text-slate-600">Beralih dari batu bara ke sumber energi yang lebih ramah lingkungan.</p>
                    </div>
                    {/* Card 3 - Penghijauan */}
                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Sabuk Hijau</h5>
                      <p className="text-xs text-slate-600">Menanam pohon penyerap karbon di sekeliling area pabrik.</p>
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

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      {/* Menampilkan kedua komponen */}
      <WeatherDashboard />
      <AirQuality />
    </div>
  );
}

export default App;
