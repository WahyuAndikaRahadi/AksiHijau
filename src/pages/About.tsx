import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  BookOpen,
  Users,
  Sprout,
  Leaf,
  LayoutGrid,
  Wind,
  Droplet,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  Lightbulb,
  Zap,
  RefreshCw,
  Megaphone,
  ShieldCheck,
  Target,
  Trees,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

// ==========================================
// 1. KONFIGURASI CHART JS
// ==========================================
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ==========================================
// 2. KOMPONEN UTAMA (ABOUT PAGE)
// ==========================================
const About = () => {
  // Data Solusi (Timeline)
  const solutions = [
    {
      icon: ShieldCheck,
      title: 'Sadar Akan Jejak Karbon',
      description:
        'Kenali dampak dari aktivitas harianmu terhadap lingkungan dan mulai hitung jejak karbon pribadimu.',
    },
    {
      icon: Zap,
      title: 'Efisiensi Energi Sehari-hari',
      description:
        'Mulai dari mematikan lampu tak terpakai, beralih ke LED, hingga mengurangi penggunaan AC berlebihan.',
    },
    {
      icon: RefreshCw,
      title: 'Terapkan 3R Secara Berkala',
      description:
        'Reduce, Reuse, Recycle. Gunakan barang berulang kali dan pilah sampah organik serta anorganik.',
    },
    {
      icon: Megaphone,
      title: 'Ambil Aksi dan Suarakan',
      description:
        'Ingat, menjaga bumi butuh konsistensi. Ajak orang terdekatmu dan mulai langkah pertamamu sekarang.',
    },
  ];

  // Data Chart
  const chartData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Total Sampah (Juta Ton)',
        data: [27.6, 27.5, 28.5, 38.5, 43.2, 34.0],
        borderColor: '#10B981',
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

          return gradient;
        },
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 7,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151',
          padding: 20,
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Total Produksi Sampah di Indonesia (2019–2024)',
        font: { size: 18, weight: 'bold' as const },
        color: '#111827',
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y.toFixed(
              1,
            )} Juta Ton`,
        },
      },
    },
    scales: {
      y: {
        min: 25,
        max: 45,
        grid: {
          color: '#E5E7EB',
          borderDash: [5, 5],
        },
        ticks: {
          color: '#6B7281',
          stepSize: 5,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7281' },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Tentang AksiHijau
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Gerakan digital yang menghubungkan individu dengan solusi nyata
            untuk menghadapi krisis iklim global.
          </p>
        </motion.div>

        {/* BAGIAN MISI KAMI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 mx-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Aksi Iklim untuk <span className="text-primary">Semua</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Di Indonesia, masih banyak kebingungan dan rasa kewalahan seputar
              krisis iklim yang membuat orang enggan untuk memulai.{' '}
              <strong>AksiHijau hadir untuk mengubah itu.</strong>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kami menyediakan platform yang mudah diakses, terverifikasi, dan
              gratis untuk membantu siapa saja yang membutuhkan tempat untuk
              belajar, memahami dampaknya, dan mendapatkan panduan aksi yang
              suportif.
            </p>

            {/* Note Box */}
            <div className="bg-emerald-50 border-l-4 border-primary text-emerald-800 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm leading-relaxed">
                    <strong>Catatan Penting:</strong> AksiHijau adalah alat
                    pendukung edukasi dan aksi. Kami bukan pengganti data riset
                    ilmiah primer. Untuk aksi korporat atau kebijakan, kami
                    sangat menyarankan untuk berkonsultasi dengan para ahli
                    lingkungan berlisensi.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              './img/Turbinangin.jpg',
              './img/Polusiudara.jpg',
              './img/Iklimpanas.jpg',
              './img/Hutantropis.jpg',
            ].map((imgSrc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="bg-white rounded-2xl shado~w-lg p-0 overflow-hidden flex items-center justify-center aspect-square transition-all duration-300 hover:shadow-blue-300 hover:border-blue-300 border-2 border-green-300 shadow-green-300"
              >
                <img
                  src={imgSrc}
                  alt={`Aksi Hijau ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3 ASPEK UTAMA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24"
        >
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-green-100 text-primary font-semibold px-4 py-1 rounded-full text-sm mb-4">
              <Leaf className="w-4 h-4 mr-2" />
              Environmental Health
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Kesehatan <span className="text-primary">Lingkungan</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Memahami status kesehatan lingkungan kita adalah langkah pertama
              untuk melindunginya. Tiga aspek ini—udara, tanah, dan air—
              merupakan pilar utama yang menopang kehidupan.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border-2 border-primary/30 rounded-3xl p-6 sm:p-10 shadow-xl"
          >
            <div className="flex items-center text-xl font-semibold text-gray-800 mb-8">
              <LayoutGrid className="w-6 h-6 mr-3 text-primary" />
              3 Aspek Utama
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kualitas Udara */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                className="border-2 border-blue-300 rounded-2xl p-6 flex flex-col h-full bg-blue-50/50 shadow-lg cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white border border-blue-200 shadow-sm mr-4">
                    <Wind className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Kualitas Udara
                  </h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Masalah Utama
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Polusi dari emisi industri, transportasi, dan pembakaran
                        bahan bakar fosil.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Dampak Kesehatan
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Penyakit pernapasan (asma, PPOK), masalah
                        kardiovaskular, dan iritasi mata.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Transisi ke energi terbarukan, penggunaan transportasi
                        umum, dan reboisasi perkotaan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: '72%' }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">
                    Tingkat Urgensi: 72%
                  </p>
                </div>
              </motion.div>

              {/* Kesehatan Tanah */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                className="border-2 border-primary/30 rounded-2xl p-6 flex flex-col h-full bg-green-50/50 shadow-lg cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white border border-primary/20 shadow-sm mr-4">
                    <Sprout className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Kesehatan Tanah
                  </h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Masalah Utama
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Kontaminasi oleh pestisida, limbah industri, dan
                        praktik pertanian monokultur.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Dampak Kesehatan
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Kontaminasi rantai makanan, penurunan gizi tanaman, dan
                        paparan zat kimia berbahaya.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Pertanian organik, rotasi tanaman, dan remediasi tanah
                        yang terkontaminasi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">
                    Tingkat Urgensi: 65%
                  </p>
                </div>
              </motion.div>

              {/* Kualitas Air */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                className="border-2 border-cyan-300 rounded-2xl p-6 flex flex-col h-full bg-cyan-50/50 shadow-lg cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white border border-cyan-200 shadow-sm mr-4">
                    <Droplet className="w-7 h-7 text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Kualitas Air
                  </h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Masalah Utama
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Pembuangan limbah domestik dan industri, polusi plastik,
                        dan tumpahan bahan kimia.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Dampak Kesehatan
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Penyakit (kolera, disentri), keracunan logam berat, dan
                        gangguan sistem hormon.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Pengelolaan air limbah (IPAL) yang lebih baik,
                        mengurangi plastik, dan melindungi daerah aliran sungai
                        (DAS).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-cyan-500 h-2.5 rounded-full"
                      style={{ width: '80%' }}
                    />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">
                    Tingkat Urgensi: 80%
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* BAGIAN TARGET DAMPAK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24"
        >
          <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* KONTEN KIRI */}
              <div className="z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-cyan-200 text-green-700 text-sm font-semibold mb-6">
                  <Target className="w-4 h-4" />
                  Target Dampak
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Perlindungan Masa Depan Melalui{' '}
                  <span className="text-green-600">Aksi Nyata</span>
                </h2>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Ribuan ton emisi karbon dilepaskan setiap hari. Kami
                  menargetkan kolaborasi masif untuk mengurangi dampak ini,
                  memulihkan ekosistem, dan menciptakan lingkungan yang lebih
                  sehat bagi generasi mendatang.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100 min-w-[140px]">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      10K+
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Relawan Aktif
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100 min-w-[140px]">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      50%
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Target Reduksi
                    </div>
                  </div>
                </div>
              </div>

              {/* KONTEN KANAN */}
              <div className="relative h-full min-h-[300px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white h-full">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Lingkungan Hijau"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                      <Trees className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Satu Aksi</div>
                      <div className="text-sm font-bold text-gray-800">
                        1 Pohon/Bulan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BAGIAN PROSES / CARA KERJA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proses Sederhana,{' '}
              <span className="text-green-600">Dampak Maksimal</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Lima langkah mudah untuk mengubah kebiasaan kecil menjadi
              kontribusi besar bagi bumi.
            </p>
          </div>

          <div className="relative">
            {/* Garis Penghubung (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0 border-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {[
                {
                  id: 1,
                  title: 'Gabung Gerakan',
                  desc: 'Buat akun AksiHijau dan mulai login untuk mengikuti acara komunitas.',
                  image:
                    'https://media.istockphoto.com/id/2151209290/id/foto/ilustrasi-3d-pria-pria-qadir-online-konsep-medis-seluler-aplikasi-untuk-perawatan-kesehatan.webp?a=1&b=1&s=612x612&w=0&k=20&c=rQfCWIKZgpKb2_2wwSVDEx8i5z6sNc6eZ08zHJmGOzA=',
                  color: 'bg-blue-100',
                },
                {
                  id: 2,
                  title: 'Pilih Tantangan',
                  desc: 'Telusuri berbagai tantangan harian, mulai dari hemat energi hingga olah sampah.',
                  image:
                    'https://i.pinimg.com/736x/24/66/6b/24666b39c23712cb7b9d42c51703b808.jpg',
                  color: 'bg-orange-100',
                },
                {
                  id: 3,
                  title: 'Lakukan Aksi',
                  desc: 'Jalankan misi di dunia nyata. Tanam pohon, pilah sampah, atau gunakan tumbler.',
                  image:
                    'https://media.istockphoto.com/id/1329055727/id/foto/seorang-pria-memegang-pohon-untuk-ditanam-di-tanah-ilustrasi.webp?a=1&b=1&s=612x612&w=0&k=20&c=lj9qglZNapiHHUp7zKS88XIjmojeyuW2azfewJ1W3eI=',
                  color: 'bg-purple-100',
                },
                {
                  id: 4,
                  title: 'Verifikasi',
                  desc: 'Unggah bukti aksimu. Sistem kami dan komunitas akan memverifikasi kontribusimu.',
                  image:
                    'https://media.istockphoto.com/id/819929090/id/foto/konsep-tanda-centang-3d.webp?a=1&b=1&s=612x612&w=0&k=20&c=SF8G2TiebZCX_0xxCUBCOhBthUksMsYShK_IGXpJmXk=',
                  color: 'bg-cyan-100',
                },
                {
                  id: 5,
                  title: 'Raih Apresiasi',
                  desc: 'Dapatkan poin, lencana hijau, dan naikkan peringkatmu di Leaderboard Komunitas.',
                  image:
                    'https://plus.unsplash.com/premium_photo-1718560021014-b2464cd8021d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGF5YXIlMjBwb25zZWwlMjBtZW5hbXBpbGthbiUyMHVjYXBhbiUyMHNlbGFtYXQlMjBkYW4lMjBwb2luJTIweWFuZyUyMGRpZGFwYXQufGVufDB8fDB8fHww',
                  color: 'bg-emerald-100',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="flex justify-center mb-6 relative">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-inner overflow-hidden`}
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.3,
                      }}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </motion.div>

                    <div className="absolute -top-2 -right-2 md:right-12 lg:-right-2 w-8 h-8 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 shadow-sm z-20">
                      {step.id}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {index !== 4 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-6 xl:-right-8 transform -translate-y-1/2 items-center justify-center z-0">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  <div className="lg:hidden flex justify-center mt-4 opacity-30">
                    {index !== 4 && (
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* DATA & STATISTIK SAMPAH INDONESIA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-24 border-2 border-cyan-200 rounded-2xl p-6 sm:p-8 shadow-lg bg-white"
        >
          <div className="mb-4 p-4 bg-cyan-100 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-cyan-700 flex-shrink-0" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Data dan Statistik Sampah Indonesia
              </h2>
            </div>
          </div>

          <div className="mb-8 p-4 bg-cyan-100 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700">
              Berikut adalah visualisasi data timbulan sampah nasional di
              Indonesia berdasarkan laporan kabupaten/kota.
            </p>
          </div>

          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
            <Line options={chartOptions} data={chartData} />
          </div>
        </motion.div>

        {/* LATAR BELAKANG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-24 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-800 font-semibold text-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Latar Belakang
          </span>

          <div className="mt-6 space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              Data yang tersaji di atas bukan sekadar angka; itu adalah cerminan
              dari tantangan nyata yang dihadapi planet kita. Tren kenaikan
              emisi global, hilangnya keanekaragaman hayati, dan polusi plastik
              yang konsisten menjadi <strong>latar belakang utama</strong> dan
              panggilan mendesak bagi kami. Kami melihat adanya{' '}
              <strong>kebutuhan mendesak</strong> akan platform yang dapat
              diakses untuk edukasi dan aksi iklim. Peningkatan ini menunjukkan
              bahwa metode advokasi tradisional saja tidak lagi mencukupi.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Di saat yang sama, kami menyadari adanya jurang besar antara
              kesadaran akan masalah dan tindakan nyata.{' '}
              <strong>Sikap apatis</strong> atau kebingungan yang masih melekat
              kuat membuat banyak orang takut untuk memulai. Selain itu,{' '}
              <strong>akses yang terbatas</strong> ke data yang terverifikasi
              dan panduan praktis serta <strong>biaya solusi hijau</strong> yang
              terkadang dianggap mahal menjadi penghalang yang nyata.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Oleh karena itu, <strong>AksiHijau lahir</strong> sebagai jawaban
              atas tantangan ini. Kami hadir untuk menjembatani kesenjangan
              tersebut dengan memanfaatkan kekuatan teknologi dan data yang
              akurat. AksiHijau dirancang sebagai sahabat digital dan langkah
              awal yang suportif bagi siapa saja yang ingin berkontribusi
              menjaga kesehatan planet kita.
            </p>
          </div>
        </motion.div>

        {/* SOLUSI NYATA (TIMELINE) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24 w-full bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 md:p-12 shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Kolom Kiri: Ilustrasi */}
            <div className="relative z-10 order-2 lg:order-1">
              <div className="bg-emerald-100 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center relative shadow-inner">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />

                <div className="relative z-10 text-center">
                  <img
                    src="/public/img/premium-vector.png"
                    alt="Ilustrasi Gotong Royong Lingkungan"
                    className="w-full h-full object-cover rounded-xl z-20 transition-opacity duration-300 mix-blend-multiply lg:-mt-40"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'block';
                      }
                    }}
                  />
                  <div className="hidden">
                    <Users className="w-32 h-32 text-emerald-600 mx-auto mb-4" />
                    <p className="text-emerald-800 font-bold text-lg">
                      Kolaborasi Hijau
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Timeline */}
            <div className="order-1 lg:order-2 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Solusi Nyata untuk Pulihkan Bumi
              </h2>
              <p className="text-white mb-10 text-lg leading-relaxed font-bold">
                Setelah memahami urgensi krisis iklim, berikut langkah-langkah
                praktis yang bisa membantumu menjaga dan memulihkan lingkungan
                bersama AksiHijau:
              </p>

              <div className="relative flex flex-col gap-8">
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-white md:left-8" />
                {solutions.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-start group"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg z-10 mr-5 transition-transform duration-300 group-hover:scale-110">
                      <step.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-bold text-white mb-1 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-white font-bold text-sm leading-relaxed font-poppins">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
