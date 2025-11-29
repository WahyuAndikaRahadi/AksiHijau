import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Zap,
  Check,
  DollarSign,
  Users,
  Clock,
  Camera,
  Bot,
  Plus,
  Minus,
} from "lucide-react";
import React, { useState } from 'react';

// =========================================================================
// DATA
// =========================================================================

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
  {
    quote:
      "EcoScan sangat membantu memilah sampah. Saya tidak ragu lagi mau buang sampah ke mana!",
    name: "Joko A.",
    title: "Eco Warrior",
  },
  {
    quote:
      "Konten edukasi di sini sederhana dan mudah dicerna. Sangat cocok untuk pemula seperti saya.",
    name: "Lina M.",
    title: "Eco Friend",
  },
  {
    quote:
      "Komunitasnya suportif sekali! Saya jadi termotivasi untuk konsisten menjaga lingkungan.",
    name: "Sinta N.",
    title: "Anggota Komunitas",
  },
];

const testimonialsLine1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
const testimonialsLine2 = testimonials.slice(Math.ceil(testimonials.length / 2));


const faqData = [
  {
    question: "Apa itu AksiHijau dan apa misinya?",
    answer:
      "AksiHijau adalah platform digital yang didedikasikan untuk memfasilitasi dan mengedukasi masyarakat tentang cara hidup berkelanjutan. Misi kami adalah membuat aksi lingkungan menjadi mudah diakses, informatif, dan menyenangkan bagi semua orang, dari pemula hingga aktivis berpengalaman.",
  },
  {
    question: "Bagaimana cara kerja fitur EcoScan?",
    answer:
      "EcoScan menggunakan teknologi AI (Computer Vision) untuk menganalisis foto sampah yang Anda unggah. AI akan mengidentifikasi jenis material (plastik, kertas, kaca, dll.) dan secara instan memberikan panduan langkah demi langkah tentang cara memilah, membersihkan, dan mendaur ulang yang benar di lokasi Anda.",
  },
  {
    question: "Apakah semua layanan di AksiHijau gratis?",
    answer:
      "Ya, sebagian besar fitur inti AksiHijau, termasuk EcoScan, Konsultasi AI, dan semua konten edukasi, 100% gratis untuk diakses oleh semua pengguna. Kami percaya bahwa edukasi lingkungan harus dapat diakses tanpa hambatan finansial.",
  },
  {
    question: "Bagaimana AksiHijau memastikan keakuratan informasi lingkungan?",
    answer:
      "Informasi dan panduan di AksiHijau disusun dan diverifikasi oleh tim ahli lingkungan dan mitra nirlaba terpercaya. Kami secara rutin memperbarui data kami berdasarkan penelitian ilmiah terbaru dan regulasi lingkungan setempat.",
  },
  {
    question: "Apa saja jenis kegiatan yang bisa saya ikuti di Komunitas Eco Warrior?",
    answer:
      "Komunitas Eco Warrior mengadakan berbagai kegiatan, seperti program penanaman pohon, acara 'clean-up' (pembersihan sampah) di area publik dan pantai, workshop daur ulang, serta tantangan pengurangan jejak karbon mingguan yang interaktif. Anda dapat mendaftar dan mendapatkan poin kontribusi dari setiap aktivitas.",
  },
];


// =========================================================================
// KOMPONEN PEMBANTU (Helper Components)
// =========================================================================

const TestimonialTicker = ({ testimonials, direction = "left", duration = 25 }) => {
  const DUPLICATION_FACTOR = 5;
  const duplicatedTestimonials = [];
  for (let i = 0; i < DUPLICATION_FACTOR; i++) {
    duplicatedTestimonials.push(...testimonials);
  }

  const distance = 100 / DUPLICATION_FACTOR;

  const xFrom =
    direction === "right" ? [`-${distance}%`, "0%"] : ["0%", `-${distance}%`];

  const tickerVariants = {
    animate: {
      x: xFrom,
      transition: {
        x: {
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        },
      },
    },
  };

  return (
    <div className="overflow-hidden py-4">
      <motion.div
        className="flex items-stretch w-max transform-gpu"
        variants={tickerVariants}
        animate="animate"
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex-shrink-0 min-w-[200px] md:min-w-[240px] lg:min-w-[280px] px-4 py-2"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              className="bg-white p-8 rounded-2xl shadow-md border border-green-300 hover:border-sky-300 h-full flex flex-col justify-between transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>

              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.425 8.204 1.192-5.933 5.792 1.402 8.169L12 18.896l-7.339 3.856 1.402-8.169-5.933-5.792 8.204-1.192L12 .587z"/>
                  </svg>
                ))}
              </div>

              <blockquote className="text-gray-700 leading-relaxed italic text-base">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};


