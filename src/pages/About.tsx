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
  Github,
  Instagram,
  Recycle, 
} from 'lucide-react';
import CountUp from '../components/CountUp';

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

const teamMembers = [
  {
    name: 'Muhammad Bintang',
    role: 'Front-End',
    image:
      './img/MuhammadBintang.jpeg',
    bio: 'Saya seorang Front-End Developer yang berfokus pada pembuatan antarmuka web modern dan responsif.menggunakan React dan Tailwind CSS untuk pengalaman pengguna yang cepat dan menarik.',
    social: { github: 'https://github.com/Ktune-kpop', instagram: 'https://www.instagram.com/bintanggg_20/  ' },
  },
  {
    name: 'Wahyu Andika Rahadi',
    role: 'Team Lead | Back-End',
    image:
      './img/WahyuAndikaRahadi.jpeg',
    bio: 'Saya menjadi team leader sekaligus backend developer di proyek web Aksi Hijau, bertugas mengatur kerja tim dan mengambil keputusan teknis selama pengembangan.',
    social: { github: 'https://github.com/WahyuAndikaRahadi', instagram: 'https://www.instagram.com/andika.rwahyu/' },
  },
  {
    name: 'Bagus Hasan Ali',
    role: 'Front-End',
    image:
      './img/BagusHasanAli.jpeg',
    bio: 'Saya adalah Front-End Developer. Berfokus pada arsitektur komponen React dan desain responsif Tailwind CSS. Menciptakan pengalaman web mulus dan berkinerja tinggi.',
    social: { github: 'https://github.com/Zyzenmax', instagram: 'https://www.instagram.com/bagushsnali/' },
  },
];

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

const impactStats = [
  {
    icon: Users, 
    value: 500, 
    suffix: '+',
    label: 'Komunitas Hijau',
    desc: 'Pengguna aktif berbagi aksi nyata dan inspirasi di Social Feed.',
  },
  {
    icon: Recycle,
    value: 1200,
    suffix: '+',
    label: 'Objek Terdeteksi',
    desc: 'Sampah berhasil diidentifikasi dan dipilah menggunakan AI EcoScan.',
  },
  {
    icon: Droplet,
    value: 50000,
    suffix: '+',
    label: 'Liter Air Dihitung',
    desc: 'Estimasi jejak air harian yang dilacak melalui kalkulator pengguna.',
  },
  {
    icon: Wind,
    value: 24,
    suffix: '/7',
    label: 'Pantauan Udara',
    desc: 'Akses data kualitas udara real-time untuk perlindungan kesehatan.',
  },
];

const processSteps = [
  {
    id: 1,
    title: 'Gabung Komunitas',
    desc: 'Buat akun AksiHijau untuk mengakses fitur eksklusif, bergabung dengan event, dan terhubung dengan relawan lain.',
    image:
      'https://media.istockphoto.com/id/2151209290/id/foto/ilustrasi-3d-pria-pria-qadir-online-konsep-medis-seluler-aplikasi-untuk-perawatan-kesehatan.webp?a=1&b=1&s=612x612&w=0&k=20&c=rQfCWIKZgpKb2_2wwSVDEx8i5z6sNc6eZ08zHJmGOzA=',
    color: 'bg-blue-100',
  },
  {
    id: 2,
    title: 'Gunakan Fitur AI',
    desc: 'Manfaatkan EcoScan untuk mendeteksi jenis sampah atau konsultasi masalah lingkungan dengan EcoBot cerdas.',
    image: './img/Robot.png',
    color: 'bg-orange-100',
  },
  {
    id: 3,
    title: 'Pantau Lingkungan',
    desc: 'Cek kualitas udara (AQI) dan cuaca real-time di sekitarmu untuk mengantisipasi dampak polusi.',
    image: './img/PantauLingkungan.jpg',
    color: 'bg-cyan-100',
  },
  {
    id: 4,
    title: 'Ikuti Event Nyata',
    desc: 'Temukan dan hadiri kegiatan positif seperti penanaman pohon atau clean-up day di lokasi terdekat.',
    image:
      './img/KegiatanPositif.jpg',
    color: 'bg-purple-100',
  },
  {
    id: 5,
    title: 'Raih Level & Badge',
    desc: 'Dapatkan poin dari setiap partisipasi, naikkan Eco Level-mu, dan koleksi Badge penghargaan eksklusif.',
    image:
      './img/Badge.jpg',
    color: 'bg-emerald-100',
  },
];

