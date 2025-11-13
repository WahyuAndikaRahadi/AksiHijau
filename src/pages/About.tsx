import { motion } from 'framer-motion';
import { Target, Eye, Award, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Tentang AksiHijau
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Gerakan digital yang menghubungkan individu dengan solusi nyata untuk menghadapi krisis iklim global
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Misi Kami
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              AksiHijau adalah platform edukasi dan aksi perubahan iklim yang memungkinkan setiap orang untuk berkontribusi dalam menyelamatkan planet kita. Kami percaya bahwa perubahan dimulai dari tindakan kecil yang konsisten.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Melalui edukasi, kolaborasi, dan aksi nyata, kami membangun komunitas global yang peduli dan siap menghadapi tantangan lingkungan masa depan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-sky-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Award className="w-32 h-32 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-800">Eco Heroes</p>
                <p className="text-gray-600">Rise for Climate Action</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: Target,
              title: 'Visi',
              description: 'Dunia yang berkelanjutan di mana setiap individu berperan aktif dalam melindungi lingkungan',
            },
            {
              icon: Eye,
              title: 'Transparansi',
              description: 'Informasi akurat dan terpercaya tentang isu lingkungan dan solusinya',
            },
            {
              icon: TrendingUp,
              title: 'Dampak Nyata',
              description: 'Mengukur dan melaporkan dampak positif dari setiap aksi yang dilakukan',
            },
            {
              icon: Award,
              title: 'Kolaborasi',
              description: 'Membangun jaringan global untuk aksi kolektif yang lebih besar',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 to-sky-50 rounded-2xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bergabunglah dengan Gerakan Kami
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Bersama-sama, kita bisa membuat perbedaan yang signifikan untuk masa depan planet ini
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-lg font-semibold"
            >
              Daftar Sekarang
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-gray-800 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-all duration-300 font-semibold"
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
