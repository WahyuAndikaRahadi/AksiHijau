import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  BookOpen,
  Zap,
  TrendingUp,
  Check,
} from "lucide-react";

// Data untuk Testimoni
const testimonials = [
  {
    quote:
      "Sejak bergabung, saya lebih teredukasi tentang cara hidup berkelanjutan. Program penanaman pohonnya luar biasa!",
    name: "Rina S.",
    title: "Anggota Komunitas",
  },
  {
    quote:
      "AksiHijau membuat aksi lingkungan menjadi mudah dan menyenangkan. Dampak nyata dari kegiatan kami terasa sekali.",
    name: "Bima T.",
    title: "Relawan Aktif",
  },
  {
    quote:
      "Aplikasi ini inspiratif! Saya termotivasi untuk mengurangi jejak karbon saya berkat tantangan mingguan.",
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
  // Definisi animasi untuk Filosofi
  const cardVariants = {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const tagVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-sky-50 py-20 sm:py-32 overflow-hidden px-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Bersama Selamatkan Bumi Lewat{" "}
                <span className="text-primary">Aksi Hijau</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Bergabunglah dengan gerakan global untuk mengatasi perubahan
                iklim. Setiap aksi kecil membuat perbedaan besar untuk masa
                depan bumi kita.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 mb-10 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:scale-105"
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
              <div className="md:-mt-16 xl:ml-36 lg:ml-20 relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-primary/25 rounded-full blur-3xl"></div>

                {/* === GAMBAR UTAMA BUMI === */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <img
                    src="/public/img/Green Earth.png"
                    alt="Ilustrasi Bumi atau Lingkungan"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* === Bulat Kecil === */}
                <motion.img
                  src="/public/img/wind-power.png"
                  alt="Small decorative dot"
                  className="bg-white p-2 shadow-lg absolute w-12 h-12 rounded-full top-[8%] left-[8%] -translate-x-1/2 -translate-y-1/2 object-cover"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />

                <motion.img
                  src="/public/img/forest.png"
                  alt="Small decorative dot"
                  className="bg-white p-2 shadow-lg absolute w-12 h-12 rounded-full top-[8%] right-[8%] translate-x-1/2 -translate-y-1/2 object-cover"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                />

                <motion.img
                  src="/public/img/wind.png"
                  alt="Small decorative dot"
                  className="bg-white p-2 shadow-lg absolute w-12 h-12 rounded-full bottom-[8%] left-[8%] -translate-x-1/2 translate-y-1/2 object-cover"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.1,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />

                <motion.img
                  src="/public/img/solar-panels.png"
                  alt="Small decorative dot"
                  className="bg-white p-2 shadow-lg absolute w-12 h-12 rounded-full bottom-[8%] right-[8%] translate-x-1/2 translate-y-1/2 object-cover"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.3,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Filosofi AksiHijau */}
      <section className="px-10 py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-4xl mx-auto bg-green-50/50 p-6 sm:p-12 rounded-3xl border border-green-200 shadow-xl"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              backgroundImage:
                "linear-gradient(to bottom right, #f0fdf4, #ecfeff)",
            }}
          >
            <div className="relative text-center">
              <p className="text-xl sm:text-2xl text-gray-700 font-medium leading-relaxed my-8">
                <span className="text-primary font-bold">" Kelestarian Lingkungan</span>{" "}
                adalah perjalanan, bukan tujuan. AksiHijau berkomitmen menjadi
                pendamping digitalmu yang andal, aman, dan tanpa penghakiman.
                Kami percaya setiap individu berhak mendapatkan dukungan terbaik
                untuk mencapai{" "}
                <span className="text-primary font-bold">
                  Bumi yang Lestari. "
                </span>
              </p>
            </div>
          </motion.div>

          {/* Tag */}
          <div className="flex justify-center flex-wrap gap-4 mt-8">
            <motion.div
              variants={tagVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" /> 100% Dampak
                Nyata
              </div>
            </motion.div>

            <motion.div
              variants={tagVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 1 }}
            >
              <div className="bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center">
                <Zap className="w-4 h-4 text-yellow-500 mr-2" /> Teknologi AI
                Canggih
              </div>
            </motion.div>

            <motion.div
              variants={tagVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center">
                <Heart className="w-4 h-4 text-red-500 mr-2" /> Komunitas
                Suportif
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Fitur Utama */}
      <section className="px-10 py-20 bg-gray-50">
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
              Kami menyediakan alat dan sumber daya untuk memberdayakan setiap
              individu dalam perjalanan hijau mereka.
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

      {/* 4. Testimoni */}
      <section className="px-10 py-20 bg-white">
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
              Kisah nyata dari orang-orang yang telah membuat perbedaan bersama
              AksiHijau.
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
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-primary">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Akhir */}
      <section className="px-10 py-20 bg-gradient-to-br from-primary/10 to-sky-50">
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
              Daftar sekarang dan mulai perjalanan Anda untuk membuat perbedaan
              nyata bagi planet kita.
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
