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
  Target,
  Eye,
  Award,
  TrendingUp,
  BookOpen,
  Users,
  Sprout,
  ArrowRight,
  Leaf,
  LayoutGrid,
  Wind,
  Droplet,
  AlertTriangle,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const About = () => {
  // Data untuk bagian "Apa yang Kami Lakukan?"
  const whatWeDo = [
    {
      icon: BookOpen,
      title: 'Edukasi Terpercaya',
      description:
        'Menyediakan artikel, panduan, dan data terverifikasi untuk meningkatkan kesadaran tentang krisis iklim.',
    },
    {
      icon: Sprout,
      title: 'Aksi Nyata',
      description:
        'Menghubungkan pengguna dengan program penanaman pohon, kampanye daur ulang, dan tantangan gaya hidup hijau.',
    },
    {
      icon: Users,
      title: 'Komunitas Peduli',
      description:
        'Membangun platform bagi para pejuang lingkungan untuk berkolaborasi, berbagi ide, dan menginspirasi perubahan.',
    },
  ];

  // Data untuk nilai-nilai
  const values = [
    {
      icon: Target,
      title: 'Visi',
      description:
        'Dunia yang berkelanjutan di mana setiap individu berperan aktif dalam melindungi lingkungan.',
    },
    {
      icon: Eye,
      title: 'Transparansi',
      description: 'Informasi akurat dan terpercaya tentang isu lingkungan dan solusinya.',
    },
    {
      icon: TrendingUp,
      title: 'Dampak Nyata',
      description: 'Mengukur dan melaporkan dampak positif dari setiap aksi yang dilakukan.',
    },
    {
      icon: Award,
      title: 'Kolaborasi',
      description: 'Membangun jaringan global untuk aksi kolektif yang lebih besar.',
    },
  ];

  // ============================================================
  // DATA & OPTIONS UNTUK CHART SAMPAH INDONESIA
  // (contoh: timbulan sampah nasional per tahun, satuan juta ton)
  // ============================================================
  const chartData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Total Sampah (Juta Ton)',
        data: [27.6, 27.5, 28.5, 38.5, 43.2, 34.0],
        borderColor: '#10B981', // primary (emerald)
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
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
        position: 'bottom',
        labels: {
          color: '#374151',
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Total Produksi Sampah di Indonesia (2019–2024)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#111827',
        padding: {
          bottom: 20,
        },
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
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} Juta Ton`;
          },
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
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7281',
        },
      },
    },
    interaction: {
      mode: 'index',
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
            Gerakan digital yang menghubungkan individu dengan solusi nyata untuk menghadapi
            krisis iklim global.
          </p>
        </motion.div>

        {/* MISI KAMI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Misi Kami</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              AksiHijau adalah platform edukasi dan aksi perubahan iklim yang memungkinkan setiap
              orang untuk berkontribusi dalam menyelamatkan planet kita. Kami percaya bahwa
              perubahan dimulai dari tindakan kecil yang konsisten.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Melalui edukasi, kolaborasi, dan aksi nyata, kami membangun komunitas global yang
              peduli dan siap menghadapi tantangan lingkungan masa depan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-sky-100 rounded-2xl flex items-center justify-center p-8">
              <div className="text-center">
                <Sprout className="w-64 h-64 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-800">Tumbuh Bersama Alam</p>
                <p className="text-gray-600">Satu Aksi, Satu Perubahan.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* APA YANG KAMI LAKUKAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Apa yang Kami Lakukan?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami fokus pada tiga pilar utama untuk menciptakan dampak yang berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatWeDo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NILAI-NILAI KAMI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip yang menjadi pedoman kami dalam setiap langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* KESEHATAN LINGKUNGAN */}
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
              Memahami status kesehatan lingkungan kita adalah langkah pertama untuk melindunginya.
              Tiga aspek ini—udara, tanah, dan air—merupakan pilar utama yang menopang kehidupan.
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
                  <h3 className="text-2xl font-bold text-gray-900">Kualitas Udara</h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Masalah Utama</h4>
                      <p className="text-gray-600 text-sm">
                        Polusi dari emisi industri, transportasi, dan pembakaran bahan bakar fosil.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Dampak Kesehatan</h4>
                      <p className="text-gray-600 text-sm">
                        Penyakit pernapasan (asma, PPOK), masalah kardiovaskular, dan iritasi mata.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Transisi ke energi terbarukan, penggunaan transportasi umum, dan reboisasi
                        perkotaan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '72%' }} />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">Tingkat Urgensi: 72%</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">Kesehatan Tanah</h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Masalah Utama</h4>
                      <p className="text-gray-600 text-sm">
                        Kontaminasi oleh pestisida, limbah industri, dan praktik pertanian
                        monokultur.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Dampak Kesehatan</h4>
                      <p className="text-gray-600 text-sm">
                        Kontaminasi rantai makanan, penurunan gizi tanaman, dan paparan zat kimia
                        berbahaya.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Pertanian organik, rotasi tanaman, dan remediasi tanah yang terkontaminasi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">Tingkat Urgensi: 65%</p>
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
                  <h3 className="text-2xl font-bold text-gray-900">Kualitas Air</h3>
                </div>

                <div className="space-y-5 flex-grow">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Masalah Utama</h4>
                      <p className="text-gray-600 text-sm">
                        Pembuangan limbah domestik dan industri, polusi plastik, dan tumpahan bahan
                        kimia.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeartPulse className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Dampak Kesehatan</h4>
                      <p className="text-gray-600 text-sm">
                        Penyakit (kolera, disentri), keracunan logam berat, dan gangguan sistem
                        hormon.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Solusi</h4>
                      <p className="text-gray-600 text-sm">
                        Pengelolaan air limbah (IPAL) yang lebih baik, mengurangi plastik, dan
                        melindungi daerah aliran sungai (DAS).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '80%' }} />
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">Tingkat Urgensi: 80%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
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
              Berikut adalah visualisasi data timbulan sampah nasional di Indonesia berdasarkan
              laporan kabupaten/kota.
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
              Data yang tersaji di atas bukan sekadar angka; itu adalah cerminan dari tantangan
              nyata yang dihadapi planet kita. Tren kenaikan emisi global, hilangnya keanekaragaman
              hayati, dan polusi plastik yang konsisten menjadi{' '}
              <strong>latar belakang utama</strong> dan panggilan mendesak bagi kami. Kami melihat
              adanya <strong>kebutuhan mendesak</strong> akan platform yang dapat diakses untuk
              edukasi dan aksi iklim. Peningkatan ini menunjukkan bahwa metode advokasi tradisional
              saja tidak lagi mencukupi.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Di saat yang sama, kami menyadari adanya jurang besar antara kesadaran akan masalah
              dan tindakan nyata. <strong>Sikap apatis</strong> atau kebingungan yang masih melekat
              kuat membuat banyak orang takut untuk memulai. Selain itu,{' '}
              <strong>akses yang terbatas</strong> ke data yang terverifikasi dan panduan praktis
              serta <strong>biaya solusi hijau</strong> yang terkadang dianggap mahal menjadi
              penghalang yang nyata.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Oleh karena itu, <strong>AksiHijau lahir</strong> sebagai jawaban atas tantangan ini.
              Kami hadir untuk menjembatani kesenjangan tersebut dengan memanfaatkan kekuatan
              teknologi dan data yang akurat. AksiHijau dirancang sebagai sahabat digital dan
              langkah awal yang suportif bagi siapa saja yang ingin berkontribusi menjaga kesehatan
              planet kita.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary to-green-500 text-white rounded-2xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Siap Bergabung dengan Gerakan?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Jadilah bagian dari perubahan. Mulai perjalanan hijau Anda bersama kami hari ini.
            </p>
            <button className="bg-white text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center mx-auto shadow-md">
              Gabung Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
