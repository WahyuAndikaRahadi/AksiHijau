import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const footerNavSections = [
  {
    title: "Fitur Kami",
    links: [
      { path: "/air-quality", label: "Kualitas Udara" },
      { path: "/soil-health", label: "Kesehatan Tanah" },
      { path: "/water-quality", label: "Kualitas Air" },
      { path: "/cam", label: "EcoScan" },
      { path: "/ai", label: "EcoBot" }
    ],
  },
  {
    title: "Artikel & Komunitas", 
    links: [

      { path: "/news", label: "News & Update" },
      { path: "/blog", label: "Blog & Artikel" },
      { path: "/community-events", label: "Events Komunitas" },
      { path: "/community-social", label: "Komunitas Sosial" },
    ],
  },
  {
    title: "Info & Akun", 
    links: [
      { path: "/login", label: "Login" },
      { path: "/register", label: "Daftar Akun" },
      { path: "/about", label: "Tentang Kami" },
      { path: "/contact", label: "Kontak Kami" },
    ],
  },
];

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-b from-green-50 to-green-100 border-t-4 border-green-700 overflow-hidden pb-8 md:pb-60 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-9 lg:px-8 py-8 md:py-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <motion.div
            className="col-span-1" 
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <img
                  src="/img/logo.png"
                  alt="Logo Aksi Hijau"
                  className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform duration-300"
                />
              </motion.div>
              <span className="text-3xl font-extrabold text-green-800">
                Aksi Hijau
              </span>
            </div>
            <p className="text-green-900 font-semibold leading-relaxed mb-6 italic">
              Gerakan digital untuk edukasi perubahan iklim dan aksi nyata
              menyelamatkan bumi.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-white bg-green-700 p-2 rounded-full shadow-lg"
                  aria-label={social.label}
                  variants={socialIconVariants}
                  whileHover="hover"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: { delay: 0.8 + index * 0.1 },
                  }}
                >
                  <social.Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerNavSections.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants}>
              <h3 className="text-xl font-extrabold text-green-800 mb-6 border-b-2 border-green-300 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} variants={itemVariants}>
                    <Link
                      to={link.path}
                      className="text-green-900 hover:text-green-600 transition-colors duration-300 font-semibold block p-1 -ml-1 rounded-md"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 pt-6   text-center border-t-2 border-green-300 md:mt-12 md:pt-8"
          variants={itemVariants}
        >
          <p className="text-green-900 font-semibold">
            © 2025 Aksi Hijau. All Rights Reserved.
          </p>
        </motion.div>
      </div>

      <div className="absolute md:mt-24 bottom-0 left-0 w-full pointer-events-none z-10">
        <img
          src="/img/footer.png"
          alt="Karangan Bunga Dekorasi Footer"
          className="w-full h-auto opacity-80 block"
        />
      </div>
    </motion.footer>
  );
};

export default Footer;