import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  BookOpen,
  Activity,
  Layers,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  Skull,
  X,
  Calculator,
  Tractor,
  CheckSquare,
} from 'lucide-react';

const KesehatanTanah: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    // Penambahan overflow-x-hidden pada section utama untuk mengunci scroll samping
    <section className="py-16 px-4 w-full bg-gradient-to-b from-white to-green-50 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white border border-emerald-100 rounded-[2.5rem] p-8 lg:p-12 relative shadow-xl"
      >
        {/* Dekorasi Background - Disesuaikan posisinya agar tidak bocor keluar container */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-50 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-lime-50 rounded-full filter blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-6 shadow-sm backdrop-blur-sm">
              <Sprout className="w-4 h-4" />
              Kesehatan Tanah
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Jaga Fondasi Kehidupan: <br />
              <span className="text-green-600">Tanah Subur &amp; Sehat</span>
            </h2>

            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Tanah bukan sekadar pijakan, tapi ekosistem hidup yang menopang 95% pangan dunia. Degradasi tanah akibat
              bahan kimia dan erosi mengancam masa depan ketahanan pangan kita.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">33%</div>
                <div className="text-xs md:text-sm text-emerald-800/80 font-medium">Tanah dunia terdegradasi</div>
              </div>
              <div className="bg-lime-50/50 rounded-2xl p-6 border border-lime-100">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50th</div>
                <div className="text-xs md:text-sm text-lime-800/80 font-medium">Sisa panen jika abai</div>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`
                group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white 
                transition-all duration-300 rounded-full shadow-lg overflow-hidden
                ${showDetails ? 'bg-gray-800 hover:bg-gray-900' : 'bg-emerald-600 hover:bg-emerald-700'}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {showDetails ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                {showDetails ? 'Tutup Detail' : 'Pelajari Dampaknya'}
              </span>
            </button>
          </div>

          {/* Image Container */}
          <div className="relative w-full flex justify-center lg:justify-end mb-10 lg:mb-0 order-1 lg:order-2">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white group relative z-0">
                <img
                  src="./img/KesehatanTanah.jpg"
                  alt="Tanah Kering vs Subur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />
              </div>

              {/* Floating Card Info - Penyesuaian agar tidak keluar layar di mobile */}
              <div className="absolute -bottom-4 left-0 md:-bottom-8 md:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 flex items-center gap-4 z-20 max-w-[220px] md:max-w-[260px]">
                <div className="p-2 md:p-3 bg-lime-100 rounded-xl flex-shrink-0 text-lime-600">
                  <Layers className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Kandungan Organik
                  </div>
                  <div className="text-xs md:text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-red-500">Kritis (&lt;2%)</span>
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION - Sudah Dikembalikan Lengkap */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 48 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-inner">
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
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-orange-400 mt-1.5 text-[8px]">●</span>
                        <span>Penurunan kesuburan tanah hingga 40% akibat erosi dan pencemaran kimia.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-orange-400 mt-1.5 text-[8px]">●</span>
                        <span>Kontaminasi rantai makanan oleh mikroplastik yang terurai di dalam tanah.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-orange-400 mt-1.5 text-[8px]">●</span>
                        <span>Gangguan ekosistem alami dan hilangnya biodiversitas mikroorganisme tanah.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Jenis Pencemar */}
                  <div>
                    <h4 className="flex items-center text-lg font-bold text-red-600 mb-4">
                      <Skull className="w-5 h-5 mr-2" /> Jenis Pencemar Tanah
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-red-400 mt-1.5 text-[8px]">●</span>
                        <span>Sampah plastik (kantong, kemasan, mikroplastik) yang sulit terurai.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-red-400 mt-1.5 text-[8px]">●</span>
                        <span>Limbah elektronik yang mengandung logam berat berbahaya.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                        <span className="text-red-400 mt-1.5 text-[8px]">●</span>
                        <span>Bahan kimia pertanian (pestisida, herbisida) yang berlebihan.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Solusi Section */}
                <div className="pt-6 border-t border-emerald-50">
                  <h4 className="flex items-center text-lg font-bold text-emerald-700 mb-6">
                    <ShieldCheck className="w-5 h-5 mr-2" /> Solusi Berkelanjutan
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                      <h5 className="font-bold text-emerald-800 mb-2 text-sm">Pengelolaan Sampah</h5>
                      <p className="text-xs text-emerald-700/80 leading-relaxed">
                        Terapkan sistem 3R (Reduce, Reuse, Recycle) dan dukung bank sampah lokal.
                      </p>
                    </div>

                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                      <h5 className="font-bold text-emerald-800 mb-2 text-sm">Pertanian Organik</h5>
                      <p className="text-xs text-emerald-700/80 leading-relaxed">
                        Gunakan kompos alami dan pestisida ramah lingkungan untuk menjaga nutrisi tanah.
                      </p>
                    </div>

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

const SoilCalculator = () => {
  const [area, setArea] = useState<number | ''>('');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const practices = [
    { 
      id: 'kompos', 
      title: 'Penambahan Kompos/Pupuk Organik', 
      desc: 'Meningkatkan kesuburan tanah dan retensi air.',
      score: 1.5 
    },
    { 
      id: 'cover_crop', 
      title: 'Penanaman Tanaman Penutup (Cover Crop)', 
      desc: 'Melindungi tanah dari erosi, menambah biomassa.',
      score: 1.2 
    },
    { 
      id: 'no_till', 
      title: 'Tanpa Olah Tanah (No-Till)', 
      desc: 'Meminimalkan gangguan tanah, menjaga struktur tanah.',
      score: 2.0 
    },
    { 
      id: 'rotasi', 
      title: 'Rotasi Tanaman', 
      desc: 'Meningkatkan kesehatan tanah dan mengurangi hama.',
      score: 1.8 
    },
    { 
      id: 'biochar', 
      title: 'Penggunaan Biochar', 
      desc: 'Meningkatkan kapasitas penyerapan karbon dan air tanah.',
      score: 2.5 
    },
  ];

  const togglePractice = (id: string) => {
    setSelectedPractices(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const calculateImpact = (e: React.FormEvent) => {
    e.preventDefault();
    const areaVal = Number(area) || 0;
    
    const totalScore = practices
      .filter(p => selectedPractices.includes(p.id))
      .reduce((acc, curr) => acc + curr.score, 0);
      
    const totalImpact = areaVal * totalScore * 0.5; 

    setResult(totalImpact);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-0 pb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden"
      >
        <div className="bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-full mb-4 border border-white/30">
                    <Calculator className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Hitung Dampak Positif Upaya Anda!</h2>
                <p className="text-emerald-100 max-w-2xl mx-auto">
                    Estimasi kontribusi Anda terhadap lingkungan dengan praktik pengelolaan tanah yang berkelanjutan.
                </p>
            </div>
        </div>

        <div className="p-8 md:p-10">
            <form onSubmit={calculateImpact}>
                <div className="mb-8">
                    <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-600" />
                        Luas Lahan yang Dikelola (m²):
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={area}
                            onChange={(e) => setArea(Number(e.target.value))}
                            placeholder="Contoh: 1000"
                            className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-emerald-300 font-medium"
                            min="0"
                        />
                        <span className="absolute right-4 top-4 text-emerald-600 font-bold text-sm bg-white px-2 py-0.5 rounded-md shadow-sm border border-emerald-100">m²</span>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 font-bold mb-4 flex items-center gap-2">
                        <Tractor className="w-5 h-5 text-emerald-600" />
                        Pilih Praktik yang Anda Lakukan:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {practices.map((practice) => (
                            <div 
                                key={practice.id}
                                onClick={() => togglePractice(practice.id)}
                                className={`
                                    cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative group
                                    ${selectedPractices.includes(practice.id) 
                                      ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                                      : 'bg-white border-gray-100 hover:border-emerald-300 hover:shadow-sm'}
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`
                                        w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                                        ${selectedPractices.includes(practice.id) 
                                          ? 'bg-emerald-500 border-emerald-500' 
                                          : 'border-gray-300 bg-white group-hover:border-emerald-400'}
                                    `}>
                                        {selectedPractices.includes(practice.id) && <CheckSquare className="w-4 h-4 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm mb-1 ${selectedPractices.includes(practice.id) ? 'text-emerald-900' : 'text-gray-700'}`}>
                                            {practice.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {practice.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 text-lg transform active:scale-[0.99]"
                >
                    <Calculator className="w-5 h-5" />
                    Hitung Dampak
                </button>
            </form>

            <AnimatePresence>
                {result !== null && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="bg-gradient-to-br from-lime-50 to-emerald-50 rounded-2xl p-6 border border-emerald-200 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sprout className="w-32 h-32 text-emerald-600" />
                        </div>
                        
                        <div className="relative z-10 text-center">
                            <p className="text-sm text-emerald-800 font-bold uppercase tracking-wider mb-2">Estimasi Penyerapan Karbon</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-5xl font-black text-emerald-600">{result.toFixed(1)}</span>
                                <span className="text-xl font-medium text-gray-600 mt-4">kg C/tahun</span>
                            </div>
                            <p className="text-gray-600 text-sm max-w-lg mx-auto">
                                Dengan menerapkan praktik ini, Anda membantu memulihkan struktur tanah dan menyerap karbon dari atmosfer. Terima kasih telah menjadi pahlawan bumi! 🌍
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-green-50/30">
      <KesehatanTanah />
      <SoilCalculator />
    </div>
  );
};

export default App;