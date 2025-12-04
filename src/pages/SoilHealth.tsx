import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, BookOpen, Activity, Layers, AlertTriangle, Leaf, Microscope, ShieldCheck, Skull, X } from 'lucide-react';

const KesehatanTanah: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-16 px-4 w-full bg-gradient-to-b from-white to-green-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white border border-emerald-100 rounded-[2.5rem] p-8 lg:p-12 relative shadow-xl"
      >
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none border-2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime-50 rounded-full filter blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* --- KONTEN KIRI (TEKS) --- */}
          <div>
            {/* Badge Kategori */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-6 shadow-sm backdrop-blur-sm">
              <Sprout className="w-4 h-4" />
              Kesehatan Tanah
            </div>

            {/* Judul Utama */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Jaga Fondasi Kehidupan: <br />
              <span className="text-green-600">
                Tanah Subur & Sehat
              </span>
            </h2>

            {/* Deskripsi */}
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Tanah bukan sekadar pijakan, tapi ekosistem hidup yang menopang 95% pangan dunia. Degradasi tanah akibat bahan kimia dan erosi mengancam masa depan ketahanan pangan kita.
            </p>

            {/* Kotak Statistik */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-4xl font-bold text-emerald-700 mb-2">33%</div>
                <div className="text-sm text-emerald-800/80 font-medium">Tanah dunia terdegradasi</div>
              </div>
              <div className="bg-lime-50/50 rounded-2xl p-6 border border-lime-100">
                <div className="text-4xl font-bold text-green-600 mb-2">50th</div>
                <div className="text-sm text-lime-800/80 font-medium">Sisa panen jika abai</div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={`
                group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg overflow-hidden
                ${showDetails ? 'bg-gray-800 hover:bg-gray-900' : 'bg-emerald-600 hover:bg-emerald-700'}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {showDetails ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                {showDetails ? 'Tutup Detail' : 'Pelajari Dampaknya'}
              </span>
            </button>
          </div>

          {/* --- KONTEN KANAN (GAMBAR) --- */}
          <div className="relative w-full flex justify-center lg:justify-end pt-10 lg:pt-0">
            <div className="relative w-full">
                {/* Container Gambar */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white group relative z-0">
                    <img
                        src="./img/KesehatanTanah.jpg"
                        alt="Tanah Kering vs Subur"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay Gradient Halus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
                </div>

                {/* Floating Card (Status Tanah) */}
                <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-emerald-50 flex items-center gap-4 z-20 max-w-[260px]">
                    <div className="p-3 bg-lime-100 rounded-xl flex-shrink-0 text-lime-600">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Kandungan Organik
                        </div>
                        <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-red-500">Kritis (&lt;2%)</span>
                            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Elemen Dekoratif Daun Melayang */}
                <div className="absolute -top-6 -right-6 p-3 bg-white rounded-full shadow-lg text-emerald-500 z-10 hidden md:block">
                  <Leaf className="w-8 h-8" />
                </div>
            </div>
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
              <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-inner">
                <h3 className="text-2xl font-bold text-emerald-900 mb-6 pb-4 border-b border-emerald-100">
                  Dampak Kerusakan Tanah
                </h3>
                
                <div className="grid md:grid-cols-2 gap-12 mb-10">
                  {/* Dampak Lingkungan */}
                  <div>
                    <h4 className="flex items-center text-lg font-bold text-orange-600 mb-4">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Dampak Lingkungan
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Penurunan kesuburan tanah hingga 40% akibat erosi dan pencemaran kimia.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Kontaminasi rantai makanan oleh mikroplastik yang terurai di dalam tanah.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-orange-400 mt-1 text-xs">●</span>
                        <span>Gangguan ekosistem alami dan hilangnya biodiversitas mikroorganisme tanah.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Dampak Kesehatan Manusia (Opsional, jika ingin ditambahkan) */}
                  <div>
                    <h4 className="flex items-center text-lg font-bold text-red-600 mb-4">
                      <Skull className="w-5 h-5 mr-2" /> Jenis Pencemar Tanah
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Sampah plastik (kantong, kemasan, mikroplastik) yang sulit terurai.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Limbah elektronik yang mengandung logam berat berbahaya.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-400 mt-1 text-xs">●</span>
                        <span>Bahan kimia pertanian (pestisida, herbisida) yang berlebihan.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Solusi Berkelanjutan */}
                <div className="pt-6 border-t border-emerald-50">
                    <h4 className="flex items-center text-lg font-bold text-emerald-700 mb-6">
                      <ShieldCheck className="w-5 h-5 mr-2" /> Solusi Berkelanjutan
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Solusi 1 */}
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                            <h5 className="font-bold text-emerald-800 mb-2 text-sm">Pengelolaan Sampah</h5>
                            <p className="text-xs text-emerald-700/80 leading-relaxed">
                                Terapkan sistem 3R (Reduce, Reuse, Recycle) dan dukung bank sampah lokal.
                            </p>
                        </div>
                         {/* Solusi 2 */}
                         <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                            <h5 className="font-bold text-emerald-800 mb-2 text-sm">Pertanian Organik</h5>
                            <p className="text-xs text-emerald-700/80 leading-relaxed">
                                Gunakan kompos alami dan pestisida ramah lingkungan untuk menjaga nutrisi tanah.
                            </p>
                        </div>
                         {/* Solusi 3 */}
                         <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                            <h5 className="font-bold text-emerald-800 mb-2 text-sm">Bioremediasi</h5>
                            <p className="text-xs text-emerald-700/80 leading-relaxed">
                                Penggunaan mikroorganisme khusus untuk membersihkan tanah dari polutan.
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

export default KesehatanTanah;