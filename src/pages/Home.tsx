import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Globe, Users, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div>
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

      <section className="py-20 bg-gradient-to-br from-primary/10 to-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Siap Menjadi Eco Hero?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan mulai perjalanan Anda untuk membuat perbedaan nyata bagi planet kita
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
