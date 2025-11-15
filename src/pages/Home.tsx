import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Globe, Users, Heart, BookOpen, Zap, TrendingUp } from 'lucide-react';

// Data untuk Testimoni
const testimonials = [
  {
    quote: "Sejak bergabung, saya lebih teredukasi tentang cara hidup berkelanjutan. Program penanaman pohonnya luar biasa!",
    name: "Rina S.",
    title: "Anggota Komunitas",
  },
  {
    quote: "AksiHijau membuat aksi lingkungan menjadi mudah dan menyenangkan. Dampak nyata dari kegiatan kami terasa sekali.",
    name: "Bima T.",
    title: "Relawan Aktif",
  },
  {
    quote: "Aplikasi ini inspiratif! Saya termotivasi untuk mengurangi jejak karbon saya berkat tantangan mingguan.",
    name: "Dewi P.",
    title: "Eco Hero",
  },
];

// Komponen Card Fitur Utama
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay, duration: 0.6 }}
    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500 ease-in-out"
  >
    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);


const Home = () => {
  return (
    // Struktur Anda sudah benar. Setiap Section menggunakan container di dalamnya.
    <div> 
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-sky-50 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Bersama Selamatkan Bumi Lewat{' '}
                <span className="text-primary">Aksi Hijau</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Bergabunglah dengan gerakan global untuk mengatasi perubahan iklim.
                Setiap aksi kecil membuat perbedaan besar untuk masa depan bumi kita.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Mulai Sekarang
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <Globe className="w-full h-full text-primary drop-shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Mengapa AksiHijau? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa AksiHijau?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform terpercaya untuk edukasi dan aksi nyata dalam menghadapi krisis iklim
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Edukasi Berkelanjutan',
                description: 'Pelajari tentang perubahan iklim dan solusi praktis yang bisa diterapkan sehari-hari',
              },
              {
                icon: Users,
                title: 'Komunitas Global',
                description: 'Bergabung dengan ribuan eco heroes yang berkomitmen untuk perubahan positif',
              },
              {
                icon: Heart,
                title: 'Aksi Nyata',
                description: 'Ikuti program dan kampanye lingkungan yang membuat dampak nyata',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tiga Fitur Utama (Konten Baru) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Utama AksiHijau
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan alat dan sumber daya untuk memberdayakan setiap individu dalam perjalanan hijau mereka.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={BookOpen}
              title="Pusat Edukasi Interaktif"
              description="Akses modul pembelajaran, infografis, dan webinar tentang isu lingkungan, dari daur ulang hingga energi terbarukan."
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Tantangan Hijau Harian"
              description="Ikuti tantangan seru untuk mengadopsi kebiasaan ramah lingkungan. Lacak kemajuan Anda dan dapatkan lencana Eco Hero!"
              delay={0.2}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Lacak Jejak Karbon"
              description="Hitung dan visualisasikan jejak karbon pribadi Anda. Dapatkan saran yang dipersonalisasi untuk mengurangi emisi."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* 4. Testimoni (Konten Baru) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Eco Heroes Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kisah nyata dari orang-orang yang telah membuat perbedaan bersama AksiHijau.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-primary/5 p-8 rounded-xl shadow-md flex flex-col justify-between h-full"
              >
                <blockquote className="italic text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Akhir */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Siap Menjadi Eco Hero?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan mulai perjalanan Anda untuk membuat perbedaan nyata bagi planet kita.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Bergabung Sekarang
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;