const NewFeatureCard = ({ icon: Icon, title, description, linkTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100 flex flex-col justify-between group cursor-pointer"
  >
    <div>
      <div className="p-4 w-fit rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
    </div>

    <Link
      to={linkTo}
      className="flex items-center text-primary font-semibold hover:text-green-600 transition-colors mt-auto"
    >
      Jelajahi Sekarang
      <svg
        className="w-5 h-5 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
      </svg>
    </Link>
  </motion.div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: isOpen ? "#f0fdf4" : "#ffffff",
        borderColor: isOpen ? "#34d399" : "#34d399",
        boxShadow: isOpen ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
      }}
      className="border border-gray-200 rounded-xl p-5 mb-4 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <header className="flex justify-between items-center">
        <h3 className={`text-xl font-semibold ${isOpen ? 'text-primary' : 'text-gray-900'}`}>
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-1 rounded-full ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} transition-colors duration-300`}
        >
          <motion.div
              key={isOpen ? "minus" : "plus"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
          >
              {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pt-4 text-gray-700 leading-relaxed pr-8">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
};


// =========================================================================
// KOMPONEN UTAMA (Home Component)
// =========================================================================

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleFaqClick = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };


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

  const newFeatures = [
    {
      icon: Bot,
      title: "Konsultasi AI Interaktif",
      description: "Dapatkan jawaban cerdas dan teredukasi tentang cara hidup berkelanjutan dan langkah-langkah ramah lingkungan.",
      link: "/ai-chat",
    },
    {
      icon: Camera,
      title: "EcoScan: Deteksi Sampah Cerdas",
      description: "Identifikasi jenis sampah dan dapatkan panduan pengolahan yang tepat secara instan hanya dengan memfoto.",
      link: "/cam",
    },
    {
      icon: Users,
      title: "Komunitas Eco Warrior",
      description: "Terhubung dengan ribuan relawan. Ikuti acara penanaman pohon, clean-up, dan kumpulkan poin kontribusi.",
      link: "/community-social",
    },
  ];


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
      <section className="px-10 py-20 md:my-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-4xl mx-auto bg-green-50/50  p-5 sm:p-12 rounded-3xl border-2 border-green-200 shadow-xl"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              backgroundImage:
                "linear-gradient(to bottom right, #f0fdf4, #ecfeff)",
            }}
          >
            <div className="relative text-center">
              <p className="text-xl sm:text-2xl text-gray-700 font-medium leading-relaxed my-8">
                <span className="text-primary font-bold">
                  "Kelestarian Lingkungan
                </span>{" "}
                adalah perjalanan, bukan tujuan. AksiHijau berkomitmen menjadi
                pendamping digitalmu yang antusias, aman, dan tanpa penghakiman.
                Kami percaya setiap individu berhak mendapatkan dukungan terbaik
                untuk mencapai{" "}
                <span className="text-primary font-bold">
                  Bumi yang Lestari."
                </span>
              </p>
              <div className="flex justify-center flex-wrap gap-4 mt-8">
                <motion.div
                  variants={tagVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" /> 100%
                    Dampak Nyata
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
                    <Zap className="w-4 h-4 text-yellow-500 mr-2" /> Teknologi
                    AI Canggih
                  </div>
                </motion.div>

                <motion.div
                  variants={tagVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="bg-white border border-gray-100 px-6 py-2 mb-5 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" /> Komunitas
                    Suportif
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    

      {/* 3. KENAPA MEMILIH AKSI HIJAU */}
      <section className="mx-10 my-16 px-5 py-16 sm:px-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-primary/90 text-white text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full w-fit mb-6 shadow-md">
                Kenapa Memilih AksiHijau?
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-snug">
                Bersama AksiHijau, Jalani Perjalanan Hijau dengan{" "}
                <span className="text-primary">Dampak Nyata</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="p-3 bg-primary/10 rounded-full mr-4 flex-shrink-0"
                  >
                    <DollarSign className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Gratis & Terjangkau
                    </h3>
                    <p className="text-gray-600">
                      Akses fitur dan edukasi lingkungan sepenuhnya gratis untuk
                      semua.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="p-3 bg-primary/10 rounded-full mr-4 flex-shrink-0"
                  >
                    <Users className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Didukung Pakar Lingkungan
                    </h3>
                    <p className="text-gray-600">
                      Konten disusun pakar dan berbasis data terpercaya.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    className="p-3 bg-primary/10 rounded-full mr-4 flex-shrink-0"
                  >
                    <Clock className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Akses Fleksibel 24/7
                    </h3>
                    <p className="text-gray-600">
                      EcoScan siap dipakai kapan saja, 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="relative w-full h-full min-h-[400px] bg-white rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/public/img/IlustrasiPembersihan.jpg"
                alt="Ilustrasi Komunitas Lingkungan"
                className="w-full h-full object-cover object-center rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. ECO ASSISTANT BARU (EcoScan) */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="px-5 py-15 sm:px-10 sm:py-20 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-8 md:p-12 lg:p-16 lg:my-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-sky-500/50 rounded-full blur-3xl opacity-70"></div>

                <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-green-300/50 rounded-full opacity-70 scale-110"></div>

                <img
                  src="/public/img/dslr-camera.png"
                  alt="AI Eco Assistant"
                  className="relative z-10 w-1/2 h-1/2 object-contain drop-shadow-2xl animate-[bounce_3s_infinite]"
                />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="md:pl-8"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 mt-5">
                  <span className="text-primary">Eco</span>Scan
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  EcoScan bekerja dengan cara memfoto sampah menggunakan kamera.
                  Setelah itu, AI menganalisis gambar tersebut untuk mengenali
                  jenis sampahnya, seperti plastik, kertas, kaca, organik, atau
                  logam. Setelah jenisnya ditemukan, EcoScan langsung memberikan
                  informasi cara pengolahan yang benar — apakah harus didaur
                  ulang, dibersihkan dulu, dipisahkan, atau diolah menjadi
                  kompos.
                </p>
                <Link
                  to="/cam"
                  className="inline-block px-8 py-4 bg-primary text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
                >
                  Coba Sekarang
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

        {/* 5. FITUR UNGGULAN BARU */}
      <section className="px-10 py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Dukung Setiap Langkah Aksi Hijau{" "}
              <br className="hidden sm:inline" /> dengan Layanan Terbaik
            </h2>
            <p className="text-lg text-green-100 max-w-3xl mx-auto">
              AksiHijau menyediakan berbagai fitur edukatif dan dukungan pintar
              untuk menemani perjalanan lingkungan yang aman, nyaman, dan penuh informasi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newFeatures.map((feature, index) => (
              <NewFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                linkTo={feature.link}
              />
            ))}
          </div>
        </div>
      </section>


      {/* 6. FAQ Section BARU */}
      <section className="px-5 py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 rounded-full">
              Pertanyaan yang Sering Diajukan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Pahami Lebih Lanjut Tentang AksiHijau
            </h2>
            <p className="text-lg text-gray-600">
              Kami telah merangkum jawaban atas pertanyaan paling umum untuk
              membantu Anda memulai perjalanan hijau Anda.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openFaq === index}
                onClick={() => handleFaqClick(index)}
              />
            ))}
          </div>
        </div>
      </section>


      {/* 7. Testimoni (FULL WIDTH TICKER) */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Eco Heroes Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kisahnya yang sederhana dan tanpa drama, telah membuat mereka
              nyaman menjalani aksi hijau bersama AksiHijau.
            </p>
          </motion.div>
        </div>

        <TestimonialTicker
          testimonials={testimonialsLine1}
          direction="left"
          duration={25}
        />

        <TestimonialTicker
          testimonials={testimonialsLine2}
          direction="right"
          duration={25}
        />
      </section>

      {/* 8. CTA Akhir BARU */}
      <section className="px-5 py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="bg-primary p-8 sm:p-12 lg:p-20 rounded-3xl text-center shadow-2xl"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-snug">
              Edukasi Lingkungan Premium, Gratis untuk Semua!
            </h2>
            <p className="text-lg text-green-100 mb-10 max-w-4xl mx-auto">
              Setiap individu berhak mendapatkan edukasi lingkungan terbaik. AksiHijau hadir dengan fitur pintar dan informasi lengkap yang bisa diakses gratis, kapan saja.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/about"
                className="inline-block px-10 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-green-100 transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-md"
              >
                Lihat Layanan
              </Link>

              <Link
                to="/community-social"
                className="inline-block px-10 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-md"
              >
                Gabung Komunitas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;