const About = () => {
  const chartData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Total Sampah (Juta Ton)',
        data: [27.592603, 28.591323, 38.710014, 43.209373, 32.658076],
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
            `${context.dataset.label}: ${context.parsed.y.toFixed(1)} Juta Ton`,
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Tentang <span className="text-green-600">Aksi Hijau</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Gerakan digital yang menghubungkan individu dengan solusi nyata
            untuk menghadapi krisis iklim global.
          </p>
        </motion.div>

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
                className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden flex items-center justify-center aspect-square transition-all duration-300 hover:shadow-blue-300 hover:border-blue-300 border-2 border-green-300 shadow-green-300"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24"
        >
          <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0 border-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {processSteps.map((step, index) => (
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {index !== processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-6 xl:-right-8 transform -translate-y-1/2 items-center justify-center z-0">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  <div className="lg:hidden flex justify-center mt-4 opacity-30">
                    {index !== processSteps.length - 1 && (
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

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

          <div className="mb-8 p-4 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700">
              Berikut adalah visualisasi data timbulan sampah nasional di
              Indonesia berdasarkan laporan kabupaten/kota.
            </p>
          </div>

          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
            <Line options={chartOptions} data={chartData} />
          </div>
        </motion.div>

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
              Data yang tersaji di atas bukan sekadar angka; itu adalah
              cerminan dari tantangan nyata yang dihadapi planet kita. Tren
              kenaikan emisi global, hilangnya keanekaragaman hayati, dan
              polusi plastik yang konsisten menjadi{' '}
              <strong>latar belakang utama</strong> dan panggilan mendesak bagi
              kami. Kami melihat adanya{' '}
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
              dan panduan praktis serta{' '}
              <strong>biaya solusi hijau</strong> yang terkadang dianggap mahal
              menjadi penghalang yang nyata.
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24 w-full bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 md:p-12 shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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

        <section className="py-12 px-4 max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dampak Kami dalam Angka
            </h2>
            <p className="text-gray-500 text-lg">
              Bersama membangun masyarakat yang lebih sehat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {impactStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group h-full"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-200/40 via-transparent to-cyan-200/40 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                <div className="relative bg-white rounded-2xl border shadow-sm border-green-600
          transition-all duration-300 p-6 
          flex flex-col items-center text-center justify-between h-full"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center 
              shadow-[0_6px_18px_rgba(16,185,129,0.18)]"
                    >
                      <item.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-1">
                      <CountUp
                        from={0}
                        to={item.value}
                        separator=","
                        direction="up"
                        duration={2}
                      />
                    </div>
                    <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-700 mb-2">
                      {item.label}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed mt-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-24 py-16 px-6 bg-gradient-to-b from-emerald-50 via-white to-cyan-50 rounded-3xl border border-emerald-100 shadow-xl relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 right-[-40px] w-60 h-60 bg-emerald-200/50 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-[-40px] w-72 h-72 bg-cyan-200/50 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />

          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4 shadow-sm">
              <Users className="w-4 h-4" />
              Tim Kolaborasi AksiHijau
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Di Balik <span className="text-green-600">Gerakan Hijau</span>
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Setiap fitur dan inisiatif AksiHijau adalah hasil kerja tim yang
              saling melengkapi: pemimpin, developer, dan penggerak komunitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-emerald-100 hover:border-emerald-300 transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 opacity-70" />

                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                    {member.role}
                  </span>
                </div>

                <div className="flex flex-col items-center text-center mt-4 mb-5">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 via-cyan-400 to-emerald-500 p-[3px] shadow-lg group-hover:shadow-emerald-300/70 transition-shadow duration-300">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                      <div className="w-16 h-16 bg-emerald-200/60 blur-2xl rounded-full" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg md:text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs tracking-[0.18em] uppercase text-emerald-600 font-semibold">
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed text-center mb-5 px-1">
                  {member.bio}
                </p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent mb-4" />

                <div className="flex items-center justify-center gap-3">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
                      aria-label={`${member.name} Github`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-pink-50 border border-pink-100 text-pink-500 hover:text-pink-600 hover:border-pink-200 hover:-translate-y-0.5 transition-all duration-200"
                      aria-label={`${member.name} Instagram`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;