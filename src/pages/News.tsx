import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Kampanye Penanaman 10.000 Pohon Sukses Dilaksanakan',
      date: '15 Januari 2025',
      summary: 'Komunitas AksiHijau berhasil menanam 10.000 pohon di berbagai wilayah Indonesia sebagai bagian dari program reforestasi nasional.',
      image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      title: 'Workshop Energi Terbarukan Dihadiri 500+ Peserta',
      date: '10 Januari 2025',
      summary: 'Workshop virtual tentang teknologi energi terbarukan menarik perhatian lebih dari 500 peserta dari seluruh Asia Tenggara.',
      image: 'https://images.pexels.com/photos/371900/pexels-photo-371900.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      title: 'Peluncuran Program Edukasi Iklim untuk Sekolah',
      date: '5 Januari 2025',
      summary: 'AksiHijau meluncurkan program edukasi perubahan iklim yang akan menjangkau lebih dari 100 sekolah di seluruh Indonesia.',
      image: 'https://images.pexels.com/photos/207756/pexels-photo-207756.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 4,
      title: 'Kolaborasi dengan LSM Internasional untuk Program Laut',
      date: '28 Desember 2024',
      summary: 'Kemitraan strategis dibentuk untuk program pembersihan dan konservasi ekosistem laut di kawasan pesisir Indonesia.',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 5,
      title: 'Webinar: Gaya Hidup Zero Waste untuk Pemula',
      date: '20 Desember 2024',
      summary: 'Ratusan peserta belajar cara memulai gaya hidup zero waste melalui webinar interaktif dengan para expert.',
      image: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 6,
      title: 'Pencapaian: 50.000 Anggota Bergabung dalam 6 Bulan',
      date: '15 Desember 2024',
      summary: 'Komunitas AksiHijau tumbuh pesat dengan 50.000 anggota aktif yang berkomitmen untuk aksi nyata melawan perubahan iklim.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Berita & Update
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ikuti perkembangan terbaru dari gerakan AksiHijau dan komunitas global kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time dateTime={item.date}>{item.date}</time>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.summary}
                </p>

                <button className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold">
            Muat Lebih Banyak
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default News;
